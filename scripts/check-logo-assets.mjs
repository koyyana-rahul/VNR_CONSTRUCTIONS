/**
 * ============================================================================
 * LOGO ASSET CHECK
 * ============================================================================
 * Replaces the old build-logo-assets.mjs.
 *
 * WHAT CHANGED
 * ------------
 * The old script rewrote `public/vnr-logo.svg` — an SVG wrapper around an
 * embedded JPEG — by trimming its viewBox from the 1280x1280 square canvas down
 * to the measured artwork bounds. That job existed because the artwork was
 * rotated 90 degrees relative to its container and the square canvas wasted 57%
 * of the box.
 *
 * The supplied asset is now `public/vnr-logo.png`: a 1774 x 887 (2.000:1)
 * raster with even margins and no dead space. There is nothing to reframe, so
 * this script no longer WRITES anything. It only verifies, which is the part
 * that still has value: a logo silently 404-ing is the single most damaging
 * thing that can happen to a site's header, and that is exactly the bug this
 * replaced (`company.logo.src` pointed at the deleted .svg while the site
 * served a .png).
 *
 * USAGE: node scripts/check-logo-assets.mjs
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '../public');

const EXPECTED = {
  /** The untouched supplied artwork. This script never writes to it. */
  original: { file: 'vnr-logo.png', width: 1774, height: 887 },
  /** The losslessly trimmed display asset the site actually renders. */
  trim: { file: 'vnr-logo-trim.png', width: 1495, height: 670 },
  usedBy: ['header', 'mobile drawer', 'footer', 'About plate'],
};

let failed = false;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  failed = true;
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

console.log('\nLOGO ASSET\n' + '='.repeat(60));

for (const [role, spec] of Object.entries(EXPECTED)) {
  if (role === 'usedBy') continue;
  const path = resolve(PUBLIC_DIR, spec.file);
  if (!existsSync(path)) {
    fail(`${spec.file} is missing from public/ (${role})`);
    continue;
  }
  const size = statSync(path).size;
  pass(`${spec.file} present — ${(size / 1024).toFixed(0)} KB (${role})`);

  // Read the IHDR chunk straight out of the file. No decoder needed.
  const buf = readHeader(path);
  if (!buf) {
    fail(`${spec.file}: could not read the PNG header`);
    continue;
  }
  const { width, height, bitDepth, colorType } = buf;
  const aspect = width / height;
  pass(`  intrinsic ${width} x ${height}, aspect ${aspect.toFixed(4)}`);

  if (width !== spec.width || height !== spec.height) {
    fail(
      `  intrinsic size is ${width}x${height}, expected ${spec.width}x${spec.height}.\n` +
        '    Re-run `npm run logo` if the artwork changed, then update\n' +
        '    company.logo.width/height AND the --logo-h ratio in\n' +
        '    src/styles/index.css — otherwise the header reserves the wrong box.',
    );
  }
  if (bitDepth !== 8) fail(`  unexpected bit depth ${bitDepth}`);
  // colorType 6 = RGBA (has alpha), 2 = RGB (opaque).
  if (colorType === 6) {
    console.log('  · has an alpha channel — if the background is meant to be opaque, re-export as RGB');
  } else {
    pass('  opaque RGB — no transparency/blending risk');
  }
}

/* Every logo width token must be defined at :root, not only inside media
   queries. An undefined var() makes `width: var(--x)` invalid at computed-value
   time, so the width is dropped and the image falls back to its full intrinsic
   width — which is how the footer logo became 1495px wide and injected ~1150px
   of horizontal overflow below 480px. Cheap to check, expensive to debug. */
const css = readFileSync(resolve(__dirname, '../src/styles/index.css'), 'utf8');
const rootBlock = css.slice(0, css.indexOf('@layer base'));
for (const token of ['--logo-w', '--logo-w-drawer', '--logo-w-footer']) {
  if (new RegExp(`${token}\\s*:`).test(rootBlock)) {
    pass(`${token} defined at :root`);
  } else {
    fail(
      `${token} is NOT defined at :root — any width using it is invalid below ` +
        'the first media query, and the logo falls back to its intrinsic size',
    );
  }
}

/* The rendered path must exist and must point at the TRIM asset, not the
   original. This is the check that catches the bug that actually happened:
   company.logo.src referencing a file that was renamed out from under it,
   which 404'd into the SPA fallback and rendered as alt text in the header. */
const configSrc = readFileSync(resolve(__dirname, '../src/config/company.js'), 'utf8');
const declared = configSrc.match(/src:\s*'([^']*vnr-logo[^']*)'/)?.[1];
if (!declared) {
  fail('company.logo.src not found in src/config/company.js');
} else if (existsSync(resolve(PUBLIC_DIR, declared.replace(/^\//, '')))) {
  pass(`company.logo.src -> ${declared} exists on disk`);
} else {
  fail(`company.logo.src -> ${declared} but public${declared} does not exist`);
}

const declaredW = Number(configSrc.match(/width:\s*(\d+)/)?.[1]);
const declaredH = Number(configSrc.match(/height:\s*(\d+)/)?.[1]);
const trim = readHeader(resolve(PUBLIC_DIR, EXPECTED.trim.file));
if (trim && (declaredW !== trim.width || declaredH !== trim.height)) {
  fail(
    `company.logo declares ${declaredW}x${declaredH} but ${EXPECTED.trim.file} ` +
      `is ${trim.width}x${trim.height} — the browser will reserve the wrong box.`,
  );
} else if (trim) {
  pass(`company.logo ${declaredW}x${declaredH} matches the asset`);
}

// The reference copy of the previous artwork, kept for provenance.
const original = resolve(__dirname, '../../reference/vnr-logo.original.svg');
console.log(
  existsSync(original)
    ? '  · previous artwork preserved at reference/vnr-logo.original.svg'
    : '  · note: reference/vnr-logo.original.svg not found',
);

console.log('='.repeat(60));
console.log(
  failed
    ? '\nLogo asset check FAILED — fix the above before shipping.\n'
    : '\nLogo asset check passed.\n',
);

if (failed) process.exitCode = 1;

function readHeader(file) {
  const b = readFileSync(file);
  if (b.slice(1, 4).toString() !== 'PNG') return null;
  return {
    width: b.readUInt32BE(16),
    height: b.readUInt32BE(20),
    bitDepth: b[24],
    colorType: b[25],
  };
}