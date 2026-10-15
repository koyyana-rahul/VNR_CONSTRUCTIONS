import { cn } from '../../utils/cn.js';
import { company } from '../../config/company.js';

/**
 * ============================================================================
 * LOGO — renders the supplied artwork, never redraws it
 * ============================================================================
 *
 * Rules enforced here:
 *
 * 1. ASPECT RATIO IS LOCKED — the width is always `auto`, so the image scales
 *    from whichever height applies and can never be stretched or squashed.
 *
 * 2. NO CROPPING — `object-contain`, never `object-cover`.
 *
 * 3. NO RECOLOURING — no CSS filter, no blend mode, no mask.
 *
 * 4. BACKGROUND — the artwork has a WHITE background, verified by sampling the
 *    rendered corner pixel (rgb(255, 255, 255)). That white is intentional and
 *    belongs to the original design, so it is preserved rather than removed, and
 *    the even margin around the lettering is baked into the asset's own viewBox
 *    (see scripts/build-logo-assets.mjs).
 *
 *    This component therefore renders NO box of its own — no fill, no border,
 *    no shadow, no padding. An earlier version wrapped the image in a bordered,
 *    padded white plate; once the dead whitespace was removed from the asset
 *    that plate was purely decorative chrome, so it is gone. What you see around
 *    the lettering is the logo's own white.
 *
 *    The monogram is near-black and the header is midnight navy — roughly 1.3:1,
 *    i.e. invisible without a light field. That is a property of the supplied
 *    artwork and cannot be corrected with CSS without recolouring the brand.
 *
 * 5. SIZING USES INLINE CSS, NOT UTILITY CLASSES.
 *    An earlier version built the class with `h-[${value}]` from a prop. That
 *    is invisible to Tailwind's static scanner, so the utility was never
 *    generated — and the logo silently rendered at its full 320px intrinsic
 *    width, overflowing a 320px header by 76px. Inline styles cannot be purged,
 *    so they cannot fail this way. Any `clamp()` also works directly.
 *
 * 6. ONE ASSET, ONE COMPONENT. The complete lockup — monogram, CONSTRUCTION and
 *    the BUILDING BETTER TOMORROWS tagline — is used at every size, in the
 *    header, drawer, footer and About panel. There is no second variant, so no
 *    context can drift or crop a band of the artwork.
 */
/**
 * The tagline rendered INSIDE the supplied logo artwork, read from the image
 * itself: "BUILDING BETTER TOMORROWS" (measured band 3 of the lockup).
 *
 * Deliberately NOT `company.tagline`, which is the site's editorial slogan
 * ("Building Your Vision Into Reality.") and differs. Alt text has to describe
 * the pixels of this image; a screen-reader user hearing the editorial slogan
 * while looking at a logo stamped with different words is a mismatch, not a
 * nicety. If the brand ever settles on one line, change it in both places.
 */
const LOGO_ARTWORK_TAGLINE = 'Building Better Tomorrows';

export function Logo({
  className,
  /**
   * CSS length — the artwork's rendered HEIGHT. A number is px; a string is
   * used as-is, so `clamp(3.75rem, 2rem + 3vw, 4.75rem)` scales fluidly.
   *
   * Always pass the HEIGHT, never the width. The lockup is stacked at 1.419:1,
   * so driving it by height keeps the aspect locked and the width follows.
   */
  height = 'clamp(3.75rem, 2rem + 3vw, 4.75rem)',
  decorative = false,
  alt,
}) {
  const { src, width, height: intrinsicH } = company.logo;

  return (
    <span className={cn('inline-flex shrink-0 items-center', className)}>
      <img
        src={src}
        alt={decorative ? '' : (alt ?? `${company.name} — ${LOGO_ARTWORK_TAGLINE}`)}
        /* The true intrinsic box of the delivered asset. The old 210x56
            reservation was a 3.75:1 box around 1.419:1 artwork, which shifted
            the header as soon as the image decoded. */
        width={width}
        height={intrinsicH}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: 'auto',
          maxWidth: 'none',
        }}
        decoding="async"
        className={cn(
          'shrink-0 object-contain',
          'transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none',
        )}
      />
    </span>
  );
}

export default Logo;
