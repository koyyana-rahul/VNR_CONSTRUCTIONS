/**
 * Motion animation features, split into their own async chunk.
 *
 * <LazyMotion features={() => import('./features.js')}> in App.jsx defers this
 * into a separate file, so the animation runtime is not part of the initial
 * bundle. `domAnimation` covers everything this site uses — enter/exit
 * transitions, variants, whileInView, tap — without pulling in the drag and
 * pan machinery it never touches.
 *
 * If this chunk fails to load, Motion's LazyMotion renders children in their
 * un-animated state, so the page still appears. That is the behaviour
 * <AnimatePresenceFallback> relies on.
 */
import { domAnimation } from 'motion/react';

export default domAnimation;