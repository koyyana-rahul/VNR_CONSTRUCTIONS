import { Link, useLocation } from 'react-router-dom';
import { Seo } from '../components/common/Seo.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading } from '../components/common/Button.jsx';
import { ContactSection } from '../components/home/ContactSection.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { ROUTES } from '../config/site.js';

/**
 * CONTACT PAGE — the same consultation surface as the homepage section, given
 * a full page so it is reachable from the nav and has room to breathe.
 */
export function Contact() {
  useLocation(); // keeps scroll/route handling centralised in Layout

  return (
    <>
      <Seo path={ROUTES.contact} />

      <div className="bg-navy pt-16 pb-4 sm:pt-20 lg:pt-24">
        <Container size="page">
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title="Tell Us About Your Project."
              as="h1"
              lead="Share your plot, budget and timeline. We will come back with a clear next step, with no obligation to proceed."
              align="center"
            />
          </Reveal>
        </Container>
      </div>

      <ContactSection />

      <Section tone="navy2" spacing="tight">
        <Container size="page">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="max-w-2xl font-display text-h2 font-bold text-ivory text-balance">
              Not ready to talk yet? Get a sense of the numbers.
            </h2>
            <p className="max-w-xl text-lead text-text-secondary">
              The cost estimator turns your area and specification into an
              indicative budget in about fifteen seconds.
            </p>
            <Link
              to={ROUTES.estimate}
              className="mt-2 inline-flex min-h-11 items-center rounded-sm font-sans text-sm font-semibold text-gold underline underline-offset-4 transition-colors hover:text-gold-light"
            >
              Open the cost estimator
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default Contact;