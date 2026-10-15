import { m } from 'motion/react';

/**
 * Resolve an `as` prop to a component that accepts Motion props.
 *
 * ============================================================================
 * WHY THIS EXISTS
 * ============================================================================
 * A real bug shipped from this: `<Reveal as="li">` spread Motion's props onto a
 * plain DOM `<li>`, producing
 *
 *   "React does not recognize the `whileInView` prop on a DOM element."
 *
 * A string tag IS a DOM element, so `whileInView`, `variants`, `initial`,
 * `viewport` and `transition` all landed in the DOM as invalid attributes.
 *
 * `m` is Motion's proxy over every HTML element (`m.li`, `m.ul`, `m.div`…), so
 * mapping a string through it yields the motion component for that tag. An
 * unknown tag falls back to `m.div`, which is far safer than returning the bare
 * string and leaking props into the DOM.
 *
 * Lives in its own module so that Reveal.jsx exports only components, which
 * Vite's React Fast Refresh requires for HMR to work.
 */
export function resolveTag(Tag) {
  if (typeof Tag !== 'string') return Tag ?? m.div;
  return m[Tag] ?? m.div;
}

export default resolveTag;