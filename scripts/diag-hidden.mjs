/** Identify exactly which elements remain invisible after a full scroll. */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(800);

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(1200);

  return page.evaluate(() => {
    return [...document.querySelectorAll('h2, h3, p, li, img')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 20 && r.height > 10;
      })
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.5)
      .map((el) => {
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 48),
          opacity: Number(cs.opacity).toFixed(2),
          transform: cs.transform,
          // Motion writes these inline when it owns the element.
          style: el.getAttribute('style')?.slice(0, 160) ?? '',
          parentTag: el.parentElement?.tagName.toLowerCase(),
          parentStyle: el.parentElement?.getAttribute('style')?.slice(0, 160) ?? '',
        };
      });
  });
}