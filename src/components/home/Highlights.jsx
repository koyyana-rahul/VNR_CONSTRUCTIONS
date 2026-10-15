import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { Icon } from '../common/icons.jsx';
import { Stagger, StaggerItem } from '../motion/Reveal.jsx';
import { highlights } from '../../data/home.js';

/**
 * ============================================================================
 * HIGHLIGHTS STRIP (reference section 4)
 * ============================================================================
 * Four supplied highlights on a navy gradient.
 *
 * Responsive: 1 column on very narrow viewports, 2 on small/tablet, 4 on wide.
 * The circular gold-outline symbols are decorative; the accessible content is
 * the heading and description text, so nothing depends on the icon rendering.
 */
export function Highlights() {
  return (
    <Section id="highlights" tone="navyGradient" spacing="tight" className="border-b border-border-dark">
      <Container size="page">
        <Stagger className="grid grid-cols-1 gap-8 xs:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {highlights.map((item) => (
            <StaggerItem key={item.id} className="text-center">
              <span
                aria-hidden="true"
                className="mx-auto grid size-14 place-items-center rounded-full border border-gold/45 text-gold"
              >
                <Icon name={item.icon} className="size-6" strokeWidth={1.5} />
              </span>

              <h3 className="mt-5 font-display text-h4 font-bold text-ivory">
                {item.title}
              </h3>
              <p className="mt-2 text-fine text-text-muted">{item.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Highlights;