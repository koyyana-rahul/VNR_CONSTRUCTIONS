import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * SURFACE CARD — the one card the supporting pages are built from
 * ============================================================================
 *
 * Packages, Projects, Quality Standards, the Project detail page and the cost
 * estimator all need a bordered panel on an ivory or navy ground. Each had
 * written its own, and they drifted:
 *
 *     Packages scope card      p-6 sm:p-7   bg-brand-white
 *     Quality trade card       p-6           bg-brand-white
 *     Quality inner panel      p-6           bg-surface-warm
 *     Projects skeleton        (none)        bg-brand-white
 *     ProjectCard              p-5 sm:p-6    bg-brand-white
 *     Packages service link    p-5           bg-surface-warm
 *     Estimator fieldsets ×3   p-5 sm:p-7    bg-brand-white
 *     Estimator result         (own header)  bg-surface-warm
 *
 * Eight components, four different paddings, and two near-identical ivory
 * surfaces (`#F8F7F2` and `#FBF9F3`, 3/255 apart) swapped with no rule at all.
 * Any future card would be a ninth opinion.
 *
 * This component is that decision, made once.
 *
 * `tone` exists because the two ivories were never a mistake — they are the
 * page ground and the raised surface on it, and both are in the palette:
 *
 *     ivory  #F8F7F2  the card itself, used on a `white` or `mist` section
 *     warm   #FBF9F3  a nested panel, used when a card sits on a card
 *     navy   a dark panel, e.g. the estimator's result header
 *
 * `pad` is `md` everywhere by default. The `lg` step exists for exactly two
 * callers — the estimator's three input fieldsets, which genuinely have more
 * controls inside them and have always used the larger padding — so it is a
 * named option rather than each page re-deciding.
 *
 * `interactive` is a single restrained hover: a 3px lift and a gold border,
 * matching the homepage service cards. It is disabled under reduced motion.
 */
export function SurfaceCard({
  as: Tag = 'div',
  tone = 'ivory',
  pad = 'md',
  interactive = false,
  className,
  children,
  ...rest
}) {
  const tones = {
    ivory: 'bg-brand-white',
    warm: 'bg-surface-warm',
    navy: 'bg-brand-deep',
  };

  const pads = {
    none: '',
    md: 'p-5 sm:p-6',
    lg: 'p-5 sm:p-7',
  };

  return (
    <Tag
      className={cn(
        'rounded-sm border border-line',
        tones[tone],
        pads[pad],
        interactive &&
          'transition-[border-color,transform,box-shadow] duration-300 ease-[var(--ease-architectural)] hover:-translate-y-[3px] hover:border-gold-medium hover:shadow-card focus-within:-translate-y-[3px] focus-within:border-gold-medium motion-reduce:transform-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * A definition-list pair inside a SurfaceCard — "Best for", "Programme",
 * or any label/value row.
 *
 * Exists because the Packages cards hand-rolled the same `<div><dt><dd>`
 * triple with its own margins, and the estimator's breakdown needed a different
 * variant of the same idea. One component, two densities.
 */
export function CardMeta({ label, children, className }) {
  return (
    <div className={className}>
      <dt className="font-display text-[0.8125rem] font-bold text-brand-black">{label}</dt>
      <dd className="mt-1 text-fine leading-relaxed text-text">{children}</dd>
    </div>
  );
}

export default SurfaceCard;