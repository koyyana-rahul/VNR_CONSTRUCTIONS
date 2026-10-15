import { useState } from 'react';
import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * RESPONSIVE IMAGE
 * ============================================================================
 * Wraps a plain <img> with three guarantees:
 *
 * 1. NO LAYOUT SHIFT — width/height attributes plus an aspect-ratio box are
 *    always applied, so the slot is reserved before the bitmap decodes.
 * 2. NO BROKEN ASPECT RATIOS — the frame has a fixed ratio and the image uses
 *    object-cover, so a mismatched source can never distort the grid.
 * 3. LAZY BY DEFAULT — everything below the fold defers. The hero opts out
 *    with `priority` so it is fetched immediately.
 *
 * `objectPosition` accepts CSS object-position keywords so a portrait phone
 * can crop a landscape photo around the subject rather than through it.
 */
export function SmartImage({
  src,
  alt,
  ratio = '3/2',
  priority = false,
  sizes = '100vw',
  width = 1200,
  height = 800,
  className,
  imgClassName,
  objectPosition = 'center',
  rounded = false,
  overlay = null,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-brand-mist',
        rounded && 'rounded-sm',
        className,
      )}
      style={{ aspectRatio: ratio.replace('/', ' / ') }}
    >
      {/* Fades in once decoded — avoids a hard pop on slow connections. */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} /* reveal the tint rather than a torn icon */
        style={{ objectPosition }}
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          'transition-opacity duration-500 ease-[var(--ease-architectural)]',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
        {...rest}
      />

      {overlay}

      {/* Placeholder tint removed once loaded */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-brand-mist"
        />
      )}
    </div>
  );
}

export default SmartImage;