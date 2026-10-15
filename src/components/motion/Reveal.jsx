import { useEffect, useMemo, useState, createElement } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { fadeUp, staggerContainer, staggerItem, DURATION } from './variants.js';
import { resolveTag } from './resolveTag.js';

/**
 * ============================================================================
 * SCROLL REVEAL
 * ============================================================================
 *
 * DESIGN NOTE 1 — why `createElement` instead of `<Tag />`
 *
 *   Callers pass intrinsic tags (`<Reveal as="li">`), so the element type is
 *   dynamic. Written as JSX (`<Tag>…</Tag>`) that trips the React Compiler
 *   rule "Cannot create components during render", because a JSX element type
 *   must be provably stable. `createElement(Tag, …)` expresses exactly the
 *   same thing without that ambiguity: `Tag` is resolved once per `as` value
 *   by `resolveTag` and is referentially stable across renders.
 *
 * DESIGN NOTE 2 — why every branch renders the MOTION component
 *
 *   If a branch swapped to a bare `<li>` when animation is disabled, that
 *   string is a DOM element and any leaked Motion prop becomes an invalid DOM
 *   attribute — the exact bug this file was written to fix. Instead the tag is
 *   ALWAYS resolved through `resolveTag` (./resolveTag.js), and the disabled
 *   case simply passes no animation props at all. A Motion component with no
 *   motion props renders identical markup to a DOM element: no styles, no
 *   observers, no warnings, and the element type never changes.
 *
 * Accessibility guarantees:
 *
 *  1. `prefers-reduced-motion` renders the FINAL state immediately.
 *  2. `once: true` by default, so reveals stop being observed after firing.
 *  3. `amount` controls how much must be visible before the animation starts.
 *
 *  4. FAILSAFE — `whileInView` depends on an IntersectionObserver firing. If it
 *     never does — unsupported browser, broken polyfill, headless renderer, or
 *     an element that never intersects — the element stays at
 *     `initial="hidden"` FOREVER and the content is simply gone. That is the
 *     exact failure the brief forbids.
 *
 *     So a timer force-reveals everything after a short grace period. Losing
 *     an animation is acceptable; losing the content is not.
 *
 *  5. Initial state is resolved lazily, never in an effect, so there is no
 *     mount-time setState cascade.
 */

/** Grace period before content is force-revealed. */
const FAILSAFE_MS = 2000;

function useCanAnimate() {
  const reduced = useReducedMotion();

  const [canAnimate] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (typeof window.matchMedia === 'function') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    }
    return typeof window.IntersectionObserver !== 'undefined';
  });

  // Derived during render rather than in an effect, so there is no extra
  // render pass when the visitor changes their OS setting mid-session.
  return reduced ? false : canAnimate;
}

/** Force-reveal content if the observer never fires. */
function useFailsafe(canAnimate) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!canAnimate) return undefined;
    const t = window.setTimeout(() => setRevealed(true), FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, [canAnimate]);

  return revealed;
}

/** Single element entrance. */
export function Reveal({
  children,
  as = m.div,
  variant = fadeUp,
  delay = 0,
  once = true,
  amount = 0.15,
  className,
  style,
  ...rest
}) {
  const canAnimate = useCanAnimate();
  const revealed = useFailsafe(canAnimate);
  const Tag = useMemo(() => resolveTag(as), [as]);

  // Animation was never possible (reduced motion, or no IntersectionObserver).
  // Nothing was hidden, so render plainly.
  if (!canAnimate) {
    return createElement(Tag, { className, ...rest }, children);
  }

  // FAILSAFE. Motion already wrote `opacity: 0; transform: translateY(24px)`
  // onto this exact DOM node, and because the element type has not changed
  // React reuses the node — those inline styles survive. Simply dropping the
  // animation props here would leave the content invisible FOREVER, which is
  // the precise failure the failsafe exists to prevent.
  //
  // So keep driving Motion, but swap the trigger: `animate` runs on mount and
  // needs no observer, so it resolves the `visible` variant and fades the
  // content in. Losing the scroll trigger is acceptable; losing the content is
  // not.
  if (revealed) {
    return createElement(
      Tag,
      {
        className,
        variants: variant,
        initial: false,
        animate: 'visible',
        // Deterministic safety net. `animate: 'visible'` relies on Motion's
        // rAF loop committing the final value. That is a fair bet in a browser,
        // but this branch exists precisely for when the animation system is
        // misbehaving — so it must not also depend on it. Declaring the visible
        // inline state guarantees the content is on screen even if Motion never
        // runs a frame.
        style: { opacity: 1, transform: 'none', ...style },
        transition: delay ? { delay } : undefined,
        ...rest,
      },
      children,
    );
  }

  return createElement(
    Tag,
    {
      className,
      variants: variant,
      initial: 'hidden',
      whileInView: 'visible',
      viewport: { once, amount },
      transition: delay ? { delay } : undefined,
      ...rest,
    },
    children,
  );
}

/**
 * Stagger container. Children should use <StaggerItem>.
 * `staggerChildren` is deliberately small so a long list reads as one gesture
 * rather than a queue.
 */
export function Stagger({
  children,
  as = m.div,
  stagger = 0.07,
  delayChildren = 0.04,
  once = true,
  amount = 0.12,
  className,
  ...rest
}) {
  const canAnimate = useCanAnimate();
  const revealed = useFailsafe(canAnimate);
  const Tag = useMemo(() => resolveTag(as), [as]);

  if (!canAnimate) {
    return createElement(Tag, { className, ...rest }, children);
  }

  // Failsafe — see the note in <Reveal>. The container and its staggered
  // children have already been written at `opacity: 0`; `animate` drives both
  // back to visible without needing an observer.
  if (revealed) {
    return createElement(
      Tag,
      {
        className,
        variants: staggerContainer(stagger, delayChildren),
        initial: false,
        animate: 'visible',
        ...rest,
      },
      children,
    );
  }

  return createElement(
    Tag,
    {
      className,
      variants: staggerContainer(stagger, delayChildren),
      initial: 'hidden',
      whileInView: 'visible',
      viewport: { once, amount },
      ...rest,
    },
    children,
  );
}

/** Item inside a <Stagger>. Inherits the parent's orchestration. */
export function StaggerItem({ children, as = m.div, className, ...rest }) {
  const canAnimate = useCanAnimate();
  const Tag = useMemo(() => resolveTag(as), [as]);

  if (!canAnimate) {
    return createElement(Tag, { className, ...rest }, children);
  }

  return createElement(Tag, { className, variants: staggerItem, ...rest }, children);
}

/** Restrained entrance for the hero — plays on mount, not on scroll. */
export function HeroEnter({ children, className, delay = 0, as = m.div, ...rest }) {
  const canAnimate = useCanAnimate();
  const Tag = useMemo(() => resolveTag(as), [as]);

  if (!canAnimate) {
    return createElement(Tag, { className, ...rest }, children);
  }

  return createElement(
    Tag,
    {
      className,
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: DURATION.slow, delay, ease: [0.22, 1, 0.36, 1] },
      ...rest,
    },
    children,
  );
}

/** Subtle scroll-linked parallax for decorative backdrops. */
export function Parallax({ children, distance = 40, className }) {
  const canAnimate = useCanAnimate();

  if (!canAnimate) return <div className={className}>{children}</div>;

  return (
    <m.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: -distance }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  );
}

export default Reveal;