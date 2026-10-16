import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { Seo } from '../components/common/Seo.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { IconBadge } from '../components/common/IconBadge.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { SourceCopyPending } from '../components/common/SourceCopyPending.jsx';
import { services } from '../data/home.js';
import { ROUTES } from '../config/site.js';

/**
 * SERVICES PAGE — the six supplied services as full sections, with the process
 * and interiors steps summarised underneath so the page is genuinely useful
 * rather than a repeat of the homepage.
 */
export function Services() {
  return (
    <>
      <Seo path={ROUTES.services} />

      <div className="bg-navy pt-16 sm:pt-20 lg:pt-24">
        <Container size="page">
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title="Complete Solutions for Your Home"
              as="h1"
              lead="From the structure to the finishing details, explore services that help turn your ideas into a considered plan for your home."
            />
          </Reveal>

          <Stagger
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.06}
          >
            {services.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <article className="glass-card group relative flex h-full flex-col rounded-sm p-6 transition-[border-color,transform] duration-300 hover:-translate-y-[3px] hover:border-gold-medium motion-reduce:transform-none motion-reduce:hover:translate-y-0">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 bg-gold/45"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <IconBadge name={service.icon} size="lg" interactive />
                    <span className="font-display text-h3 font-bold tabular-nums text-gold/40">
                      {service.number}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-h4 font-bold text-ivory">
                    {service.title}
                  </h2>

                  {service.description ? (
                    <p className="mt-3 flex-1 text-fine leading-relaxed text-text-muted">
                      {service.description}
                    </p>
                  ) : (
                    <div className="mt-3 flex-1">
                      <SourceCopyPending label="Service description" />
                    </div>
                  )}

                  <Link
                    to={ROUTES.contact}
                    className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-sm font-sans text-sm font-semibold text-gold transition-colors hover:text-gold-light"
                    aria-label={`Enquire about ${service.title}`}
                  >
                    Enquire about this
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </div>

      <Section tone="navy2">
        <Container size="page">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="max-w-2xl font-display text-h2 font-bold text-ivory text-balance">
              Not sure which service you need?
            </h2>
            <p className="max-w-xl text-lead text-text-secondary">
              Start with a conversation. We will tell you what the project
              actually needs, whether that is work you have listed here or
              something we have not covered yet.
            </p>
            <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Button
                to={ROUTES.contact}
                variant="goldGradient"
                size="lg"
                fullWidth
                className="sm:w-auto"
              >
                Book a Consultation
              </Button>
              <Button
                to={ROUTES.process}
                variant="outline"
                size="lg"
                fullWidth
                className="sm:w-auto"
                icon={<Check className="size-4" />}
              >
                See our process
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default Services;