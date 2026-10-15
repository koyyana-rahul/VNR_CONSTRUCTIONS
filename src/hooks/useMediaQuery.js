import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query via useSyncExternalStore.
 *
 * useSyncExternalStore is the correct primitive here rather than
 * useState + useEffect: the value lives in an external store (the browser),
 * and this hook reads it without the setState-in-effect cascade that causes
 * an extra render pass on mount. It is also SSR-safe by construction.
 */

/**
 * @param {string} query  e.g. '(min-width: 1024px)'
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onStoreChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};

      const mql = window.matchMedia(query);
      // Safari < 14 only supports the deprecated addListener/removeListener.
      if (mql.addEventListener) {
        mql.addEventListener('change', onStoreChange);
        return () => mql.removeEventListener('change', onStoreChange);
      }
      mql.addListener(onStoreChange);
      return () => mql.removeListener(onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server snapshot must be a primitive so hydration stays stable.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Tailwind's `lg` breakpoint — the header switches to desktop nav here. */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/** True when the visitor has asked the OS to reduce motion. */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

export default useMediaQuery;