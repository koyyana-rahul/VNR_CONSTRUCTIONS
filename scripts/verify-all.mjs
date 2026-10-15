/**
 * ============================================================================
 * COMPREHENSIVE BROWSER VERIFICATION
 * ============================================================================
 * Covers the brief's section 12 checklist in one pass:
 *   - header before/after scroll
 *   - mobile nav open/closed
 *   - hero text + CTA reachability
 *   - section reveal timing (is anything left invisible?)
 *   - gallery interaction
 *   - contact form validation
 *   - reduced-motion mode
 *   - horizontal overflow (by ACTUAL scroll attempt)
 *   - layout stability
 *   - anchor offset vs sticky header
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

const VIEWPORTS = [
  [320, 568],
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1920, 1080],
];

export default async function run(page, ui) {
  const results = { overflow: [], reveals: [], h1: [], issues: [] };

  /* ---------- 1. Overflow + heading + reveal, per viewport ---------- */
  for (const [w, h] of VIEWPORTS) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(700);

    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      // Actually try to scroll — scrollWidth alone can lie.
      window.scrollTo(9999, 0);
      const scrolledX = window.scrollX;
      window.scrollTo(0, 0);

      const h1s = document.querySelectorAll('h1').length;
      const imgs = [...document.querySelectorAll('img')];
      const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).length;

      return {
        overflowBy: doc.scrollWidth - doc.clientWidth,
        scrolledX,
        h1s,
        images: imgs.length,
        broken,
      };
    });

    results.overflow.push({ w, ...r });
    if (r.overflowBy > 1 || r.scrolledX > 0) {
      results.issues.push(`${w}px: horizontal overflow ${r.overflowBy}px (scrolled ${r.scrolledX})`);
    }
    if (r.h1s !== 1) results.issues.push(`${w}px: ${r.h1s} <h1> elements`);
    if (r.broken > 0) results.issues.push(`${w}px: ${r.broken} broken images`);

    // Scroll the whole page, then confirm nothing is still invisible.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
      await page.waitForTimeout(180);
    }
    await page.waitForTimeout(800);

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll('h2, h3, p, li, img')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 20 && r.height > 10;
          })
          .filter((el) => Number(getComputedStyle(el).opacity) < 0.5).length,
    );
    results.reveals.push({ w, hidden });
    if (hidden > 0) results.issues.push(`${w}px: ${hidden} elements still invisible after full scroll`);
  }

  /* ---------- 2. Header before/after scroll ---------- */
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  const headerBefore = await page.evaluate(() => {
    const h = document.querySelector('header');
    const s = getComputedStyle(h);
    return { bg: s.backgroundColor, border: s.borderBottomColor, blur: s.backdropFilter };
  });

  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const headerAfter = await page.evaluate(() => {
    const h = document.querySelector('header');
    const s = getComputedStyle(h);
    const rect = h.getBoundingClientRect();
    return { bg: s.backgroundColor, border: s.borderBottomColor, height: Math.round(rect.height) };
  });

  results.header = { before: headerBefore, after: headerAfter };

  // Header height must not change on scroll (a jump is jarring).
  const hBefore = await page.evaluate(() =>
    Math.round(document.querySelector('header').getBoundingClientRect().height));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const hAfter = await page.evaluate(() =>
    Math.round(document.querySelector('header').getBoundingClientRect().height));
  results.header.heightStable = hBefore === hAfter;

  /* ---------- 3. Hero CTA reachable & not delayed ---------- */
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  results.hero = await page.evaluate(() => {
    const cta = [...document.querySelectorAll('a')].find((a) =>
      /discuss your project/i.test(a.textContent));
    const r = cta?.getBoundingClientRect();
    return cta
      ? { found: true, w: Math.round(r.width), h: Math.round(r.height), opacity: Number(getComputedStyle(cta).opacity) }
      : { found: false };
  });

  /* ---------- 4. Anchor offset vs sticky header ---------- */
  results.anchorOffset = await page.evaluate(async () => {
    document.getElementById('services')?.scrollIntoView();
    await new Promise((r) => setTimeout(r, 500));
    const target = document.getElementById('services');
    const heading = target?.querySelector('h2');
    const header = document.querySelector('header');
    const topbar = document.querySelector('.bg-black-blue');
    const chrome = (header?.getBoundingClientRect().height ?? 0) + (topbar?.getBoundingClientRect().height ?? 0);
    return {
      headingTop: Math.round(heading.getBoundingClientRect().top),
      stickyHeight: Math.round(chrome),
      // Heading must sit BELOW the sticky chrome, not behind it.
      clear: heading.getBoundingClientRect().top >= chrome,
    };
  });

  /* ---------- 5. Mobile nav open / close / navigate ---------- */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(500);
  const openState = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return {
      visible: !!d,
      bgLocked: getComputedStyle(document.body).overflow === 'hidden',
      links: d ? d.querySelectorAll('a').length : 0,
    };
  });

  await page.locator('[role="dialog"] a[href="/interiors"]').first().click();
  await page.waitForTimeout(700);
  const afterNav = await page.evaluate(() => ({
    path: location.pathname,
    drawerGone: !document.querySelector('[role="dialog"]'),
    scrollRestored: getComputedStyle(document.body).overflow !== 'hidden',
  }));
  results.mobileNav = { openState, afterNav };
  if (!openState.visible || !afterNav.drawerGone || !afterNav.scrollRestored) {
    results.issues.push('Mobile drawer did not open/navigate/close correctly');
  }

  /* ---------- 6. Gallery + lightbox ---------- */
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.getElementById('gallery')?.scrollIntoView());
  await page.waitForTimeout(900);
  const tile = page.locator('#gallery button').first();
  await tile.click();
  await page.waitForTimeout(500);
  const lightbox = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-modal="true"]');
    return { open: !!d, title: d?.querySelector('h2')?.textContent?.slice(0, 30) };
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const lightboxClosed = await page.evaluate(
    () => !document.querySelector('[role="dialog"][aria-modal="true"]'),
  );
  results.gallery = { lightbox, closesOnEscape: lightboxClosed };
  if (!lightbox.open || !lightboxClosed) results.issues.push('Gallery lightbox failed');

  /* ---------- 7. Contact form validation ---------- */
  await page.goto(`${BASE}/contact`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: /request a callback/i }).click();
  await page.waitForTimeout(400);
  results.form = await page.evaluate(() => ({
    alerts: document.querySelectorAll('[role="alert"]').length,
    // Must NOT claim a submission happened.
    fakeSuccess: /enquiry received|successfully submitted/i.test(document.body.innerText),
  }));
  if (results.form.alerts < 4) results.issues.push('Form validation produced too few errors');
  if (results.form.fakeSuccess) results.issues.push('Form falsely claims success');

  /* ---------- 8. Reduced motion ---------- */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  const reduced = await page.evaluate(() => {
    const visible = [...document.querySelectorAll('h2, h3, p, li')]
      .filter((el) => el.getBoundingClientRect().height > 10)
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.5).length;
    return {
      hiddenElements: visible,
      // An infinite animation should not be running under reduced motion.
      infiniteAnimations: document.getAnimations().filter((a) => {
        const timing = a.effect?.getComputedTiming?.();
        return timing?.iterations === Infinity && a.playState === 'running';
      }).length,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });
  results.reducedMotion = reduced;
  if (reduced.hiddenElements > 0) {
    results.issues.push(`Reduced motion: ${reduced.hiddenElements} elements hidden`);
  }
  await page.emulateMedia({ reducedMotion: null });

  return results;
}