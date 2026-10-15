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
  </linearGradient>
  <radialGradient id="vg" cx="50%" cy="42%" r="78%">
    <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
  </radialGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#vg)"/>`;
}

/* ==========================================================================
   COMPOSITIONS
   ========================================================================== */

/** Interior perspective — one-point room, lit and furnished.
 *
 *  Rebuilt with proper one-point geometry. The original drew four lines
 *  converging on a point plus two rectangles, which read as a wireframe box
 *  with two stray shapes in it. A one-point interior only looks like a room if
 *  the shell, the floor boards, the furniture and the lighting all converge on
 *  the SAME vanishing point — that shared convergence is the whole cue. */
function interior(seed, { w = 1600, h = 1000 } = {}) {
  const rand = rng(seed);
  const vx = w * (0.46 + rand() * 0.08);
  const vy = h * (0.5 + rand() * 0.06);

  let s = ground(w, h, C.navy3, C.navy2);

  // --- The room shell: back wall plus four edges running out of frame ------
  const bw = w * 0.3;
  const bh = h * 0.34;
  const L = vx - bw / 2;
  const R = vx + bw / 2;
  const T = vy - bh / 2;
  const B = vy + bh / 2;
  const g = (o, sw = 1.4) =>
    `<g stroke="${C.gold}" stroke-width="${sw}" fill="none" opacity="${o}">`;

  // Corners pushed outside the frame so the perspective lines actually run
  s += g('0.2');
  s += `<line x1="${r2(L)}" y1="${r2(T)}" x2="${r2(-w * 0.25)}" y2="${r2(-h * 0.2)}"/>`;
  s += `<line x1="${r2(R)}" y1="${r2(T)}" x2="${r2(w * 1.25)}" y2="${r2(-h * 0.2)}"/>`;
  s += `<line x1="${r2(L)}" y1="${r2(B)}" x2="${r2(-w * 0.25)}" y2="${r2(h * 1.2)}"/>`;
  s += `<line x1="${r2(R)}" y1="${r2(B)}" x2="${r2(w * 1.25)}" y2="${r2(h * 1.2)}"/>`;
  s += '</g>';

  // Back wall, heavier than the perspective lines
  s += `<rect x="${r2(L)}" y="${r2(T)}" width="${r2(bw)}" height="${r2(bh)}"
    stroke="${C.goldLight}" stroke-width="2.2" fill="none" opacity="0.4"/>`;

  // --- Floor boards, all converging on the vanishing point ----------------
  s += g('0.12', 1);
  for (let i = -5; i <= 5; i++) {
    const x = vx + i * (w * 0.13);
    s += `<line x1="${r2(x)}" y1="${r2(h * 1.1)}" x2="${r2(x)}" y2="${r2(B)}"/>`;
  }
  s += '</g>';

  // --- Ceiling cove light: the champagne accent ----------------------------
  s += `<line x1="${r2(L)}" y1="${r2(T + bh * 0.06)}" x2="${r2(R)}" y2="${r2(T + bh * 0.06)}"
    stroke="${C.goldLight}" stroke-width="3" opacity="0.5"/>`;
  s += `<line x1="${r2(L - w * 0.2)}" y1="${r2(T - h * 0.1)}" x2="${r2(L)}" y2="${r2(T + bh * 0.06)}"
    stroke="${C.goldLight}" stroke-width="2" opacity="0.22"/>`;
  s += `<line x1="${r2(R + w * 0.2)}" y1="${r2(T - h * 0.1)}" x2="${r2(R)}" y2="${r2(T + bh * 0.06)}"
    stroke="${C.goldLight}" stroke-width="2" opacity="0.22"/>`;

  // --- Window on the back wall, the room's light source -------------------
  const ww = bw * 0.46;
  const wh = bh * 0.5;
  const wx = vx - ww / 2;
  const wy = T + bh * 0.2;
  s += `<rect x="${r2(wx)}" y="${r2(wy)}" width="${r2(ww)}" height="${r2(wh)}"
    fill="${C.goldLight}" opacity="0.12" stroke="${C.goldLight}" stroke-width="2" stroke-opacity="0.6"/>`;
  s += g('0.4', 1.4);
  s += `<line x1="${r2(vx)}" y1="${r2(wy)}" x2="${r2(vx)}" y2="${r2(wy + wh)}"/>`;
  s += `<line x1="${r2(wx)}" y1="${r2(wy + wh * 0.45)}" x2="${r2(wx + ww)}" y2="${r2(wy + wh * 0.45)}"/>`;
  s += '</g>';
  // Light spilling onto the floor from the window
  s += `<path d="M ${r2(wx)} ${r2(wy + wh)} L ${r2(wx + ww)} ${r2(wy + wh)} L ${r2(vx + bw * 0.42)} ${r2(B + h * 0.18)} L ${r2(vx - bw * 0.42)} ${r2(B + h * 0.18)} Z"
    fill="${C.gold}" opacity="0.07"/>`;

  // --- Furniture, drawn as simple boxes sharing the same convergence ------
  // Sofa: a back panel plus two arms, sitting on the floor line
  const sx = vx - bw * 0.86;
  const sy = B - h * 0.02;
  const sw2 = bw * 0.5;
  const sh2 = h * 0.13;
  s += g('0.34', 1.6);
  s += `<rect x="${r2(sx)}" y="${r2(sy - sh2)}" width="${r2(sw2)}" height="${r2(sh2)}" rx="4"/>`;
  s += `<line x1="${r2(sx)}" y1="${r2(sy - sh2 * 0.45)}" x2="${r2(sx + sw2)}" y2="${r2(sy - sh2 * 0.45)}"/>`;
  s += `<line x1="${r2(sx + sw2 * 0.38)}" y1="${r2(sy - sh2)}" x2="${r2(sx + sw2 * 0.38)}" y2="${r2(sy - sh2 * 0.45)}"/>`;
  s += `<line x1="${r2(sx + sw2 * 0.62)}" y1="${r2(sy - sh2)}" x2="${r2(sx + sw2 * 0.62)}" y2="${r2(sy - sh2 * 0.45)}"/>`;
  s += '</g>';

  // Rug, as a shallow ellipse on the floor
  s += `<ellipse cx="${r2(vx)}" cy="${r2(B + h * 0.06)}" rx="${r2(bw * 0.8)}" ry="${r2(h * 0.055)}"
    fill="${C.gold}" opacity="0.07"/>`;
  s += `<ellipse cx="${r2(vx)}" cy="${r2(B + h * 0.06)}" rx="${r2(bw * 0.8)}" ry="${r2(h * 0.055)}"
    stroke="${C.gold}" stroke-width="1.2" fill="none" opacity="0.28"/>`;

  // Shelving on the right-hand wall, receding with the room
  s += g('0.2', 1.2);
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const x0 = R + (w * 1.2 - R) * t;
    const y0 = T + bh * 0.1 + (B - T - bh * 0.1) * t;
    s += `<line x1="${r2(R + w * 0.02)}" y1="${r2(T + bh * 0.1)}" x2="${r2(x0)}" y2="${r2(y0)}"/>`;
  }
  s += '</g>';

  // Pendants over the seating — small warm points with a halo
  s += `<g filter="url(#interior-bloom)">` +
    [0.3, 0.5, 0.7]
      .map((f) => {
        const cxp = vx + (f - 0.5) * bw * 1.5;
        const cyp = T + bh * (0.1 + Math.abs(0.5 - f) * 0.2);
        return `<circle cx="${r2(cxp)}" cy="${r2(cyp)}" r="5" fill="${C.goldLight}" opacity="0.85"/>`;
      })
      .join('') +
    '</g>';
  s += g('0.3', 1);
  [0.3, 0.5, 0.7].forEach((f) => {
    const cxp = vx + (f - 0.5) * bw * 1.5;
    const cyp = T + bh * (0.1 + Math.abs(0.5 - f) * 0.2);
    s += `<line x1="${r2(cxp)}" y1="${r2(T - h * 0.16)}" x2="${r2(cxp)}" y2="${r2(cyp)}"/>`;
  });
  s += '</g>';

  // A defining local filter, kept separate from the hero's so ids stay unique
  s = s.replace(
    '</defs>',
    `<filter id="interior-bloom" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter></defs>`,
  );

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

/** Plan / layout drawing — used for the About section and gallery-02.
 *
 *  Rebuilt at much higher density. The original drew an outer wall, three
 *  partition lines, one door swing and a dimension string, which at card size
 *  read as an almost empty box with a stray rectangle floating in it. A plan is
 *  only recognisable when it carries the things that make a plan a plan:
 *  multiple rooms, several door swings, a column grid, fixtures in the wet
 *  areas, a section hatch, and dimension strings on two sides. Same drafting
 *  language as the hero backdrop, so the set still reads as one shoot. */
function plan(seed, { w = 1200, h = 900 } = {}) {
  let s = ground(w, h, C.navy2, C.navy);

  const px = w * 0.13;
  const py = h * 0.11;
  const pw = w * 0.74;
  const ph = h * 0.74;
  const SW = 1.4;
  const g = (o) => `<g stroke="${C.gold}" stroke-width="${SW}" fill="none" opacity="${o}">`;

  // Outer wall, heaviest stroke, plus the inner wall face
  s += `<rect x="${r2(px)}" y="${r2(py)}" width="${r2(pw)}" height="${r2(ph)}"
    stroke="${C.goldLight}" stroke-width="2.6" fill="none" opacity="0.45"/>`;
  s += `<rect x="${r2(px + 9)}" y="${r2(py + 9)}" width="${r2(pw - 18)}" height="${r2(ph - 18)}"
    stroke="${C.gold}" stroke-width="1" fill="none" opacity="0.22"/>`;

  // Internal partitions — a real room layout, not three stray lines
  const xs = [0.3, 0.52, 0.76];
  const ys = [0.36, 0.68];
  s += g('0.24');
  xs.forEach((fx) => {
    s += `<line x1="${r2(px + pw * fx)}" y1="${r2(py + 9)}" x2="${r2(px + pw * fx)}" y2="${r2(py + ph * ys[0] - 6)}"/>`;
    s += `<line x1="${r2(px + pw * fx)}" y1="${r2(py + ph * ys[0] + 6)}" x2="${r2(px + pw * fx)}" y2="${r2(py + ph - 9)}"/>`;
  });
  ys.forEach((fy) => {
    s += `<line x1="${r2(px + 9)}" y1="${r2(py + ph * fy)}" x2="${r2(px + pw - 9)}" y2="${r2(py + ph * fy)}"/>`;
  });
  s += '</g>';

  // Column grid, drawn small and faint
  s += g('0.13');
  for (let i = 0; i <= 6; i++) {
    for (let j = 0; j <= 4; j++) {
      const cx = px + (pw / 6) * i;
      const cy = py + (ph / 4) * j;
      s += `<rect x="${r2(cx - 5)}" y="${r2(cy - 5)}" width="10" height="10"/>`;
    }
  }
  s += '</g>';

  // Door swings on the main partition line
  s += g('0.3');
  xs.forEach((fx, i) => {
    const dx = px + pw * fx;
    const dy = py + ph * ys[0];
    const r = 34;
    s += `<path d="M ${r2(dx)} ${r2(dy)} L ${r2(dx - r)} ${r2(dy)}"/>`;
    s += `<path d="M ${r2(dx - r)} ${r2(dy)} A ${r} ${r} 0 0 1 ${r2(dx)} ${r2(dy - r)}" stroke-dasharray="6 6"/>`;
    if (i === 0) {
      s += `<path d="M ${r2(dx)} ${r2(dy)} L ${r2(dx)} ${r2(dy + r)}"/>`;
    }
  });
  s += '</g>';

  // Wet-area fixtures — a bath and a basin, drawn as plumbing, not furniture
  s += g('0.2');
  const bx = px + pw * 0.52 + 14;
  const by = py + ph * 0.36 + 14;
  s += `<rect x="${r2(bx)}" y="${r2(by)}" width="96" height="54" rx="4"/>`;
  s += `<circle cx="${r2(bx + 48)}" cy="${r2(by + 27)}" r="7"/>`;
  s += `<rect x="${r2(bx + 8)}" y="${r2(by + 74)}" width="42" height="34" rx="4"/>`;
  s += '</g>';

  // Hatched section through one room
  s += g('0.12');
  const hx = px + pw * 0.06;
  const hy = py + ph * 0.7;
  for (let i = 0; i < 12; i++) {
    const o = i * 14;
    s += `<line x1="${r2(hx + o)}" y1="${r2(hy)}" x2="${r2(hx + o - 54)}" y2="${r2(hy + ph * 0.24)}"/>`;
  }
  s += '</g>';

  // Dimension strings, below and to the right
  s += g('0.24');
  const dy2 = py + ph + 40;
  s += `<line x1="${r2(px)}" y1="${r2(dy2)}" x2="${r2(px + pw)}" y2="${r2(dy2)}"/>`;
  for (let i = 0; i <= 3; i++) {
    const x = px + (pw / 3) * i;
    s += `<line x1="${r2(x)}" y1="${r2(dy2 - 7)}" x2="${r2(x)}" y2="${r2(dy2 + 7)}"/>`;
  }
  const dx2 = px + pw + 42;
  s += `<line x1="${r2(dx2)}" y1="${r2(py)}" x2="${r2(dx2)}" y2="${r2(py + ph)}"/>`;
  for (let j = 0; j <= 2; j++) {
    const y = py + (ph / 2) * j;
    s += `<line x1="${r2(dx2 - 7)}" y1="${r2(y)}" x2="${r2(dx2 + 7)}" y2="${r2(y)}"/>`;
  }
  s += '</g>';

  // One warm accent so the drawing has a focal point
  s += `<rect x="${r2(px + pw * 0.32)}" y="${r2(py + ph * 0.7)}" width="${r2(pw * 0.16)}" height="${r2(ph * 0.24)}"
    fill="${C.goldLight}" opacity="0.12"/>`;

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

/**
 * ==========================================================================
   HERO BACKDROP
   ==========================================================================
   A dedicated composition for the one image that carries the whole first
   impression.

   The generic generators draw a single idea at line-art density, which is right
   for a card and wrong for a full-bleed hero: behind a navy scrim it reads as an
   empty panel. This one is built to survive that scrim, so it stacks
   atmosphere rather than outline:

     sky gradient  ->  warm bloom  ->  large-scale architectural drawing
                  ->  lit accents  ->  light shafts  ->  vignette

   The drawing is biased to the RIGHT because the hero copy occupies the left,
   so nothing in it competes with the headline.
 */
function heroBackdrop(seed, { w = 1920, h = 1280 } = {}) {
  const rand = rng(seed);

  // --- Sky: deeper at the top, lifting toward the horizon -------------------
  let s = `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#01050B"/>
      <stop offset="0.45" stop-color="#04101E"/>
      <stop offset="0.78" stop-color="#0A2135"/>
      <stop offset="1" stop-color="#0E2C44"/>
    </linearGradient>
    <radialGradient id="bloom" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#D9AD45" stop-opacity="0.30"/>
      <stop offset="0.55" stop-color="#D9AD45" stop-opacity="0.09"/>
      <stop offset="1" stop-color="#D9AD45" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%">
      <stop offset="50%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.62"/>
    </radialGradient>
    <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE3A0" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#FFE3A0" stop-opacity="0"/>
    </linearGradient>
    <filter id="bloom-filter" x="-12%" y="-12%" width="124%" height="124%">
      <feGaussianBlur stdDeviation="9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>`;

  // --- Warm bloom, placed behind the drawing so light appears to come from
  //     behind the plan rather than sitting on top of it -------------------
  s += `<ellipse cx="${r2(w * 0.68)}" cy="${r2(h * 0.52)}" rx="${r2(w * 0.44)}" ry="${r2(h * 0.46)}" fill="url(#bloom)"/>`;

  // ==========================================================================
  //  ARCHITECTURAL DRAWING
  // ==========================================================================
  // Two earlier passes tried to draw a literal building here — first a full
  // window grid, then a shadowed silhouette with bloomed windows. Both failed
  // for the same reason: a flat rectangle mass reads as a box, and filled
  // window rectangles read as a spreadsheet. SVG line art cannot carry a
  // photoreal facade, and trying to fake one cheapens the whole hero.
  //
  // What line art IS good at is drafting. So the motif is now a large-scale
  // floor plan — walls, partitions, door swings, column grid, section hatch
  // and dimension strings — in fine champagne strokes at low contrast, sitting
  // in the bloom. It is unmistakably architectural, it has depth because the
  // strokes recede, and it never competes with the headline because nothing in
  // it is filled or high-contrast.
  const px = w * 0.34;
  const py = h * 0.1;
  const pw = w * 0.78;
  const ph = h * 0.82;
  const STROKE = 1.6;
  const faint = (o) => `<g stroke="${C.gold}" stroke-width="${STROKE}" fill="none" opacity="${o}">`;
  const faintEnd = '</g>';

  // Outer wall, drawn heaviest — the one element allowed real presence
  s += `<rect x="${r2(px)}" y="${r2(py)}" width="${r2(pw)}" height="${r2(ph)}"
    stroke="${C.goldLight}" stroke-width="3" fill="none" opacity="0.34"/>`;
  // Inner offset line, the way a wall is drawn in plan
  s += `<rect x="${r2(px + 14)}" y="${r2(py + 14)}" width="${r2(pw - 28)}" height="${r2(ph - 28)}"
    stroke="${C.gold}" stroke-width="1.2" fill="none" opacity="0.2"/>`;

  // Internal partitions
  s += faint('0.19');
  for (let i = 1; i < 6; i++) {
    const x = px + (pw / 6) * i;
    const inset = ph * 0.04;
    s += `<line x1="${r2(x)}" y1="${r2(py + inset)}" x2="${r2(x)}" y2="${r2(py + ph * 0.46)}"/>`;
    s += `<line x1="${r2(x)}" y1="${r2(py + ph * 0.58)}" x2="${r2(x)}" y2="${r2(py + ph - inset)}"/>`;
  }
  s += `<line x1="${r2(px + 14)}" y1="${r2(py + ph * 0.52)}" x2="${r2(px + pw - 14)}" y2="${r2(py + ph * 0.52)}"/>`;
  s += faintEnd;

  // Column grid — the structural rhythm of an open plan
  s += faint('0.13');
  for (let i = 0; i <= 8; i++) {
    for (let j = 0; j <= 5; j++) {
      const cx = px + (pw / 8) * i;
      const cy = py + (ph / 5) * j;
      s += `<rect x="${r2(cx - 7)}" y="${r2(cy - 7)}" width="14" height="14"/>`;
    }
  }
  s += faintEnd;

  // Door swings — the detail that makes a plan read as a plan
  s += faint('0.26');
  for (let i = 0; i < 6; i++) {
    const dx = px + (pw / 6) * i;
    const dy = py + ph * 0.52;
    const r = 42;
    s += `<path d="M ${r2(dx)} ${r2(dy)} L ${r2(dx)} ${r2(dy - r)}"/>`;
    s += `<path d="M ${r2(dx)} ${r2(dy - r)} A ${r} ${r} 0 0 1 ${r2(dx + r)} ${r2(dy)}" stroke-dasharray="7 7"/>`;
  }
  s += faintEnd;

  // Section hatch on one bay, the way a cut is indicated on a drawing
  s += faint('0.16');
  const hx = px + pw * 0.68;
  const hy = py + ph * 0.12;
  for (let i = 0; i < 16; i++) {
    const o = i * 13;
    s += `<line x1="${r2(hx + o)}" y1="${r2(hy)}" x2="${r2(hx + o - 70)}" y2="${r2(hy + ph * 0.28)}"/>`;
  }
  s += faintEnd;

  // Dimension strings below and to the right, with tick marks
  s += faint('0.22');
  const dy2 = py + ph + 54;
  s += `<line x1="${r2(px)}" y1="${r2(dy2)}" x2="${r2(px + pw)}" y2="${r2(dy2)}"/>`;
  for (let i = 0; i <= 6; i++) {
    const x = px + (pw / 6) * i;
    s += `<line x1="${r2(x)}" y1="${r2(dy2 - 9)}" x2="${r2(x)}" y2="${r2(dy2 + 9)}"/>`;
  }
  s += `<line x1="${r2(px + pw + 50)}" y1="${r2(py)}" x2="${r2(px + pw + 50)}" y2="${r2(py + ph)}"/>`;
  for (let j = 0; j <= 5; j++) {
    const y = py + (ph / 5) * j;
    s += `<line x1="${r2(px + pw + 41)}" y1="${r2(y)}" x2="${r2(px + pw + 59)}" y2="${r2(y)}"/>`;
  }
  s += faintEnd;

  // Two bright accents: a lit room and a warm marker, so the drawing has a
  // focal point instead of being uniformly faint. Both are placed in the RIGHT
  // half — the left half of the plan sits behind the hero copy, and a bright
  // shape there competes with the headline instead of supporting it.
  s += `<g filter="url(#bloom-filter)">` +
    `<rect x="${r2(px + pw * 0.46)}" y="${r2(py + ph * 0.08)}" width="${r2(pw * 0.16)}" height="${r2(ph * 0.32)}"
      fill="${C.goldLight}" opacity="0.16"/>` +
    `<circle cx="${r2(px + pw * 0.5)}" cy="${r2(py + ph * 0.52)}" r="7" fill="${C.goldLight}" opacity="0.75"/>` +
    `</g>`;

  // --- Light shafts falling across the drawing ------------------------------
  s += `<path d="M ${r2(w * 0.3)} 0 L ${r2(w * 0.46)} 0 L ${r2(w * 0.62)} ${r2(h)} L ${r2(w * 0.34)} ${r2(h)} Z" fill="url(#shaft)"/>`;
  s += `<path d="M ${r2(w * 0.62)} 0 L ${r2(w * 0.7)} 0 L ${r2(w * 0.86)} ${r2(h)} L ${r2(w * 0.66)} ${r2(h)} Z" fill="url(#shaft)" opacity="0.6"/>`;

  s += `<rect width="${w}" height="${h}" fill="url(#vig)"/>`;

  return svg(w, h, s);
}

/* ==========================================================================
   FILE MAP
   ========================================================================== */

const FILES = {
  // Hero — cinematic night elevation, weighted into the right third because
  // the hero copy sits on the left
  'hero-interiors': () => heroBackdrop(101, { w: 1920, h: 1280 }),

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