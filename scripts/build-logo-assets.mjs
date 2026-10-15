/**
 * ============================================================================
 * LOGO ASSET BUILDER
 * ============================================================================
 * Rewrites the logo SVG wrappers so the artwork fills its box.
 *
 * WHY THIS EXISTS
 * ---------------
 * The supplied `vnr-logo.svg` is a 1280x1280 SQUARE canvas wrapping an
 * embedded JPEG photograph of the logo. Measured from the rendered pixels:
 *
 *   canvas            1280 x 1280   (aspect 1.000)
 *   artwork bbox      x 242..1040, y 358..906   (798 x 548, aspect 1.456)
 *   artwork fill      62.5% of width, 43% of height
 *
 * Two separate defects follow from that:
 *
 * 1. SIZING. The <Logo> component sets an explicit `height` and `width:auto`.
 *    For a 1:1 asset that produces a SQUARE, so a header logo sized at 40px
 *    tall is also 40px wide — and the artwork inside it only occupies 43% of
 *    the height, leaving roughly 16px of visible logo. This is the actual
 *    "too small / looks cropped" cause.
 *
 * 2. RESERVATION. `company.logo` declared 210x56 (aspect 3.75:1), which
 *    matches neither the canvas nor the artwork. The browser reserved the
 *    wrong box and the real image then resized on load — a layout shift.
 *
 * THE FIX
 * -------
 * Change only the viewBox. The embedded JPEG is copied across byte-for-byte,
 * so no pixel of the original artwork is redrawn, recoloured, resampled,
 * distorted or cropped — the viewBox simply stops wasting 57% of the box on
 * empty paper. Re-running the site's existing `height` + `width:auto` rule now
 * yields a correctly proportioned, fully legible logo.
 *
 * COMPACT VARIANT
 * ---------------
 * The lockup is STACKED: monogram, then CONSTRUCTION, then the tagline. Its
 * 1.46:1 aspect is incompatible with a wide navigation bar — a 180-230px logo
 * would be 124-158px tall. The tagline band is only 18px of 548 (3.3%), so at
 * header scale it renders as an illegible smudge.
 *
 * So a second file frames bands 1+2 (monogram + CONSTRUCTION) and omits only
 * the tagline. The pixels are identical and unaltered; this selects a region
 * of the same original image rather than producing a new logo. The full lockup
 * — tagline included — remains in use in the footer, the About plate and the
 * mobile drawer, wherever there is room for it.
 *
 * The untouched original is preserved at reference/vnr-logo.original.svg.
 *
 * USAGE: node scripts/build-logo-assets.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '../public');
const REFERENCE_DIR = resolve(__dirname, '../../reference');

/**
 * Measured from the rendered pixels by scripts/measure-logo.mjs.
 *
 * The logo is a STACKED lockup: monogram (y 358-750), the word CONSTRUCTION
 * (y 792-838), then the tagline BUILDING BETTER TOMORROWS (y 890-906).
 */
const ARTWORK = { x: 242, y: 358, w: 798, h: 548 };

/**
 * Even white margin baked into the viewBox, in source pixels (~3% of width).
 *
 * Without it the crop would run the white field flush against the lettering and
 * the logo would read as clipped. This replaces the decorative CSS plate that
 * used to provide that breathing room: the padding is now part of the asset's
 * own white background, so nothing is added around the image at render time.
 */
const MARGIN = 24;

const BOX = {
  x: ARTWORK.x - MARGIN,
  y: ARTWORK.y - MARGIN,
  w: ARTWORK.w + MARGIN * 2,
  h: ARTWORK.h + MARGIN * 2,
};

const ORIGINAL = resolve(PUBLIC_DIR, 'vnr-logo.svg');
const source = readFileSync(ORIGINAL, 'utf8');

const href = source.match(/href="(data:image\/jpeg;base64,[^"]+)"/)?.[1];
if (!href) {
  throw new Error(
    'No embedded JPEG found in vnr-logo.svg. This script only reframes the ' +
      'existing embedded image; it never re-encodes or redraws it.',
  );
}

const title =
  'VNR Constructions logo — complete lockup (monogram, CONSTRUCTION, and the ' +
  'BUILDING BETTER TOMORROWS tagline). Original supplied artwork with the viewBox ' +
  'trimmed to the measured artwork bounds plus an even white margin; no pixel ' +
  'altered, recoloured or cropped.';

function build(box) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${box.w}" height="${box.h}"
     viewBox="${box.x} ${box.y} ${box.w} ${box.h}">
  <title>${title}</title>
  <image width="1280" height="1280"
         preserveAspectRatio="none"
         href="${href}"/>
</svg>
`;
}

/* ---- Preserve the untouched original ------------------------------------
   Guarded: `source` is the CURRENT public/vnr-logo.svg, which after the first
   run is already reframed. Writing it back unconditionally would silently
   replace the pristine original with the trimmed version on the second run,
   destroying the only copy of the as-supplied asset. Write once, never again. */
mkdirSync(REFERENCE_DIR, { recursive: true });
const preserved = resolve(REFERENCE_DIR, 'vnr-logo.original.svg');
if (existsSync(preserved)) {
  console.log('  original already preserved — leaving reference/vnr-logo.original.svg untouched');
} else {
  writeFileSync(preserved, source, 'utf8');
  console.log('  original preserved at reference/vnr-logo.original.svg');
}

/* ---- Write the reframed asset ---------------------------------------------
   ONE asset, the complete lockup, used in every context. An earlier pass also
   emitted a wordmark-only "compact" variant for the header; that is gone. It
   omitted the tagline, and the brief requires the tagline wherever the logo
   appears, so the full lockup is now used at every size instead. */
writeFileSync(resolve(PUBLIC_DIR, 'vnr-logo.svg'), build(BOX, 'complete lockup'), 'utf8');

console.log('✓ logo asset rebuilt from the original embedded image');
console.log(
  `  viewBox="${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}"  aspect ${(BOX.w / BOX.h).toFixed(3)}` +
    `  (artwork ${ARTWORK.w}x${ARTWORK.h} + ${MARGIN}px margin)`,
);

