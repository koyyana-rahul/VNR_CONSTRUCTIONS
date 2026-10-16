import { useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { Logo } from '../brand/Logo.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';
import { HeaderMoreMenu } from './HeaderMoreMenu.jsx';
import { ScrollProgressBar } from './ScrollProgressBar.jsx';
import { m, useMotionValueEvent, useScroll } from 'motion/react';
import { cn } from '../../utils/cn.js';
import { navWithHome, navSecondary, headerCta } from '../../data/home.js';
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
 * WHAT IS IN THE BAR, AND WHERE
 * ------------------------------
 * The bar and the mobile drawer expose the SAME ten destinations. They used
 * not to: the drawer listed all ten and the desktop bar listed five, so Our
 * Projects, Packages, Cost Estimator and Quality Standards were reachable on a
 * phone and not on a desktop. A wide screen can afford strictly more
 * navigation than a narrow one, so that was backwards — and it was the direct
 * cause of four fully-built pages being orphaned from the header entirely.
 *
 * Home is in the bar as a real link, even though the logo already goes home.
 * That reverses the usual "redundant next to a logo" advice on purpose: the
 * bar and the drawer have to agree, and a visitor who learned the navigation on
 * a phone should meet the same destinations in the same words.
 *
 * TEN LINKS DO NOT FIT, AND FORCING THEM MAKES IT WORSE
 * ------------------------------------------------------
 * All ten inline need ~990px of link width plus the logo, the CTA, both
 * gutters and the flex gaps — about 1420px. That is past every 1366-class
 * laptop, and it made the bar change SHAPE at a breakpoint: all links inline
 * above 1400px, collapsed below. One page, two different headers, split at an
 * arbitrary width that means nothing to the visitor.
 *
 * So there is one shape at every desktop width: six inline links (Home and the
 * five primary pages) and the "Also worth seeing" disclosure carrying the four
 * supporting pages. Same label, same four items, same order as the drawer's
 * group of the same name, so the two navigation surfaces read as one site.
 *
 * The bar shows from `lg` (1024px), not `xl` (1280px). It used to start at
 * `xl`, on the stated belief that five items plus a CTA plus the logo
 * "genuinely do not fit at 1024px". Measured, that was wrong by a wide margin.
 * The real widths at 1024 are:
 *
 *     gutter        24    (lg:px-6)
 *     logo         164    (--logo-w at lg)
 *     gap           16
 *     nav items    488    (measured at 1280; they are fluid text, not a fixed box)
 *     gap           16
 *     CTA           85    (min-h-11 px-5 at size="md")
 *     gutter        24
 *                 ---
 *                 817px against a 1024px viewport
 *
 * 207px of slack. So for every width from 900px to 1279px — 1024x768 and
 * 1152x864 laptops, 1248-wide windows, every iPad in landscape, and any desktop
 * at 125% browser zoom, which reports 1024 CSS pixels on a 1280 screen — the
 * header showed a logo, a hamburger, and NOTHING ELSE: no navigation and, worse,
 * no "Book a Consultation" CTA. The site's primary action silently disappeared
 * across a whole band of real desktop screens.
 *
 * `md` (768px) genuinely does not fit — 431px of space against 488px of items —
 * so that stays on the drawer, which is the right call for a tablet in portrait
 * anyway.
 */
export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 12);
  });

  /**
   * LOGO WIDTH — a CSS token, not a class.
   *
   * The per-breakpoint ladder (140 / 160 / 168 / 188 / 208px, each derived
   * from the asset's true 1.4195:1 ratio and matched to the brief's width
   * bands) lives in `src/styles/index.css` as `--logo-w`. Consuming it here
   * rather than repeating the steps as utility classes means the header, the
   * drawer and anything else reading the same variable can never disagree
   * about how big the logo is.
   *
   * The row height is NOT hard-coded either: it is `py-3` around the logo plus
   * the 1px gold border, so the header is always exactly the logo plus its
   * breathing room and the two cannot drift out of step. See
   * `--chrome-h` and `useChromeHeight` for how the hero consumes the result.
   */
  const LOGO_WIDTH = 'var(--logo-w)';

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
          {/* The row is sized by the logo plus `py-3` (24px) of breathing room
              and the 1px gold border — never by a hard-coded height. That is why
              a logo change can never open a gap under it, and why the header is
              automatically "proportionate to the logo" at every breakpoint. */}
          <div className="flex items-center justify-between gap-2 py-3 sm:gap-3 lg:gap-4">
            <Link
              to={ROUTES.home}
              aria-label={`${company.name} — home`}
              className="-my-1 flex min-w-0 shrink-0 items-center rounded-sm"
            >
              {/* The COMPLETE lockup — monogram, CONSTRUCTION and the
                  BUILDING BETTER TOMORROWS tagline — at every size, per the
                  requirement that no context crops a band of the artwork.

                  No white plate is used: the margin around the lettering is
                  baked into the asset's own viewBox, and the white you see is
                  the logo's own background rather than a box drawn around it.

                  Width-driven with `height: auto`, so the 1.4195:1 ratio is
                  taken from the asset's own intrinsic attributes and can never
                  be stretched. `shrink-0` on the wrapper plus `min-w-0` on the
                  link is what stops the nav pushing or squeezing it: the
                  hamburger and CTA are the only things that yield. */}
              <Logo width={LOGO_WIDTH} />
            </Link>

            {/* ---------- THE BAR ----------

                One shape at every desktop width: six inline links (Home plus the
                five primary pages) and the "Also worth seeing" disclosure. There
                is deliberately no second, wider arrangement — see the breakpoint
                note at the top of this file. */}

            {/* `lg:flex` with `lg:items-center`, not `lg:block`.

                The two children below are the link list and the disclosure. As
                block children of a block nav they STACK — at 1024 the links took
                one row and the trigger dropped onto a second row that ran out
                through the bottom of the 90px header and over the page beneath
                it. A row flex puts them side by side. */}

            <nav
              aria-label="Primary"
              className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center"
            >
              <ul className="flex items-center justify-center gap-0.5">
                {navWithHome.map((item) => (
                  <li key={item.to} className="shrink-0">
                    <NavLink
                      to={item.to}
                      aria-description={item.description}
                      /* Without `end`, React Router marks "/" active on EVERY
                         route, so the gold underline and the gold label sat on
                         Home permanently while the visitor read the footer. */
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          /* `shrink-0` + `whitespace-nowrap` are load-bearing,
                             not tidiness. The global base reset sets
                             `min-width: 0` on every element so grid and flex
                             children cannot force page-level overflow — which
                             also means a child of a row that is slightly too
                             full will happily SHRINK below its content width
                             instead of pushing the row over. At 1024px that is
                             exactly what happened: every link wrapped mid-word
                             and rendered as "Ho me", "Servic es", "Conta ct".
                             Nothing overflowed the header, so no overflow check
                             could ever have caught it — only a wrap check. */
                          'relative flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-sm',
                          'px-2.5 text-[0.875rem] font-semibold xl:px-3 xl:text-[0.9375rem]',
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
                              'pointer-events-none absolute inset-x-2.5 -bottom-px h-0.5 origin-left rounded-full bg-gold xl:inset-x-3',
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

              {/* The supporting pages. Same label, same four items, same order
                  as the drawer's "Also worth seeing" group. */}
              <div className="flex items-center justify-center gap-0.5">
                <HeaderMoreMenu items={navSecondary} />
              </div>
            </nav>

            <div className="hidden shrink-0 items-center gap-3 lg:flex">
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
              onClick={() => setDrawerOpen((open) => !open)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              className="relative grid size-11 shrink-0 place-items-center rounded-sm text-gold transition-colors duration-200 hover:bg-white/10 active:bg-white/16 lg:hidden"
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