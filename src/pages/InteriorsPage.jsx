import { Seo } from '../components/common/Seo.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { IconBadge } from '../components/common/IconBadge.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { SourceCopyPending } from '../components/common/SourceCopyPending.jsx';
import { interiors } from '../data/home.js';
import { ROUTES } from '../config/site.js';

/** INTERIORS — the reference heading, four features and the promo artwork. */
export function InteriorsPage() {
  return (
    <>
      <Seo path={ROUTES.interiors} />

      <div className="bg-navy pt-16 sm:pt-20 lg:pt-24">
        <Container size="page">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
            <Reveal className="lg:col-span-6">
              <SectionHeading eyebrow="Interiors" title={interiors.title} as="h1" />

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
                      <IconBadge name={feature.icon} size="md" interactive />
                      <h2 className="pt-2 font-display text-[1.0625rem] font-bold text-gold-light">
                        {feature.title}
                      </h2>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Button to={ROUTES.contact} variant="goldGradient" size="lg" className="mt-9">
                Book a Consultation
              </Button>
            </Reveal>

            <Reveal delay={80} className="lg:col-span-6">
              <div className="frame-gold overflow-hidden rounded-sm border border-gold-medium">
                <img
                  src={interiors.image}
                  alt="Placeholder artwork standing in for the supplied VNR interiors promotional image"
                  width="1400"
                  height="1050"
                  loading="eager"
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
      </div>

      <Section tone="navy2">
        <Container size="page">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="max-w-2xl font-display text-h2 font-bold text-ivory text-balance">
              Interiors and construction, from the same conversation.
            </h2>
            <p className="max-w-xl text-lead text-text-secondary">
              Deciding both at the same time means the structure, services and
              finishes are resolved together instead of negotiating against each
              other later.
            </p>
            <Button to={ROUTES.contact} variant="outline" size="lg">
              Talk it through
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default InteriorsPage;