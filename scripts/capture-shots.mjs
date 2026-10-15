/**
 * Capture hero + section screenshots at the mandated widths so the layout can
 * be judged by eye rather than by assertion.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';
const OUT = process.env.SHOT_DIR || '.audit/shots';

const SHOTS = [
  { name: '01-hero-320', w: 320, h: 640, y: 0 },
  { name: '02-hero-390', w: 390, h: 844, y: 0 },
  { name: '03-hero-768', w: 768, h: 1024, y: 0 },
  { name: '04-hero-1440', w: 1440, h: 900, y: 0 },
  { name: '05-hero-1920', w: 1920, h: 1080, y: 0 },
  { name: '06-home-full-1440', w: 1440, h: 900, y: -1 },
];

export default async function run(page, ui) {
  const done = [];
  for (const s of SHOTS) {
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(900);
    if (s.y === -1) {
      // full page
      await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: true });
    } else {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), s.y);
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${OUT}/${s.name}.png` });
    }
    done.push(s.name);
  }
  return { done };
}
