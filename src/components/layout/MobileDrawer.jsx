import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { X, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { Logo } from '../brand/Logo.jsx';
import { cn } from '../../utils/cn.js';
import { nav, navHome, navSecondary, headerCta } from '../../data/home.js';
import { ROUTES } from '../../config/site.js';
import {
  company,
  hasPhone,
  hasEmail,
  hasAddress,
  telHref,
  mailtoHref,
} from '../../config/company.js';
import { useLockBodyScroll, useEscapeKey } from '../../hooks/useBodyScrollLock.js';

/**
 * ============================================================================
 * MOBILE NAVIGATION DRAWER
 * ============================================================================
 *
 * Implements the dialog pattern properly:
 *   - role="dialog" aria-modal="true" with an accessible name
 *   - background scroll locked (useLockBodyScroll), with scrollbar compensation
 *   - Escape closes (useEscapeKey)
 *   - Tab is TRAPPED — otherwise keyboard users tab into the page behind
 *   - focus moves in on open and returns to the trigger on close
 *   - closes automatically on route change
 *   - labelled "Close menu" — the bare X is not an adequate accessible name
 *
 * COLOUR: the surface is `.glass-drawer` (near-opaque black-blue) and every
 * control uses the navy/champagne tokens. An earlier version still referenced
 * the old light-mode aliases, which after the retheme resolved to NAVY — i.e.
 * dark text on a dark panel, invisible. Surfaces and their text are now set
 * from the same family.
 *
 * Z-ORDER (explicit, to avoid conflicts): topbar/header z-60, drawer z-80,
 * modal z-[80] but never both open, scroll-progress z-90. The drawer and the
 * modal are mutually exclusive by construction — opening the drawer closes
 * nothing else, and the modal cannot be opened from inside the drawer.
 */
export function MobileDrawer({ open, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);
  const { pathname } = useLocation();

  useLockBodyScroll(open);
  useEscapeKey(open, onClose);

  /**
   * Close on route change.
   *
   * The `previousPathname` ref is essential: without it this effect also runs
   * on mount, where pathname has not "changed" yet, so it would call onClose
   * immediately and the drawer could never stay open. Comparing against the
   * previous value makes this strictly a *change* detector.
   */
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      if (open) onClose();
    }
  }, [pathname, open, onClose]);

  // Move focus in on open, restore it on close.
  useEffect(() => {
    if (!open) return undefined;
    lastFocused.current = document.activeElement;
    // rAF lets the panel mount before focus moves, avoiding a no-op focus().
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    };
  }, [open]);

  // Focus trap.
  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const FOCUSABLE =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;
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
    };

    panel.addEventListener('keydown', onKeyDown);
    return () => panel.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-[75] bg-black-blue/70 backdrop-blur-sm',
          'transition-opacity duration-300 ease-[var(--ease-architectural)]',
          'motion-reduce:transition-none',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        id="mobile-nav"
        className={cn(
          'glass-drawer fixed inset-y-0 right-0 z-[80] flex w-full max-w-[22rem] flex-col',
          'transition-transform duration-300 ease-[var(--ease-architectural)]',
          'motion-reduce:transition-none',
          // Off-canvas when closed — not `hidden`, so the transition can run.
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link
            to={ROUTES.home}
            onClick={onClose}
            className="min-w-0 rounded-sm"
            aria-label={`${company.name} — home`}
          >
            {/* Sized via --logo-w-drawer, not a local class. `className` on <Logo>
                lands on the wrapper span, which cannot size the image — passing
                width explicitly is the only thing that actually moves the
                artwork. One token, shared with the header's ratio. */}
            <Logo width="var(--logo-w-drawer)" decorative />
          </Link>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-1.5 grid size-11 shrink-0 place-items-center rounded-sm text-ivory transition-colors hover:bg-white/10 active:bg-white/16"
          >
            <X className="size-5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* Links.

            Ten destinations in two groups, not five in one.

            The drawer used to render `nav` alone: no Home (the logo was the only
            way back, which is not a navigation affordance on a list) and no link
            at all to /projects, /packages, /estimate or /quality — four fully
            built pages that nothing in the chrome pointed to. That left 280px of
            empty panel between "Contact" and the CTA, which is exactly how a
            drawer ends up looking unfinished.

            `HOME + nav` is the primary set and keeps the full-size row with the
            gold active marker. `navSecondary` follows under a small uppercase
            rule at a lighter weight, because these are supporting tools rather
            than destinations in their own right — but they are all real routes
            with their own SEO entries, so they are reachable now.

            The list centres in whatever height is left (`justify-center` on the
            flex column) rather than pinning to the top, so the panel is balanced
            at 568px and at 932px alike, and `overflow-y-auto` still takes over
            if a future entry makes it taller than a short landscape phone. */}
        <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto overscroll-contain py-2">
          <ul className="flex flex-1 flex-col justify-center">
            {[navHome, ...nav].map((item) => (
              <li key={item.to} className="border-b border-white/8 last:border-b-0">
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  aria-description={item.description}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-14 items-center justify-between gap-3 px-5 py-3',
                      'font-sans text-[1.0625rem] font-semibold',
                      'transition-colors duration-200',
                      isActive
                        ? 'bg-gold/10 text-gold-light'
                        : 'text-text-secondary hover:bg-white/6 active:bg-white/10',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-5 w-0.5 shrink-0 rounded-full bg-gold"
                          />
                        )}
                        {item.label}
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-gold" aria-hidden="true" />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="mt-3 px-5 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-text-muted">
            Also worth seeing
          </p>
          <ul className="mt-1 flex flex-col">
            {navSecondary.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  aria-description={item.description}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-12 items-center justify-between gap-3 rounded-sm px-5 py-2.5',
                      'font-sans text-[0.9375rem] font-medium',
                      'transition-colors duration-200',
                      isActive
                        ? 'bg-gold/10 text-gold-light'
                        : 'text-text-muted hover:bg-white/6 hover:text-text-secondary active:bg-white/10',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-4 w-0.5 shrink-0 rounded-full bg-gold"
                          />
                        )}
                        {item.label}
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-gold/70" aria-hidden="true" />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="border-t border-white/10 bg-black-blue/60 px-5 py-5 pb-safe">
          <Button
            to={headerCta.to}
            variant="goldGradient"
            size="md"
            fullWidth
            onClick={onClose}
            icon={<ArrowRight className="size-4" />}
          >
            {headerCta.label}
          </Button>

          {/* Only render rows when a verified value exists — no dead links. */}
          {(hasPhone || hasEmail || hasAddress) && (
            <div className="mt-5 flex flex-col gap-1 text-fine">
              {hasPhone && (
                <a
                  href={telHref()}
                  className="flex min-h-11 items-center gap-2.5 rounded-sm text-text-secondary transition-colors hover:text-gold-light"
                >
                  <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {company.phone.display}
                </a>
              )}
              {hasEmail && (
                <a
                  href={mailtoHref()}
                  className="flex min-h-11 items-center gap-2.5 break-all rounded-sm text-text-secondary transition-colors hover:text-gold-light"
                >
                  <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {company.email.display}
                </a>
              )}
              {hasAddress && company.address.city && (
                <p className="flex items-start gap-2.5 text-text-secondary">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span className="whitespace-pre-line">
                    {company.serviceAreas.list.join(', ')}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileDrawer;