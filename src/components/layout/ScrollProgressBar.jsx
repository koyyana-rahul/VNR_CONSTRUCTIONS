import { m } from 'motion/react';
import { useScrollProgress } from '../../hooks/useScrollProgress.js';

/**
 * Thin champagne progress bar across the top of the viewport.
 *
 * The scaleX transform is animated by Motion, which runs it on the compositor
 * — so scrolling stays smooth even while the bar moves. The hook itself does
 * the rAF coalescing (see useScrollProgress.js).
 *
 * Renders nothing under prefers-reduced-motion, and nothing at all on a page
 * with no scroll range.
 */
export function ScrollProgressBar({ className }) {
  const { progress, scrollable, reduced } = useScrollProgress();

  if (reduced || !scrollable) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5 bg-black-blue/70 ${
        className ?? ''
      }`}
    >
      <m.div
        className="h-full w-full origin-left bg-gradient-to-r from-gold-button-dark via-gold to-gold-light"
        style={{ scaleX: progress }}
      />
    </div>
  );
}

export default ScrollProgressBar;