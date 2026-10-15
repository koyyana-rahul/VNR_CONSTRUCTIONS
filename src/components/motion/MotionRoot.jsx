/**
 * Wrapper that degrades gracefully if Motion's feature chunk never loads.
 *
 * Motion already handles a rejected features() promise by rendering children
 * statically, so this component's real job is to make the intent explicit and
 * to keep the Suspense boundary above it as narrow as possible — a failure
 * here should cost you animation, never content.
 */
export function AnimatePresenceFallback({ children }) {
  return children;
}

export default AnimatePresenceFallback;