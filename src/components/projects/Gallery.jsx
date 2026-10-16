import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { PhotoPending } from '../common/PhotoPending.jsx';
import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * PROJECT IMAGE GALLERY
 * ============================================================================
 *
 * GRID — 1 column at 320px (a two-up grid at that width gives ~130px images,
 * which is unusable), 2 columns from `sm`, 3 from `lg`. Every tile is a real
 * <button>, so the gallery is fully operable by keyboard and announced
 * correctly; the stretched pseudo-element gives each tile a large tap target.
 *
 * LIGHTBOX — dialog pattern:
 *   - role="dialog" aria-modal, labelled
 *   - body scroll locked
 *   - Escape closes
 *   - Arrow keys navigate; Home/End jump to first/last
 *   - focus trapped inside, and restored to the originating tile on close
 *   - counter and caption are exposed as text, not just an image swap
 */
export function Gallery({ images, title }) {
  const [index, setIndex] = useState(null); // null = closed
  const isOpen = index !== null;
  const triggerRefs = useRef([]);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const close = useCallback(() => {
    const previous = index;
    setIndex(null);
    // Return focus to the tile that opened the lightbox.
    requestAnimationFrame(() => triggerRefs.current[previous]?.focus());
  }, [index]);

  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      switch (event.key) {
        case 'Escape': event.preventDefault(); close(); break;
        case 'ArrowRight': event.preventDefault(); step(1); break;
        case 'ArrowLeft': event.preventDefault(); step(-1); break;
        case 'Home': event.preventDefault(); setIndex(0); break;
        case 'End': event.preventDefault(); setIndex(images.length - 1); break;
        default: break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close, step, images.length]);

  // Focus trap inside the dialog.
  useEffect(() => {
    if (!isOpen) return undefined;
    const node = dialogRef.current;
    if (!node) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...node.querySelectorAll('button')].filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => node.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!images?.length) {
    // No verified photography yet. Rather than render fabricated elevations or
    // nothing at all, state the gap once, at full width, in the same plate the
    // cards use — so the detail page is consistent with the portfolio grid.
    return (
      <PhotoPending
        ratio="16/9"
        tone="light"
        label="Photography pending"
        title="Site photography for this project has not been supplied yet"
        caption="VNR publishes project photographs once the shoot is approved and the record is verified."
      />
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {images.map((image, i) => (
          <li key={`${image.src}-${i}`}>
            <button
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'group relative block w-full overflow-hidden rounded-sm border border-line bg-brand-white',
                'transition-[border-color,box-shadow] duration-300 hover:border-brand-gold/60 hover:shadow-lift',
                'motion-reduce:transition-none',
                // First tile leads the grid on wide screens.
                i === 0 && 'lg:col-span-2 lg:row-span-2',
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                width="1200"
                height="800"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={cn(
                  'w-full object-cover transition-transform duration-500 ease-[var(--ease-architectural)] motion-reduce:transform-none',
                  'group-hover:scale-[1.03]',
                  i === 0 ? 'aspect-[16/10] lg:aspect-[16/9]' : 'aspect-[16/10]',
                )}
              />

              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-brand-deep/0 transition-colors duration-300 group-hover:bg-brand-deep/35"
              >
                <span className="grid size-11 scale-75 place-items-center rounded-full bg-brand-white/95 text-brand-black opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none">
                  <Expand className="size-4" strokeWidth={2} />
                </span>
              </span>

              <span className="sr-only">
                View image {i + 1} of {images.length}: {image.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* ---- Lightbox ---- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          role="presentation"
        >
          <div
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 bg-brand-deep/92 backdrop-blur-sm"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — image viewer`}
            className="on-dark relative z-10 flex max-h-dvh w-full max-w-6xl flex-col p-3 sm:p-6"
          >
            {/* Header */}
            <div className="mb-3 flex shrink-0 items-center justify-between gap-4">
              <p className="min-w-0 text-fine text-white/70">
                <span className="tabular-nums text-brand-gold-light">
                  {index + 1} / {images.length}
                </span>
                <span className="mx-2 text-white/30">—</span>
                <span className="line-clamp-1">{images[index].alt}</span>
              </p>

              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close image viewer"
                className="grid size-11 shrink-0 place-items-center rounded-sm border border-white/20 text-white transition-colors hover:border-brand-gold hover:text-brand-gold-light"
              >
                <X className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Image */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <img
                key={images[index].src}
                src={images[index].src}
                alt={images[index].alt}
                width="1600"
                height="1067"
                className="max-h-[65dvh] w-auto max-w-full rounded-sm object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className="absolute left-0 grid size-11 -translate-x-0 place-items-center rounded-full border border-white/20 bg-brand-deep/70 text-white transition-colors hover:border-brand-gold hover:text-brand-gold-light sm:-translate-x-2 sm:size-12"
                  >
                    <ChevronLeft className="size-5" strokeWidth={2} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className="absolute right-0 grid size-11 place-items-center rounded-full border border-white/20 bg-brand-deep/70 text-white transition-colors hover:border-brand-gold hover:text-brand-gold-light sm:size-12"
                  >
                    <ChevronRight className="size-5" strokeWidth={2} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <ul className="mt-4 hidden shrink-0 justify-center gap-2 sm:flex">
                {images.map((image, i) => (
                  <li key={`thumb-${image.src}-${i}`}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-current={i === index ? 'true' : undefined}
                      className={cn(
                        'block h-12 w-20 overflow-hidden rounded-sm border-2 transition-colors',
                        i === index
                          ? 'border-brand-gold'
                          : 'border-transparent opacity-55 hover:opacity-100',
                      )}
                    >
                      <img
                        src={image.src}
                        alt=""
                        width="160"
                        height="107"
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;