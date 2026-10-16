import { cn } from '../../utils/cn.js';
import { company } from '../../config/company.js';

/**
 * ============================================================================
 * LOGO — renders the supplied artwork, never redraws it
 * ============================================================================
 *
 * THE SIZING CONTRACT, AND THE TRAP IN IT
 * --------------------------------------
 * `className` is applied to the WRAPPER `<span>`, not to the `<img>`. The image
 * carries its own explicit inline width/height style, so a width utility passed
 * via `className` silently does nothing to the artwork.
 *
 * That is not theoretical. The header and the mobile drawer were both given
 * `w-[13rem]` through `className`, and the logo rendered at the 4.5rem default
 * at every viewport — a ladder that generated CSS correctly and changed
 * nothing. Size the ARTWORK with the `width` prop (`var(--logo-w)`,
 * `clamp(...)` or a px number); use `className` only for flex/margin concerns.
 *
 * `width` is the primary axis because a design spec talks about logo width.
 * `height: auto` then derives the height from the asset's own intrinsic
 * width/height attributes, so the ratio cannot drift. Pass `width` OR `height`,
 * never both — giving both hard-codes the ratio in CSS where it would silently
 * rot the next time the artwork changed.
 *
 * Other rules, all still enforced here:
 *
 * 1. NO CROPPING — `object-contain`, never `object-cover`.
 *
 * 2. NO RECOLOURING — no CSS filter, no blend mode, no mask.
 *
 * 3. BACKGROUND — the artwork is an opaque white field, verified by sampling
 *    the rendered corner pixel (rgb(254, 254, 254)) and by the PNG colour type
 *    (2 = RGB, no alpha channel). That white cannot be removed: the source is a
 *    flattened JPEG, so removing it would mean thresholding the mark itself,
 *    which is recolouring the brand and is forbidden.
 *
 *    What CAN be changed is whether it reads as an accident. Rendered raw, the
 *    file is a hard-edged WHITE RECTANGLE sitting in a midnight-navy header —
 *    the loudest shape in the chrome, on every page, and the first thing that
 *    makes the site look unfinished rather than designed.
 *
 *    So the field is treated as an intentional brand chip: clipped to a rounded
 *    corner and given a hairline edge plus a soft drop shadow, it reads as a
 *    deliberate plate holding the mark, and the same treatment applies
 *    identically in the header, the drawer, the footer and the About plate so
 *    it is a component decision rather than four separate accidents.
 *
 *    scripts/build-logo-assets.mjs also trims the even white margin at build
 *    time, so the visible padding around the lettering is ~20px of source
 *    pixels, not a box drawn here.
 *
 * 4. ONE ASSET, ONE COMPONENT. The same file and the same ratio are used in
 *    the header, the drawer, the footer and the About plate. Only the width
 *    token differs per context.
 */
/**
 * Alt text for the logo.
 *
 * This used to be `${company.name} — Building Better Tomorrows`, read off the
 * PREVIOUS artwork, which was a stacked lockup carrying that tagline. The
 * supplied replacement is a horizontal monogram-and-wordmark lockup with NO
 * tagline in it, so that string was announcing words a screen-reader user could
 * not see anywhere in the image — a mismatch, not a nicety.
 *
 * An accessible name also has to work inside the header's link, which already
 * carries `aria-label="VNR Constructions — home"`. A bare, accurate description
 * of the mark is correct in both places; the tagline is editorial copy that
 * lives in the footer heading, where it is real text.
 */
const LOGO_ALT = 'VNR Constructions logo';

/** Fallback for any call site that passes neither axis. */
const DEFAULT_HEIGHT = '4.5rem';

/**
 * THE PLATE.
 *
 * One `overflow-hidden` + one compound shadow does all of it: the rounded clip
 * turns the baked-in white field into a chip, the inset hairline gives the
 * white an edge against navy (which white-on-navy otherwise has none of), and
 * the drop shadow lifts it off the surface.
 *
 * It is written as an explicit `box-shadow` compound rather than `ring-1
 * ring-inset` because `ring-inset` is not a Tailwind v4 utility — v4 replaced
 * it with `inset-ring-*`, so the older spelling silently compiles to nothing.
 * An arbitrary box-shadow is exact and cannot rot on a framework upgrade.
 *
 * `plate={false}` opts out, for any future context that needs the raw field.
 */
const PLATE_CLASS =
  'overflow-hidden rounded-[7px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12),0_2px_10px_-4px_rgb(0_0_0/0.55)]';

export function Logo(props) {
  const { className, width, height, decorative = false, alt, plate = true } = props;
  const { src, width: intrinsicW, height: intrinsicH } = company.logo;

  // Driving by height is the fallback: keep `height` as the default so every
  // existing call site keeps working unchanged.
  const box = width
    ? { width: typeof width === 'number' ? `${width}px` : width, height: 'auto' }
    : {
        height: typeof height === 'number' ? `${height}px` : (height ?? DEFAULT_HEIGHT),
        width: 'auto',
      };

  return (
    <span className={cn('inline-flex shrink-0 items-center', plate && PLATE_CLASS, className)}>
      <img
        src={src}
        alt={decorative ? '' : (alt ?? LOGO_ALT)}
        /* The true intrinsic box of the delivered asset (846x596). The old
           210x56 reservation was a 3.75:1 box around 1.4195:1 artwork, which
           shifted the header as soon as the image decoded. */
        width={intrinsicW}
        height={intrinsicH}
        style={{ ...box, maxWidth: 'none' }}
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
