/**
 * Row-by-row ink profile of the logo, used to find the horizontal gaps between
 * the monogram, the CONSTRUCTION wordmark and the BUILDING BETTER TOMORROWS
 * tagline.
 *
 * Needed because the supplied lockup is a STACKED composition with an aspect
 * of roughly 1.46:1. That is fundamentally incompatible with a wide navigation
 * bar: to hit a 180-230px logo width the artwork would be 124-158px tall, which
 * no reasonable header can accommodate. Measuring the bands tells us exactly
 * which part of the ORIGINAL artwork can be used where, with no redrawing.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';

export default async function run(page, ui) {
  await page.goto(`${BASE}/`, { waitUntil: 'load' });

  return await page.evaluate(async () => {
    const img = new Image();
    img.src = '/vnr-logo.svg';
    await img.decode();

    const S = 640;
    const cw = S;
    const ch = S;
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, cw, ch);
    const { data } = ctx.getImageData(0, 0, cw, ch);

    const at = (x, y) => {
      const i = (y * cw + x) * 4;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const isInk = (x, y) => {
      const [r, g, b] = at(x, y);
      return r < 190 || g < 190 || b < 190;
    };

    // Ink per row, then split into bands separated by empty runs.
    const rows = [];
    for (let y = 0; y < ch; y++) {
      let c = 0;
      let firstX = -1;
      let lastX = -1;
      for (let x = 0; x < cw; x++) {
        if (!isInk(x, y)) continue;
        c++;
        if (firstX < 0) firstX = x;
        lastX = x;
      }
      rows.push({ y, c, firstX, lastX });
    }

    // A band continues while a row has any ink; gaps of >=4px start a new band.
    const bands = [];
    let cur = null;
    let gap = 0;
    rows.forEach((r) => {
      if (r.c > 0) {
        if (!cur) cur = { y0: r.y, y1: r.y, x0: r.firstX, x1: r.lastX };
        cur.y1 = r.y;
        cur.x0 = Math.min(cur.x0, r.firstX);
        cur.x1 = Math.max(cur.x1, r.lastX);
        gap = 0;
      } else if (cur) {
        gap++;
        if (gap >= 5) {
          bands.push(cur);
          cur = null;
          gap = 0;
        }
      }
    });
    if (cur) bands.push(cur);

    // Canvas is 1280 units; we sampled at 640, so double everything.
    const k = 1280 / cw;
    return bands
      .filter((b) => b.y1 - b.y0 > 6)
      .map((b, i) => ({
        band: i + 1,
        y: [Math.round(b.y0 * k), Math.round(b.y1 * k)],
        x: [Math.round(b.x0 * k), Math.round(b.x1 * k)],
        height: Math.round((b.y1 - b.y0 + 1) * k),
        width: Math.round((b.x1 - b.x0 + 1) * k),
      }));
  });
}
