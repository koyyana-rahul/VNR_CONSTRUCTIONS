/**
 * ============================================================================
 * GENERATES BRAND-PALETTE ARCHITECTURAL ARTWORK
 * ============================================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * VNR has not supplied project photography, and the brief forbids random broken
 * image links and off-palette stock imagery. So instead of hotlinking
 * unsplash-style URLs (which break offline, in CI, and in audits, and which
 * bring colours that fight the black/white/gold identity), this script draws
 * deterministic architectural line artwork as real .svg files.
 *
 * Benefits:
 *   - Nothing to break. Files are committed to public/images/.
 *   - Every image is already in the VNR palette.
 *   - Tiny (2-6 KB each) and infinitely scalable.
 *   - Deterministic: the same seed always produces the same image.
 *
 * TO REPLACE WITH REAL PHOTOGRAPHY: drop real images into public/images/ using
 * the same filenames (see the FILES map below), or point the data files at new
 * paths. The site expects 3:2 landscape for project cards and 4:5 for hero
 * crops, but the <img> tags use object-cover with a fixed aspect ratio, so
 * other ratios are safe.
 *
 * USAGE: node scripts/generate-images.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/images');

const C = {
  deep: '#101010',
  black: '#171717',
  gold: '#B99A59',
  goldLight: '#D0B477',
  warm: '#FAFAF8',
  mist: '#F4F3EF',
  line: '#E5E1D8',
  text: '#77736B',
};

/* ---- Deterministic PRNG (mulberry32) so output is reproducible ----------- */
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
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">${body}</svg>\n`;

/** Warm paper gradient background shared by every image. */
function paper(w, h, from = C.warm, to = C.mist, angle = 135) {
  const rad = (angle * Math.PI) / 180;
  const x = r2((Math.cos(rad) + 1) / 2 * 100);
  const y = r2((Math.sin(rad) + 1) / 2 * 100);
  return `<defs><linearGradient id="p" x1="${100 - x}%" y1="0%" x2="${x}%" y2="${y}%">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient></defs><rect width="${w}" height="${h}" fill="url(#p)"/>`;
}

/* ==========================================================================
   GENERATORS
   ========================================================================== */

/** Building elevation: stacked floors, window grid, one gold accent floor. */
function facade(seed, { w = 1200, h = 800 } = {}) {
  const rand = rng(seed);
  const goldFloor = Math.floor(rand() * 3);
  const floors = 3 + Math.floor(rand() * 3);
  const cols = 4 + Math.floor(rand() * 4);

  const padX = w * 0.12;
  const padTop = h * 0.18;
  const padBottom = h * 0.16;
  const bw = w - padX * 2;
  const bh = h - padTop - padBottom;
  const floorH = bh / floors;

  let s = paper(w, h);
  // Ground line
  s += `<line x1="0" y1="${r2(padTop + bh)}" x2="${w}" y2="${r2(padTop + bh)}" stroke="${C.black}" stroke-width="2" opacity="0.5"/>`;
  // Parapet
  s += `<rect x="${r2(padX)}" y="${r2(padTop)}" width="${r2(bw)}" height="${r2(bh)}" stroke="${C.black}" stroke-width="2.5"/>`;

  for (let f = 0; f < floors; f++) {
    const y = padTop + f * floorH;
    const isGold = f === goldFloor;
    const stroke = isGold ? C.gold : C.black;
    const op = isGold ? 0.85 : 0.34;
    const sw = isGold ? 2.5 : 1.25;

    // Slab band
    s += `<line x1="${r2(padX)}" y1="${r2(y)}" x2="${r2(padX + bw)}" y2="${r2(y)}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>`;

    const inset = bw * 0.09;
    const cw = (bw - inset * 2) / cols;
    const winH = floorH * 0.52;
    for (let c = 0; c < cols; c++) {
      const x = padX + inset + c * cw;
      const wx = x + cw * 0.18;
      const ww = cw * 0.64;
      s += `<rect x="${r2(wx)}" y="${r2(y + floorH * 0.24)}" width="${r2(ww)}" height="${r2(winH)}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>`;
      // Mullion
      s += `<line x1="${r2(wx + ww / 2)}" y1="${r2(y + floorH * 0.24)}" x2="${r2(wx + ww / 2)}" y2="${r2(y + floorH * 0.24 + winH)}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>`;
    }
  }

  // Entry
  const ew = bw * 0.12;
  const ex = padX + (bw - ew) / 2;
  s += `<rect x="${r2(ex)}" y="${r2(padTop + bh - floorH * 0.72)}" width="${r2(ew)}" height="${r2(floorH * 0.72)}" stroke="${C.gold}" stroke-width="2.5"/>`;
  // Horizon rule
  s += `<line x1="0" y1="${r2(h * 0.94)}" x2="${w}" y2="${r2(h * 0.94)}" stroke="${C.gold}" stroke-width="1.5" opacity="0.4"/>`;
  return svg(w, h, s);
}

/** Structural frame: columns, beams, bracing, section lines. */
function structure(seed, { w = 1200, h = 800 } = {}) {
  const rand = rng(seed);
  const bays = 3 + Math.floor(rand() * 3);
  const storeys = 2 + Math.floor(rand() * 2);

  let s = paper(w, h, C.mist, '#EDEBE4');
  const padX = w * 0.14;
  const padTop = h * 0.14;
  const padBottom = h * 0.2;
  const bw = w - padX * 2;
  const bh = h - padTop - padBottom;
  const bayW = bw / bays;
  const stH = bh / storeys;

  for (let st = 0; st <= storeys; st++) {
    const y = padTop + st * stH;
    s += `<line x1="${r2(padX)}" y1="${r2(y)}" x2="${r2(padX + bw)}" y2="${r2(y)}" stroke="${C.black}" stroke-width="${st === 0 ? 3 : 2}" opacity="${st === 0 ? 0.7 : 0.4}"/>`;
  }
  for (let b = 0; b <= bays; b++) {
    const x = padX + b * bayW;
    s += `<line x1="${r2(x)}" y1="${r2(padTop)}" x2="${r2(x)}" y2="${r2(padTop + bh)}" stroke="${C.black}" stroke-width="${b === 0 || b === bays ? 3 : 1.5}" opacity="0.45"/>`;
  }
  // Diagonal bracing in two bays
  for (let i = 0; i < 2; i++) {
    const b = Math.floor(rand() * (bays - 1));
    const x1 = padX + b * bayW;
    const x2 = x1 + bayW;
    s += `<line x1="${r2(x1)}" y1="${r2(padTop)}" x2="${r2(x2)}" y2="${r2(padTop + bh)}" stroke="${C.gold}" stroke-width="2" opacity="0.5"/>`;
  }
  // Section markers
  s += `<line x1="${r2(w * 0.06)}" y1="${r2(h * 0.06)}" x2="${r2(w * 0.06)}" y2="${r2(h * 0.94)}" stroke="${C.text}" stroke-width="1" stroke-dasharray="10 8" opacity="0.4"/>`;
  s += `<line x1="${r2(w * 0.94)}" y1="${r2(h * 0.06)}" x2="${r2(w * 0.94)}" y2="${r2(h * 0.94)}" stroke="${C.text}" stroke-width="1" stroke-dasharray="10 8" opacity="0.4"/>`;
  return svg(w, h, s);
}

/** Interior perspective: one-point room with floor and ceiling lines. */
function interior(seed, { w = 1200, h = 800 } = {}) {
  const rand = rng(seed);
  const vx = w * (0.42 + rand() * 0.16);
  const vy = h * (0.44 + rand() * 0.12);

  let s = `<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="100%">
    <stop offset="0" stop-color="${C.warm}"/><stop offset="1" stop-color="${C.mist}"/>
  </linearGradient></defs><rect width="${w}" height="${h}" fill="url(#f)"/>`;

  const corners = [
    [0, 0], [w, 0], [w, h], [0, h],
  ];
  corners.forEach(([x, y], i) => {
    const isGold = i === 2;
    s += `<line x1="${x}" y1="${y}" x2="${r2(vx)}" y2="${r2(vy)}" stroke="${isGold ? C.gold : C.black}" stroke-width="${isGold ? 2 : 1.25}" opacity="${isGold ? 0.7 : 0.32}"/>`;
  });

  // Ceiling / floor centre lines
  s += `<line x1="${w / 2}" y1="0" x2="${r2(vx)}" y2="${r2(vy)}" stroke="${C.black}" stroke-width="1" opacity="0.18" stroke-dasharray="8 10"/>`;
  s += `<line x1="${w / 2}" y1="${h}" x2="${r2(vx)}" y2="${r2(vy)}" stroke="${C.black}" stroke-width="1" opacity="0.18" stroke-dasharray="8 10"/>`;

  // Wall opening on the vanishing wall
  const ow = w * 0.13;
  const oh = h * 0.3;
  s += `<rect x="${r2(vx - ow / 2)}" y="${r2(vy - oh / 2)}" width="${r2(ow)}" height="${r2(oh)}" stroke="${C.gold}" stroke-width="2.5"/>`;
  s += `<line x1="${r2(vx - ow / 2)}" y1="${r2(vy)}" x2="${r2(vx + ow / 2)}" y2="${r2(vy)}" stroke="${C.gold}" stroke-width="1.5" opacity="0.5"/>`;
  return svg(w, h, s);
}

/** Floor plan: rooms, walls, openings, dimension string. */
function plan(seed, { w = 1200, h = 800 } = {}) {
  const rand = rng(seed);
  let s = paper(w, h, '#FFFFFF', C.warm);

  const padX = w * 0.16;
  const padY = h * 0.14;
  const pw = w - padX * 2;
  const ph = h - padY * 2;

  // Outer wall (double line = poché)
  s += `<rect x="${r2(padX)}" y="${r2(padY)}" width="${r2(pw)}" height="${r2(ph)}" fill="none" stroke="${C.black}" stroke-width="3"/>`;
  s += `<rect x="${r2(padX + 9)}" y="${r2(padY + 9)}" width="${r2(pw - 18)}" height="${r2(ph - 18)}" fill="none" stroke="${C.black}" stroke-width="1"/>`;

  // Internal partitions
  const cuts = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < cuts; i++) {
    const vertical = rand() > 0.5;
    if (vertical) {
      const x = padX + pw * (0.28 + rand() * 0.46);
      s += `<line x1="${r2(x)}" y1="${r2(padY)}" x2="${r2(x)}" y2="${r2(padY + ph)}" stroke="${C.black}" stroke-width="2" opacity="0.65"/>`;
    } else {
      const y = padY + ph * (0.28 + rand() * 0.46);
      s += `<line x1="${r2(padX)}" y1="${r2(y)}" x2="${r2(padX + pw)}" y2="${r2(y)}" stroke="${C.black}" stroke-width="2" opacity="0.65"/>`;
    }
  }

  // Door swing, highlighted in gold
  const dx = padX + pw * 0.4;
  const dy = padY + ph * 0.52;
  s += `<path d="M ${r2(dx)} ${r2(dy)} L ${r2(dx)} ${r2(dy + 52)}" stroke="${C.gold}" stroke-width="3"/>`;
  s += `<path d="M ${r2(dx)} ${r2(dy + 52)} A 52 52 0 0 0 ${r2(dx + 52)} ${r2(dy)}" stroke="${C.gold}" stroke-width="1.5" opacity="0.6" stroke-dasharray="6 6"/>`;
  s += `<line x1="${r2(dx)}" y1="${r2(dy)}" x2="${r2(dx + 52)}" y2="${r2(dy)}" stroke="${C.gold}" stroke-width="1.5" opacity="0.6"/>`;

  // Dimension string below the plan
  const dy2 = padY + ph + 40;
  s += `<line x1="${r2(padX)}" y1="${dy2}" x2="${r2(padX + pw)}" y2="${dy2}" stroke="${C.text}" stroke-width="1" opacity="0.55"/>`;
  [padX, padX + pw / 2, padX + pw].forEach((x) => {
    s += `<line x1="${r2(x)}" y1="${dy2 - 7}" x2="${r2(x)}" y2="${dy2 + 7}" stroke="${C.text}" stroke-width="1" opacity="0.55"/>`;
  });
  return svg(w, h, s);
}

/** Site view: crane mast, hoarding, material stacks. */
function site(seed, { w = 1200, h = 800 } = {}) {
  const rand = rng(seed);
  let s = paper(w, h, '#F7F6F2', '#E9E6DD');

  const groundY = h * 0.82;
  s += `<line x1="0" y1="${r2(groundY)}" x2="${w}" y2="${r2(groundY)}" stroke="${C.black}" stroke-width="2.5" opacity="0.65"/>`;

  // Crane mast + jib
  const mx = w * (0.2 + rand() * 0.15);
  const topY = h * 0.2;
  s += `<line x1="${r2(mx)}" y1="${r2(groundY)}" x2="${r2(mx)}" y2="${r2(topY)}" stroke="${C.gold}" stroke-width="4"/>`;
  s += `<line x1="${r2(mx - 26)}" y1="${r2(groundY)}" x2="${r2(mx + 26)}" y2="${r2(groundY)}" stroke="${C.gold}" stroke-width="3" opacity="0.7"/>`;
  s += `<line x1="${r2(mx)}" y1="${r2(topY)}" x2="${r2(w * 0.82)}" y2="${r2(topY)}" stroke="${C.gold}" stroke-width="3"/>`;
  s += `<line x1="${r2(mx)}" y1="${r2(topY)}" x2="${r2(w * 0.14)}" y2="${r2(topY)}" stroke="${C.gold}" stroke-width="2" opacity="0.5"/>`;
  s += `<line x1="${r2(w * 0.58)}" y1="${r2(topY)}" x2="${r2(w * 0.58)}" y2="${r2(topY + h * 0.16)}" stroke="${C.black}" stroke-width="1.5" opacity="0.5"/>`;
  // Mast lattice
  for (let y = topY; y < groundY; y += 34) {
    s += `<line x1="${r2(mx - 12)}" y1="${r2(y)}" x2="${r2(mx + 12)}" y2="${r2(y + 17)}" stroke="${C.gold}" stroke-width="1" opacity="0.45"/>`;
    s += `<line x1="${r2(mx + 12)}" y1="${r2(y)}" x2="${r2(mx - 12)}" y2="${r2(y + 17)}" stroke="${C.gold}" stroke-width="1" opacity="0.45"/>`;
  }

  // Building under construction
  const bx = w * 0.42;
  const bw = w * 0.4;
  const storeys = 2 + Math.floor(rand() * 2);
  const bh = groundY - h * 0.34;
  s += `<rect x="${r2(bx)}" y="${r2(groundY - bh)}" width="${r2(bw)}" height="${r2(bh)}" fill="none" stroke="${C.black}" stroke-width="2.5"/>`;
  for (let i = 1; i < storeys; i++) {
    const y = groundY - bh + (bh / storeys) * i;
    s += `<line x1="${r2(bx)}" y1="${r2(y)}" x2="${r2(bx + bw)}" y2="${r2(y)}" stroke="${C.black}" stroke-width="1.75" opacity="0.5"/>`;
    const cols = 4;
    for (let c = 0; c < cols; c++) {
      const cw = bw / cols;
      const x = bx + c * cw + cw * 0.3;
      s += `<rect x="${r2(x)}" y="${r2(y + bh / storeys * 0.22)}" width="${r2(cw * 0.4)}" height="${r2(bh / storeys * 0.5)}" fill="none" stroke="${C.black}" stroke-width="1.25" opacity="0.4"/>`;
    }
  }

  // Material stacks
  const sx = w * 0.12;
  for (let i = 0; i < 3; i++) {
    const sw = 70 + rand() * 40;
    const sh = 14 + rand() * 10;
    const x = sx + i * 110;
    s += `<rect x="${r2(x)}" y="${r2(groundY - sh)}" width="${r2(sw)}" height="${r2(sh)}" fill="none" stroke="${C.text}" stroke-width="1.5" opacity="0.6"/>`;
  }
  return svg(w, h, s);
}

/** Detail texture: fine parallel hatch with one gold band. */
function detail(seed, { w = 1200, h = 800 } = {}) {
  const rand = rng(seed);
  const angle = rand() > 0.5 ? 0 : 90;
  let s = paper(w, h, '#FFFFFF', C.warm);
  const step = 14 + Math.floor(rand() * 10);
  const bandStart = h * 0.36;
  for (let i = -h; i < w + h; i += step) {
    const inGold = angle === 0 ? i > bandStart && i < bandStart + h * 0.1 : i > w * 0.4 && i < w * 0.5;
    const isGold = i % (step * 9) < step && inGold;
    s += `<line x1="${i}" y1="0" x2="${i + (angle === 90 ? h : 0)}" y2="${angle === 90 ? h : h}" stroke="${isGold ? C.gold : C.black}" stroke-width="${isGold ? 2 : 1}" opacity="${isGold ? 0.55 : 0.14}"/>`;
  }
  return svg(w, h, s);
}

/** Service-specific composition: a large centred icon glyph on paper. */
function serviceGlyph(glyphPath, { w = 800, h = 600 } = {}) {
  const s =
    paper(w, h, C.warm, C.mist) +
    `<g transform="translate(${w / 2} ${h / 2}) scale(3.4) translate(-24 -24)" stroke="${C.black}" stroke-width="1.25" opacity="0.72" fill="none">${glyphPath}</g>` +
    `<circle cx="${w / 2}" cy="${h / 2}" r="104" stroke="${C.gold}" stroke-width="1.5" opacity="0.5"/>`;
  return svg(w, h, s);
}

/* ==========================================================================
   FILE MAP — every image the site can request
   ========================================================================== */

// Lucide-derived 24x24 path data (MIT licensed) reused as line art.
const LUCIDE = {
  house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a4 2 0 0 1-8 0a4 2 0 0 1-8 0a2 2 0 0 1-2-2V7"/>',
  hammer: '<path d="m15 12-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
  paintbrush: '<path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
};

const FILES = {
  // Hero — wide, dramatic
  'hero-main': () => facade(1017, { w: 1920, h: 1280 }),

  // Service cards
  'service-residential': () => serviceGlyph(LUCIDE.house),
  'service-independent': () => serviceGlyph(LUCIDE.home),
  'service-villa': () => serviceGlyph(LUCIDE.landmark),
  'service-apartments': () => serviceGlyph(LUCIDE.building2),
  'service-commercial': () => serviceGlyph(LUCIDE.store),
  'service-renovation': () => serviceGlyph(LUCIDE.hammer),
  'service-interiors': () => serviceGlyph(LUCIDE.paintbrush),
  'service-consultation': () => serviceGlyph(LUCIDE.clipboard),

  // Process / quality supporting art
  'process-plan': () => plan(2024, { w: 1200, h: 800 }),
  'process-site': () => site(3031, { w: 1200, h: 800 }),
  'quality-structure': () => structure(4044, { w: 1200, h: 800 }),
  'quality-interiors': () => interior(5055, { w: 1200, h: 800 }),
  'detail-texture': () => detail(6066, { w: 1200, h: 800 }),

  // Portfolio — deterministic mix across generators
  'project-01': () => facade(11, { w: 1200, h: 800 }),
  'project-02': () => structure(12, { w: 1200, h: 800 }),
  'project-03': () => interior(13, { w: 1200, h: 800 }),
  'project-04': () => facade(14, { w: 1200, h: 800 }),
  'project-05': () => site(15, { w: 1200, h: 800 }),
  'project-06': () => facade(16, { w: 1200, h: 800 }),
  'project-07': () => facade(17, { w: 1200, h: 800 }),
  'project-08': () => interior(18, { w: 1200, h: 800 }),
  'project-09': () => interior(19, { w: 1200, h: 800 }),
  'project-10': () => facade(20, { w: 1200, h: 800 }),
  'project-11': () => interior(21, { w: 1200, h: 800 }),
  'project-12': () => interior(22, { w: 1200, h: 800 }),
  'project-13': () => site(23, { w: 1200, h: 800 }),
  'project-14': () => interior(24, { w: 1200, h: 800 }),
  'project-15': () => interior(25, { w: 1200, h: 800 }),
  'project-16': () => interior(26, { w: 1200, h: 800 }),
  'project-17': () => interior(27, { w: 1200, h: 800 }),
  'project-18': () => facade(28, { w: 1200, h: 800 }),
  'project-19': () => interior(29, { w: 1200, h: 800 }),
  'project-20': () => site(30, { w: 1200, h: 800 }),
  'project-21': () => interior(31, { w: 1200, h: 800 }),
};

/* ==========================================================================
   WRITE
   ========================================================================== */

mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const [name, build] of Object.entries(FILES)) {
  writeFileSync(resolve(OUT_DIR, `${name}.svg`), build(), 'utf8');
  count++;
}

console.log(`✓ Generated ${count} images in public/images/`);