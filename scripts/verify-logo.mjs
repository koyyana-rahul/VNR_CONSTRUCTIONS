/**
 * Verifies the logo as actually rendered at the widths the brief mandates.
 *
 * Checks the things that actually break: correct aspect, ink filling the box
 * (i.e. the artwork is not floating in dead whitespace), no clipping, no
 * overlap with the navigation or the menu button, no horizontal overflow, and
 * that every context uses the same single asset.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';
const WIDTHS = [320, 375, 430, 768, 1024, 1366, 1440, 1920, 2560];

async function inkReport(img) {
  const probe = new Image();
  probe.src = img.currentSrc || img.src;
  await probe.decode();
  const S = 320;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = Math.max(1, Math.round((S * probe.naturalHeight) / probe.naturalWidth));
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(probe, 0, 0, c.width, c.height);
  const d = cx.getImageData(0, 0, c.width, c.height).data;
  let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
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
  if (maxX < 0) return null;
  return {
    fillW: +(((maxX - minX + 1) / c.width) * 100).toFixed(1),
    fillH: +(((maxY - minY + 1) / c.height) * 100).toFixed(1),
  };
}

export default async function run(page, ui) {
  const rows = [];

  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(650);

    const r = await page.evaluate(async (vw) => {
      const img = document.querySelector('header img[src*="vnr-logo"]');
      if (!img) return { error: 'no header logo' };
      const rect = img.getBoundingClientRect();
      const plate = img.parentElement;

      // Does anything in the header overlap the logo?
      let overlap = null;
      for (const el of document.querySelectorAll('header a, header button, header nav')) {
        if (el === plate || el.contains(img) || img.contains(el)) continue;
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) continue;
        if (b.left < rect.right - 0.5 && b.right > rect.left + 0.5 &&
            b.top < rect.bottom - 0.5 && b.bottom > rect.top + 0.5) {
          overlap = el.getAttribute('aria-label') || el.textContent.trim().slice(0, 24);
        }
      }

      return {
        viewport: vw,
        file: img.getAttribute('src').split('/').pop(),
        box: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        displayedAspect: +(rect.width / rect.height).toFixed(3),
        naturalAspect: +(img.naturalWidth / img.naturalHeight).toFixed(3),
        objectFit: getComputedStyle(img).objectFit,
        // Clipping: the image must not be cropped by its own box.
        clipped: img.scrollWidth > img.clientWidth + 1 || img.scrollHeight > img.clientHeight + 1,
        insideViewport: rect.left >= -0.5 && rect.right <= vw + 0.5,
        headerHeight: Math.round(document.querySelector('header').getBoundingClientRect().height),
        overlap,
        docOverflow:
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, w);

    // Visible ink needs the decoded image, so it runs outside the evaluate above.
    const ink = await page.evaluate(async () => {
      const img = document.querySelector('header img[src*="vnr-logo"]');
      const probe = new Image();
      probe.src = img.currentSrc || img.src;
      await probe.decode();
      const S = 320;
      const c = document.createElement('canvas');
      c.width = S;
      c.height = Math.max(1, Math.round((S * probe.naturalHeight) / probe.naturalWidth));
      const cx = c.getContext('2d', { willReadFrequently: true });
      cx.drawImage(probe, 0, 0, c.width, c.height);
      const d = cx.getImageData(0, 0, c.width, c.height).data;
      let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
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
      return {
        fillW: +(((maxX - minX + 1) / c.width) * 100).toFixed(1),
        fillH: +(((maxY - minY + 1) / c.height) * 100).toFixed(1),
      };
    });

    rows.push({ ...r, ink });
  }

  // Every logo on the site must be the same single asset
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const assets = await page.evaluate(() => {
    const set = new Set();
    const where = {};
    const scan = (root, label) => {
      for (const i of root.querySelectorAll('img[src*="vnr-logo"]')) {
        const f = i.getAttribute('src').split('/').pop();
        set.add(f);
        where[f] = where[f] || [];
        where[f].push(label);
      }
    };
    scan(document, 'page');
    return { files: [...set], where };
  });

  // Drawer + footer
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(600);
  const drawer = await page.evaluate(() => {
    const i = document.querySelector('[role="dialog"] img[src*="vnr-logo"]');
    if (!i) return null;
    const b = i.getBoundingClientRect();
    return { box: `${Math.round(b.width)}x${Math.round(b.height)}`, aspect: +(b.width / b.height).toFixed(3) };
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }));
  await page.waitForTimeout(700);
  const footer = await page.evaluate(() => {
    const i = document.querySelector('footer img[src*="vnr-logo"]');
    if (!i) return null;
    const b = i.getBoundingClientRect();
    return { box: `${Math.round(b.width)}x${Math.round(b.height)}`, aspect: +(b.width / b.height).toFixed(3) };
  });

  return { rows, assets, drawer, footer };
}
