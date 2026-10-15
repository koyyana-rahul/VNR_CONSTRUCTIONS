import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading, Button } from '../common/Button.jsx';
import { Accordion } from '../common/Accordion.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { faqs } from '../../data/faqs.js';
import { ROUTES } from '../../config/site.js';

/**
 * FAQ section.
 * The first item is open by default so the section never presents as an empty
 * list on arrival — it demonstrates both the content and the interaction.
 */
export function FaqSection({ limit, id = 'faq' }) {
  const items = limit ? faqs.slice(0, limit) : faqs;

  return (
    <Section id={id} tone="navy">
      <Container size="page">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Sticky only on desktop — a sticky sidebar needs real height, so it
              is hidden on mobile rather than creating a janky scroll trap. */}
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                eyebrow="Questions"
                title="Straight answers before you commit."
                as="h2"
              />
              <p className="mt-5 max-w-sm text-fine leading-relaxed text-text-muted">
                If something is not covered here, ask during the consultation. It
                is always cheaper to settle a question at the start than halfway
                through a build.
              </p>
              <Button to={ROUTES.contact} variant="outline" size="sm" className="mt-6">
                Ask a question
              </Button>
            </div>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-8">
            <Accordion items={items} defaultOpenIds={items[0] ? [items[0].id] : []} tone="dark" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default FaqSection;