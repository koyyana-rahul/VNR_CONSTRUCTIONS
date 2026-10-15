/** Footer logo in isolation. */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';

export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const f = document.querySelector('footer');
    f?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  const box = await page.evaluate(() => {
    const f = document.querySelector('footer');
    const r = f.getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.top), width: window.innerWidth, height: Math.min(600, r.height) };
  });
  await page.screenshot({ path: '.audit/shots/logo-footer-real.png', clip: box });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '.audit/shots/logo-footer-1440.png' });
  return { ok: true };
}
