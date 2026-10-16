import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, CircleAlert } from 'lucide-react';
import { Seo } from '../components/common/Seo.jsx';
import { PageHero } from '../components/common/PageHero.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { DataNotice } from '../components/common/DataNotice.jsx';
import { Icon } from '../components/common/icons.jsx';
import { IconBadge } from '../components/common/IconBadge.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { getRelatedServices, getServiceBySlug } from '../data/services.js';
import { ROUTES } from '../config/site.js';

export function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <>
        <Seo path={ROUTES.services} noIndex />
        <Section tone="mist" spacing="loose">
          <Container size="page">
            <div className="mx-auto max-w-xl text-center">
              <h1 className="font-display text-h1 font-bold text-brand-black">
                Service not found
              </h1>
              <p className="mt-4 text-lead text-text">
                We could not find that service. Browse the full service list to
                choose another starting point.
              </p>
              <Button to={ROUTES.services} variant="goldGradient" size="lg" className="mt-8">
                View all services
              </Button>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const related = getRelatedServices(service);

  return (
    <>
      <Seo
        path={ROUTES.services}
        title={`${service.title} | ${'VNR Constructions'}`}
        description={service.summary}
        structuredData={{
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          provider: { '@type': 'Organization', name: 'VNR Constructions' },
        }}
      />

      <PageHero
        eyebrow={service.shortTitle}
        title={service.title}
        lead={service.summary}
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Services', to: ROUTES.services },
          { label: service.title },
        ]}
      />

      <Section tone="white">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-7">
              <div className="flex flex-col gap-5 text-lead text-text">
                {service.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Button to={ROUTES.contact} variant="goldGradient" size="lg" className="mt-8">
                Discuss this service
              </Button>
            </Reveal>

            <Reveal delay={80} className="lg:col-span-5">
              {/*
                An ICON, not an illustration.

                Eight service pages each carried a 1200x800 raster file holding a
                single oversized glyph on paper. That was a second icon style at
                a second size competing with the IconBadge system already used
                for these same services on the cards, the services rail and the
                contact rows — exactly the mixed-style problem the brief rules
                out. One icon, drawn once, at the one size used everywhere else.
              */}
              <div className="flex h-full items-center justify-center rounded-sm border border-line bg-surface-warm p-10">
                <IconBadge
                  name={service.icon}
                  size="xl"
                  tone="light"
                  strokeWidth={1.35}
                  shape="square"
                  label={`${service.title} — service category`}
                  className="size-24 sm:size-28"
                />
              </div>
            </Reveal>
          </div>

          {!service.confirmed && (
            <DataNotice tone="warning" title="Service details to confirm" className="mt-12">
              This page describes a proposed service structure for the website.
              VNR should confirm the exact offering, inclusions and exclusions
              before publication.
            </DataNotice>
          )}
        </Container>
      </Section>

      <Section tone="mist">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <SectionHeading
                title="A useful place to start"
                as="h2"
                lead="These are the decisions that usually shape the scope before work begins."
              />
              <ul className="mt-7 flex flex-col gap-3">
                {service.suitableFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fine text-text">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-gold-muted" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80} className="lg:col-span-7">
              <div className="rounded-sm border border-line bg-brand-white p-6 sm:p-8">
                <h3 className="font-display text-h3 font-bold text-brand-black">
                  Planning considerations
                </h3>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {service.planning.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-fine text-text">
                      <CircleAlert className="mt-0.5 size-4 shrink-0 text-brand-gold-muted" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container size="page">
          <Reveal>
            <SectionHeading title="How this work typically moves" as="h2" />
          </Reveal>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {service.process.map((stage, index) => (
              <StaggerItem key={stage.title} className="rounded-sm border border-line bg-surface-warm p-5">
                <span className="font-display text-label font-bold tracking-[0.16em] text-brand-gold-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-h4 font-bold text-brand-black">
                  {stage.title}
                </h3>
                <p className="mt-2 text-fine leading-relaxed text-text">{stage.detail}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="mist">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <SectionHeading title="Usually included" as="h2" />
              <ul className="mt-6 flex flex-col gap-3">
                {service.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fine text-text">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-gold-muted" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={80}>
              <SectionHeading title="Usually outside the scope" as="h2" />
              <ul className="mt-6 flex flex-col gap-3">
                {service.exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fine text-text">
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-brand-gold-muted" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="white" spacing="tight">
          <Container size="page">
            <Reveal>
              <SectionHeading title="Related services" as="h2" />
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`${ROUTES.services}/${item.slug}`}
                  className="group rounded-sm border border-line bg-surface-warm p-5 transition-colors hover:border-brand-gold/55"
                >
                  {/* Bare glyph on the light card rather than a badge — this rail
                      is already a list of links with their own titles, so a
                      container per item would add decoration without adding
                      hierarchy. Charcoal on ivory for legibility. */}
                  <Icon
                    name={item.icon}
                    className="size-5 text-[#1B2A36]"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <span className="mt-4 block font-display text-h4 font-bold text-brand-black">
                    {item.title}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-muted">
                    Explore service
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

export default ServiceDetail;
