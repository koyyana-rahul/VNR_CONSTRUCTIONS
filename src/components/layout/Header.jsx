import { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { Logo } from '../brand/Logo.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';
import { ScrollProgressBar } from './ScrollProgressBar.jsx';
import { m } from 'motion/react';
import { cn } from '../../utils/cn.js';
import { nav, headerCta } from '../../data/home.js';
import { ROUTES } from '../../config/site.js';
import { company } from '../../config/company.js';

/**
 * ============================================================================
 * STICKY GLASS HEADER (reference section 2)
 * ============================================================================
 *
 * Transparent dark with backdrop blur and a thin gold border. On scroll the
 * background opacity increases and a shadow appears — WITHOUT any height
 * change, so the logo and nav never shift under the user's cursor.
 *
 * `.glass-panel` in index.css supplies the blur, gated behind @supports so
 * browsers without backdrop-filter get a solid, still-readable navy.
 *
 * Breakpoint: the desktop nav shows from `xl` (1280px), not `lg` (1024px).
 * Five nav items plus a CTA plus the logo genuinely do not fit at 1024px, and
 * the brief warns specifically about nav colliding with the logo or CTA.
 * Everything below that gets the hamburger.
 */
export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Logo height — the complete lockup, tagline included.
   *
   * The supplied artwork is STACKED at 1.419:1 (monogram, then CONSTRUCTION,
   * then the tagline), so width follows from height. Sizing is driven by
   * height on purpose: passing a width would have to hard-code the ratio and
   * would drift the moment the asset's viewBox changed.
   *
   *   mobile  60px tall -> ~85px wide
   *   lg      76px tall -> ~108px wide
   *
   * The brief's suggested 140-240px width is NOT reachable here. At this
   * aspect, 200px wide is 137px tall and 240px wide is 165px tall, i.e. a
   * 149-177px header — taller than the entire hero copy above the fold. These
   * values are the largest a professional header can carry while staying
   * vertically balanced. The lockup is 96% of its box filled with ink after the
   * whitespace fix, so this is a genuine size, not a padded one.
   */
  const LOGO_HEIGHT = 'clamp(3.75rem, 2.1rem + 2.6vw, 4.75rem)';

  const closeDrawer = () => {
    setDrawerOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <ScrollProgressBar />

      {/* The skip link lives in Layout, BEFORE the TopBar, so it is genuinely
          the first focusable element. Kept here only for pages that render a
          Header without the shell. */}

      <header
        className={cn(
          'sticky top-0 z-[60] w-full',
          'transition-[background-color,border-color,box-shadow] duration-[240ms] ease-out',
          'motion-reduce:transition-none',
          // Gold hairline is part of the identity and never disappears.
          'border-b',
          scrolled
            ? 'border-gold/42 bg-navy/96 shadow-header'
            : 'border-gold/28 bg-navy/88 shadow-[0_8px_28px_rgb(0_0_0/0.18)] backdrop-blur-[16px] backdrop-saturate-[130%] supports-[not(backdrop-filter:blur(1px))]:bg-navy',
        )}
      >
        <Container size="page">
          {/* Row height is driven by the logo, not the other way round: 80px on
              mobile holds a 60px lockup, 96px from `lg` holds 76px. The
              hamburger is size-11 (44px) and the CTA is comfortably centred
              within the same row, so nothing collides. */}
          <div className="flex h-20 items-center justify-between gap-3 lg:h-24">
            <Link
              to={ROUTES.home}
              aria-label={`${company.name} — home`}
              className="-my-1 flex min-w-0 shrink-0 items-center rounded-sm py-1"
            >
              {/* The COMPLETE lockup — monogram, CONSTRUCTION and the
                  BUILDING BETTER TOMORROWS tagline — at every size, per the
                  requirement that no context crops a band of the artwork.

                  No white plate is used: the margin around the lettering is
                  baked into the asset's own viewBox, and the white you see is
                  the logo's own background rather than a box drawn around it.

                  `shrink-0` is what stops the nav pushing it; the parent is a
                  flex row with `gap-3`, and the logo takes its width from the
                  inline height, so it cannot be squeezed or distorted. */}
              <Logo height={LOGO_HEIGHT} />
            </Link>

            <nav aria-label="Primary" className="hidden xl:block xl:flex-1">
              <ul className="flex items-center justify-center gap-1">
                {nav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      aria-description={item.description}
                      className={({ isActive }) =>
                        cn(
                          'relative flex min-h-11 items-center rounded-sm px-3.5 text-[0.9375rem] font-semibold',
                          'tracking-tight transition-colors duration-200',
                          isActive
                            ? 'text-gold-light'
                            : 'text-text-secondary hover:text-gold',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {item.label}
                          <span
                            aria-hidden="true"
                            className={cn(
                              'pointer-events-none absolute inset-x-3 -bottom-px h-0.5 origin-left rounded-full bg-gold',
                              'transition-transform duration-300 ease-[var(--ease-architectural)]',
                              'motion-reduce:transition-none',
                              isActive ? 'scale-x-100' : 'scale-x-0',
                            )}
                          />
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden shrink-0 items-center gap-3 xl:flex">
              <Button to={headerCta.to} variant="goldGradient" size="md">
                {headerCta.label}
              </Button>
            </div>

            {/* Hamburger → close cross-morph.
                Both glyphs occupy the same box and cross-fade, so the icon
                reads as one shape transforming rather than two icons swapping.
                Motion handles opacity/rotate/transform only — no layout work. */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="relative grid size-11 shrink-0 place-items-center rounded-sm text-gold transition-colors duration-200 hover:bg-white/10 active:bg-white/16 xl:hidden"
            >
              <m.span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center"
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Menu className="size-6" strokeWidth={1.75} />
              </m.span>
              <m.span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center"
                initial={false}
                animate={{ opacity: drawerOpen ? 1 : 0, rotate: drawerOpen ? 0 : -90, scale: drawerOpen ? 1 : 0.6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <X className="size-6" strokeWidth={1.75} />
              </m.span>
            </button>
          </div>
        </Container>
      </header>

      {drawerOpen && <MobileDrawer open={drawerOpen} onClose={closeDrawer} />}
    </>
  );
}

export default Header;