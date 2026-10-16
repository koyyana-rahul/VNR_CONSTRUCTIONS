/**
 * ============================================================================
 * LOGO DISPLAY ASSET BUILDER — lossless whitespace trim
 * ============================================================================
 *
 * THE PROBLEM
 * -----------
 * public/vnr-logo.png is 1774 x 887, opaque RGB (PNG colour type 2 — no alpha
 * channel at all), with the black-and-gold artwork sitting inside an even white
 * field:
 *
 *     ink bbox   x 160..1614, y 124..753   (1455 x 630)
 *     ink fill   82% of the width, 71% of the height
 *     margins    160 left / 159 right, 124 top / 133 bottom
 *
 * Because the background is opaque white and the margins are even, the file
 * renders as a large WHITE RECTANGLE with the mark floating inside it. On the
 * midnight-navy header that white block is the loudest thing in the chrome, and
 * the actual logo reads as "too small inside a big box". It is also why sizing
 * the element larger never helped: only 82% of every pixel added is artwork.
 *
 * THE FIX
 * -------
 * Emit a second file, vnr-logo-trim.png, cropped to the measured ink bounds plus
 * a small even margin, and point the site at that. The fill goes from 82%x71%
 * to ~97%x~94%, so the artwork finally fills its box.
 *
 * This is a genuine crop of DEAD WHITESPACE ONLY. No letterform, the gold
 * blade, or the CONSTRUCTIONS wordmark is touched — the new bounds are
 * `bbox +/- padding`, and the measurement is done from the decoded pixels
 * rather than hard-coded, so re-running it against a new asset stays correct.
 *
 * WHY IT IS LOSSLESS
 * ------------------
 * The crop only selects whole pixels; nothing is resampled, re-encoded at lower
 * quality, or filtered. Every retained pixel is bit-identical to the source.
 * The encoder below writes standard filter type 0 (None) on every row and
 * deflates at level 9.
 *
 * THE ENCODER, AND WHY IT IS HERE
 * -------------------------------
 * Cropping needs a PNG decoder and encoder. The project has no image library —
 * no sharp, no cwebp, no ImageMagick — and the brief forbids adding
 * dependencies. So this file implements the minimum: inflate + unfilter to read,
 * crop, filter + deflate to write. It supports 8-bit RGB and RGBA, which is
 * what a logo export is, and refuses anything else loudly rather than
 * corrupting it.
 *
 * The ORIGINAL is never modified.
 *
 * USAGE: node scripts/build-logo-assets.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '../public');

const SOURCE = 'vnr-logo.png';
const OUTPUT = 'vnr-logo-trim.png';

/**
 * Even margin left around the artwork after trimming, in source pixels.
 *
 * Small on purpose. The point is to stop the white block dominating; leaving a
 * generous pad would re-create the problem at a smaller size. 20px is ~1.4% of
 * the artwork width — enough that the white never appears to clip the black,
 * small enough that the fill stays around 97%.
 */
const PADDING = 20;

/** A pixel counts as artwork if ANY channel is below this (0-255). */
const INK_THRESHOLD = 200;

/* ==========================================================================
   PNG DECODE
   ========================================================================== */
function crc32(buf) {
  let c;
  const table = crc32.table ?? (crc32.table = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/** @returns {{width:number,height:number,channels:number,data:Buffer}} */
function decodePng(file) {
  const buf = readFileSync(file);
  if (buf.slice(1, 4).toString() !== 'PNG') throw new Error(`${file} is not a PNG`);

  const ihdr = {};
  const idat = [];
  let i = 8;
  while (i < buf.length - 8) {
    const len = buf.readUInt32BE(i);
    const type = buf.slice(i + 4, i + 8).toString('ascii');
    const body = buf.slice(i + 8, i + 8 + len);
    if (type === 'IHDR') {
      ihdr.width = body.readUInt32BE(0);
      ihdr.height = body.readUInt32BE(4);
      ihdr.bitDepth = body[8];
      ihdr.colorType = body[9];
      ihdr.interlace = body[12];
    } else if (type === 'IDAT') {
      idat.push(body);
    } else if (type === 'IEND') break;
    i += 12 + len;
  }

  if (ihdr.bitDepth !== 8) throw new Error(`unsupported bit depth ${ihdr.bitDepth} (need 8)`);
  if (ihdr.interlace !== 0) throw new Error('interlaced PNGs are not supported');
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[ihdr.colorType];
  if (!channels) throw new Error(`unsupported colour type ${ihdr.colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const { width, height } = ihdr;
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);

  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const rowStart = y * stride;
    const prevStart = rowStart - stride;
    for (let x = 0; x < stride; x++) {
      const rawByte = raw[pos + x];
      const a = x >= channels ? out[rowStart + x - channels] : 0;
      const b = y > 0 ? out[prevStart + x] : 0;
      const c = x >= channels && y > 0 ? out[prevStart + x - channels] : 0;
      let v;
      switch (filter) {
        case 0: v = rawByte; break;
        case 1: v = rawByte + a; break;
        case 2: v = rawByte + b; break;
        case 3: v = rawByte + ((a + b) >> 1); break;
        case 4: v = rawByte + paeth(a, b, c); break;
        default: throw new Error(`unknown PNG filter ${filter} on row ${y}`);
      }
      out[rowStart + x] = v & 0xff;
    }
    pos += stride;
  }

  return { width, height, channels, colorType: ihdr.colorType, data: out };
}

/* ==========================================================================
   PNG ENCODE
   ========================================================================== */
function chunk(type, body) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(body.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, body])));
  return Buffer.concat([len, typeBuf, body, crc]);
}

function encodePng({ width, height, channels, colorType, data }) {
  const stride = width * channels;
  // Filter type 0 (None) on every row: after a whitespace crop the rows are
  // still highly compressible, and None keeps the encoder trivially correct.
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = colorType;
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ==========================================================================
   TRIM
   ========================================================================== */
function inkBounds({ width, height, channels, data }) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    const rowStart = y * width * channels;
    for (let x = 0; x < width; x++) {
      const p = rowStart + x * channels;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      if (r < INK_THRESHOLD || g < INK_THRESHOLD || b < INK_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error('no artwork found — the asset is blank');
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function crop(img, box) {
  const { width, channels, data } = img;
  const stride = width * channels;
  const out = Buffer.alloc(box.w * box.h * channels);
  for (let y = 0; y < box.h; y++) {
    const from = (box.y + y) * stride + box.x * channels;
    data.copy(out, y * box.w * channels, from, from + box.w * channels);
  }
  return { ...img, width: box.w, height: box.h, data: out };
}

/* ==========================================================================
   RUN
   ========================================================================== */
const src = resolve(PUBLIC, SOURCE);
console.log(`\nBuilding ${OUTPUT} from ${SOURCE}\n${'='.repeat(60)}`);

const img = decodePng(src);
console.log(
  `  source     ${img.width} x ${img.height}  (aspect ${(img.width / img.height).toFixed(4)}, ` +
    `colour type ${img.colorType})`,
);

const ink = inkBounds(img);
console.log(
  `  ink bbox   x ${ink.x}..${ink.x + ink.w - 1}, y ${ink.y}..${ink.y + ink.h - 1}  ` +
    `(${ink.w} x ${ink.h})`,
);
console.log(
  `  fill       ${((ink.w / img.width) * 100).toFixed(1)}% wide, ` +
    `${((ink.h / img.height) * 100).toFixed(1)}% tall`,
);

const box = {
  x: Math.max(0, ink.x - PADDING),
  y: Math.max(0, ink.y - PADDING),
  w: 0,
  h: 0,
};
box.w = Math.min(img.width, ink.w + PADDING * 2);
box.h = Math.min(img.height, ink.h + PADDING * 2);

const trimmed = crop(img, box);
writeFileSync(resolve(PUBLIC, OUTPUT), encodePng(trimmed));

const fillW = (ink.w / trimmed.width) * 100;
const fillH = (ink.h / trimmed.height) * 100;
console.log(`  trimmed    ${trimmed.width} x ${trimmed.height}  (aspect ${(trimmed.width / trimmed.height).toFixed(4)})`);
console.log(`  fill       ${fillW.toFixed(1)}% wide, ${fillH.toFixed(1)}% tall`);
console.log(`  padding    ${PADDING}px even, artwork untouched (lossless crop)`);
console.log('='.repeat(60));
console.log('  Update company.logo.width/height and --logo-h to match.\n');