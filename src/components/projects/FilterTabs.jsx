import { useId } from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Filter control group, built as a real ARIA tablist.
 *
 * Why tabs rather than plain buttons: the filter directly controls the set of
 * results below it, and `role="tablist"` + `aria-selected` + `role="tabpanel"`
 * communicates that relationship to a screen reader, where a row of toggle
 * buttons does not.
 *
 * Mobile behaviour: the row scrolls horizontally inside its own container with
 * the scrollbar hidden — this is a contained scroll, NOT page-level horizontal
 * overflow, which the acceptance criteria forbid. Fade masks at each end hint
 * at more options. Keyboard users can Tab to the group and use Arrow keys.
 *
 * Counts are shown so an empty result set is predictable before you tap.
 */
export function FilterTabs({
  options,
  activeId,
  onChange,
  label = 'Filter by category',
  counts = {},
  panelId,
  className,
}) {
  const baseId = useId();

  // The panel this group controls. Callers pass a stable id so the consumer can
  // render a matching role="tabpanel" — aria-controls must reference an id that
  // actually exists in the document, not one this hook invented.
  const targetPanelId = panelId ?? `${baseId}-panel`;

  const onKeyDown = (event, index) => {
    const last = options.length - 1;

    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = index === last ? 0 : index + 1;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = index === 0 ? last : index - 1;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = last;
    } else {
      return;
    }

    event.preventDefault();
    document.getElementById(`${baseId}-${options[next].id}`)?.focus();
    onChange(options[next].id);
  };

  return (
    <div
      className={cn(
        // Relative to the bleed wrapper so the fade masks position correctly.
        'relative',
        // The scroll strip is allowed to be wider than the viewport, so the
        // wrapper must both bleed to the screen edge AND clip. Without the
        // overflow clip, the strip's intrinsic width propagates up and widens
        // the whole document at 320/375px.
        '-mx-5 max-w-[100vw] overflow-x-clip px-5 sm:mx-0 sm:px-0',
        // Fade masks hint at more options; they are decorative and sit outside
        // the scroll area's padding box.
        'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-8 before:bg-gradient-to-r before:from-brand-mist before:to-transparent sm:before:hidden',
        'after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-8 after:bg-gradient-to-l after:from-brand-mist after:to-transparent sm:after:hidden',
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={label}
        className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
      >
        {options.map((option, index) => {
          const isActive = option.id === activeId;
          const count = counts[option.id] ?? 0;

          return (
            <button
              key={option.id}
              id={`${baseId}-${option.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={targetPanelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(option.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2',
                'font-display text-sm font-semibold tracking-tight',
                'transition-colors duration-200 ease-[var(--ease-architectural)]',
                'motion-reduce:transition-none',
                isActive
                  ? 'border-brand-black bg-brand-black text-brand-white'
                  : 'border-line bg-brand-white text-text hover:border-brand-gold hover:text-brand-gold-muted',
              )}
            >
              {option.label}
              <span
                aria-hidden="true"
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[0.6875rem] font-bold tabular-nums',
                  isActive ? 'bg-white/18 text-brand-white' : 'bg-brand-mist text-text-muted',
                )}
              >
                {count}
              </span>
              {/* Screen readers get the un-abbreviated context. */}
              <span className="sr-only">{count === 1 ? ' project' : ' projects'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterTabs;