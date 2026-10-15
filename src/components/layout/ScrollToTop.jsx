import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reset scroll on route change — a single-page app otherwise keeps the
 * previous page's scroll offset, landing users halfway down a new page.
 *
 * The `savedPosition` key on a location lets a future "back to where you were"
 * feature override this, but nothing sets it today, so behaviour is always
 * "start at the top".
 *
 * Hash targets are honoured instead of being reset to the top.
 */
export function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    if (key === 'savedPosition') return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, key]);

  return null;
}

export default ScrollToTop;