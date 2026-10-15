import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * CONTAINER
 * ============================================================================
 * A single, controlled page width for the whole site.
 *
 * WIDTH IS FLUID, NOT BREAKPOINT-DRIVEN: `min(100% - <gutter>, max)` means
 * there is no jump at any breakpoint and no layout shift as the viewport
 * changes. Below 640px the gutter tightens from 20px to 16px per side, which
 * is the maximum usable content width on a 320px phone.
 *
 * `size="prose"` clamps to a comfortable reading measure for long-form pages
 * (privacy, estimator notes) so paragraphs never run the full width of a 1920px
 * display.
 */
export function Container({
  as: Tag = 'div',
  size = 'page',
  className,
  children,
  ...rest
}) {
  const sizes = {
    page: 'max-w-page',
    prose: 'max-w-prose',
    narrow: 'max-w-3xl',
    wide: 'max-w-[92rem]',
    full: 'max-w-none',
  };

  return (
    <Tag
      className={cn(
        // Inline-flex keeps the page content at full width inside the flex
        // shell in Layout; the padding approach is equivalent and avoids the
        // negative-margin overflow that full-bleed wrappers cause.
        'mx-auto w-full px-4 sm:px-5 lg:px-6',
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Container;