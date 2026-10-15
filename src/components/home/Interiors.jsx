import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading, Button } from '../common/Button.jsx';
import { Icon } from '../common/icons.jsx';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal.jsx';
import { SourceCopyPending } from '../common/SourceCopyPending.jsx';
import { interiors } from '../../data/home.js';
import { ROUTES } from '../../config/site.js';

/**
 * ============================================================================
 * PREMIUM INTERIORS (reference section 8)
 * ============================================================================
 * Midnight-navy ground, white heading, muted supporting text, gold feature
 * headings, a thin gold image frame, and the consultation CTA.
 *
 * The image keeps its aspect ratio via `aspect-[4/3]` plus `object-cover`, so
 * it is never cropped incorrectly at any viewport. The frame is inset
 * (`.frame-gold`) rather than an outer border, matching the reference.
 *
 * Layout: text + features left, image right on desktop; stacked on mobile with
 * the image following the copy, so the heading is never pushed below a tall
 * picture.
 */
export function Interiors() {
  return (
    <Section id="interiors" tone="navy">
      <Container size="page">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* Copy */}
          <Reveal className="lg:col-span-6">
            <SectionHeading eyebrow="Interiors" title={interiors.title} as="h2" />

            {interiors.description ? (
              <p className="mt-6 text-lead text-text-secondary">{interiors.description}</p>
            ) : (
              <div className="mt-6">
                <SourceCopyPending label="Supporting paragraph" />
              </div>
            )}

            <Stagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.06}>
              {interiors.features.map((feature) => (
                <StaggerItem key={feature.id}>
                  <div className="glass-card group flex h-full items-start gap-3.5 rounded-sm p-5 transition-[border-color,transform] duration-300 hover:-translate-y-[3px] hover:border-gold-medium motion-reduce:transform-none motion-reduce:hover:translate-y-0">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-colors duration-300 group-hover:border-gold"
                    >
                      <Icon name={feature.icon} className="size-[1.15rem]" strokeWidth={1.5} />
                    </span>
                    <h3 className="pt-2 font-display text-[1.0625rem] font-bold text-gold-light">
                      {feature.title}
                    </h3>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Button to={ROUTES.contact} variant="goldGradient" size="lg" className="mt-9">
              Book a Consultation
            </Button>
          </Reveal>

          {/* Image */}
          <Reveal delay={80} className="lg:col-span-6">
            <div className="frame-gold overflow-hidden rounded-sm border border-gold-medium">
              <img
                src={interiors.image}
                alt="Placeholder artwork standing in for the supplied VNR interiors promotional image"
                width="1400"
                height="1050"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <p className="mt-3 text-fine text-text-muted">
              Development visual — the supplied promotional image replaces this
              before launch.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default Interiors;