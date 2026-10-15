/**
 * ============================================================================
 * BROWSER REGRESSION TEST — REVEAL FAILSAFE
 * ============================================================================
 *
 * THE BUG
 * -------
 * `Reveal`/`Stagger` drive their entrance with `whileInView`, which depends on
 * an IntersectionObserver firing. If it never fires, Motion has already written
 * `opacity: 0; transform: translateY(24px)` inline and the content is simply
 * GONE. That happened for real: six gallery `<li>`s sat at `opacity: 0` on
 * every viewport after a full scroll.
 *
 * The rescue is a 2s failsafe timer. A regression in it is invisible to jsdom,
 * because jsdom does not run Motion's animation loop at all — `m.li` cannot
 * even be constructed there. So this test runs in a real browser.
 *
 * THE METHOD
 * ----------
 * `addInitScript` replaces IntersectionObserver with one that registers
 * targets and NEVER invokes its callback — the precise condition that strands
 * content. Nothing can then animate on scroll, so the only thing that can save
 * the content is the failsafe.
 *
 * Passes only if, after the failsafe window, nothing is left invisible.
 */

const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

/** FAILSAFE_MS in Reveal.jsx, plus margin for the fade. */
const FAILSAFE_MS = 2000;

const VIEWPORTS = [
  [360, 800],
  [768, 1024],
  [1366, 768],
];

export default async function run(page, ui) {
  // Replace the observer before any app code runs.
  await page.addInitScript(() => {
    class SilentObserver {
      constructor(cb) {
        this.cb = cb;
        this.targets = [];
      }
      observe(el) {
        this.targets.push(el);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    window.IntersectionObserver = SilentObserver;
    // Keep the real property readable so app checks don't throw.
    Object.defineProperty(window, '__ioStubbed', { value: true, configurable: true });
  });

  const results = [];
  const issues = [];

  for (const [w, h] of VIEWPORTS) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });

    // Do NOT scroll: with a silent observer nothing should reveal on scroll.
    // Wait out the failsafe so it is the only possible mechanism.
    await page.waitForTimeout(FAILSAFE_MS + 1500);

    const stranded = await page.evaluate(() => {
      const els = [...document.querySelectorAll('h1, h2, h3, p, li, img, a')].filter(
        (el) => {
          const r = el.getBoundingClientRect();
          if (r.width <= 20 || r.height <= 10) return false;
          if (el.closest('[aria-hidden="true"]')) return false;
          return true;
        },
      );
      return els
        .filter((el) => {
          const cs = getComputedStyle(el);
          return Number(cs.opacity) < 0.5 || cs.visibility === 'hidden';
        })
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 40),
          opacity: Number(getComputedStyle(el).opacity).toFixed(2),
          style: (el.getAttribute('style') || '').slice(0, 80),
        }));
    });

    results.push({ viewport: `${w}px`, stranded: stranded.length, samples: stranded.slice(0, 3) });
    if (stranded.length > 0) {
      issues.push(`${w}px: ${stranded.length} elements stranded despite failsafe`);
    }
  }

  return { failSafeMs: FAILSAFE_MS, results, issues, PASS: issues.length === 0 };
}