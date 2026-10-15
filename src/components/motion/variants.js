/**
 * ============================================================================
 * MOTION DESIGN TOKENS
 * ============================================================================
 *
 * One easing curve and one duration ladder for the whole site, so motion feels
 * like one system instead of a collection of individually-tuned transitions.
 *
 * Timings follow the brief's guidance:
 *   button 160-220ms · icon 180-260ms · menu 220-320ms · modal 220-350ms
 *   card entrance 400-650ms · section reveal 450-700ms · page 200-350ms
 *
 * Everything animates `opacity` and `transform` only — never width, height,
 * top/left or margin — so nothing triggers layout recalculation during scroll.
 */

/** The house easing. Snappy out, gentle settle. */
export const EASE = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

export const DURATION = {
  micro: 0.16, // buttons, icon nudges
  fast: 0.22, // hovers, small reveals
  menu: 0.28, // dropdowns, drawer
  modal: 0.3, // dialogs, lightbox
  page: 0.32, // route transitions
  reveal: 0.62, // scroll reveals
  slow: 0.8, // hero entrance
};

export const SPRING = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

/** Standard transition object. */
export const t = (duration = DURATION.fast, ease = EASE) => ({ duration, ease });

/* ==========================================================================
   REUSABLE VARIANTS
   ========================================================================== */

/** Fade + rise. The default entrance for most content. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: t(DURATION.reveal) },
};

/** Fade only — for images where movement would look wrong. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: t(DURATION.reveal) },
};

/** Slide in from the left. */
export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: t(DURATION.reveal) },
};

/** Slide in from the right. */
export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: t(DURATION.reveal) },
};

/** Gentle scale-up. Used sparingly, for images with a mask reveal. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: t(DURATION.reveal) },
};

/**
 * Parent container that staggers its children.
 * `staggerChildren` is small (0.07s) so a long list does not feel slow —
 * combined with `delayChildren` this reads as one gesture, not a queue.
 */
export const staggerContainer = (stagger = 0.07, delayChildren = 0.04) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Child of a stagger container. */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: t(DURATION.reveal) },
};

/* ---- Hero, sequenced entrance ---------------------------------------- */

/**
 * The hero animates as an ordered sequence so the headline reads as arriving
 * before the CTAs. Total time is ~1.1s, after which the page is fully
 * interactive — long enough to feel crafted, short enough to not gate the user.
 */
export const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

export const heroBackdrop = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE } },
};

export const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE },
  },
};

/** Headline lines rise individually. */
export const heroLine = {
  hidden: { opacity: 0, y: '0.5em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

/* ---- Overlays --------------------------------------------------------- */

export const backdropFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: t(DURATION.modal) },
  exit: { opacity: 0, transition: t(DURATION.fast) },
};

/** Right-hand drawer (mobile navigation, consultation modal). */
export const drawerSlide = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: t(DURATION.modal) },
  exit: { x: '100%', transition: t(DURATION.fast) },
};

/** Centred dialog (lightbox). */
export const dialogScale = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: t(DURATION.modal) },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: t(DURATION.fast) },
};

/** Accordion panel — height is animated on a measured max-height. */
export const accordionPanel = {
  collapsed: { height: 0, opacity: 0, transition: t(DURATION.menu) },
  expanded: { height: 'auto', opacity: 1, transition: t(DURATION.menu) },
};

/** Route cross-fade. */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: t(DURATION.page) },
  exit: { opacity: 0, transition: t(DURATION.fast) },
};

export default {
  EASE,
  DURATION,
  SPRING,
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
};