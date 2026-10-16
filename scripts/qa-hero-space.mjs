/**
 * ============================================================================
 * HERO SPACING INSPECTOR
 * ============================================================================
 *
 * Measures, at every width, the actual distance between the gold frame and
 * the hero's content — which is the whole question here.
 *
 * WHAT IT READS
 *   frame      the aria-hidden gold border box
 *   padStart   computed padding-inline-start of the hero's content Container
 *   padEnd     computed padding-inline-end
 *   gaps       frame edge -> content edge, per side, per element
 *   padTop/Bot vertical clearance inside the frame
 *   overflow   document scrollWidth vs clientWidth
 *
 * WHY THIS IS A SCRIPT AND NOT A LOOK
 * -----------------------------------
 * The bug this exists to catch is invisible in the class list. The frame was
 * `inset-4` and the content Container was `px-4` — the SAME value — so every
 * hero element sat exactly ON the border line, at every width. Reading the
 * JSX does not tell you that; measuring the two rectangles does.
 *
 * USAGE
 *   node <browser-runner> http://localhost:5199/ --script ./scripts/qa-hero-space.mjs
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';
const WIDTHS = [320, 344, 360, 375, 390, 414, 430, 768, 1024, 1440];

export default async function run(page) {
  const rows = [];

  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    /* The hero animates in over ~1.2s and `heroItem` carries a translateY.
       Measuring at 700ms caught the CTA block still in flight and reported it
       22px below where it actually rests — a phantom "the buttons cross the
       bottom border" failure. Wait for the entrance to finish before reading
       any geometry. */
    await page.waitForTimeout(2200);

    const m = await page.evaluate(() => {
      const section = document.querySelector('section[aria-labelledby="hero-heading"]');
      const frame = [...section.querySelectorAll('div')].find(
        (d) => d.getAttribute('aria-hidden') === 'true' && /border/.test(d.className || ''),
      );
      // The content Container is the section's in-flow child that is not the
      // absolutely-positioned plate.
      const content = [...section.children].find(
        (d) => getComputedStyle(d).position === 'relative' && d.tagName === 'DIV',
      );
      const cs = getComputedStyle(content);
      const fr = frame.getBoundingClientRect();
      const sr = section.getBoundingClientRect();

      const pad = (v) => parseFloat(cs[v]);

      // The copy column is the element the padding actually protects.
      const column = content.firstElementChild;
      const cr = column.getBoundingClientRect();

      // Every leaf of the copy: eyebrow, h1, body, price card, disclaimer, CTAs.
      const parts = {};
      const collect = (sel, name) => {
        const el = column.querySelector(sel);
        if (!el) return;
        const b = el.getBoundingClientRect();
        parts[name] = {
          left: Math.round(b.left - fr.left),
          right: Math.round(fr.right - b.right),
          top: Math.round(b.top - fr.top),
          bottom: Math.round(fr.bottom - b.bottom),
        };
      };
      collect('.eyebrow', 'eyebrow');
      collect('h1', 'heading');
      collect('p', 'body');
      const price = column.children[3];
      if (price) {
        const b = price.getBoundingClientRect();
        parts.price = {
          left: Math.round(b.left - fr.left),
          right: Math.round(fr.right - b.right),
        };
      }
      const ctaWrap = column.querySelector(':scope > div:last-of-type');
      const ctaWrapRect = ctaWrap?.getBoundingClientRect();
      if (ctaWrap) {
        const b = ctaWrap.getBoundingClientRect();
        parts.ctas = {
          left: Math.round(b.left - fr.left),
          right: Math.round(fr.right - b.right),
          bottom: Math.round(fr.bottom - b.bottom),
        };
      }

      const doc = document.documentElement;
      window.scrollTo(9999, 0);
      const scrolledX = window.scrollX;
      window.scrollTo(0, 0);

      return {
        sectionH: Math.round(sr.height),
        sectionBottom: Math.round(sr.bottom),
        frameBottom: Math.round(fr.bottom),
        containerBottom: Math.round(content.getBoundingClientRect().bottom),
        columnBottom: Math.round(cr.bottom),
        ctaBottom: Math.round(ctaWrapRect ? ctaWrapRect.bottom : -1),
        lastChildTag: column.lastElementChild?.tagName ?? null,
        frameW: Math.round(fr.width),
        frameInsetL: Math.round(fr.left - sr.left),
        frameInsetR: Math.round(sr.right - fr.right),
        padStart: pad('paddingInlineStart'),
        padEnd: pad('paddingInlineEnd'),
        padTop: pad('paddingTop'),
        padBottom: pad('paddingBottom'),
        columnLeftGap: Math.round(cr.left - fr.left),
        columnRightGap: Math.round(fr.right - cr.right),
        columnTopGap: Math.round(cr.top - fr.top),
        columnBottomGap: Math.round(fr.bottom - cr.bottom),
        parts,
        overflowBy: doc.scrollWidth - doc.clientWidth,
        scrolledX,
        nextSectionTop: Math.round(
          section.getBoundingClientRect().bottom + window.scrollY,
        ),
      };
    });

    rows.push({ width: w, ...m });
  }

  return rows;
}