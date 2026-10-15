import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { EASE } from './variants.js';

/**
 * ============================================================================
 * ANIMATED NUMBER
 * ============================================================================
 *
 * Used for the estimator headline so a recalculation is felt rather than just
 * seen. Deliberately implemented WITHOUT a spring/animation library:
 *
 *  - Uses a single rAF loop with a fixed duration and an ease-out curve, so it
 *    costs one ref write per frame and never triggers a React render per frame
 *    (which is the usual way count-up animations wreck scroll performance).
 *  - Only the text node is written, via a ref, so React state is untouched
 *    during the animation.
 *  - Cancels cleanly on unmount and whenever the target changes mid-flight, so
 *    rapid slider dragging cannot queue up animations.
 *  - Renders the FINAL value instantly under prefers-reduced-motion, and on
 *    first paint, so the number is never wrong for long.
 */
export function AnimatedNumber({ value, format, duration = 520, className }) {
  const reduced = useReducedMotion();
  const nodeRef = useRef(null);
  const rafRef = useRef(0);
  const fromRef = useRef(value);
  const [display, setDisplay] = useState(() => (reduced ? format(value) : null));

  useEffect(() => {
    const node = nodeRef.current;

    // Reduced motion, or no DOM node: show the truth immediately.
    if (reduced || !node) {
      setDisplay(format(value));
      return undefined;
    }

    const from = fromRef.current;
    const delta = value - from;

    // Nothing meaningful to animate.
    if (!Number.isFinite(delta) || Math.abs(delta) < 1) {
      node.textContent = format(value);
      fromRef.current = value;
      return undefined;
    }

    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      // easeOutCubic — fast start, gentle settle.
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + delta * eased;

      // Write straight to the DOM; no setState per frame.
      node.textContent = format(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Land exactly on the target, not on an accumulated approximation.
        node.textContent = format(value);
        fromRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      fromRef.current = value;
    };
  }, [value, duration, reduced, format]);

  return (
    <span ref={nodeRef} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {display ?? format(value)}
    </span>
  );
}

export { EASE };
export default AnimatedNumber;