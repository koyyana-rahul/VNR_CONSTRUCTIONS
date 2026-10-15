import { Seo } from '../components/common/Seo.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { Process } from '../components/home/Process.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { SourceCopyPending } from '../components/common/SourceCopyPending.jsx';
import { process } from '../data/home.js';
import { ROUTES } from '../config/site.js';

/** OUR PROCESS — the four supplied steps, expanded with what each involves. */
export function ProcessPage() {
  return (
    <>
      <Seo path={ROUTES.process} />

      <div className="bg-navy pt-16 pb-4 sm:pt-20 lg:pt-24">
        <Container size="page">
          <Reveal>
            <SectionHeading
              eyebrow="Our process"
              title="Your Project, Step by Step"
              as="h1"
              lead="Four stages, and you always know which one you are in. Nothing below is a contractual commitment — the detail is agreed in writing before any work starts."
              align="center"
            />
          </Reveal>
        </Container>
      </div>

      <Process />

      {/* Detail per stage */}
      <Section tone="navy2">
        <Container size="page">
          <Reveal>
            <SectionHeading eyebrow="In detail" title="What each stage covers." as="h2" />
          </Reveal>

          <ol className="mt-10 flex flex-col gap-4">
            {process.map((step) => (
              <Reveal
                as="li"
                key={step.step}
                delay={step.step * 50}
                className="glass-card rounded-sm p-6 sm:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/45 font-display text-sm font-bold tabular-nums text-gold-light"
                  >
                    {String(step.step).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-h4 font-bold text-ivory">{step.title}</h3>
                    {step.description ? (
                      <p className="mt-2.5 text-lead text-text-secondary">{step.description}</p>
                    ) : (
                      <div className="mt-3">
                        <SourceCopyPending label="Step description" />
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-12 flex justify-center">
            <Button to={ROUTES.contact} variant="goldGradient" size="lg">
              Start with Step One
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default ProcessPage;