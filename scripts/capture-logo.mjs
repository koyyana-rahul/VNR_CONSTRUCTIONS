/** Header / drawer / footer logo crops, so the fix can be judged by eye. */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';
const OUT = '.audit/shots';

export default async function run(page, ui) {
  const shots = [];

  for (const [name, w, h] of [
    ['logo-320', 320, 560],
    ['logo-390', 390, 560],
    ['logo-768', 768, 560],
    ['logo-1440', 1440, 560],
  ]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/${name}.png`, clip: { x: 0, y: 0, width: w, height: 150 } });
    shots.push(name);
  }

  // Drawer (mobile)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/logo-drawer.png` });
  shots.push('logo-drawer');

  // Footer
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/logo-footer.png` });
  shots.push('logo-footer');

  return { shots };
}
