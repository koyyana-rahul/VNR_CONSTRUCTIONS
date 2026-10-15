import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Logo } from '../brand/Logo.jsx';
import { cn } from '../../utils/cn.js';
import { currentYear } from '../../utils/format.js';
import { ROUTES } from '../../config/site.js';
import { nav } from '../../data/home.js';
import {
  company,
  telHref,
  mailtoHref,
  hasEmail,
} from '../../config/company.js';

const EXPLORE = [
  { to: ROUTES.home, label: 'Home' },
  ...nav.map((item) => ({ to: item.to, label: item.label })),
];

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

      <Container size="page" className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            {/* Complete lockup, sized explicitly. The default clamp tops out at
                76px tall, which is right for the header but too small for a
                footer brand block; 92px gives ~131px of logo and lets the
                tagline band read as a tagline. */}
            <Logo height={92} decorative />
            <p className="mt-5 font-display text-h4 font-bold text-ivory">
              Building Better Tomorrows.
            </p>
            <p className="mt-3 max-w-xs text-fine leading-relaxed">
              Home construction and premium interior solutions, brought together
              under one roof with clear project discussions at every stage.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="lg:col-span-3">
            <h2 className="font-sans text-label font-bold uppercase tracking-[0.16em] text-gold">
              Explore
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
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
          <div className="lg:col-span-5">
            <h2 className="font-sans text-label font-bold uppercase tracking-[0.16em] text-gold">
              Contact
            </h2>

            <ul className="mt-5 flex flex-col gap-4 text-fine">
              {telHref() && (
                <li>
                  <a
                    href={telHref()}
                    className="group flex items-start gap-3 rounded-sm transition-colors hover:text-gold-light"
                  >
                    <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
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
                    className="group flex items-start gap-3 rounded-sm break-all transition-colors hover:text-gold-light"
                  >
                    <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-ivory">Email</span>
                      {company.email.display}
                    </span>
                  </a>
                </li>
              )}

              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-ivory">Service area</span>
                  {company.serviceAreas.list.join(', ')}
                </span>
              </li>
            </ul>

            <Link
              to={ROUTES.contact}
              className={cn(
                'mt-7 inline-flex min-h-11 items-center rounded-sm border border-gold-medium px-5',
                'font-sans text-sm font-semibold text-gold-light',
                'transition-colors duration-200 hover:border-gold hover:bg-gold/10',
              )}
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border-dark pt-6 sm:flex-row sm:items-center">
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