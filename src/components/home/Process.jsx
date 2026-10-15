import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading } from '../common/Button.jsx';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal.jsx';
import { SourceCopyPending } from '../common/SourceCopyPending.jsx';
import { process } from '../../data/home.js';

/**
 * ============================================================================
 * FOUR-STEP PROCESS (reference section 7)
 * ============================================================================
 * The four supplied steps, in order.
 *
 * Layout per the brief:
 *   lg   four columns
 *   sm   two columns
 *   base single-column VERTICAL TIMELINE with a gold rail and numbered nodes —
 *        which is what a phone reader actually wants, not a squeezed grid.
 *
 * The rail is drawn with a pseudo-element on the <ol>, so it needs no extra
 * markup and cannot drift out of alignment with the nodes.
 *
 * "The sequence must remain understandable when animations are disabled" —
 * under reduced motion every step renders visible immediately, in document
 * order, with its number intact.
 */
export function Process() {
  return (
    <Section id="process" tone="navy">
      <Container size="page">
        <Reveal>
          <SectionHeading
            eyebrow="How we work"
            title="Your Project, Step by Step"
            align="center"
          />
        </Reveal>

        <Stagger
          className={[
            'relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6',
            // Mobile rail, hidden once the layout becomes a grid.
            'before:absolute before:bottom-6 before:left-[1.125rem] before:top-6 before:w-px',
            'before:bg-gradient-to-b before:from-gold/60 before:via-gold/30 before:to-transparent',
            'lg:before:hidden',
          ].join(' ')}
          stagger={0.08}
        >
          {process.map((step) => (
            <StaggerItem key={step.step} className="relative pl-14 lg:pl-0 lg:pt-14">
              {/* Numbered node. Sits on the rail on mobile, above the card on
                  desktop, so every column in a row starts level. */}
              <span
                aria-hidden="true"
                className={[
                  'absolute left-0 top-0 grid size-9 place-items-center rounded-full',
                  'border border-gold/50 bg-navy font-display text-xs font-bold tabular-nums text-gold-light',
                  'lg:left-0 lg:top-0',
                ].join(' ')}
              >
                {String(step.step).padStart(2, '0')}
              </span>

              <div className="glass-card h-full rounded-sm p-6 transition-[border-color,transform] duration-300 hover:-translate-y-[3px] hover:border-gold-medium motion-reduce:transform-none motion-reduce:hover:translate-y-0">
                <h3 className="font-display text-h4 font-bold text-ivory">{step.title}</h3>

                {step.description ? (
                  <p className="mt-3 text-fine leading-relaxed text-text-muted">
                    {step.description}
                  </p>
                ) : (
                  <div className="mt-3">
                    <SourceCopyPending label="Step description" />
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Process;