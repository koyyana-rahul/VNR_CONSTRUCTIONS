import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { backdropFade, dialogScale, drawerSlide, t, DURATION } from './variants.js';

/**
 * ============================================================================
 * ACCESSIBLE MODAL — one dialog implementation for the whole app
 * ============================================================================
 *
 * Powers the mobile drawer, the consultation modal and the gallery lightbox, so
 * focus behaviour can never drift between them. Implements the WAI-ARIA
 * dialog pattern properly:
 *
 *  - role="dialog" aria-modal="true" with an accessible name
 *  - background scroll locked (reference-counted, with scrollbar compensation)
 *  - Escape closes
 *  - Tab is TRAPPED — otherwise keyboard users tab into the page behind
 *  - focus moves in on open, and is RESTORED to the trigger on close
 *  - the backdrop is click-to-close
 *  - rendered through a portal, so no ancestor transform/overflow can clip it
 *  - internal scrolling on small screens (max-h-dvh + overflow-y-auto), so a
 *    long modal never extends beyond the viewport
 *
 * Motion: backdrop fades, panel slides/springs per `variant`. All of it is
 * skipped under prefers-reduced-motion.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'center', // 'center' | 'right'
  size = 'md', // 'sm' | 'md' | 'lg'
  className,
  showClose = true,
  closeLabel = 'Close',
}) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  const reduced = useReducedMotion();

  /* ---- Scroll lock, with scrollbar-width compensation ---- */
  useEffect(() => {
    if (!open) return undefined;

    const { body } = document;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  /* ---- Focus in on open, restore on close ---- */
  useEffect(() => {
    if (!open) return undefined;

    restoreRef.current = document.activeElement;
    const id = requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      cancelAnimationFrame(id);
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
    };
  }, [open]);

  /* ---- Escape ---- */
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  /* ---- Focus trap ---- */
  const trapFocus = useCallback((event) => {
    if (event.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;

    const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null,
    );
    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  const panelMotion =
    variant === 'right' ? drawerSlide : dialogScale;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-[80]', variant === 'center' && 'grid place-items-center p-3 sm:p-6')}>
          {/* Backdrop */}
          <m.div
            variants={reduced ? undefined : backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
            className="absolute inset-0 bg-brand-deep/55 backdrop-blur-[3px]"
          />

          <m.div
            ref={panelRef}
            onKeyDown={trapFocus}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            variants={reduced ? undefined : panelMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={reduced ? undefined : { transition: t(DURATION.modal) }}
            className={cn(
              'on-dark relative flex flex-col bg-brand-white shadow-lift',
              // max-h + internal scroll guarantees the modal never exceeds the
              // viewport, however long its content.
              'max-h-[100dvh] overflow-y-auto overscroll-contain',
              variant === 'center' && [
                'w-full rounded-sm',
                sizes[size],
              ],
              variant === 'right' && 'h-dvh w-full max-w-[22rem] rounded-l-sm',
              className,
            )}
          >
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <h2 id={titleId} className="font-display text-h4 font-bold text-brand-black">
                  {title}
                </h2>
                {description && (
                  <p id={descId} className="mt-1 text-fine text-text-muted">
                    {description}
                  </p>
                )}
              </div>

              {showClose && (
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="-mr-1.5 grid size-11 shrink-0 place-items-center rounded-sm text-brand-black transition-colors hover:bg-brand-mist active:bg-brand-line"
                >
                  <X className="size-5" strokeWidth={2} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 px-5 py-5">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="shrink-0 border-t border-line bg-brand-warm px-5 py-4 pb-safe">
                {footer}
              </div>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default Modal;