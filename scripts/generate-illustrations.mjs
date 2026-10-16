/**
 * ============================================================================
 * VNR CONSTRUCTIONS — ILLUSTRATION SYSTEM
 * ============================================================================
 *
 * WHY THIS REPLACES generate-images.mjs / generate-brand-images.mjs
 * ---------------------------------------------------------------
 * Those two scripts drew architecture with `rng(seed)` — a PRNG that picked
 * floor counts, bay widths and window columns at random. Two consequences,
 * both visible on the live site:
 *
 *   1. THE DARK SET WAS INVISIBLE. generate-brand-images.mjs drew navy lines
 *      on a navy ground (#102A3D -> #071727). Ink and ground were the same
 *      value, so the hero, About plate, Interiors panel and all six gallery
 *      tiles rendered as near-black rectangles. It was not a styling problem;
 *      the contrast ratio was roughly 1.1:1.
 *
 *   2. THE LIGHT SET WAS MEANINGLESS. A random seed means project-07 and
 *      project-13 are unrelated buildings. Twenty-one fabricated elevations
 *      presented as twenty-one projects is worse than showing none at all.
 *
 * WHAT THIS DOES INSTEAD
 * ----------------------
 * One drawing language, two grounds, and DELIBERATE compositions:
 *
 *   DARK  ground (navy sections: hero, About, Interiors, gallery)
 *     primary ink  #D9E6F2 @ 0.72   <- pale, ~8:1 on the navy ground
 *     secondary    #8AA0B4 @ 0.52
 *     accent       #D9AD45 (gold, used sparingly)
 *
 *   LIGHT ground (ivory cards: services, quality, process)
 *     primary ink  #16232E @ 0.74
 *     secondary    #5E6B77 @ 0.52
 *     accent       #A8821F
 *
 * STROKE WIDTH IS SCALED, NOT HARDCODED
 * -------------------------------------
 * The single biggest quality lever. A `stroke-width="1"` in a 1200-unit
 * viewBox is 0.33 device pixels once the image renders at 400px wide — the
 * browser antialiases it to a faint smear no matter how good the colours are.
 * Every stroke here is `base * (w / 1200)`, so a drawing keeps its visual
 * weight at any rendered size. Raise `W_REF` to thin the whole system.
 *
 * Every composition is hand-parameterised. There is no PRNG, so the same file
 * is produced on every machine and every run, and each drawing actually
 * depicts something meaningful — an elevation, a plan, a section, a detail.
 *
 * THESE ARE NOT PHOTOGRAPHS AND DO NOT PRETEND TO BE.
 * They are labelled in the UI as development visuals. VNR's real site
 * photography replaces them file-for-file; see scripts/media-manifest.mjs,
 * which lists the required subject, aspect and resolution for every slot.
 *
 * USAGE: node scripts/generate-illustrations.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '../public/images');

/** Width the drawings are authored against. Stroke widths scale off this. */
const W_REF = 1200;

const r2 = (n) => Math.round(n * 100) / 100;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" role="img">${body}</svg>\n`;

/* ---- Palettes ------------------------------------------------------------
   The ONLY difference between the two themes is these values; every drawing
   function below is theme-aware and never hard-codes a colour. */
const DARK = {
  bgFrom: '#0B1C2C',
  bgTo: '#04101C',
  skyFrom: '#020812',
  skyTo: '#0C2740',
  p: '#DCE9F5',
  pO: 0.72,
  s: '#93A9BC',
  sO: 0.52,
  a: '#D9AD45',
  aO: 0.9,
  glow: '#F3C56B',
  grid: '#2A4A66',
  gridO: 0.18,
};
const LIGHT = {
  bgFrom: '#FCFBF8',
  bgTo: '#EDEBE3',
  p: '#16232E',
  pO: 0.74,
  s: '#5E6B77',
  sO: 0.52,
  a: '#A8821F',
  aO: 0.95,
  glow: '#D9AD45',
  grid: '#D6D2C6',
  gridO: 0.45,
};

/* ---- Stroke helpers ------------------------------------------------------
   `k` is the viewBox scale: a drawing authored at 2400 wide gets 2x the
   stroke weight of one authored at 1200, so both look the same on screen. */
const K = (w) => w / W_REF;
const sw = (k, base) => r2(Math.max(0.5, base * k));

const P = (t, k, o = 1, base = 2) => `stroke="${t.p}" stroke-opacity="${r2(t.pO * o)}" stroke-width="${sw(k, base)}"`;
const S = (t, k, o = 1, base = 1.4) => `stroke="${t.s}" stroke-opacity="${r2(t.sO * o)}" stroke-width="${sw(k, base)}"`;
const A = (t, k, o = 1, base = 2) => `stroke="${t.a}" stroke-opacity="${r2(t.aO * o)}" stroke-width="${sw(k, base)}"`;

const line = (x1, y1, x2, y2, attrs) => `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" ${attrs}/>`;
const rect = (x, y, w, h, attrs) => `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" ${attrs}/>`;
const path = (d, attrs) => `<path d="${d}" ${attrs}/>`;

/* ==========================================================================
   THEME PRIMITIVES
   ========================================================================== */
function ground(t, w, h) {
  const from = t === DARK ? DARK.skyFrom : LIGHT.bgFrom;
  const to = t === DARK ? DARK.bgTo : LIGHT.bgTo;
  return `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient>
  <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" stroke="${t.grid}" stroke-width="1"/>
  </pattern>
  <radialGradient id="warm" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="${t.glow}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#bg)"/>
<rect width="${w}" height="${h}" fill="url(#grid)" opacity="${t.gridO}"/>`;
}

/* ==========================================================================
   COMPOSITION 1 — ELEVATION
   A drawn front elevation of a two-storey house. `v` selects one of three
   hand-written bay layouts so repeated use never produces identical tiles.
   ========================================================================== */
const ELEVATION_VARIANTS = [
  { bays: 3, doorAt: 0.44, canopy: true, storeys: 2, parapet: true },
  { bays: 4, doorAt: 0.22, canopy: false, storeys: 3, parapet: false },
  { bays: 3, doorAt: 0.62, canopy: true, storeys: 2, parapet: true, wing: true },
];

function elevation(t, w, h, v = 0) {
  const k = K(w);
  const o = ELEVATION_VARIANTS[v % ELEVATION_VARIANTS.length];
  const groundY = h * 0.9;
  const bx = w * 0.14;
  const bw = w * 0.72;
  const plinth = h * 0.05;
  const topY = h * 0.18;
  const sh = (groundY - topY) / o.storeys;
  let s = ground(t, w, h);

  // Context: neighbouring rooflines and a street tree.
  s += path(`M${r2(w * 0.01)} ${r2(groundY)}V${r2(h * 0.62)}L${r2(w * 0.13)} ${r2(h * 0.55)}V${r2(groundY)}`, S(t, k, 0.75, 1.6));
  s += path(`M${r2(w * 0.87)} ${r2(groundY)}V${r2(h * 0.58)}L${r2(w * 0.99)} ${r2(h * 0.5)}V${r2(groundY)}`, S(t, k, 0.6, 1.6));
  s += line(w * 0.9, groundY, w * 0.9, groundY - h * 0.17, S(t, k, 0.8));
  s += path(`M${r2(w * 0.9)} ${r2(groundY - h * 0.15)}L${r2(w * 0.855)} ${r2(groundY - h * 0.1)}M${r2(w * 0.9)} ${r2(groundY - h * 0.15)}L${r2(w * 0.945)} ${r2(groundY - h * 0.1)}M${r2(w * 0.9)} ${r2(groundY - h * 0.15)}L${r2(w * 0.9)} ${r2(groundY - h * 0.12)}`, S(t, k, 0.8, 1.6));

  // Ground and plinth
  s += line(0, groundY, w, groundY, P(t, k, 0.9));
  s += rect(bx - w * 0.013, groundY - plinth, bw + w * 0.026, plinth, P(t, k, 0.8));

  // Main volume + roof treatment
  s += rect(bx, topY, bw, groundY - plinth - topY, P(t, k));
  if (o.parapet) s += rect(bx - w * 0.009, topY - h * 0.03, bw + w * 0.018, h * 0.032, P(t, k, 0.95));
  else {
    // Pitched roof: reads as a different building type, not a recolour.
    s += path(`M${r2(bx - w * 0.02)} ${r2(topY)}L${r2(bx + bw / 2)} ${r2(topY - h * 0.11)}L${r2(bx + bw + w * 0.02)} ${r2(topY)}Z`, P(t, k, 0.95));
    s += line(bx + bw * 0.18, topY - h * 0.06, bx + bw * 0.82, topY - h * 0.06, S(t, k, 0.7));
  }
  if (o.wing) s += rect(bx + bw + w * 0.01, groundY - sh * 1.05, w * 0.09, sh * 1.05 - plinth, P(t, k, 0.6));

  // Floor slabs
  for (let i = 1; i < o.storeys; i++) s += line(bx, topY + sh * i, bx + bw, topY + sh * i, P(t, k, 0.7));

  // Openings
  const winW = (bw * 0.86) / o.bays / 2.6;
  const winH = sh * 0.42;
  for (let f = 0; f < o.storeys; f++) {
    const fy = topY + sh * f + sh * 0.3;
    const isGround = f === o.storeys - 1;
    const doorLeft = isGround ? o.doorAt * bw : null;
    const doorW = bw * 0.13;
    const doorH = sh * 0.6;

    for (let i = 0; i < o.bays; i++) {
      const x = bx + bw * 0.07 + i * ((bw * 0.86) / o.bays);
      if (isGround && doorLeft !== null && x > doorLeft - bw * 0.06 && x < doorLeft + doorW + bw * 0.06) continue;
      s += rect(x, fy, winW, winH, P(t, k, 0.85, 1.7));
      s += line(x + winW / 2, fy, x + winW / 2, fy + winH, S(t, k, 0.95, 1.2));
      s += line(x, fy + winH * 0.44, x + winW, fy + winH * 0.44, S(t, k, 0.8, 1.2));
      // Gold sill — the one accent per opening
      s += line(x - winW * 0.08, fy + winH, x + winW * 1.08, fy + winH, A(t, k, 0.75, 2));
    }

    if (isGround && doorLeft !== null) {
      s += rect(doorLeft, groundY - doorH, doorW, doorH, A(t, k));
      s += line(doorLeft + doorW * 0.5, groundY - doorH, doorLeft + doorW * 0.5, groundY, S(t, k, 0.9, 1.3));
      if (o.canopy) s += line(doorLeft - bw * 0.045, groundY - doorH - h * 0.055, doorLeft + doorW + bw * 0.045, groundY - doorH - h * 0.055, A(t, k));
      // Entry steps
      for (let i = 0; i < 2; i++) s += line(doorLeft + doorW * 0.3, groundY - i * h * 0.014, doorLeft + doorW * 0.7, groundY - i * h * 0.014, S(t, k, 0.7, 1.2));
    }
  }

  // Overall dimension string, right-hand side.
  const dx = bx + bw + w * 0.075;
  s += line(dx, topY - h * 0.03, dx, groundY, A(t, k, 0.75));
  s += line(dx - w * 0.013, topY - h * 0.03, dx + w * 0.013, topY - h * 0.03, A(t, k, 0.75));
  s += line(dx - w * 0.013, groundY, dx + w * 0.013, groundY, A(t, k, 0.75));

  return svg(w, h, s);
}

/* ==========================================================================
   COMPOSITION 2 — INTERIOR PERSPECTIVE
   One-point room, glazed wall as the light source.
   ========================================================================== */
function interior(t, w, h, v = 0) {
  const k = K(w);
  const vx = w * (0.46 + v * 0.05);
  const vy = h * 0.5;
  const iw = w * 0.78;
  const ih = h * 0.76;
  const rx = vx - iw / 2;
  const ry = vy - ih / 2;
  let s = ground(t, w, h);

  s += path(`M0 0L${r2(rx)} ${r2(ry)}H${r2(rx + iw)}L${w} 0`, P(t, k, 0.9));
  s += path(`M0 ${h}L${r2(rx)} ${r2(ry + ih)}H${r2(rx + iw)}L${w} ${h}`, P(t, k, 0.9));
  s += rect(rx, ry, iw, ih, P(t, k));

  s += line(w / 2, 0, vx, vy, S(t, k, 0.7, 1.1));
  s += line(w / 2, h, vx, vy, S(t, k, 0.7, 1.1));
  s += line(0, h / 2, vx, vy, S(t, k, 0.5, 1.1));
  s += line(w, h / 2, vx, vy, S(t, k, 0.5, 1.1));

  // Glazed wall, left: the light source, drawn in gold with mullions.
  const gTop = ry + ih * 0.1;
  const gBot = ry + ih * 0.9;
  s += path(`M0 ${r2(h * 0.18)}L${r2(rx)} ${r2(gTop)}V${r2(gBot)}L0 ${r2(h * 0.82)}`, A(t, k));
  for (let i = 1; i < 3; i++) {
    const f = i / 3;
    const xTop = rx * f;
    s += line(xTop, h * 0.18 + (gTop - h * 0.18) * f, xTop, h * 0.82 + (gBot - h * 0.82) * f, S(t, k, 0.75, 1.2));
  }
  // Light spill on the floor
  s += path(`M${r2(rx)} ${r2(gBot)}L${r2(w * 0.62)} ${r2(ry + ih)}L${r2(w * 0.3)} ${r2(ry + ih)}Z`, S(t, k, 0.4, 1.2));

  // Rear-wall opening
  s += rect(vx - iw * 0.16, ry + ih * 0.22, iw * 0.32, ih * 0.34, P(t, k, 0.9, 1.7));
  s += line(vx, ry + ih * 0.22, vx, ry + ih * 0.56, S(t, k, 0.85, 1.2));
  s += line(vx - iw * 0.16, ry + ih * 0.39, vx + iw * 0.16, ry + ih * 0.39, S(t, k, 0.85, 1.2));

  // Furniture, in perspective.
  s += path(`M${r2(rx + iw * 0.04)} ${r2(ry + ih * 0.58)}h${r2(iw * 0.26)}v${r2(ih * 0.17)}h${r2(-iw * 0.26)}z`, P(t, k, 0.8, 1.7));
  s += path(`M${r2(rx + iw * 0.04)} ${r2(ry + ih * 0.58)}l${r2(-iw * 0.07)} ${r2(-ih * 0.06)}h${r2(iw * 0.26)}l${r2(-iw * 0.07)} ${r2(ih * 0.06)}`, S(t, k, 0.9, 1.2));
  s += path(`M${r2(rx + iw * 0.62)} ${r2(ry + ih * 0.62)}h${r2(iw * 0.3)}v${r2(ih * 0.13)}h${r2(-iw * 0.3)}z`, P(t, k, 0.7, 1.7));
  s += line(rx + iw * 0.7, ry + ih * 0.62, rx + iw * 0.7, ry + ih * 0.44, S(t, k, 0.8, 1.2));

  return svg(w, h, s);
}

/* ==========================================================================
   COMPOSITION 3 — FLOOR PLAN
   Poché walls, door swings, fixtures, dimension strings. A plan genuinely
   communicates a layout, which is exactly why it is used here.
   ========================================================================== */
const PLAN_VARIANTS = [
  { vx: 0.38, hy: 0.42, sinkRight: true },
  { vx: 0.52, hy: 0.5, sinkRight: false },
  { vx: 0.3, hy: 0.55, sinkRight: true },
];

function plan(t, w, h, v = 0) {
  const k = K(w);
  const o = PLAN_VARIANTS[v % PLAN_VARIANTS.length];
  const padX = w * 0.15;
  const padY = h * 0.15;
  const pw = w - padX * 2;
  const ph = h - padY * 2;
  const wall = sw(k, 5);
  let s = ground(t, w, h);

  s += rect(padX, padY, pw, ph, P(t, k, 1, 2.6));
  s += rect(padX + wall, padY + wall, pw - wall * 2, ph - wall * 2, S(t, k, 0.85, 1.1));

  const vx = padX + pw * o.vx;
  const hy = padY + ph * o.hy;
  const gap = h * 0.06;
  s += line(vx, padY, vx, hy - gap, P(t, k, 0.9, 2.2));
  s += line(vx, hy + gap, vx, padY + ph, P(t, k, 0.9, 2.2));
  s += line(padX, hy, vx - gap, hy, P(t, k, 0.9, 2.2));
  s += line(vx + gap, hy, padX + pw, hy, P(t, k, 0.9, 2.2));

  // Door leaf and swing — the "how it works" moment on a plan.
  const dr = gap * 0.92;
  s += line(vx, hy - gap, vx, hy - gap - dr, A(t, k));
  s += path(`M${r2(vx)} ${r2(hy - gap - dr)}A${r2(dr)} ${r2(dr)} 0 0 0 ${r2(vx - dr)} ${r2(hy - gap)}`, A(t, k, 0.65, 1.4));
  s += line(vx, hy - gap - dr, vx - dr, hy - gap, A(t, k, 0.65, 1.4));

  // Fixtures.
  s += rect(padX + wall * 1.6, padY + wall * 1.6, pw * 0.13, ph * 0.1, S(t, k, 0.95, 1.4));
  if (o.sinkRight) s += rect(padX + pw * 0.63, padY + ph * 0.73, pw * 0.28, ph * 0.19, S(t, k, 0.95, 1.4));
  else s += rect(padX + pw * 0.08, padY + ph * 0.74, pw * 0.3, ph * 0.18, S(t, k, 0.95, 1.4));
  // Stair treads, so a plan reads as a real storey.
  const stW = pw * 0.16;
  const stX = o.sinkRight ? padX + pw * 0.72 : padX + pw * 0.56;
  for (let i = 0; i < 7; i++) s += line(stX, padY + ph * 0.3 + i * ph * 0.038, stX + stW, padY + ph * 0.3 + i * ph * 0.038, S(t, k, 0.8, 1.2));
  s += rect(stX, padY + ph * 0.3, stW, ph * 0.266, S(t, k, 0.7, 1.3));

  // Dimension strings.
  const dy = padY + ph + h * 0.075;
  s += line(padX, dy, padX + pw, dy, S(t, k, 0.9, 1.1));
  for (const x of [padX, padX + pw / 2, padX + pw]) s += line(x, dy - h * 0.016, x, dy + h * 0.016, S(t, k, 0.9, 1.1));
  s += line(padX + pw * 0.63, dy - h * 0.032, padX + pw, dy - h * 0.032, A(t, k, 0.8));
  s += line(padX + pw * 0.63, dy - h * 0.05, padX + pw, dy - h * 0.05, A(t, k, 0.8));

  // North point.
  const nx = padX + pw + w * 0.045;
  const ny = padY + ph * 0.14;
  const nr = w * 0.028;
  s += `<circle cx="${r2(nx)}" cy="${r2(ny)}" r="${r2(nr)}" ${A(t, k, 0.85, 1.6)}/>`;
  s += line(nx, ny + nr * 0.7, nx, ny - nr * 0.7, A(t, k, 0.85, 1.6));

  return svg(w, h, s);
}

/* ==========================================================================
   COMPOSITION 5 — JOINERY / DETAIL SECTION
   Explains a construction method; never decorative filler.
   ========================================================================== */
function detail(t, w, h, v = 0) {
  const k = K(w);
  const cx = w * 0.5;
  const cy = h * 0.46;
  const pw = w * 0.19;
  const ph = h * 0.44;
  let s = ground(t, w, h);

  if (v === 0) {
    // Exploded carcass with a highlighted centre panel.
    s += rect(cx - pw * 1.72, cy - ph / 2, pw, ph, P(t, k));
    s += rect(cx + pw * 0.72, cy - ph / 2, pw, ph, P(t, k));
    s += rect(cx - pw / 2, cy - ph * 0.26, pw, ph * 0.52, A(t, k));
    for (let i = 1; i < 4; i++) {
      s += line(cx - pw * 1.72 + (pw / 4) * i, cy - ph / 2, cx - pw * 1.72 + (pw / 4) * i, cy + ph / 2, S(t, k, 0.65, 1.1));
      s += line(cx - pw / 2 + (pw / 4) * i, cy - ph * 0.26, cx - pw / 2 + (pw / 4) * i, cy + ph * 0.26, S(t, k, 0.65, 1.1));
    }
    s += line(cx, cy + ph * 0.26, cx, cy + ph * 0.68, A(t, k));
    s += line(cx, cy + ph * 0.68, cx + w * 0.13, cy + ph * 0.68, A(t, k));
    s += line(cx, cy - ph * 0.26, cx, cy - ph * 0.6, S(t, k, 0.8, 1.2));
    s += line(cx, cy - ph * 0.6, cx - w * 0.1, cy - ph * 0.6, S(t, k, 0.8, 1.2));
  } else {
    // Wall section: layers, slab, and a call-out on the junction.
    const lx = w * 0.12;
    const lw = w * 0.2;
    s += rect(lx, cy - ph / 2, lw, ph, P(t, k));
    for (let i = 1; i < 4; i++) s += line(lx + (lw / 4) * i, cy - ph / 2, lx + (lw / 4) * i, cy + ph / 2, S(t, k, 0.75, 1.2));
    s += rect(lx + lw * 1.2, cy - ph * 0.34, lw * 1.1, ph * 0.68, P(t, k));
    for (let i = 1; i < 5; i++) s += line(lx + lw * 1.2 + (lw * 1.1 / 5) * i, cy - ph * 0.34, lx + lw * 1.2 + (lw * 1.1 / 5) * i, cy + ph * 0.34, S(t, k, 0.6, 1.1));
    s += rect(lx + lw * 2.6, cy - ph * 0.42, lw * 0.9, ph * 0.84, A(t, k));
    // Insulation hatch, the way a real detail draws it
    for (let i = 0; i < 12; i++) {
      const x = lx + lw * 2.6 + i * (lw * 0.9 / 12);
      s += line(x, cy + ph * 0.42, x + ph * 0.1, cy + ph * 0.24, S(t, k, 0.55, 1.1));
    }
    // Leader to the highlighted junction
    s += line(lx + lw * 2.9, cy - ph * 0.42, lx + lw * 2.9, cy - ph * 0.72, A(t, k));
    s += line(lx + lw * 2.9, cy - ph * 0.72, lx + lw * 4.1, cy - ph * 0.72, A(t, k));
    // Slab
    s += rect(w * 0.68, cy + ph * 0.3, w * 0.2, h * 0.035, P(t, k));
    for (let i = 0; i < 7; i++) s += line(w * 0.68 + i * (w * 0.2 / 7), cy + ph * 0.3, w * 0.68 + i * (w * 0.2 / 7) + h * 0.03, cy + ph * 0.3 + h * 0.035, S(t, k, 0.5, 1));
  }

  return svg(w, h, s);
}

/* ==========================================================================
   COMPOSITION 6 — DUSK HERO
   The hero backdrop: lit windows over a dark elevation, warm horizon bloom.
   ========================================================================== */
function heroDusk(w, h) {
  const k = K(w);
  const groundY = h * 0.93;
  let defs = `<defs><radialGradient id="hz" cx="60%" cy="${r2((groundY / h) * 100)}%" r="48%">
    <stop offset="0" stop-color="#D9AD45" stop-opacity="0.42"/>
    <stop offset="0.55" stop-color="#D9AD45" stop-opacity="0.11"/>
    <stop offset="1" stop-color="#D9AD45" stop-opacity="0"/>
  </radialGradient></defs>`;
  let s = defs + ground(DARK, w, h).replace(/^<defs>[\s\S]*?<\/defs>/, (m) =>
    m.replace('</defs>', `<radialGradient id="warm" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#F3C56B" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#F3C56B" stop-opacity="0"/></radialGradient></defs>`));
  s += `<rect width="${w}" height="${h}" fill="url(#hz)"/>`;

  // Three masses at different depths — a skyline, not a row of boxes.
  const blocks = [
    { x: w * 0.02, y: h * 0.46, bw: w * 0.15, o: 0.4 },
    { x: w * 0.79, y: h * 0.38, bw: w * 0.19, o: 0.45 },
    { x: w * 0.19, y: h * 0.22, bw: w * 0.59, o: 1 },
  ];
  for (const b of blocks) {
    s += rect(b.x, b.y, b.bw, groundY - b.y, P(DARK, k, b.o, 2));
    s += rect(b.x - w * 0.004, b.y - h * 0.012, b.bw + w * 0.008, h * 0.014, P(DARK, k, b.o * 0.9, 1.6));
    // Window density matters more than window size here. A 9x5 grid of large
    // panes reads as a spreadsheet; a denser grid of smaller openings reads as
    // a building. Floors are also offset per block so the skyline is not
    // three copies of the same storey height.
    const floors = Math.max(5, Math.round((groundY - b.y) / (h * 0.075)));
    const cols = Math.max(6, Math.round((b.bw / w) * 26));
    const fh = (groundY - b.y) / floors;
    for (let f = 0; f < floors; f++) {
      const fy = b.y + fh * f;
      // Slab band, then the shadow line under it.
      s += line(b.x, fy, b.x + b.bw, fy, S(DARK, k, b.o * 0.65, 1.2));
      s += line(b.x, fy + fh * 0.09, b.x + b.bw, fy + fh * 0.09, S(DARK, k, b.o * 0.28, 1));
      for (let c = 0; c < cols; c++) {
        const x = b.x + (b.bw / cols) * c + (b.bw / cols) * 0.22;
        const ww = (b.bw / cols) * 0.56;
        const wh = fh * 0.5;
        const wy = fy + fh * 0.22;
        // A minority lit. The irregularity is what makes it read as a
        // building at dusk rather than a spreadsheet.
        const lit = (f * 7 + c * 3 + Math.round(b.x / 10)) % 4 < 2;
        if (lit) {
          s += rect(x, wy, ww, wh, `stroke="#F3C56B" stroke-opacity="${r2(0.5 * b.o)}" stroke-width="${sw(k, 1.3)}"`);
          s += rect(x, wy, ww, wh, `fill="url(#warm)" opacity="${r2(0.75 * b.o)}"`);
        } else {
          s += rect(x, wy, ww, wh, S(DARK, k, b.o * 0.8, 1.2));
        }
      }
    }
    // Vertical bay lines break the horizontal banding.
    for (let c = 0; c <= cols; c += 2) {
      const x = b.x + (b.bw / cols) * c;
      s += line(x, b.y, x, groundY, S(DARK, k, b.o * 0.2, 1));
    }
  }

  // Foreground road edge + planting strip.
  s += rect(0, groundY, w, h - groundY, P(DARK, k, 0.8, 2));
  s += line(0, groundY, w, groundY, A(DARK, k, 0.6, 2));
  s += line(0, groundY + h * 0.022, w, groundY + h * 0.022, S(DARK, k, 0.55, 1.4));
  for (let i = 0; i < 26; i++) {
    const x = w * 0.02 + i * (w * 0.038);
    s += line(x, groundY + h * 0.012, x + w * 0.012, groundY + h * 0.01, S(DARK, k, 0.3, 1));
  }

  return svg(w, h, s);
}

/* ==========================================================================
   FILE MAP — deliberate compositions, no PRNG, no duplicates.

   This list is the COMPLETE set of illustrated slots on the site. Nothing here
   is generated "just in case": an unused illustration is a file nobody chose,
   and unused files rot. Everything else the site needs is either a real
   photograph (pending — see scripts/media-manifest.mjs) or drawn in CSS by
   components/common/PhotoPending.jsx.
   ========================================================================== */
const FILES = {
  // DARK — sits on navy sections
  'hero-interiors': () => heroDusk(1920, 1280), //  home + services hero backdrop
  'about-project': () => plan(DARK, 1200, 900, 0), //  home About plate, /about-vnr
  'interiors-promo': () => interior(DARK, 1400, 1050, 0), //  home Interiors panel
  'gallery-01': () => interior(DARK, 1200, 900, 1), //  home gallery mosaic
  'gallery-02': () => plan(DARK, 1200, 900, 2),
  'gallery-03': () => elevation(DARK, 1200, 900, 0),
  'gallery-04': () => detail(DARK, 1200, 900, 0),
  'gallery-05': () => interior(DARK, 1200, 900, 2),
  'gallery-06': () => elevation(DARK, 1200, 900, 1),

  // LIGHT — sits inside ivory cards
  'quality-interiors': () => interior(LIGHT, 1200, 800, 1), //  /quality
};

mkdirSync(PUBLIC, { recursive: true });
let n = 0;
for (const [name, build] of Object.entries(FILES)) {
  writeFileSync(resolve(PUBLIC, `${name}.svg`), build(), 'utf8');
  n++;
}
console.log(`✓ ${n} illustrations written to public/images/`);