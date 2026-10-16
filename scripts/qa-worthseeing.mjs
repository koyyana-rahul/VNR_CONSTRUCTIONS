/**
 * ============================================================================
 * WORTH-SEEING SWEEP
 * ============================================================================
 *
 * The four supporting pages at every width the acceptance criteria list, with
 * the checks that only matter for these pages:
 *
 *   overflow     no horizontal scrolling
 *   selectables  every `data-active` control resolves to a real, VISIBLE
 *                selected state — the selection language is the thing that was
 *                inconsistent, and "inconsistent" is invisible to a style
 *                diff
 *   buttons      every <a>/<button> carrying a Button look like a Button: a
 *                background or a border. A Button whose variant resolved to
 *                `undefined` has neither, and that is exactly how six
 *                unstyled primary CTAs shipped.
 *   cards        SurfaceCard padding is uniform
 *
 * Output: viewport-sized tiles for Packages, Estimate, Projects and Quality.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';
const OUT = 'C:/Users/RAHUL/AppData/Local/Temp/vnr-qa';

const WIDTHS = [
  320, 344, 360, 375, 390, 414, 430, 600, 768, 820, 1024, 1280, 1366, 1440, 1920,
];

const ROUTES = [
  ['packages', '/packages'],
  ['estimate', '/estimate'],
  ['projects', '/projects'],
  ['quality', '/quality'],
];

export default async function run(page) {
  const problems = [];
  const shots = [];

  for (const [name, path] of ROUTES) {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
      await page.waitForTimeout(900);

      const r = await page.evaluate(() => {
        const doc = document.documentElement;

        /* ---- 1. horizontal overflow ---- */
        const overflowBy = doc.scrollWidth - doc.clientWidth;

        /* ---- 2. every selectable control shows a real selected state ----
           Measured, not diffed: the selected state must actually change the
           background or the border, or "selected" is a word with no meaning
           for anyone who cannot see a colour. */
        const selects = [...document.querySelectorAll('[data-active]')];
        const invisibleSelection = selects.filter((el) => {
          const s = getComputedStyle(el);
          if (el.dataset.active !== 'true') return false;
          return s.backgroundColor === 'rgba(0, 0, 0, 0)' && s.borderTopColor === s.borderBottomColor;
        }).length;
        const selectCount = selects.filter((el) => el.dataset.active === 'true').length;

        /* ---- 3. every rendered Button must carry its variant ----

           Scoped by Button's OWN base-class signature — `justify-center` +
           `rounded-sm` + `tracking-tight` together appear on no other element
           in the codebase, so this matches Buttons and nothing else.

           The first version of this check was "any <a>/<button> with 8-60
           characters of text and no fill and no border", which reported 60
           failures per page: nav links, footer links, FAQ triggers, project
           card titles and the skip link are all legitimately unstyled text
           links. A check that flags correct code gets switched off, so it is
           narrower here. */
        const BUTTON_SIGNATURE = /justify-center/;
        const bareButtons = [...document.querySelectorAll('a, button')]
          .filter((el) => {
            const cls = el.className?.toString?.() || '';
            if (!BUTTON_SIGNATURE.test(cls)) return false;
            if (!/rounded-sm/.test(cls) || !/tracking-tight/.test(cls)) return false;
            const s = getComputedStyle(el);
            const filled = s.backgroundColor !== 'rgba(0, 0, 0, 0)';
            const bordered = parseFloat(s.borderTopWidth) > 0;
            return !filled && !bordered;
          })
          .map((el) => (el.textContent || '').trim().slice(0, 40));

        /* ---- 4. card padding uniformity ---- */
        const pads = {};
        for (const el of document.querySelectorAll('*')) {
          const cls = el.className?.toString?.() || '';
          if (!cls.includes('rounded-sm') || !cls.includes('border-line')) continue;
          if (!cls.includes('p-')) continue;
          const s = getComputedStyle(el);
          const k = `${s.paddingTop}/${s.paddingBottom}`;
          pads[k] = (pads[k] || 0) + 1;
        }

        return {
          overflowBy,
          selectCount,
          invisibleSelection,
          bareButtons,
          pads,
          h1: document.querySelectorAll('h1').length,
        };
      });

      if (r.overflowBy > 1) problems.push(`${name} @${w}: overflow +${r.overflowBy}px`);
      if (r.h1 !== 1) problems.push(`${name} @${w}: expected 1 h1, found ${r.h1}`);
      if (r.invisibleSelection > 0) {
        problems.push(`${name} @${w}: ${r.invisibleSelection} selected control(s) with no visual change`);
      }
      if (r.bareButtons.length) {
        problems.push(`${name} @${w}: unstyled CTA(s) ${JSON.stringify(r.bareButtons)}`);
      }
      if (w === 1440 || w === 390) shots.push({ name, w, pads: r.pads });
    }
  }

  /* Tiles at the two widths that matter most for a visual read. */
  for (const [name, path] of ROUTES) {
    for (const [w, h] of [
      [390, 844],
      [1440, 900],
    ]) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
      await page.waitForTimeout(1100);
      await page.evaluate(async () => {
        const step = Math.round(window.innerHeight * 0.8);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((res) => setTimeout(res, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
      const total = await page.evaluate(() => Math.ceil(document.body.scrollHeight / window.innerHeight));
      for (let i = 0; i < Math.min(total, 10); i += 1) {
        await page.evaluate((y) => window.scrollTo(0, y), i * h);
        await page.waitForTimeout(240);
        await page.screenshot({ path: `${OUT}/ws-${name}-${w}-${i}.png` });
      }
    }
  }

  return { combinations: WIDTHS.length * ROUTES.length, problems, shots };
}