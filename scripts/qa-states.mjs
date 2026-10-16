/**
 * ============================================================================
 * MOBILE INTERACTIVE-STATE CAPTURE
 * ============================================================================
 *
 * The states that only exist after a click — the navigation drawer, the
 * consultation modal, the gallery lightbox — and which a route sweep can never
 * reach. Each is opened at a phone width and screenshotted, and any console
 * error or page error raised along the way is collected and returned.
 *
 * WHY THIS IS SEPARATE FROM qa-mobile.mjs
 * ---------------------------------------
 * audit-responsive.mjs asserts that the drawer opens, locks scroll, closes on
 * Escape, restores focus and auto-closes on navigation — but it measures, it
 * never shows you. A drawer can pass all of that and still be visually broken.
 * This is the script that produces the pictures.
 *
 * USAGE
 *   npm run qa:states
 *
 * Output: C:/…/Temp/vnr-qa/state-*.png
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5174';
const OUT = 'C:/Users/RAHUL/AppData/Local/Temp/vnr-qa';

export default async function run(page) {
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`[${m.type()}] ${m.text().slice(0, 160)}`); });
  page.on('pageerror', (e) => errs.push(`[pageerror] ${String(e).slice(0, 160)}`));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  // Drawer
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/state-drawer.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // Consultation modal — open via the hero CTA
  await page.getByRole('link', { name: /discuss your project/i }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/state-contact.png` });

  // Gallery lightbox
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('#gallery')?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.locator('#gallery button').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/state-lightbox.png` });
  await page.keyboard.press('Escape');

  // Estimator at phone width, scrolled to the controls
  await page.goto(`${BASE}/estimate`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/state-estimator.png` });

  // Project detail + gallery
  await page.goto(`${BASE}/projects`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/state-projects.png` });

  return { errs };
}