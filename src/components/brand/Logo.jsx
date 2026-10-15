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
 * 4. BACKGROUND AWARENESS — if the supplied file has a WHITE background
 *    (`company.logo.variant === 'light'`), it is only ever placed on a light
 *    surface. On dark surfaces it is wrapped in a white plate, so you see the
 *    logo rather than a white rectangle floating in navy. Supplying a verified
 *    transparent file and setting variant to 'transparent' removes the plate.
 *
 * 5. SIZING USES INLINE CSS, NOT UTILITY CLASSES.
 *    An earlier version built the class with `h-[${value}]` from a prop. That
 *    is invisible to Tailwind's static scanner, so the utility was never
 *    generated — and the logo silently rendered at its full 320px intrinsic
 *    width, overflowing a 320px header by 76px. Inline styles cannot be purged,
 *    so they cannot fail this way. Any `clamp()` also works directly.
 *
 * 6. MEANINGFUL ALT TEXT — passes through, defaulting to the company name.
 */
export function Logo({
  className,
  /**
   * CSS length. A number is treated as px; a string is used as-is, so
   * `clamp(1.9rem, 1.2rem + 1.3vw, 2.5rem)` works and scales fluidly.
   */
  height = 'clamp(1.9rem, 1.2rem + 1.3vw, 2.5rem)',
  onDark = false,
  decorative = false,
  alt,
}) {
  const { src, width, height: intrinsicH, variant } = company.logo;

  const img = (
    <img
      src={src}
      alt={decorative ? '' : (alt ?? `${company.name} logo`)}
      /* Intrinsic size reserves the box before decode, preventing layout shift. */
      width={width}
      height={intrinsicH}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: 'auto',
        maxWidth: 'none',
      }}
      decoding="async"
      className={cn(
        'object-contain',
        'transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none',
      )}
    />
  );

  const useWhitePlate = onDark && variant !== 'transparent';

  if (useWhitePlate) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center rounded-sm bg-white px-4 py-3',
          className,
        )}
      >
        {img}
      </span>
    );
  }

  return (
    <span className={cn('inline-flex shrink-0 items-center', className)}>{img}</span>
  );
}

export default Logo;