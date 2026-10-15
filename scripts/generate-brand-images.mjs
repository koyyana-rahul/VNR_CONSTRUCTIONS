/**
 * ============================================================================
 * GENERATES THE MIDNIGHT-NAVY / CHAMPAGNE-GOLD ARTWORK
 * ============================================================================
 *
 * WHY PLACEHOLDER ARTWORK EXISTS
 * ------------------------------
 * The brief names two real assets — `vnr-logo.jpg` and
 * `vnr-interiors-promo.png` — plus actual VNR project photography. None of
 * them are in the repository. Rather than hotlink stock images (which break
 * offline, in CI and in audits, and bring colours that fight the palette),
 * this script draws deterministic architectural line art in the EXACT brand
 * palette. Every generated file is clearly named for what it replaces.
 *
 * BENEFITS
 *   - Nothing can 404. The site builds and audits offline.
 *   - Every image is already on-palette, so no section drifts.
 *   - Tiny (3-8 KB each) and resolution-independent.
 *   - Deterministic: the same seed always draws the same picture.
 *
 * TO SWAP IN REAL PHOTOGRAPHY
 *   Drop `vnr-interiors-promo.png` into src/assets/images/ and set
 *   hero.image in src/data/home.js. Same for gallery items — each entry names
 *   the photograph it stands in for.
 *
 * USAGE: node scripts/generate-brand-images.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_ASSETS = resolve(__dirname, '../src/assets/images');
const PUBLIC_IMAGES = resolve(__dirname, '../public/images');

/* ---- Brand palette (must match src/styles/index.css) ------------------- */
const C = {
  navy: '#030A12',
  navy2: '#071727',
  navy3: '#102A3D',
  blackBlue: '#02070D',
  gold: '#D9AD45',
  goldLight: '#FFE3A0',
  goldSoft: '#D9AD4538',
  goldMid: '#D9AD456B',
  ivory: '#F8F7F2',
  textMuted: '#AAB6BF',
  border: '#243746',
};

/* ---- Deterministic PRNG ------------------------------------------------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n) => Math.round(n * 100) / 100;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" role="img">${body}</svg>\n`;

/** Navy gradient ground — every visual shares this family so the set reads as one shoot. */
function ground(w, h, from = C.navy3, to = C.navy) {
  return `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>`;
}

/* ==========================================================================
   COMPOSITIONS
   ========================================================================== */

/** Interior perspective — one-point room, gold light slot on the back wall. */
function interior(seed, { w = 1600, h = 1000 } = {}) {
  const rand = rng(seed);
  const vx = w * (0.44 + rand() * 0.14);
  const vy = h * (0.46 + rand() * 0.1);

  let s = ground(w, h, C.navy3, C.navy2);

  // Floor / ceiling convergence lines
  [[0, 0], [w, 0], [w, h], [0, h]].forEach(([x, y], i) => {
    const gold = i === 3;
    s += `<line x1="${x}" y1="${y}" x2="${r2(vx)}" y2="${r2(vy)}"
      stroke="${gold ? C.gold : C.goldSoft}" stroke-width="${gold ? 2 : 1.4}" opacity="${gold ? 0.8 : 0.55}"/>`;
  });

  // Ceiling cove light — the champagne accent that ties the set together
  s += `<path d="M 0 ${r2(h * 0.06)} L ${r2(vx)} ${r2(vy - h * 0.05)}" stroke="${C.goldLight}" stroke-width="3" opacity="0.5"/>`;

  // Back-wall opening
  const ow = w * 0.12;
  const oh = h * 0.3;
  s += `<rect x="${r2(vx - ow / 2)}" y="${r2(vy - oh / 2)}" width="${r2(ow)}" height="${r2(oh)}"
    stroke="${C.gold}" stroke-width="2.5" opacity="0.85"/>`;
  s += `<line x1="${r2(vx - ow / 2)}" y1="${r2(vy)}" x2="${r2(vx + ow / 2)}" y2="${r2(vy)}"
    stroke="${C.gold}" stroke-width="1.5" opacity="0.55"/>`;

  // Furniture silhouettes, suggesting an occupied room rather than a wireframe
  s += `<rect x="${r2(w * 0.14)}" y="${r2(h * 0.66)}" width="${r2(w * 0.2)}" height="${r2(h * 0.2)}"
    stroke="${C.textMuted}" stroke-width="1.5" opacity="0.5" rx="4"/>`;
  s += `<rect x="${r2(w * 0.66)}" y="${r2(h * 0.6)}" width="${r2(w * 0.22)}" height="${r2(h * 0.12)}"
    stroke="${C.goldMid}" stroke-width="1.5" opacity="0.6" rx="4"/>`;

  // Floor sheen
  s += `<ellipse cx="${r2(vx)}" cy="${r2(h * 0.86)}" rx="${r2(w * 0.3)}" ry="${r2(h * 0.06)}"
    fill="${C.gold}" opacity="0.06"/>`;

  return svg(w, h, s);
}

/** Stacked elevation — architectural facade at dusk. */
function elevation(seed, { w = 1600, h = 1000 } = {}) {
  const rand = rng(seed);
  const floors = 3 + Math.floor(rand() * 3);
  const cols = 4 + Math.floor(rand() * 4);
  const goldFloor = Math.floor(rand() * floors);

  const padX = w * 0.14;
  const padTop = h * 0.16;
  const padBottom = h * 0.18;
  const bw = w - padX * 2;
  const bh = h - padTop - padBottom;
  const floorH = bh / floors;

  let s = ground(w, h, C.navy2, C.navy);
  s += `<line x1="0" y1="${r2(padTop + bh)}" x2="${w}" y2="${r2(padTop + bh)}" stroke="${C.goldMid}" stroke-width="2" opacity="0.7"/>`;
  s += `<rect x="${r2(padX)}" y="${r2(padTop)}" width="${r2(bw)}" height="${r2(bh)}"
    stroke="${C.goldMid}" stroke-width="2.5" fill="none"/>`;

  for (let f = 0; f < floors; f++) {
    const y = padTop + f * floorH;
    const lit = f === goldFloor;
    const stroke = lit ? C.goldLight : C.gold;
    const op = lit ? 0.9 : 0.4;

    s += `<line x1="${r2(padX)}" y1="${r2(y)}" x2="${r2(padX + bw)}" y2="${r2(y)}"
      stroke="${stroke}" stroke-width="${lit ? 2.5 : 1.4}" opacity="${op}"/>`;

    const inset = bw * 0.1;
    const cw = (bw - inset * 2) / cols;
    const winH = floorH * 0.5;
    for (let c = 0; c < cols; c++) {
      const wx = padX + inset + c * cw + cw * 0.18;
      const ww = cw * 0.64;
      s += `<rect x="${r2(wx)}" y="${r2(y + floorH * 0.26)}" width="${r2(ww)}" height="${r2(winH)}"
        stroke="${stroke}" stroke-width="${lit ? 2.2 : 1.2}" opacity="${op}" fill="${lit ? C.goldSoft : 'none'}"/>`;
    }
  }

  // Entrance, always lit — the warm welcome the hero copy talks about
  const ew = bw * 0.1;
  s += `<rect x="${r2(padX + (bw - ew) / 2)}" y="${r2(padTop + bh - floorH * 0.74)}"
    width="${r2(ew)}" height="${r2(floorH * 0.74)}" stroke="${C.goldLight}" stroke-width="2.5" fill="${C.goldSoft}"/>`;

  return svg(w, h, s);
}

/** Plan / layout drawing — used for the About section. */
function plan(seed, { w = 1200, h = 900 } = {}) {
  const rand = rng(seed);
  let s = ground(w, h, C.navy2, C.navy);

  const padX = w * 0.18;
  const padY = h * 0.16;
  const pw = w - padX * 2;
  const ph = h - padY * 2;

  s += `<rect x="${r2(padX)}" y="${r2(padY)}" width="${r2(pw)}" height="${r2(ph)}"
    stroke="${C.goldMid}" stroke-width="3" fill="none"/>`;
  s += `<rect x="${r2(padX + 10)}" y="${r2(padY + 10)}" width="${r2(pw - 20)}" height="${r2(ph - 20)}"
    stroke="${C.gold}" stroke-width="1" fill="none" opacity="0.6"/>`;

  for (let i = 0; i < 3; i++) {
    if (rand() > 0.5) {
      const x = padX + pw * (0.3 + rand() * 0.42);
      s += `<line x1="${r2(x)}" y1="${r2(padY)}" x2="${r2(x)}" y2="${r2(padY + ph)}"
        stroke="${C.gold}" stroke-width="1.8" opacity="0.65"/>`;
    } else {
      const y = padY + ph * (0.3 + rand() * 0.42);
      s += `<line x1="${r2(padX)}" y1="${r2(y)}" x2="${r2(padX + pw)}" y2="${r2(y)}"
        stroke="${C.gold}" stroke-width="1.8" opacity="0.65"/>`;
    }
  }

  // Door swing
  const dx = padX + pw * 0.4;
  const dy = padY + ph * 0.5;
  s += `<path d="M ${r2(dx)} ${r2(dy)} L ${r2(dx)} ${r2(dy + 56)}" stroke="${C.goldLight}" stroke-width="3"/>`;
  s += `<path d="M ${r2(dx)} ${r2(dy + 56)} A 56 56 0 0 0 ${r2(dx + 56)} ${r2(dy)}"
    stroke="${C.gold}" stroke-width="1.4" opacity="0.55" stroke-dasharray="6 6"/>`;

  // Dimension string
  const dy2 = padY + ph + 42;
  s += `<line x1="${r2(padX)}" y1="${dy2}" x2="${r2(padX + pw)}" y2="${dy2}" stroke="${C.textMuted}" stroke-width="1" opacity="0.5"/>`;
  [padX, padX + pw / 2, padX + pw].forEach((x) => {
    s += `<line x1="${r2(x)}" y1="${dy2 - 7}" x2="${r2(x)}" y2="${dy2 + 7}" stroke="${C.textMuted}" stroke-width="1" opacity="0.5"/>`;
  });

  return svg(w, h, s);
}

/** Site under construction — tower crane, frame, material stacks. */
function site(seed, { w = 1600, h = 1000 } = {}) {
  const rand = rng(seed);
  let s = ground(w, h, C.navy3, C.navy2);

  const groundY = h * 0.84;
  s += `<line x1="0" y1="${r2(groundY)}" x2="${w}" y2="${r2(groundY)}" stroke="${C.goldMid}" stroke-width="2.5" opacity="0.8"/>`;

  // Crane
  const mx = w * 0.2;
  const topY = h * 0.18;
  s += `<line x1="${r2(mx)}" y1="${r2(groundY)}" x2="${r2(mx)}" y2="${r2(topY)}" stroke="${C.gold}" stroke-width="4"/>`;
  s += `<line x1="${r2(mx - 28)}" y1="${r2(groundY)}" x2="${r2(mx + 28)}" y2="${r2(groundY)}" stroke="${C.gold}" stroke-width="3"/>`;
  s += `<line x1="${r2(mx)}" y1="${r2(topY)}" x2="${r2(w * 0.84)}" y2="${r2(topY)}" stroke="${C.gold}" stroke-width="3"/>`;
  s += `<line x1="${r2(mx)}" y1="${r2(topY)}" x2="${r2(w * 0.14)}" y2="${r2(topY)}" stroke="${C.gold}" stroke-width="2" opacity="0.55"/>`;
  for (let y = topY; y < groundY; y += 34) {
    s += `<line x1="${r2(mx - 12)}" y1="${r2(y)}" x2="${r2(mx + 12)}" y2="${r2(y + 17)}" stroke="${C.gold}" stroke-width="1" opacity="0.45"/>`;
    s += `<line x1="${r2(mx + 12)}" y1="${r2(y)}" x2="${r2(mx - 12)}" y2="${r2(y + 17)}" stroke="${C.gold}" stroke-width="1" opacity="0.45"/>`;
  }

  // Building
  const bx = w * 0.42;
  const bw = w * 0.4;
  const storeys = 2 + Math.floor(rand() * 2);
  const bh = groundY - h * 0.34;
  s += `<rect x="${r2(bx)}" y="${r2(groundY - bh)}" width="${r2(bw)}" height="${r2(bh)}"
    stroke="${C.gold}" stroke-width="2.5" fill="none"/>`;
  for (let i = 1; i < storeys; i++) {
    const y = groundY - bh + (bh / storeys) * i;
    s += `<line x1="${r2(bx)}" y1="${r2(y)}" x2="${r2(bx + bw)}" y2="${r2(y)}" stroke="${C.gold}" stroke-width="1.6" opacity="0.55"/>`;
    const cols = 4;
    for (let c = 0; c < cols; c++) {
      const cw = bw / cols;
      const x = bx + c * cw + cw * 0.3;
      s += `<rect x="${r2(x)}" y="${r2(y + (bh / storeys) * 0.24)}" width="${r2(cw * 0.4)}"
        height="${r2((bh / storeys) * 0.48)}" stroke="${C.textMuted}" stroke-width="1.2" opacity="0.45" fill="none"/>`;
    }
  }

  return svg(w, h, s);
}

/** Detail texture — close-crop joinery lines. */
function detail(seed, { w = 1200, h = 900 } = {}) {
  const rand = rng(seed);
  let s = ground(w, h, C.navy3, C.navy2);
  const step = 16 + Math.floor(rand() * 10);
  const band = h * (0.4 + rand() * 0.2);
  for (let i = -h; i < w + h; i += step) {
    const isGold = i > band && i < band + h * 0.08;
    s += `<line x1="${i}" y1="0" x2="${i + h * 0.35}" y2="${h}"
      stroke="${isGold ? C.gold : C.border}" stroke-width="${isGold ? 2.2 : 1}" opacity="${isGold ? 0.6 : 0.5}"/>`;
  }
  return svg(w, h, s);
}

/* ==========================================================================
   FILE MAP
   ========================================================================== */

const FILES = {
  // Hero — wide cinematic interior
  'hero-interiors': () => interior(101, { w: 1920, h: 1280 }),

  // About section
  'about-project': () => plan(202, { w: 1200, h: 900 }),

  // Premium interiors promo
  'interiors-promo': () => interior(303, { w: 1400, h: 1050 }),

  // Gallery — six distinct concepts
  'gallery-01': () => interior(401, { w: 1200, h: 900 }),
  'gallery-02': () => plan(402, { w: 1200, h: 900 }),
  'gallery-03': () => elevation(403, { w: 1200, h: 900 }),
  'gallery-04': () => detail(404, { w: 1200, h: 900 }),
  'gallery-05': () => interior(405, { w: 1200, h: 900 }),
  'gallery-06': () => elevation(406, { w: 1200, h: 900 }),

  // Supporting
  'site-crane': () => site(707, { w: 1600, h: 1000 }),
  'detail-joinery': () => detail(808, { w: 1200, h: 900 }),
};

function write(dir, name, content) {
  writeFileSync(resolve(dir, `${name}.svg`), content, 'utf8');
}

mkdirSync(SRC_ASSETS, { recursive: true });
mkdirSync(PUBLIC_IMAGES, { recursive: true });

let n = 0;
for (const [name, build] of Object.entries(FILES)) {
  // Brand imagery is imported through src/assets so Vite fingerprints it, and
  // mirrored into public/images for any direct URL references.
  write(SRC_ASSETS, name, build());
  write(PUBLIC_IMAGES, name, build());
  n++;
}

console.log(`✓ Generated ${n} brand images in navy + champagne gold`);
console.log('  src/assets/images/  (imported, hashed by Vite)');
console.log('  public/images/       (direct URL references)');
console.log('\nReplace with the supplied artwork:');
console.log('  src/assets/images/vnr-interiors-promo.png  -> hero.image');
console.log('  actual VNR project photos                  -> gallery[].src');