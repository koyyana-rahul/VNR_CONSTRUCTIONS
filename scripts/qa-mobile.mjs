/**
 * ============================================================================
 * MOBILE VISUAL QA SWEEP
 * ============================================================================
 *
 * Loads every route at a phone width, measures the things that are easy to get
 * wrong on mobile, and writes screenshots that can actually be LOOKED at.
 *
 * Unlike scripts/audit-responsive.mjs — which asserts — this one is for
 * judgement. It emits, per route:
 *
 *   1. a full-page PNG        ->  C:/…/Temp/vnr-qa/<width>-<route>.png
 *   2. viewport-sized tiles   ->  …/tile-<route>-<n>.png
 *   3. a measurement record   ->  the JSON this script returns
 *
 * The tiles matter most. A single 10,000px-tall phone screenshot is
 * unreadable when scaled to fit, which is how "looks fine" survives a real
 * problem. One tile per screen is what makes the sweep worth running.
 *
 * The page is scrolled end-to-end BEFORE capture, because every section is
 * behind a scroll-triggered reveal — an unscrolled capture shows sections that
 * have not animated in yet and reads as broken when it is not.
 *
 * WHAT IT MEASURES
 *   overflowBy    document scrollWidth vs clientWidth. The single most common
 *                 responsive bug, and the one that silently ruins a phone.
 *   offenders     which elements are past the viewport edge, so a failure is
 *                 actionable rather than just a number.
 *   small         touch targets under 44px that are genuinely hittable.
 *   imgs          every rendered image box, to catch wrong ratios and blanks.
 *   minFont       the smallest rendered font on the page, with the element
 *                 that produced it. 9px body copy is invisible on a phone.
 *
 * USAGE
 *   npm run qa:mobile                                   # 390x844
 *   QA_WIDTH=320 QA_HEIGHT=568 node scripts/browser-runner … --script …
 *   QA_WIDTH=1440 QA_HEIGHT=900 …                        # same sweep, desktop
 *
 * For the assertion-based gate use scripts/audit-responsive.mjs instead.
 */
import fs from 'node:fs';

const BASE = process.env.AUDIT_BASE || 'http://localhost:5174';
const OUT = 'C:/Users/RAHUL/AppData/Local/Temp/vnr-qa';
const WIDTH = Number(process.env.QA_WIDTH || 390);
const HEIGHT = Number(process.env.QA_HEIGHT || 844);

const ROUTES = [
  ['home', '/'],
  ['services', '/services'],
  ['about', '/about'],
  ['process', '/process'],
  ['interiors', '/interiors'],
  ['contact', '/contact'],
  ['projects', '/projects'],
  ['project-detail', '/projects/sample-villa-01'],
  ['packages', '/packages'],
  ['estimate', '/estimate'],
  ['quality', '/quality'],
  ['privacy', '/privacy-policy'],
  ['404', '/nope'],
];

export default async function run(page) {
  fs.mkdirSync(OUT, { recursive: true });
  const results = [];

  for (const [name, path] of ROUTES) {
    await page.setViewportSize({ width: WIDTH, height: HEIGHT });
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    await page.waitForTimeout(700);

    // Walk the page so every reveal fires.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.75);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      window.scrollTo(9999, 0);
      const scrolledX = window.scrollX;
      window.scrollTo(0, 0);

      const offenders = [];
      if (doc.scrollWidth - doc.clientWidth > 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const s = getComputedStyle(el);
          if (s.position === 'fixed') continue;
          if (r.right > doc.clientWidth + 1 || r.left < -1) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: String(el.className?.toString?.() || '').slice(0, 60),
              l: Math.round(r.left),
              r: Math.round(r.right),
            });
          }
          if (offenders.length >= 5) break;
        }
      }

      // Touch targets smaller than 44px that are genuinely hittable.
      const small = [];
      for (const el of document.querySelectorAll('a, button, input, select, textarea, [role="tab"], [role="radio"], [role="checkbox"]')) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
        const label = el.closest('label');
        if (label && label.getBoundingClientRect().height >= 40) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'inline' && el.closest('p,li,span,dd')) {
          // inline text links inside prose: measured by line box
          const lh = parseFloat(cs.lineHeight) || r.height;
          if (lh >= 24 && r.height >= 20) continue;
        }
        if (r.height < 44 || r.width < 44) {
          small.push({ tag: el.tagName.toLowerCase(), t: (el.textContent || '').trim().slice(0, 28), w: Math.round(r.width), h: Math.round(r.height) });
        }
        if (small.length >= 12) break;
      }

      const imgs = [...document.querySelectorAll('img')].map((i) => {
        const r = i.getBoundingClientRect();
        return { src: i.currentSrc.split('/').pop(), w: Math.round(r.width), h: Math.round(r.height) };
      });

      // Smallest rendered font on the page
      let minFont = 999, minFontSel = '';
      for (const el of document.querySelectorAll('p,a,li,span,dd,dt,label,button,small,figcaption')) {
        if (el.children.length) continue;
        const t = (el.textContent || '').trim();
        if (t.length < 3) continue;
        const fs2 = parseFloat(getComputedStyle(el).fontSize);
        if (fs2 < minFont) { minFont = fs2; minFontSel = `${el.tagName}:${t.slice(0, 24)}`; }
      }

      return {
        overflowBy: doc.scrollWidth - doc.clientWidth,
        scrolledX,
        pageHeight: document.body.scrollHeight,
        offenders,
        small,
        imgs,
        minFont,
        minFontSel,
        h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.slice(0, 40)),
      };
    });

    await page.screenshot({ path: `${OUT}/${WIDTH}-${name}.png`, fullPage: true });

    // Also emit viewport-sized tiles so each screen can actually be looked at.
    const total = Math.ceil(metrics.pageHeight / HEIGHT);
    for (let i = 0; i < Math.min(total, 14); i += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), i * HEIGHT);
      await page.waitForTimeout(280);
      await page.screenshot({ path: `${OUT}/tile-${name}-${i}.png` });
    }

    results.push({ name, ...metrics });
  }

  return results;
}