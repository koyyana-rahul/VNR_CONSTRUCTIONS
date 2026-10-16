import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { Logo } from '../brand/Logo.jsx';
import { cn } from '../../utils/cn.js';
import { currentYear } from '../../utils/format.js';
import { ROUTES } from '../../config/site.js';
import { nav, navHome, navSecondary } from '../../data/home.js';
import {
  company,
  telHref,
  mailtoHref,
  hasEmail,
} from '../../config/company.js';

/**
 * Every route a visitor can reach, in one list.
 *
 * `navHome + nav + navSecondary`. The supporting four (Projects, Packages, Cost
 * Estimator, Quality Standards) were previously unreachable from ANY part of
 * the chrome: the header has no room for them and the footer was built from
 * `nav` alone. Every link here is a real route — nothing renders as "#".
 */
const EXPLORE = [navHome, ...nav, ...navSecondary].map((item) => ({
  to: item.to,
  label: item.label,
}));

/**
 * ============================================================================
 * FOOTER (reference section 11)
 * ============================================================================
 * Deep black-blue ground, gold top border, light text, gold headings.
 * Logo, "Building Better Tomorrows" tagline, a short construction-and-interiors
 * introduction, Explore links, contact details, Hyderabad/Telangana, and a
 * copyright year generated at render time — never hard-coded, which would go
 * stale in January.
 *
 * Every link here is a real route. Nothing renders as "#".
 */
export function Footer() {
  return (
    <footer className="on-dark bg-black-blue text-text-secondary">
      {/* Gold top border — part of the identity, always present. */}
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

      <Container size="page" className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-9 sm:grid-cols-2 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            {/* Sized via --logo-w-footer, one step up from the header on wide screens.
                Same asset, same ratio, separate context token — context-appropriate
                sizing without a duplicate variant or any conflicting CSS. */}
            <Logo width="var(--logo-w-footer)" decorative />
            <p className="mt-5 font-display text-h4 font-bold text-ivory">
              Building Better Tomorrows.
            </p>
            <p className="mt-3 max-w-xs text-fine leading-relaxed">
              Home construction and premium interior solutions, brought together
              under one roof with clear project discussions at every stage.
            </p>
          </div>

          {/* Explore.

              Two columns at every breakpoint, including `lg`.

              Ten links at a 44px minimum touch height is 440px of column. In one
              column that is what it was, and on desktop it pushed the footer to
              nearly 1000px tall while the Contact block beside it ended after
              300px — leaving a large void under the contact CTA, which is worse
              than the phone problem it solved.

              So the column widens instead of re-collapsing: Explore takes 4 of
              the 12 grid tracks from `lg` (rather than 3), Contact takes 4, and
              the brand block keeps 4. At ~380px a two-column list gives ~180px
              per cell, which holds "Quality Standards" on one line at 13px. */}
          <nav aria-label="Explore" className="lg:col-span-4">
            <h2 className="font-sans text-label font-bold uppercase tracking-[0.16em] text-gold">
              Explore
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-0.5 sm:mt-5 lg:mt-5">
              {EXPLORE.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      // min-h-11 gives a 44px touch target on every footer
                      // link. A bare text link renders at 21px, which is below
                      // the WCAG 2.2 target minimum and awkward to hit on a
                      // phone.
                      'inline-flex min-h-11 items-center rounded-sm text-fine text-text-secondary',
                      'transition-colors duration-200 hover:text-gold-light',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="font-sans text-label font-bold uppercase tracking-[0.16em] text-gold">
              Contact
            </h2>

            <ul className="mt-4 flex flex-col gap-4 text-fine sm:mt-5">
              {telHref() && (
                <li>
                  <a
                    href={telHref()}
                    className="group flex min-h-11 items-start gap-3 rounded-sm transition-colors hover:text-gold-light"
                  >
                    <Phone className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-ivory">Phone</span>
                      {company.phone.display}
                    </span>
                  </a>
                </li>
              )}

              {hasEmail && (
                <li>
                  <a
                    href={mailtoHref()}
                    className="group flex min-h-11 items-start gap-3 rounded-sm break-all transition-colors hover:text-gold-light"
                  >
                    <Mail className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-ivory">Email</span>
                      {company.email.display}
                    </span>
                  </a>
                </li>
              )}

              <li className="flex items-start gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-ivory">Service area</span>
                  {company.serviceAreas.list.join(', ')}
                </span>
              </li>
            </ul>

            {/* The design-system Button, full-width on a phone and auto-width
                from `sm`.

                It was a 44px-tall outlined pill sitting alone in a column of
                its own with 28px of dead space above it — the least prominent
                thing on the page carrying the most important action, and not a
                `<Button>`, so it could never match the hero or the drawer CTA.
                On a phone the column is already full width, so filling it costs
                nothing and gives the footer a proper terminus. */}
            <Button
              to={ROUTES.contact}
              variant="goldGradient"
              size="md"
              fullWidth
              className="mt-6 sm:mt-7 sm:w-auto"
            >
              Book a Consultation
            </Button>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border-dark pt-5 sm:mt-12 sm:flex-row sm:items-center sm:gap-4 sm:pt-6">
          <p className="text-fine text-text-muted">
            &copy; {currentYear()} {company.name}. All rights reserved.
          </p>
          <ul className="-mx-2 flex flex-wrap items-center gap-x-4">
            <li>
              <Link
                to={ROUTES.privacy}
                className="inline-flex min-h-11 items-center rounded-sm px-2 text-fine text-text-muted underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.services}
                className="inline-flex min-h-11 items-center rounded-sm px-2 text-fine text-text-muted underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                Services
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;