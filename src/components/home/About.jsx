import { Check } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading, Button } from '../common/Button.jsx';
import { Logo } from '../brand/Logo.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { SourceCopyPending } from '../common/SourceCopyPending.jsx';
import { about } from '../../data/home.js';
import { ROUTES } from '../../config/site.js';

/**
 * ============================================================================
 * ABOUT VNR (reference section 6)
 * ============================================================================
 * Heading, logo artwork, gold checkmarks, gold borders, dark navy surfaces and
 * the consultation CTA are all preserved.
 *
 * The logo is rendered at its natural ratio inside a fixed-height plate. The
 * brief is explicit — "do not stretch the logo to fill the image container" —
 * so the plate is `object-contain` and generously padded rather than filled.
 *
 * Layout: text left, visual right on desktop; stacked on mobile with the
 * visual first, since it is the lighter element.
 */
export function About() {
  return (
    <Section id="about" tone="navy2">
      <Container size="page">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* Copy */}
          <Reveal className="lg:col-span-6">
            <SectionHeading title={about.title} as="h2" />

            {about.introduction ? (
              <div className="mt-6 flex flex-col gap-4 text-lead text-text-secondary">
                {String(about.introduction)
                  .split('\n\n')
                  .map((p) => (
                    <p key={p}>{p}</p>
                  ))}
              </div>
            ) : (
              <div className="mt-6">
                <SourceCopyPending label="Company introduction" />
              </div>
            )}

            {/* Four supplied value statements — wording pending from source. */}
            <ul className="mt-8 flex flex-col gap-3">
              {about.values.map((value) => (
                <li key={value.id} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-gold/45 text-gold"
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {value.text ? (
                    <span className="text-lead text-text-secondary">{value.text}</span>
                  ) : (
                    <SourceCopyPending label="Value statement" className="flex-1" />
                  )}
                </li>
              ))}
            </ul>

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

          {/* Visual */}
          <Reveal delay={80} className="lg:col-span-6">
            <div className="relative">
              {/* Gold frame, inset, per the reference treatment */}
              <div className="frame-gold overflow-hidden rounded-sm border border-gold-medium">
                <img
                  src={about.image}
                  alt="Development visual: a floor plan drawing. Stands in for the supplied VNR project image."
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              {/* The brand plate overlaps the artwork's lower-left corner on `sm` and up.
                  On a phone it would sit on top of the floor-plan drawing's
                  own caption area, which is the part of the visual that says
                  what it is — so below `sm` it drops BELOW the frame and the
                  two stack. The plate is still the lower of the two, so the
                  reading order (artwork, then logo, then tagline) is unchanged.

                  10px rather than 9px: `text-[0.5625rem]` was the smallest text
                  rendered anywhere on the site, found by the mobile audit at 9px
                  on a 390px screen. Uppercase with 0.12em tracking needs a
                  little more than 13px to stay legible, and one step up clears
                  it without altering the plate's proportions. */}
              <div className="glass-panel relative mt-5 max-w-[min(21rem,calc(100%-2rem))] rounded-sm px-4 py-3.5 sm:absolute sm:-bottom-6 sm:left-6 sm:mt-0 sm:px-5 sm:py-4">
                <Logo height={68} decorative />
                <p className="mt-2 text-[0.625rem] uppercase leading-relaxed tracking-[0.12em] text-text-muted sm:tracking-[0.14em]">
                  {about.tagline}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default About;