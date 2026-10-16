import { useEffect } from 'react';

/**
 * ============================================================================
 * PUBLISHES THE REAL HEADER CHROME HEIGHT
 * ============================================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * The hero has to start directly below the header and fill the rest of the
 * first screen: `min-height: calc(100svh - var(--chrome-h))`.
 *
 * `--chrome-h` cannot be a number in the stylesheet, because the chrome is
 * NOT content-driven-once:
 *
 *   - The TopBar wraps from one row to two at narrow widths (measured: 112px at
 *     320, 90px at 360-600, 86px at 768-820, 60px from 1024).
 *   - The header height follows the logo, which steps through five sizes.
 *   - A user with larger default text or 200% zoom rewraps both.
 *
 * Hard-coding any of those produces exactly the two failures the brief warns
 * against: a visible gap under the header, or a negative-margin hack to hide
 * one. So the height is measured, from the real elements, and published.
 *
 * WHY offsetHeight AND NOT getBoundingClientRect
 * ---------------------------------------------
 * The header is `sticky`. Once the page scrolls, its bounding rect tracks the
 * viewport, not the document — summing rects while scrolled would report a
 * wrong (and scroll-dependent) number. `offsetHeight` is layout height and is
 * unaffected by scroll position.
 *
 * WHY THIS CANNOT CAUSE A LAYOUT JUMP
 * -----------------------------------
 * `--chrome-h` only ever feeds `min-height`, never `height`. If the first
 * measurement lands a frame late the hero is a few pixels short for one frame;
 * content still grows the panel and nothing clips. The stylesheet ships a
 * conservative 13rem fallback for the same reason.
 *
 * ResizeObserver rather than a resize listener, so a font swap, a late wrap or
 * a zoom change that alters the chrome without changing the window is caught
 * too.
 */
export function useChromeHeight() {
  useEffect(() => {
    const root = document.documentElement;

    /**
     * The chrome is the header plus every element stacked ABOVE it.
     *
     * Found structurally by walking backwards from <header> rather than by
     * class name or by fixed indices. A fixed index was the first attempt and
     * it silently measured the wrong elements: the shell's children are
     * [skip-link, ScrollToTop, TopBar, Header, main, ...], so `children[0]`
     * and `children[1]` are the skip link (0px tall) and ScrollToTop — and it
     * reported 61px of chrome for a 224px header, which made the hero 163px
     * too tall and pushed the CTAs below the fold. Class names would break on
     * a rename; this cannot.
     */
    const measure = () => {
      const header = document.querySelector('header');
      if (!header) return;

      let total = header.offsetHeight;
      for (let node = header.previousElementSibling; node; node = node.previousElementSibling) {
        // Stop at real page content: anything from <main> onward is below the
        // hero, not above it.
        if (node.tagName === 'MAIN' || node.tagName === 'FOOTER') break;
        if (node.offsetHeight > 0) total += node.offsetHeight;
      }

      if (total > 0) root.style.setProperty('--chrome-h', `${total}px`);
    };

    measure();

    /**
     * ResizeObserver, but guarded.
     *
     * It is the right tool — it catches a chrome height that changes because
     * the TopBar rewrapped or a webfont swapped, neither of which resizes the
     * window. But it is not universally present: jsdom does not implement it,
     * and the test suite renders <Layout> for real. An unguarded constructor
     * throws there and takes the whole suite down with it.
     *
     * So: use it where it exists, fall back to a window resize listener where
     * it does not, and re-measure on fonts.ready either way. The published
     * value is identical in all three paths; only the trigger differs.
     */
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;

    const header = document.querySelector('header');
    if (header) {
      ro?.observe(header);
      // The TopBar is a sibling, not inside <header>, so it needs observing too.
      for (let node = header.previousElementSibling; node; node = node.previousElementSibling) {
        if (node.tagName === 'MAIN' || node.tagName === 'FOOTER') break;
        ro?.observe(node);
      }
    }

    if (!ro) window.addEventListener('resize', measure, { passive: true });

    // Font loading changes the TopBar's wrap height without resizing the
    // window, and ResizeObserver does not fire for it.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      ro?.disconnect();
      if (!ro) window.removeEventListener('resize', measure);
      root.style.removeProperty('--chrome-h');
    };
  }, []);
}

export default useChromeHeight;