import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { IconBadge } from '../common/IconBadge.jsx';
import { Stagger, StaggerItem } from '../motion/Reveal.jsx';
import { highlights } from '../../data/home.js';

/**
 * ============================================================================
 * HIGHLIGHTS STRIP (reference section 4)
 * ============================================================================
 * Four supplied highlights on a navy gradient.
 *
 * Responsive: 2 columns on a phone, 4 from `lg`.
 *
 * WHY TWO COLUMNS FROM 320px, NOT ONE
 * -----------------------------------
 * This used to read `grid-cols-1 xs:grid-cols-2 sm:gap-10 lg:grid-cols-4`, and
 * `xs` is 480px. On a 375-390px phone — the single most common viewport there
 * is — every highlight therefore stacked full width: a 56px badge, a one-line
 * heading and a one-line description each repeated down the page with a 32px
 * gap between. Measured at 390px that is 880px of column for roughly 190px of
 * information: a full extra screen of scrolling before the services section
 * even starts, filled with whitespace and nothing else.
 *
 * The headings are short ("Quality Materials", "Modern Designs", "Hyderabad
 * Service"), so two of them fit a 171px column without truncating anything.
 * The one that does wrap — "Construction & Interiors" — wraps to two lines
 * inside its own cell, which is what a grid row is for.
 *
 * The badge drops from `xl` to `lg` on the narrowest band only, because at
 * 56px a badge is a third of a 171px column; 48px keeps the optical weight of
 * the icon identical to every other badge on the site (IconBadge holds the
 * container:glyph ratio constant) without dominating a phone-width cell.
 */
export function Highlights() {
  return (
    <Section id="highlights" tone="navyGradient" spacing="tight" className="border-b border-border-dark">
      <Container size="page">
        <Stagger className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-10">
          {highlights.map((item) => (
            <StaggerItem key={item.id} className="group flex flex-col text-center">
              {/* Centred, so the badge itself carries the centring — the `mx-auto`
                  wrapper keeps the highlight strip balanced without needing a
                  text-align hack on the column. */}
              <IconBadge
                name={item.icon}
                size="xl"
                interactive
                className="mx-auto max-[399px]:size-12 max-[399px]:[&_svg]:size-5"
              />

              {/* `mt-auto` on the description pins every description to the
                  BOTTOM of its grid row. Without it the three-line
                  "Construction & Interiors" heading pushed its own
                  description 24px below its one-line neighbour's, and the row
                  read as two unrelated blocks instead of a pair. Titles stay
                  top-aligned under the badge; descriptions line up. */}
              <h3 className="mt-4 text-balance font-display text-[1.0625rem] font-bold text-ivory sm:text-h4">
                {item.title}
              </h3>
              <p className="mt-auto pt-1.5 text-fine text-text-muted sm:pt-2">
                {item.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Highlights;