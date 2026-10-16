import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading, Button } from '../common/Button.jsx';
import { IconBadge } from '../common/IconBadge.jsx';
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
            <SectionHeading title={interiors.title} as="h2" />

            {interiors.description ? (
              <p className="mt-6 text-lead text-text-secondary">{interiors.description}</p>
            ) : (
              <div className="mt-6">
                <SourceCopyPending label="Supporting paragraph" />
              </div>
            )}

            {/* Two columns from 320px, not one.

                The four feature titles are short ("Modular Kitchens", "Living
                Rooms", "Bedrooms & Wardrobes", "Lighting & Fittings") and the
                cards are icon-plus-title only, so a single phone column spent
                ~440px of scroll on four rows that each carried one line of
                text. Two columns halve that and give the strip the compact,
                tiled rhythm it has on every other breakpoint. */}
            <Stagger className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4" stagger={0.06}>
              {interiors.features.map((feature) => (
                <StaggerItem key={feature.id}>
                  {/* Icon ABOVE the title below `sm`.

                      Two columns of a 390px screen are ~171px. Laying the 40px
                      badge beside the title left 119px of measure, and "Bedrooms
                      & Wardrobes" broke to three lines while its neighbour
                      took two — the row read as three ragged text blocks rather
                      than four equal cards. Stacking puts the full cell width
                      back behind the heading. From `sm` the cells are wide
                      enough for the original side-by-side pairing. */}
                  <div className="glass-card group flex h-full flex-col items-start gap-2.5 rounded-sm p-4 transition-[border-color,transform] duration-300 hover:-translate-y-[3px] hover:border-gold-medium motion-reduce:transform-none motion-reduce:hover:translate-y-0 sm:flex-row sm:items-start sm:gap-3.5 sm:p-5">
                    <IconBadge name={feature.icon} size="md" interactive />
                    <h3 className="font-display text-[0.9375rem] font-bold text-balance text-gold-light sm:pt-2 sm:text-[1.0625rem]">
                      {feature.title}
                    </h3>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Button
              to={ROUTES.contact}
              variant="goldGradient"
              size="lg"
              fullWidth
              className="mt-8 sm:mt-9 sm:w-auto"
            >
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
              Development visual. The supplied promotional image replaces this
              before launch.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default Interiors;