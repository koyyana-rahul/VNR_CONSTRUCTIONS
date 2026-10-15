import { Container } from '../common/Container.jsx';
import { Button } from '../common/Button.jsx';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../config/site.js';
import { company } from '../../config/company.js';

/**
 * Closing call-to-action band.
 *
 * Navy gradient with a champagne hairline, so it reads as a distinct close to
 * the page without introducing a colour that is not in the palette.
 */
export function CtaBanner({
  title = "Let's Plan Your Next Project.",
  eyebrow = 'Next step',
  lead = 'Tell us about your plot and what you want to build. We will come back with a clear next step — no obligation.',
  primaryLabel = 'Discuss Your Project',
  primaryTo = ROUTES.contact,
  secondaryLabel = 'Our Services',
  secondaryTo = ROUTES.services,
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-navy to-black-blue py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent"
      />

      <Container size="page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow eyebrow--center">{eyebrow}</p>

          <h2
            id="cta-heading"
            className="mt-5 font-display text-display font-bold text-white text-balance"
          >
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lead text-text-secondary">{lead}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              to={primaryTo}
              variant="goldGradient"
              size="lg"
              fullWidth
              className="sm:w-auto"
              icon={<ArrowRight className="size-4" />}
            >
              {primaryLabel}
            </Button>
            <Button
              to={secondaryTo}
              variant="outline"
              size="lg"
              fullWidth
              className="sm:w-auto"
            >
              {secondaryLabel}
            </Button>
          </div>

          <p className="mt-7 text-fine text-text-muted">
            {company.name} &mdash; {company.serviceAreas.list.join(', ')}
          </p>
        </div>
      </Container>
    </section>
  );
}

export default CtaBanner;