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
 *
 * `pad={false}` REMOVES the built-in horizontal padding.
 * -----------------------------------------------
 * The hero needs this, and it cannot be done with a `className` override —
 * a reason worth recording, because it has already bitten this component once.
 *
 * The hero's gold frame is inset from the viewport edge and its content has to
 * clear that frame by its own margin, so the hero owns its padding rather than
 * inheriting the page gutter and adding to it. The first attempt passed
 * `lg:px-0` on its `className` to cancel the `lg:px-6` below. Both are
 * single-class utilities compiling to the same `padding-inline`, so the winner
 * is whichever Tailwind emits LATER, not whichever was written last — and
 * `lg:px-6` wins. The hero silently kept 24px of desktop padding it never
 * asked for, which at 1024px put the copy 8px OUTSIDE its own border.
 *
 * An opt-out prop makes the intent explicit and removes the tie. The default is
 * unchanged, so no other page is affected.
 */
export function Container({
  as: Tag = 'div',
  size = 'page',
  pad = true,
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
        'mx-auto w-full',
        pad && 'px-4 sm:px-5 lg:px-6',
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