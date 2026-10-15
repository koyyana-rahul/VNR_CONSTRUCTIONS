import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * ============================================================================
 * GOLD SCROLL PROGRESS
 * ============================================================================
 *
 * Returns real document scroll progress (0-1) for a consumer to render.
 *
 * PERFORMANCE NOTES — a scroll-progress indicator is the classic way to ship a
 * janky site, so three things matter:
 *
 *  1. The listener is PASSIVE, so it can never block scrolling.
 *  2. Progress is held in state but updated at most once per animation frame,
 *     never once per scroll event — a mouse wheel can fire dozens of events
 *     between two paints, and re-rendering on each is what causes jank.
 *  3. Work stops entirely after 2s of no scrolling: a reader who stops does
 *     not pay for a permanently-live listener.
 *
 * Writing to a ref and mutating the DOM directly would avoid React entirely,
 * but it is only safe because exactly one element consumes the value. State is
 * used here so the hook stays reusable and honest.
 *
 * Degenerate case: on a page shorter than the viewport there is nothing to
 * scroll, so progress stays 0 and the consumer hides the bar rather than
 * showing a misleading 0% line.
 */
export function useScrollProgress() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(0);
  const idleRef = useRef(0);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    // Under reduced motion the bar is not rendered at all, so there is nothing
    // to track. The hook still returns 0/false so callers behave predictably.
    if (reduced) return undefined;

    const measure = () => {
      const doc = document.documentElement;
      const delta = doc.scrollHeight - doc.clientHeight;
      setScrollable(delta > 0);
      return delta;
    };

    const update = () => {
      frameRef.current = 0;
      const delta = measure();
      if (delta <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, window.scrollY / delta)));
    };

    const schedule = () => {
      if (frameRef.current === 0) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      // Re-arm the idle timer, and stop listening once reading has settled.
      window.clearTimeout(idleRef.current);
      idleRef.current = window.setTimeout(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', update);
      }, 2000);

      if (window.scrollY < 2) {
        setProgress(0);
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      schedule();
    };

    onScroll();
    window.addEventListener('resize', update);

    return () => {
      window.clearTimeout(idleRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [reduced]);

  return { progress, scrollable, reduced };
}

export default useScrollProgress;