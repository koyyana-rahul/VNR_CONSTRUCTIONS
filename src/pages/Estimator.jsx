import { Seo } from '../components/common/Seo.jsx';
import { PageHero } from '../components/common/PageHero.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { CostEstimator } from '../components/estimator/CostEstimator.jsx';
import { DataNotice } from '../components/common/DataNotice.jsx';
import { FaqSection } from '../components/home/FaqSection.jsx';
import { CtaBanner } from '../components/home/CtaBanner.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { ROUTES } from '../config/site.js';
import { ESTIMATOR_RATE_NOTICE, rateIsVerified } from '../config/estimator.js';

/** /estimate — the full-page cost estimator. */
export function Estimator() {
  return (
    <>
      <Seo path={ROUTES.estimate} />

      <PageHero
        eyebrow="Cost estimator"
        title="Work out whether your project is within reach."
        lead="Adjust area, specification and contingency to see a live indicative figure. It is a planning tool, not a quotation — but it will tell you quickly whether the numbers need rethinking."
        breadcrumbs={[{ label: 'Home', to: ROUTES.home }, { label: 'Cost Estimator' }]}
      />

      <Section tone="white">
        <Container size="page">
          {!rateIsVerified && (
            <DataNotice tone="warning" title="Illustrative rates — not VNR prices" className="mb-8">
              {ESTIMATOR_RATE_NOTICE}
            </DataNotice>
          )}

          <CostEstimator />
        </Container>
      </Section>

      <Section tone="mist">
        <Container size="prose">
          <Reveal>
            <h2 className="font-display text-h2 font-bold text-brand-black text-balance">
              How to read these numbers
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="mt-5 flex flex-col gap-4 text-lead text-text">
              <p>
                The figure is built the same way a quantity surveyor would build
                it: your area multiplied by a rate for the construction type and
                specification you selected, plus any additional scope, plus a
                contingency reserve.
              </p>
              <p>
                What it cannot tell you is what your specific plot needs. Soil
                conditions, access for materials, drainage and how much is below
                ground can each move a real project substantially — which is why
                the online figure is a planning range and a site visit is what
                turns it into a price.
              </p>
              <p>
                If the number comes out higher than you expected, that is useful
                information now rather than a surprise later. It is usually better
                to adjust the specification or the phasing than to start a build
                that cannot be finished.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <FaqSection limit={5} id="estimate-faq" />

      <CtaBanner />
    </>
  );
}

export default Estimator;