/**
 * ============================================================================
 * SCREENSHOT CAPTURE
 * ============================================================================
 *
 * Produces viewport screenshots for visual review at the sizes the brief calls
 * out. Each section is scrolled into view BEFORE capture, because the page uses
 * scroll-triggered reveals: an unscrolled full-page capture shows sections that
 * have not animated in yet, which reads as broken but is not.
 *
 * Output: %TEMP%\vnr-<width>-<section>.png
 *
 * Run against a production preview:
 *   npm run build && npm run preview
 *   node <browser-runner> http://localhost:5199 --script ./scripts/capture.mjs
 */

const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';
const OUT = 'C:/Users/RAHUL/AppData/Local/Temp';

export const VIEWPORTS = [
  [320, 568],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1920, 1080],
];

export default async function run(page, ui) {
  const shots = [];

  for (const [width, height] of VIEWPORTS) {
    await page.setViewportSize({ width, height });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(1100);

    for (const section of ['hero', 'services', 'contact']) {
      if (section !== 'hero') {
        await page.evaluate((id) => {
          document.getElementById(id)?.scrollIntoView({ block: 'start' });
        }, section);
        await page.waitForTimeout(900);
      }
      const path = `${OUT}/vnr-${width}-${section}.png`;
      await page.screenshot({ path });
      shots.push(path);
    }
  }

  // Mobile drawer, open.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(600);
  const drawer = `${OUT}/vnr-390-drawer.png`;
  await page.screenshot({ path: drawer });
  shots.push(drawer);

  return { count: shots.length, shots };
}