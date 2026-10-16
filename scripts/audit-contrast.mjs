/**
 * Contrast audit for the light-surface (ivory) sections.
 *
 * WHY THIS NEEDS A REAL COLOUR PARSER
 * ----------------------------------
 * Tailwind v4 serialises computed colours as `oklab(...)` / `color(srgb ...)`,
 * not `rgb(...)`. A naive `match(/\d+/g)` reads the oklab components as if
 * they were sRGB channels and produces confident, completely wrong ratios —
 * exactly what happened on the first run of this script.
 *
 * oklab -> linear sRGB -> sRGB is a defined transform, so it is implemented
 * here rather than approximated. Only fully opaque (alpha >= 0.5) samples are
 * reported, since a translucent text colour over an unknown backdrop cannot be
 * resolved from computed style alone.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

export default async function run(page, ui) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());

  const out = {};

  for (const [name, path] of [
    ['quality', '/quality'],
    ['services-page', '/services'],
    ['packages', '/packages'],
    ['estimator', '/estimate'],
    ['home', '/'],
  ]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    // Walk the page so every scroll-reveal settles, then measure.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 400) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(800);

    out[name] = await page.evaluate(() => {
      /* ---- colour -> sRGB 0..255, or null ---- */
      function toSrgb(c) {
        if (!c) return null;
        const s = c.trim();

        // rgb() / rgba()
        let m = s.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
          if (p.length >= 3 && p.every((n) => !Number.isNaN(n))) {
            const a = p.length > 3 ? p[3] : 1;
            if (a < 0.5) return null;
            return [p[0], p[1], p[2]];
          }
        }

        // oklab(L a b / alpha)
        m = s.match(/oklab\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
          if (p.length < 3 || p.some(Number.isNaN)) return null;
          if (p.length > 3 && p[3] < 0.5) return null;
          const [L, a, b] = p;
          const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
          const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
          const s_ = L - 0.0894841775 * a - 1.291485548 * b;
          const l = l_ ** 3;
          const mm = m_ ** 3;
          const ss = s_ ** 3;
          const lin = [
            4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss,
            -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss,
            -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * ss,
          ];
          return lin.map((v) => {
            const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
            return Math.max(0, Math.min(255, Math.round(c * 255)));
          });
        }

        // color(srgb r g b / a) — components are 0..1
        m = s.match(/color\(srgb ([^)]+)\)/);
        if (m) {
          const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
          if (p.length >= 3 && !p.some(Number.isNaN)) {
            if (p.length > 3 && p[3] < 0.5) return null;
            return p.slice(0, 3).map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255));
          }
        }

        // #rgb / #rrggbb
        m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (m) {
          const hex = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
          return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
        }
        return null;
      }

      const lum = (rgb) => {
        const f = (c) => {
          const x = c / 255;
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
      };
      const ratio = (a, b) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
        return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
      };

      // First opaque background walking up the tree.
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = toSrgb(getComputedStyle(n).backgroundColor);
          if (c) return c;
          n = n.parentElement;
        }
        return [255, 255, 255];
      };

      const fails = [];
      const seen = new Set();
      let checked = 0;

      for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,span,a,label,button')) {
        if (el.children.length) continue;
        const txt = (el.textContent || '').trim();
        if (!txt || txt.length < 2) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.9) continue;

        const fg = toSrgb(cs.color);
        if (!fg) continue;
        // A gold-gradient CTA paints its background with background-image, not
        // background-color, so a background-colour walk reports the NAVY behind
        // it and flags navy-on-navy at 1:1 — a false positive. Skip anything
        // sitting on a gradient or image.
        let onPaint = false;
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          const bi = getComputedStyle(n).backgroundImage;
          if (bi && bi !== 'none') {
            onPaint = true;
            break;
          }
        }
        if (onPaint) continue;

        const bg = bgOf(el);
        checked++;
        const size = parseFloat(cs.fontSize);
        const bold = Number(cs.fontWeight) >= 700;
        const large = size >= 24 || (size >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        const got = ratio(fg, bg);
        if (got < need) {
          const key = `${cs.color}|${bg.join()}|${Math.round(size)}|${need}`;
          if (seen.has(key)) continue;
          seen.add(key);
          fails.push({
            text: txt.slice(0, 44),
            ratio: got,
            need,
            size: Math.round(size),
            fg: cs.color,
            bg: `rgb(${bg.join(',')})`,
          });
        }
      }
      return { checked, failCount: fails.length, fails: fails.slice(0, 12) };
    });
  }

  return out;
}
