import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * PHOTOGRAPHY PENDING PLATE
 * ============================================================================
 *
 * WHY THIS REPLACED 21 GENERATED "PROJECT PHOTOS"
 * ------------------------------------------------
 * `scripts/generate-images.mjs` produced project-01.svg … project-21.svg: a
 * seeded PRNG drew a different abstract elevation for each one. Rendered in the
 * portfolio they read as twenty-one photographs of twenty-one buildings VNR
 * had built. They were not photographs, they were not buildings, and the whole
 * grid implied work that has not been done.
 *
 * Drawing a twenty-second fake building would not fix that. Removing the
 * pretence does: a plate that says plainly that VNR's site photography is
 * pending is more trustworthy than a convincing lie, and it is the treatment a
 * serious builder would recognise immediately.
 *
 * The 21 SVGs are deleted, not orphaned. `scripts/media-manifest.mjs` records
 * exactly what to shoot and at what aspect ratio for each slot.
 *
 * DESIGN
 * ------
 * One component, two tones, so the same plate is correct in a white project
 * card and in the dark lightbox. It is drawn entirely in CSS — no image
 * request, no layout shift, no second asset to keep in sync — and it reserves
 * its box with an explicit aspect-ratio, which is what prevents the card grid
 * reflowing when real photographs arrive.
 *
 * ACCESSIBILITY
 * -------------
 * Decorative by default: the label is rendered as real text, so a screen
 * reader announces it rather than an empty box. Pass `label={false}` where the
 * surrounding card already explains the state.
 */

/* Blueprint grid. Two repeating gradients rather than a background image — it
   costs no request, never goes blurry, and recolours per tone. */
const GRID_LIGHT =
  'repeating-linear-gradient(0deg, rgba(22,35,46,0.055) 0 1px, transparent 1px 26px),' +
  'repeating-linear-gradient(90deg, rgba(22,35,46,0.055) 0 1px, transparent 1px 26px)';
const GRID_DARK =
  'repeating-linear-gradient(0deg, rgba(217,173,69,0.075) 0 1px, transparent 1px 26px),' +
  'repeating-linear-gradient(90deg, rgba(217,173,69,0.075) 0 1px, transparent 1px 26px)';

const TONES = {
  light: {
    plate: 'bg-surface-warm',
    grid: GRID_LIGHT,
    rule: 'border-brand-gold/35',
    glyph: 'text-brand-gold-muted',
    title: 'text-brand-black',
    sub: 'text-text-muted',
    badge: 'border-brand-gold/40 text-brand-gold-muted',
  },
  dark: {
    plate: 'bg-brand-deep',
    grid: GRID_DARK,
    rule: 'border-gold/30',
    glyph: 'text-gold',
    title: 'text-ivory',
    sub: 'text-text-muted',
    badge: 'border-gold/40 text-gold-light',
  },
};

export function PhotoPending({
  /** Aspect ratio for the reserved box, e.g. '16/10'. */
  ratio = '16/10',
  tone = 'light',
  /** Small line under the title — usually the project category. */
  caption,
  label = 'Photography pending',
  title = 'Site photography pending',
  className,
}) {
  const t = TONES[tone] ?? TONES.light;

  return (
    <div
      className={cn('relative isolate grid place-items-center overflow-hidden', t.plate, className)}
      style={{
        aspectRatio: ratio.replace('/', ' / '),
        backgroundImage: t.grid,
      }}
    >
      {/* Corner ticks — the drawing-board cue that ties this to the
          blueprint illustrations used elsewhere on the site. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-3 border-l border-t sm:inset-4',
          t.rule,
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-3 border-b border-r sm:inset-4',
          t.rule,
        )}
      />

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        {/* The crossed-out camera is unambiguous: this is a gap in the
            material, not a design flourish. */}
        <span
          aria-hidden="true"
          className={cn(
            'grid size-12 place-items-center rounded-full border',
            t.rule,
            t.glyph,
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M14.5 4h-5L8 6H4.5A1.5 1.5 0 0 0 3 7.5v11A1.5 1.5 0 0 0 4.5 20h15a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 19.5 6H16z" />
            <circle cx="12" cy="13" r="3.5" />
            <path d="m4 4 16 16" />
          </svg>
        </span>

        {label !== false && (
          <p
            className={cn(
              'font-sans text-[0.625rem] font-semibold uppercase tracking-[0.18em]',
              t.badge,
            )}
          >
            <span className="rounded-full border px-2.5 py-1">{label}</span>
          </p>
        )}

        {title && (
          <p className={cn('font-display text-sm font-bold leading-snug', t.title)}>
            {title}
          </p>
        )}

        {caption && (
          <p className={cn('max-w-[24ch] text-xs leading-relaxed', t.sub)}>{caption}</p>
        )}
      </div>
    </div>
  );
}

export default PhotoPending;