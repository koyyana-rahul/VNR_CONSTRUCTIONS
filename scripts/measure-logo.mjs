/**
 * Measures the real artwork inside the logo asset.
 *
 * The supplied vnr-logo.svg is a square canvas wrapping an embedded JPEG, so
 * the artwork occupies only part of it. Sizing must be based on the artwork's
 * true bounding box, not the canvas — that is what makes the header logo render
 * tiny. Computed here with a canvas rather than by eye.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5200';

export default async function run(page, ui) {
  await page.goto(`${BASE}/`, { waitUntil: 'load' });

  return await page.evaluate(async () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/vnr-logo.svg';
    await img.decode();

    const W = img.naturalWidth;
    const H = img.naturalHeight;

    // Rasterise at a manageable size; ratios are all we need.
    const scale = 512 / Math.max(W, H);
    const cw = Math.round(W * scale);
    const ch = Math.round(H * scale);

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, cw, ch);
    const { data } = ctx.getImageData(0, 0, cw, ch);

    // Background is an off-white paper tone, not #fff, so the threshold is
    // relative to the corner sample rather than an absolute near-white test.
    const px = (x, y) => {
      const i = (y * cw + x) * 4;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const corner = px(2, 2);

    // Anything meaningfully darker than the paper counts as artwork.
    const isInk = (x, y) => {
      const [r, g, b] = px(x, y);
      return r < 190 || g < 190 || b < 190;
    };

    let minX = cw;
    let minY = ch;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        if (!isInk(x, y)) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    const artW = maxX - minX + 1;
    const artH = maxY - minY + 1;

    // Back to original asset units
    const s = Math.max(W, H) / 512;
    return {
      canvas: { W, H, aspect: +(W / H).toFixed(3) },
      backgroundColour: `rgb(${corner.join(', ')})`,
      artworkBoxInCanvas: {
        x: Math.round(minX * s),
        y: Math.round(minY * s),
        width: Math.round(artW * s),
        height: Math.round(artH * s),
      },
      artworkAspect: +(artW / artH).toFixed(3),
      // Fraction of the canvas the artwork actually fills
      fillX: +((artW * s) / W).toFixed(3),
      fillY: +((artH * s) / H).toFixed(3),
    };
  });
}
