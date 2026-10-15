import { useId, useRef, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { EASE } from '../motion/variants.js';

/**
 * ============================================================================
 * ACCESSIBLE ANIMATED ACCORDION — WAI-ARIA APG pattern
 * ============================================================================
 *
 * ANIMATION
 *   Panel height and opacity are animated with Motion rather than the `hidden`
 *   attribute. `hidden` makes an element un-animatable, which is why a previous
 *   version snapped open/closed and simply used it.
 *
 *   Animating height from 0 to `auto` requires the panel to stay in the DOM, so
 *   a CLOSED panel is instead:
 *     - collapsed to height 0 / opacity 0 with overflow-hidden
 *     - `aria-hidden="true"`
 *     - `inert`, which removes it from the tab order and the accessibility tree
 *       in every browser that supports it (and is a no-op elsewhere)
 *   That gives the visual animation without ever letting a keyboard user tab
 *   into hidden content.
 *
 *   There is no `will-change` here on purpose: the panels are small, and
 *   promoting every one of them would cost more memory than the animation saves.
 *
 * A11Y
 *   - Headers are real <button>s, so Enter/Space work without extra code.
 *   - aria-expanded announces open/closed.
 *   - aria-controls ties the button to its panel; the panel is a labelled
 *     region so screen readers can jump straight to it.
 *   - Up/Down/Home/End move focus between headers (APG keyboard requirement).
 *   - State is never conveyed by gold alone: the +/- glyph rotates AND the
 *     panel's presence/absence changes.
 *
 * REDUCED MOTION
 *   Under prefers-reduced-motion the panel switches state instantly — no height
 *   tween — while keeping every behaviour intact.
 */
export function Accordion({
  items,
  allowMultiple = false,
  tone = 'light',
  defaultOpenIds = [],
  className,
  itemClassName,
}) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpenIds));
  const buttonRefs = useRef([]);
  const reduced = useReducedMotion();

  const isDark = tone === 'dark';

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set();
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onKeyDown = (event, index) => {
    const lastIndex = items.length - 1;

    let target;
    switch (event.key) {
      case 'ArrowDown':
        target = index === lastIndex ? 0 : index + 1;
        break;
      case 'ArrowUp':
        target = index === 0 ? lastIndex : index - 1;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    buttonRefs.current[target]?.focus();
  };

  return (
    <div
      className={cn('divide-y', isDark ? 'divide-white/10' : 'divide-line', className)}
    >
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id);
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;

        return (
          <div key={item.id} className={itemClassName}>
            <h3 className="m-0">
              <button
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={cn(
                  'flex w-full items-start justify-between gap-4 py-5 text-left',
                  'font-display text-h4 font-semibold leading-snug',
                  'transition-colors duration-200',
                  'sm:py-6',
                  isDark
                    ? 'text-ivory hover:text-gold-light'
                    : 'text-brand-black hover:text-brand-gold-muted',
                )}
              >
                <span className="min-w-0 flex-1 text-balance">{item.question}</span>

                {/* The glyph rotates to signal state. Rotation is a transform,
                    so it stays on the compositor. */}
                <m.span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-200',
                    isDark
                      ? 'border-white/20 text-gold-light'
                      : 'border-line text-brand-gold-muted',
                    isOpen &&
                      (isDark
                        ? 'border-gold-light bg-gold-light/12'
                        : 'border-brand-gold bg-brand-gold/12'),
                  )}
                  animate={reduced ? undefined : { rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  <Plus className="size-4" strokeWidth={2} />
                </m.span>
              </button>
            </h3>

            {/*
              `inert` on a closed panel removes it from tab order and the
              accessibility tree. It is a boolean DOM attribute in React 19.
            */}
            <m.div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              aria-hidden={!isOpen || undefined}
              inert={!isOpen || undefined}
              initial={false}
              animate={
                reduced
                  ? { opacity: isOpen ? 1 : 0 }
                  : { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }
              }
              transition={{ duration: reduced ? 0.01 : 0.28, ease: EASE }}
              className={cn(
                'overflow-hidden',
                !reduced && !isOpen && 'pointer-events-none',
                // The bottom padding lives on an inner wrapper so it collapses
                // with the height rather than leaving a gap when closed.
              )}
            >
              <div
                className={cn(
                  'pb-6 pr-12 text-fine leading-relaxed',
                  isDark ? 'text-text-secondary' : 'text-text',
                )}
              >
                {item.answer}
              </div>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;