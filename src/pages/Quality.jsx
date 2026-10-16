import { Seo } from '../components/common/Seo.jsx';
import { PageHero } from '../components/common/PageHero.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { SurfaceCard } from '../components/common/SurfaceCard.jsx';
import { SmartImage } from '../components/common/SmartImage.jsx';
import { DataNotice } from '../components/common/DataNotice.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { IconBadge } from '../components/common/IconBadge.jsx';
import { CtaBanner } from '../components/home/CtaBanner.jsx';
import { ROUTES } from '../config/site.js';
import { qualityStandards } from '../data/quality.js';

/**
 * QUALITY PAGE
 *
 * Full per-trade checklists. Deliberately avoids concrete grades, mix ratios,
 * thicknesses, brand names and warranty periods — the brief prohibits
 * publishing unsupported engineering specifications, so the page states
 * plainly that exact requirements live in the written agreement.
 */
export function Quality() {
  return (
    <>
      <Seo path={ROUTES.quality} />

      <PageHero
        eyebrow="Quality standards"
        title="Inspected while it is still cheap to fix."
        lead="Every trade on site has an inspection point. The pattern is consistent: look at the work before the next trade covers it, and record what was checked."
        breadcrumbs={[{ label: 'Home', to: ROUTES.home }, { label: 'Quality' }]}
      />

      <Section tone="white">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
            <Reveal className="lg:col-span-5">
              <SectionHeading
                eyebrow="The principle"
                title="A defect closed early is an inconvenience. Closed late, it is a rebuild."
                as="h2"
              />
              <div className="mt-6 flex flex-col gap-4 text-lead text-text">
                <p>
                  Inspections exist because remediation cost rises sharply with
                  time. A foundation issue caught before the next stage is
                  arithmetic; the same issue found after handover is demolition.
                </p>
                <p>
                  So each stage is signed off before it is covered, and the
                  checks are recorded rather than assumed. You can see what was
                  inspected and when.
                </p>
              </div>

              <SmartImage
                src="/images/quality-interiors.svg"
                alt="Architectural perspective drawing of a finished interior space"
                ratio="3/2"
                sizes="(min-width: 1024px) 28rem, 100vw"
                rounded
                className="mt-8 hidden lg:block"
              />
            </Reveal>

            <Reveal delay={80} className="lg:col-span-7">
              <DataNotice tone="warning" title="On engineering specifications">
                This page describes VNR&apos;s inspection practice. It does not
                publish concrete grades, mix designs, thicknesses, brand names or
                warranty periods, because those are specific to your design and
                site and belong in your written agreement and specifications.
              </DataNotice>

              <SurfaceCard tone="warm" className="mt-8">
                <h3 className="font-display text-h4 font-bold text-brand-black">
                  What every stage has in common
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {[
                    'Inspected before the next trade covers the work.',
                    'Recorded against the stage, not left to memory.',
                    'Snags listed, assigned and closed before the stage is signed off.',
                    'Materials approved with you before procurement, not after.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-fine text-text">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-brand-gold"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Per-trade checklists ---- */}
      <Section tone="mist">
        <Container size="page">
          <Reveal>
            <SectionHeading
              eyebrow="By trade"
              title="What gets checked, trade by trade."
              as="h2"
              align="center"
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {qualityStandards.map((item, index) => (
              <Reveal
                key={item.id}
                delay={Math.min(index, 6) * 50}
                className="flex h-full flex-col"
              >
                {/* Same card as Packages and Projects. The `h-full` sits on the
                    Reveal so the surface stretches and the ragged bottom edge
                    three cards of differing checklist length produced is gone. */}
                <SurfaceCard className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <IconBadge
                      name={item.icon}
                      size="lg"
                      tone="light"
                      shape="square"
                      strokeWidth={1.75}
                    />
                    <span className="font-display text-label font-bold tracking-[0.16em] text-brand-gold-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-5 text-balance font-display text-h4 font-bold text-brand-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-fine leading-relaxed text-text-muted">
                    {item.summary}
                  </p>

                  <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-line pt-5">
                    {item.checks.map((check) => (
                      <li key={check} className="flex items-start gap-2.5 text-fine text-text">
                        <span
                          aria-hidden="true"
                          className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-brand-gold"
                        />
                        {check}
                      </li>
                    ))}
                  </ul>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="mist">
        <Container size="page">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="max-w-2xl font-display text-h2 font-bold text-brand-black text-balance">
              Want to see how a specification is written in practice?
            </h2>
            <p className="max-w-xl text-lead text-text">
              Ask for a worked estimate during the consultation and we will walk
              you through exactly what is included.
            </p>
            <Button to={ROUTES.contact} variant="goldGradient" size="lg" className="mt-2">
              Book a consultation
            </Button>
          </div>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}

export default Quality;