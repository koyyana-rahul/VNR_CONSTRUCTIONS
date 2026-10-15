/**
 * Measures the logo as actually rendered: the white plate box, the image box,
 * and the VISIBLE INK inside the image (what a person can actually read).
 *
 * Rendered size alone is misleading here — the original bug was a correctly
 * sized box wrapping artwork that only filled 43% of it, so the visible logo was
 * far smaller than the element. This reports all three so the fix is provable.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';

const WIDTHS = [320, 390, 768, 1440];

async function measure(page, w) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  return await page.evaluate(async (vw) => {
    const out = { viewport: vw, logos: [] };
    const imgs = [...document.querySelectorAll('img')].filter((i) =>
      /vnr-logo/.test(i.getAttribute('src') || ''),
    );

    for (const img of imgs) {
      const r = img.getBoundingClientRect();
      const plate = img.parentElement;
      const pr = plate.getBoundingClientRect();
      const cs = getComputedStyle(img);

      // Visible ink: rasterise the logo and find non-white bounds.
      let ink = null;
      try {
        const probe = new Image();
        probe.src = img.currentSrc || img.src;
        await probe.decode();
        const S = 300;
        const c = document.createElement('canvas');
        c.width = S;
        c.height = Math.max(1, Math.round((S * probe.naturalHeight) / probe.naturalWidth));
        const cx = c.getContext('2d', { willReadFrequently: true });
        cx.drawImage(probe, 0, 0, c.width, c.height);
        const d = cx.getImageData(0, 0, c.width, c.height).data;
        let minX = c.width;
        let minY = c.height;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < c.height; y++) {
          for (let x = 0; x < c.width; x++) {
            const i = (y * c.width + x) * 4;
            if (d[i] > 225 && d[i + 1] > 225 && d[i + 2] > 225) continue;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
        if (maxX > 0) {
          ink = {
            fillW: +(((maxX - minX + 1) / c.width) * 100).toFixed(1),
            fillH: +(((maxY - minY + 1) / c.height) * 100).toFixed(1),
          };
        }
      } catch {
        ink = null;
      }

      out.logos.push({
        file: (img.getAttribute('src') || '').split('/').pop(),
        plate: `${Math.round(pr.width)}x${Math.round(pr.height)}`,
        box: `${Math.round(r.width)}x${Math.round(r.height)}`,
        naturalAspect: img.naturalWidth / img.naturalHeight,
        displayedAspect: +(r.width / r.height).toFixed(3),
        objectFit: cs.objectFit,
        alt: img.getAttribute('alt'),
        visibleInk: ink,
        // Does the logo overlap the nav, or push the page sideways?
        overflowsViewport: r.right > vw + 0.5 || r.left < -0.5,
      });
    }

    out.headerScrollW = document.querySelector('header')?.scrollWidth;
    out.headerClientW = document.querySelector('header')?.clientWidth;
    out.docOverflow =
      document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return out;
  }, w);
}

export default async function run(page, ui) {
  const results = [];
  for (const w of WIDTHS) results.push(await measure(page, w));

  // Footer + drawer, at one width each
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }));
  await page.waitForTimeout(600);
  const footer = await page.evaluate(() => {
    const img = [...document.querySelectorAll('footer img')].find((i) =>
      /vnr-logo/.test(i.getAttribute('src') || ''),
    );
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return { file: img.getAttribute('src').split('/').pop(), box: `${Math.round(r.width)}x${Math.round(r.height)}` };
  });

  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(600);
  const drawer = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const img = d && [...d.querySelectorAll('img')].find((i) => /vnr-logo/.test(i.getAttribute('src') || ''));
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return { file: img.getAttribute('src').split('/').pop(), box: `${Math.round(r.width)}x${Math.round(r.height)}` };
  });

  return { header: results, footer, drawer };
}
