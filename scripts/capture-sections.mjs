/**
 * Section-by-section capture. A fullPage screenshot cannot be used here: the
 * scroll-reveal animations only fire when a section actually enters the
 * viewport, so a stitched capture shows every below-the-fold section at
 * opacity 0. Scrolling each anchor into view first is the only honest way to
 * see what a visitor sees.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';
const OUT = process.env.SHOT_DIR || '.audit/shots';
const WIDTH = Number(process.env.SHOT_W || 1440);
const HEIGHT = Number(process.env.SHOT_H || 900);
const PREFIX = process.env.SHOT_PREFIX || `${WIDTH}`;

const SECTIONS = ['highlights', 'services', 'about', 'process', 'interiors', 'gallery', 'contact'];

export default async function run(page, ui) {
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(900);

  const done = [];
  for (const id of SECTIONS) {
    await page.evaluate((sel) => {
      document.getElementById(sel)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }, id);
    // Let the reveal transition settle before the shutter.
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${PREFIX}-sec-${id}.png` });
    done.push(id);
  }
  return { width: WIDTH, done };
}
