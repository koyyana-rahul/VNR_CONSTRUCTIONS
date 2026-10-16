import { useState } from 'react';
import { Expand, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading } from '../common/Button.jsx';
import { DataNotice } from '../common/DataNotice.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { Modal } from '../motion/Modal.jsx';
import { gallery } from '../../data/home.js';

/**
 * ============================================================================
 * INSPIRATION GALLERY (reference section 9)
 * ============================================================================
 *
 * The brief is emphatic that these visuals are DEVELOPMENT VISUALS and must
 * not be presented as photographs of completed VNR projects. That is stated
 * in a visible notice above the grid, in each tile's alt text, and in the
 * lightbox caption.
 *
 * INTERACTION
 *   - Subtle zoom on hover (desktop only; `motion-safe` and a scale that
 *     cannot shift layout).
 *   - Gold border accent intensifies on hover/focus.
 *   - Every tile is a real <button>, so the gallery is keyboard-operable.
 *   - The lightbox is the shared <Modal>, giving Escape, focus trap, focus
 *     restoration, scroll locking and arrow-key navigation for free.
 *
 * GRID: 2 columns on mobile (images stay readable — 3 at 320px would be
 * ~90px each), 3 from `lg`. The first tile spans two columns on wide screens
 * so the row does not read as a mechanical grid.
 */
export function Gallery() {
  const [index, setIndex] = useState(null);
  const isOpen = index !== null;

  const step = (delta) =>
    setIndex((i) => (i === null ? i : (i + delta + gallery.items.length) % gallery.items.length));

  return (
    <Section id="gallery" tone="navy2">
      <Container size="page">
        <Reveal>
          <SectionHeading
            title={gallery.title}
            align="center"
          />
        </Reveal>

        {gallery.isPlaceholder && (
          <DataNotice
            tone="dark"
            title="Development visuals — not VNR project photography"
            className="mx-auto mt-8 max-w-3xl"
          >
            {gallery.note}
          </DataNotice>
        )}

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {gallery.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={Math.min(i, 5) * 55}
              className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : undefined}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Enlarge image ${i + 1} of ${gallery.items.length}: ${item.alt}`}
                className={[
                  'group relative block w-full overflow-hidden rounded-sm border border-gold/25',
                  'transition-[border-color,box-shadow] duration-300',
                  'hover:border-gold-medium focus-visible:border-gold',
                  'motion-reduce:transition-none',
                ].join(' ')}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width="1200"
                  height="900"
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={[
                    'w-full object-cover transition-transform duration-500 ease-[var(--ease-architectural)]',
                    'motion-safe:group-hover:scale-[1.04] motion-reduce:transform-none',
                    i === 0 ? 'aspect-[4/3] lg:aspect-square' : 'aspect-[4/3]',
                  ].join(' ')}
                />

                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center bg-navy/0 transition-colors duration-300 group-hover:bg-navy/45"
                >
                  <span className="grid size-11 scale-75 place-items-center rounded-full bg-ivory/95 text-navy opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none">
                    <Expand className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </Container>

      {/* ---- Lightbox ---- */}
      <Modal
        open={isOpen}
        onClose={() => setIndex(null)}
        title={gallery.title}
        description={
          isOpen
            ? `Image ${index + 1} of ${gallery.items.length}: ${gallery.items[index].alt}`
            : undefined
        }
        variant="center"
        size="lg"
      >
        <div className="relative">
          <img
            key={gallery.items[index ?? 0].src}
            src={gallery.items[index ?? 0].src}
            alt={gallery.items[index ?? 0].alt}
            width="1600"
            height="1200"
            className="max-h-[55dvh] w-full rounded-sm object-contain"
          />

          {gallery.items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-gold-medium bg-navy/80 text-gold transition-colors hover:bg-navy hover:text-gold-light"
              >
                <ChevronLeft className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-gold-medium bg-navy/80 text-gold transition-colors hover:bg-navy hover:text-gold-light"
              >
                <ChevronRight className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        <p className="mt-4 text-fine text-text-muted">{gallery.note}</p>
      </Modal>
    </Section>
  );
}

export { X };
export default Gallery;