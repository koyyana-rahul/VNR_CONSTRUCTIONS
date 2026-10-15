/**
 * ============================================================================
 * RESPONSIVE MATRIX AUDIT (chunked)
 * ============================================================================
 * Same acceptance checks as audit-responsive.mjs, but the viewport list is
 * driven by the AUDIT_VP env var so one matrix band can be run per invocation
 * instead of 195 page loads in a single shot.
 *
 *   AUDIT_VP=mobile  node browser.mjs http://localhost:5200/ --script ./scripts/audit-matrix.mjs
 *   AUDIT_VP=tablet
 *   AUDIT_VP=desktop
 *   AUDIT_VP=ultrawide
 *   AUDIT_VP=all
 */

export const BANDS = {
  mobile: [320, 344, 360, 375, 390, 414, 430],
  phablet: [480, 540, 600, 640],
  tablet: [768, 820, 950, 1024],
  laptop: [1280, 1366],
  desktop: [1440, 1600],
  ultrawide: [1920, 2560],
};

export const ROUTES = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Process', path: '/process' },
  { name: 'Interiors', path: '/interiors' },
  { name: 'Contact', path: '/contact' },
  { name: 'Projects', path: '/projects' },
  { name: 'Packages', path: '/packages' },
  { name: 'Estimate', path: '/estimate' },
  { name: 'Quality', path: '/quality' },
  { name: 'Project detail', path: '/projects/sample-villa-01' },
  { name: 'Privacy', path: '/privacy-policy' },
  { name: '404', path: '/this-route-does-not-exist' },
];

export default async function run(page, ui) {
  const base = process.env.AUDIT_BASE || 'http://localhost:5200';
  const band = process.env.AUDIT_VP || 'mobile';
  const widths = BANDS[band] || BANDS.mobile;
  const failures = [];
  const warnings = [];

  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });

    for (const route of ROUTES) {
      await page.goto(`${base}${route.path}`, { waitUntil: 'load' });
      await page.waitForTimeout(420);

      const r = await page.evaluate(() => {
        const doc = document.documentElement;
        const vw = doc.clientWidth;

        /* 1. horizontal overflow — by real scroll attempt, not scrollWidth alone */
        window.scrollTo(9999, 0);
        const scrolledX = window.scrollX;
        window.scrollTo(0, 0);
        const overflowBy = Math.max(0, doc.scrollWidth - vw);

        const offenders = [];
        if (overflowBy > 1) {
          for (const el of document.querySelectorAll('body *')) {
            const rect = el.getBoundingClientRect();
            if (!rect.width || !rect.height) continue;
            if (getComputedStyle(el).position === 'fixed') continue;
            if (rect.right > vw + 1 || rect.left < -1) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: String(el.className || '').slice(0, 60),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
              });
            }
            if (offenders.length >= 5) break;
          }
        }

        /* 2. broken images */
        const broken = [...document.querySelectorAll('img')].filter(
          (i) => i.complete && i.naturalWidth === 0,
        ).length;

        /* 3. images with no intrinsic size hint (layout-shift risk) */
        const unsized = [...document.querySelectorAll('img')].filter((i) => {
          if (i.getAttribute('width') && i.getAttribute('height')) return false;
          const cs = getComputedStyle(i);
          return cs.aspectRatio === 'auto' && cs.height === 'auto';
        }).length;

        /* 4. heading hierarchy */
        const h1s = document.querySelectorAll('h1').length;

        /* 5. tap targets on touch widths */
        const small = [];
        if (vw < 1024) {
          for (const el of document.querySelectorAll(
            'a, button, input, select, textarea, [role="tab"]',
          )) {
            const rect = el.getBoundingClientRect();
            if (!rect.width || !rect.height) continue;
            if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
            if (el.closest('[aria-hidden="true"]')) continue;
            const label = el.closest('label');
            if (label && label.getBoundingClientRect().height >= 40) continue;
            if (rect.height < 40 || rect.width < 40) {
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              if (cx < 0 || cy < 0 || cx > vw || cy > window.innerHeight) continue;
              const hit = document.elementFromPoint(cx, cy);
              if (hit && (hit === el || el.contains(hit) || hit.contains(el))) continue;
              small.push(`${el.tagName.toLowerCase()}"${(el.textContent || '').trim().slice(0, 22)}"`);
              if (small.length >= 4) break;
            }
          }
        }

        /* 6. text clipped by its OWN hidden overflow.
              Skips screen-reader-only text (deliberately clipped to a 1px box),
              `-webkit-line-clamp` truncation, and anything not actually painted —
              otherwise every .sr-only label on the site reads as a failure. */
        const clipped = [];
        for (const el of document.querySelectorAll('h1, h2, h3, h4, p, a, li, label')) {
          if (el.children.length) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) continue;
          if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
          if (cs.clipPath && cs.clipPath !== 'none') continue;
          // sr-only pattern: absolute, 1x1 box
          if (el.clientWidth <= 2 || el.clientHeight <= 2) continue;
          if (el.clientWidth < 40) continue;
          if (cs.overflow === 'visible' && cs.overflowY === 'visible') continue;
          const clamp = cs.getPropertyValue('-webkit-line-clamp');
          if (clamp && clamp !== 'none') continue;
          if (el.scrollHeight > el.clientHeight + 2) {
            clipped.push(
              `${el.tagName.toLowerCase()}"${(el.textContent || '').trim().slice(0, 24)}" ${el.clientHeight}<${el.scrollHeight}`,
            );
            if (clipped.length >= 3) break;
          }
        }

        return {
          overflowBy,
          scrolledX,
          offenders,
          broken,
          unsized,
          h1s,
          small,
          clipped,
          scrollHeight: doc.scrollHeight,
        };
      });

      const tag = `${width}px ${route.name}`;
      if (r.overflowBy > 1 || r.scrolledX > 0) {
        failures.push(
          `OVERFLOW ${tag}: ${r.overflowBy}px (scrolled ${r.scrolledX}) ` +
            JSON.stringify(r.offenders),
        );
      }
      if (r.broken > 0) failures.push(`BROKEN IMAGE ${tag}: ${r.broken}`);
      if (r.h1s !== 1) failures.push(`HEADINGS ${tag}: ${r.h1s} <h1>`);
      if (r.clipped.length) failures.push(`CLIPPED TEXT ${tag}: ${r.clipped.join(' | ')}`);
      if (r.small.length) warnings.push(`TAP<40 ${tag}: ${r.small.join(', ')}`);
      if (r.unsized > 0) warnings.push(`UNSIZED IMG ${tag}: ${r.unsized} without dimensions`);
    }
  }

  return {
    band,
    widths,
    routes: ROUTES.length,
    pagesChecked: widths.length * ROUTES.length,
    failures,
    warnings,
    failureCount: failures.length,
    warningCount: warnings.length,
  };
}
