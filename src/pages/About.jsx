import { Check } from 'lucide-react';
import { Seo } from '../components/common/Seo.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { Logo } from '../components/brand/Logo.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { SourceCopyPending } from '../components/common/SourceCopyPending.jsx';
import { about } from '../data/home.js';
import { company } from '../config/company.js';
import { ROUTES } from '../config/site.js';

/** ABOUT VNR — the reference heading, value list, logo plate and CTA. */
export function About() {
  return (
    <>
      <Seo path={ROUTES.about} />

      <div className="bg-navy pt-16 sm:pt-20 lg:pt-24">
        <Container size="page">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-6">
              <SectionHeading eyebrow="About us" title={about.title} as="h1" />

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

              <Button to={ROUTES.contact} variant="goldGradient" size="lg" className="mt-9">
                Book a Consultation
              </Button>
            </Reveal>

            <Reveal delay={80} className="lg:col-span-6">
              <div className="frame-gold overflow-hidden rounded-sm border border-gold-medium">
                <img
                  src={about.image}
                  alt="Placeholder artwork standing in for the supplied VNR project image"
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="glass-panel mt-6 rounded-sm px-6 py-5">
                <Logo decorative onDark />
                <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.16em] text-text-muted">
                  {about.tagline} &middot; {company.serviceAreas.list.join(', ')}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      <Section tone="navy2">
        <Container size="page">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="max-w-2xl font-display text-h2 font-bold text-ivory text-balance">
              Building Better Tomorrows starts with a clear conversation.
            </h2>
            <Button to={ROUTES.process} variant="outline" size="lg">
              See how we work
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default About;