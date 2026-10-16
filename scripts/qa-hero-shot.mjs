/** Screenshots the hero alone at each width the brief lists. */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';
const OUT = 'C:/Users/RAHUL/AppData/Local/Temp/vnr-qa';

/* Tall viewports at the narrow widths. The hero is content-driven, so at 320px
   it is taller than a 568px screen and a phone-height capture crops the CTAs
   and the bottom border off — the exact edges this change is about. */
const WIDTHS = [
  [320, 1200],
  [344, 1200],
  [360, 1100],
  [375, 1100],
  [390, 1000],
  [414, 1000],
  [430, 1000],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];

export default async function run(page) {
  const out = [];
  for (const [w, h] of WIDTHS) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(2200);
    const box = await page.evaluate(() => {
      const s = document.querySelector('section[aria-labelledby="hero-heading"]');
      const r = s.getBoundingClientRect();
      return { x: 0, y: Math.max(0, r.top + window.scrollY), width: window.innerWidth, height: Math.round(r.height) };
    });
    await page.screenshot({
      path: `${OUT}/hero-${w}.png`,
      clip: { x: 0, y: box.y, width: box.width, height: Math.min(box.height, 1000) },
    });
    out.push({ w, heroH: box.height });
  }
  return out;
}