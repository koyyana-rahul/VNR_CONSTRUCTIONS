import { useEffect } from 'react';

/**
 * Prevent background scrolling while a modal-style surface (mobile drawer,
 * lightbox) is open — without letting the page behind it scroll or bounce.
 *
 * Reference-counted, so two overlapping overlays cannot fight over restoring
 * the original overflow value.
 *
 * Also compensates for the disappearing scrollbar by padding the body, which
 * stops the layout shifting sideways on desktop when the drawer opens.
 */
let lockCount = 0;

export function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return undefined;

    const { body } = document;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (lockCount === 0) {
      body.dataset.scrollLocked = 'true';
      body.style.overflow = 'hidden';
      body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        delete body.dataset.scrollLocked;
        body.style.overflow = '';
        body.style.paddingRight = '';
      }
    };
  }, [active]);
}

/**
 * Close on Escape while `active`.
 * Used by the mobile drawer and the gallery lightbox.
 */
export function useEscapeKey(active, onEscape) {
  useEffect(() => {
    if (!active) return undefined;

    const handler = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onEscape();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [active, onEscape]);
}

/** Call `handler` when a pointer event lands outside the referenced element. */
export function useClickOutside(ref, active, handler) {
  useEffect(() => {
    if (!active) return undefined;

    const listener = (event) => {
      const node = ref.current;
      if (!node || node.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('pointerdown', listener);
    return () => document.removeEventListener('pointerdown', listener);
  }, [ref, active, handler]);
}

export default useLockBodyScroll;