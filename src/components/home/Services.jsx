import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading } from '../common/Button.jsx';
import { Icon } from '../common/icons.jsx';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal.jsx';
import { services } from '../../data/home.js';
import { SourceCopyPending } from '../common/SourceCopyPending.jsx';
import { ROUTES } from '../../config/site.js';

/**
 * ============================================================================
 * SERVICES (reference section 5)
 * ============================================================================
 * The six supplied services, in the supplied order, with the supplied heading
 * and supporting line.
 *
 * Each card carries a gold top accent, a number, an icon, a functional CTA and
 * hover/focus feedback: a restrained translateY(-3px), a gold border shift and
 * an arrow nudge. No layout jump — the transform is small and the shadow is
 * layered, not a size change.
 *
 * Service DESCRIPTIONS were referenced by the brief ("do not change the
 * service descriptions") but not reproduced, so they render an explicit
 * pending state rather than invented marketing copy.
 *
 * Grid: 1 / 2 / 3 columns, per the brief.
 */
export function Services() {
  return (
    <Section id="services" tone="navy">
      <Container size="page">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Complete Solutions for Your Home"
            align="center"
          />
        </Reveal>

        <Reveal delay={60}>
          <p className="mx-auto mt-5 max-w-[58ch] text-center text-lead text-text-secondary">
            From the structure to the finishing details, explore services that help
            turn your ideas into a considered plan for your home.
          </p>
        </Reveal>

        <Stagger
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          stagger={0.07}
        >
          {services.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <article
                className={[
                  'group relative flex h-full flex-col overflow-hidden rounded-sm',
                  // Selective glass, exactly as the brief prescribes.
                  'glass-card',
                  'transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-architectural)]',
                  'hover:-translate-y-[3px] hover:border-gold-medium hover:shadow-card',
                  'focus-within:-translate-y-[3px] focus-within:border-gold-medium',
                  'motion-reduce:transform-none motion-reduce:hover:translate-y-0',
                ].join(' ')}
              >
                {/* Gold top accent — a 2px rule that fills on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-100 bg-gold/45 transition-transform duration-300 group-hover:bg-gold motion-reduce:transition-none"
                />

                <div className="flex items-start justify-between gap-4 p-6">
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/35 text-gold"
                  >
                    <Icon name={service.icon} className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="font-display text-h3 font-bold tabular-nums text-gold/40">
                    {service.number}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-6 pb-6">
                  <h3 className="font-display text-h4 font-bold text-ivory">
                    {service.title}
                  </h3>

                  {service.description ? (
                    <p className="mt-3 flex-1 text-fine leading-relaxed text-text-muted">
                      {service.description}
                    </p>
                  ) : (
                    <div className="mt-3 flex-1">
                      <SourceCopyPending
                        label="Service description"
                        className="text-text-muted"
                      />
                    </div>
                  )}

                  <Link
                    to={ROUTES.contact}
                    aria-label={`Enquire about ${service.title}`}
                    className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-sm font-sans text-sm font-semibold text-gold transition-colors duration-200 hover:text-gold-light"
                  >
                    Enquire about this
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Services;