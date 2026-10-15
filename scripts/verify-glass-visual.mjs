/**
 * Prove the header glass ACTUALLY blurs, rather than merely declaring it.
 *
 * Computed styles can claim `backdrop-filter: blur(16px)` while nothing is
 * visually blurred. This captures the identical header region twice — once
 * normally, once with `backdrop-filter: none` forced on every element — so the
 * two images can be compared by eye and by file size.
 *
 * If the blur is real, the underlying text in the "normal" capture must be
 * smeared; in the "no blur" capture it must stay razor sharp.
 */

const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(900);

  // Scroll so a text-heavy card sits directly behind the header — the header
  // region we clip must actually have content behind it, or there is nothing
  // for the blur to act on and the test proves nothing.
  await page.evaluate(() => {
    const target = document.getElementById('services');
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY + 120;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(900);

  const behind = await page.evaluate(() => {
    const header = document.querySelector('header');
    const rect = header.getBoundingClientRect();
    const mid = document.elementFromPoint(rect.width / 2, rect.height / 2);
    return { headerHeight: Math.round(rect.height), elementBehindHeader: mid?.tagName?.toLowerCase() };
  });

  const clip = { x: 0, y: 0, width: 390, height: 70 };

  // 1. As rendered.
  const withBlur = await page.screenshot({ clip, path: 'C:/Users/RAHUL/AppData/Local/Temp/glass-with-blur.png' });

  // 2. Same frame, blur disabled everywhere.
  await page.addStyleTag({
    content: `* { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }`,
  });
  await page.waitForTimeout(400);
  const withoutBlur = await page.screenshot({ clip, path: 'C:/Users/RAHUL/AppData/Local/Temp/glass-no-blur.png' });

  // Report byte size as a crude sharpness signal: a blurred region compresses
  // to fewer distinct edges, so the blurred capture is normally smaller.
  return {
    clip,
    behind,
    withBlurBytes: withBlur.length,
    withoutBlurBytes: withoutBlur.length,
    withBlurPath: 'C:/Users/RAHUL/AppData/Local/Temp/glass-with-blur.png',
    withoutBlurPath: 'C:/Users/RAHUL/AppData/Local/Temp/glass-no-blur.png',
  };
}