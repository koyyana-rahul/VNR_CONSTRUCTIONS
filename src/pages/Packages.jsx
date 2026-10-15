import { Seo } from '../components/common/Seo.jsx';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/common/PageHero.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { DataNotice } from '../components/common/DataNotice.jsx';
import { ScopeComparison } from '../components/packages/ScopeComparison.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { CtaBanner } from '../components/home/CtaBanner.jsx';
import { ROUTES } from '../config/site.js';
import { scopeOptions, countCapabilities, officialPackagesAvailable } from '../data/packages.js';
import { services } from '../data/services.js';

/**
 * /packages
 *
 * VNR has not published priced packages, so rather than fabricate a price card
 * this page presents the SCOPE comparison tool — which is the actual decision a
 * plot owner makes before approaching any builder.
 *
 * The page says plainly that prices are issued as a written quotation after a
 * site visit, and why: a per-square-foot price without knowing the plot is not
 * a price, it is a guess with a currency symbol on it.
 */
export function Packages() {
  return (
    <>
      <Seo path={ROUTES.packages} />

      <PageHero
        eyebrow="Scope options"
        title="Decide how much of the build you want to hand over."
        lead="Before anyone can quote a price, you have to decide what you actually want VNR to take on. Compare the scopes below, then use the estimator to see what each might mean in practice."
        breadcrumbs={[{ label: 'Home', to: ROUTES.home }, { label: 'Scope Options' }]}
      />

      <Section tone="white">
        <Container size="page">
          {!officialPackagesAvailable && (
            <DataNotice tone="info" title="Why there are no prices here" className="mb-10">
              VNR Constructions has not published a fixed rate card, and a
              per-square-foot figure without knowing your plot would be a guess
              with a currency symbol on it. Soil, access, drainage and how much
              is below ground move the real number more than finishes do. So we
              compare what is <strong>covered</strong> — and a written
              quotation, issued after a site visit, is what turns that into a
              price.
            </DataNotice>
          )}

          {/* ---- Card overview ---- */}
          <Reveal>
            <SectionHeading
              eyebrow="The options"
              title="Three scopes, from envelope to turnkey."
              as="h2"
              align="center"
            />
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {scopeOptions.map((option, index) => (
              <StaggerItem
                key={option.id}
                className="flex h-full flex-col rounded-sm border border-line bg-brand-white p-6 sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-label font-bold tracking-[0.16em] text-brand-gold-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="rounded-full border border-line bg-brand-warm px-2.5 py-1 font-display text-[0.6875rem] font-bold tabular-nums text-text">
                    {countCapabilities(option)}/
                    {Object.keys(option.capabilities).length} covered
                  </span>
                </div>

                <h3 className="mt-4 font-display text-h3 font-bold text-brand-black">
                  {option.title}
                </h3>
                <p className="mt-1.5 text-fine font-semibold text-brand-gold-muted">
                  {option.tagline}
                </p>
                <p className="mt-3 flex-1 text-fine leading-relaxed text-text">
                  {option.summary}
                </p>

                <dl className="mt-5 space-y-3 border-t border-line pt-5 text-fine">
                  <div>
                    <dt className="font-semibold text-brand-black">Best for</dt>
                    <dd className="mt-0.5 text-text">{option.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-brand-black">Programme</dt>
                    <dd className="mt-0.5 text-text">{option.durationNote}</dd>
                  </div>
                </dl>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ---- Comparison tool ---- */}
      <Section tone="mist">
        <Container size="page">
          <Reveal>
            <SectionHeading
              eyebrow="Compare"
              title="Put any two scopes side by side."
              as="h2"
              lead="Rows that differ between the two options are highlighted, so the real decision points stand out."
            />
          </Reveal>

          <div className="mt-10">
            <ScopeComparison />
          </div>

          <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button to={ROUTES.estimate} variant="gold" size="lg" fullWidth className="sm:w-auto">
              Estimate the cost
            </Button>
            <Button to={ROUTES.contact} variant="outline" size="lg" fullWidth className="sm:w-auto">
              Ask which fits your plot
            </Button>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Services that change the picture ---- */}
      <Section tone="white">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              <SectionHeading
                eyebrow="Alongside this"
                title="Services that sit alongside the scope."
                as="h2"
                lead="Scope selection assumes you know what else the project needs. These are the services that most often pair with each option."
              />
            </Reveal>

            <Reveal delay={80} className="lg:col-span-7">
              <ul className="flex flex-col gap-3">
                {services
                  .filter((s) =>
                    ['renovation', 'interiors-finishing', 'construction-consultation'].includes(
                      s.id,
                    ),
                  )
                  .map((service) => (
                    <li key={service.id}>
                      <Link
                        to={`${ROUTES.services}/${service.slug}`}
                        className="group flex items-start gap-4 rounded-sm border border-line bg-brand-warm p-5 transition-colors hover:border-brand-gold/55"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-h4 font-bold text-brand-black transition-colors group-hover:text-brand-gold-muted">
                            {service.title}
                          </span>
                          <span className="mt-1 block text-fine text-text">
                            {service.summary}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}

export default Packages;