import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * HEADER DISCLOSURE — "ALSO WORTH SEEING"
 * ============================================================================
 *
 * Carries the supporting pages that do not fit inline in the bar.
 *
 * WHY IT EXISTS
 * -------------
 * The desktop header used to show five links while the mobile drawer showed
 * ten. Four fully-built pages — Our Projects, Packages, Cost Estimator and
 * Quality Standards — were reachable on a phone and NOT on a desktop, which is
 * the wrong way round: a wide screen can afford strictly more navigation than a
 * narrow one, not less.
 *
 * WHY A DISCLOSURE AND NOT A WIDER BAR
 * ------------------------------------
 * All ten inline need ~990px of link width plus the logo, the CTA, both gutters
 * and the flex gaps — about 1420px, which pushes the bar past every 1366-class
 * laptop and leaves it a wall of words. Forcing them in also made the bar change
 * SHAPE at a breakpoint (all-inline above it, collapsed below), so a single page
 * looked like two different sites either side of an arbitrary width.
 *
 * One labelled disclosure, always, is better on both counts: the bar keeps the
 * same shape at every desktop size, and the four supporting pages are one click
 * away rather than zero.
 *
 * THE LABEL IS RESPONSIVE, THE PANEL HEADING IS NOT
 * -------------------------------------------------
 * The panel always heads itself "ALSO WORTH SEEING" — that is the wording the
 * drawer uses for the same four items, and it is what the label means.
 *
 * The TRIGGER is what has to flex, because it sits in a row that is already
 * full at 1024px. Measured there: logo 164 + six links at 0.875rem (492) + CTA
 * 164 + the gutters and gaps (96) = 918px, which leaves ~106px for the
 * trigger. "Also worth seeing" needs 134px at that size; "More" needs 70px.
 * So the trigger reads "More" below `xl` and "Also worth seeing" from `xl`,
 * where the row has 154px of slack and can afford the full phrase.
 *
 * `aria-label` pins the button's accessible name to the full phrase either way,
 * so a screen reader hears the same thing at every width — which is the one
 * thing that must not vary with layout.
 *
 * BEHAVIOUR
 *   - Real <button> with `aria-expanded` / `aria-controls`.
 *   - Closes on Escape, on outside click, and on ANY route change — not just
 *     on its own links. A disclosure left open while the visitor presses the
 *     browser's Back button would still be showing a panel for the page they
 *     just left, pinned to a header that has not moved.
 *   - Arrow-down opens and moves focus to the first item; the trigger keeps
 *     focus when the panel closes, so a keyboard user cannot lose their place.
 *   - The panel is UNMOUNTED when closed rather than faded out: an off-screen
 *     menu full of focusable links is a keyboard trap waiting to happen.
 */
export function HeaderMoreMenu({ items, className }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();
  const { pathname } = useLocation();

  // Route change closes. The `previous` ref makes this strictly a *change*
  // detector: without it the effect also runs on mount, where pathname has not
  // "changed" yet, and the panel could never stay open.
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setOpen(false);
  }, [pathname]);

  // Escape closes.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Outside click closes. `pointerdown` rather than `click` so the panel is
  // already gone by the time a click lands on whatever is underneath it.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const onTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      // Wait for the panel to mount before moving focus into it.
      requestAnimationFrame(() => {
        panelRef.current?.querySelector('a')?.focus();
      });
    }
  };

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        /* The accessible name is pinned to the full phrase at every width.
           Without it the button would announce whichever span is visible, so
           its name would change with the layout — the one thing that must not
           happen. */
        aria-label="Also worth seeing"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          // Same metrics as a nav link so the trigger reads as one more
          // destination rather than a separate control sitting beside them.
          // `shrink-0` + `whitespace-nowrap` matter: the row is full at 1024px,
          // and without them flex shrinks the button below its content width
          // and the label wraps mid-word.
          'flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-2.5',
          'font-sans text-[0.875rem] font-semibold tracking-tight xl:px-3 xl:text-[0.9375rem]',
          'transition-colors duration-200',
          open ? 'text-gold-light' : 'text-text-secondary hover:text-gold',
        )}
      >
        <span className="xl:hidden">More</span>
        <span className="hidden xl:inline">Also worth seeing</span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={2}
          className={cn(
            'size-3.5 shrink-0 transition-transform duration-300 ease-[var(--ease-architectural)] motion-reduce:transition-none',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          className={cn(
            'absolute right-0 top-full z-10 mt-2 w-64 overflow-hidden rounded-sm',
            'border border-gold-medium bg-navy-2 shadow-header',
          )}
        >
          <nav aria-label="More pages">
            {/* The same grouping heading the drawer uses, inside the panel this
                time. It tells a visitor who arrived straight from the drawer
                exactly what they are looking at. */}
            <p className="border-b border-white/10 px-4 pb-2 pt-3 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-text-muted">
              Also worth seeing
            </p>
            <ul>
              {items.map((item) => (
                <li key={item.to} className="border-b border-white/8 last:border-b-0">
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    aria-description={item.description}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-12 items-center px-4 py-2.5',
                        'font-sans text-[0.9375rem] font-semibold',
                        'transition-colors duration-200',
                        isActive
                          ? 'bg-gold/10 text-gold-light'
                          : 'text-text-secondary hover:bg-white/6 hover:text-gold-light',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default HeaderMoreMenu;