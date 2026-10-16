/** Quality page — the light-surface icon tone. */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

export default async function run(page, ui) {
  const out = {};

  // Block the Google Fonts requests. Playwright's screenshot blocks on
  // document.fonts.ready, and a pending webfont request makes it hang until
  // timeout with no file written. Blocking lets the page settle on its
  // system-font fallbacks, which is also what an offline visitor sees — and
  // this is how the site is designed to degrade (Georgia / Arial, no webfont
  // required for legibility).
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());

  for (const [name, w, h] of [
    ['quality-1440', 1440, 1000],
    ['services-1440', 1440, 1000],
  ]) {
    const path = name.startsWith('quality') ? '/quality' : '/services';
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo({ top: Number(620 * 2.2), behavior: 'instant' }));
    await page.waitForTimeout(700);

    // index.html swaps the Google Fonts stylesheet in from media="print" on
    // load, and Playwright's screenshot blocks on document.fonts.ready. If the
    // font request is slow the capture times out and no file is written, so the
    // wait is bounded rather than open-ended.
    await page
      .evaluate(
        () =>
          Promise.race([
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 3000)),
          ]),
      )
      .catch(() => {});

    await page
      .screenshot({ path: `.audit/shots/${name}.png`, timeout: 20000 })
      .catch((e) => {
        out[name] = `screenshot failed: ${e.message.slice(0, 60)}`;
      });
    if (!out[name]) out[name] = path;
  }
  return out;
}
