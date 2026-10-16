import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/cn.js';

/**
 * An honest notice for content that is not yet verified or not yet supplied.
 *
 * Used for the placeholder portfolio, unconfirmed data and development-only
 * visuals. Colour is never the only signal — every notice carries an icon and
 * explicit text, so it survives greyscale and colour-blind vision.
 */
export function DataNotice({
  tone = 'info',
  title,
  children,
  className,
  compact = false,
}) {
  const isWarning = tone === 'warning';
  const Icon = isWarning ? AlertTriangle : Info;

  /* The surface is NOT set here. It comes from `.vnr-notice`, which reads the
     `--notice-surface` / `--notice-border` tokens — and those are re-pointed by
     `.on-light`, so the same component is correct on the ivory sections of
     Packages, Projects, Quality and the estimator AND on the dark homepage
     sections, with no prop and no per-call-site decision.

     It used to be a literal `bg-white/[0.03]` with `border-gold/25`, which over
     an ivory ground is indistinguishable from the page: the notices rendered as
     a faint gold hairline floating on nothing. */
  const tones = {
    info: 'text-text-secondary',
    warning: 'text-text-secondary',
    dark: 'text-text-secondary',
  };

  const iconTones = {
    info: 'text-gold',
    warning: 'text-gold',
    dark: 'text-gold-light',
  };

  return (
    <div
      className={cn(
        'vnr-notice flex items-start gap-3 rounded-sm border',
        compact ? 'px-3.5 py-3' : 'px-4 py-4 sm:px-5',
        tones[tone],
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn('mt-0.5 shrink-0', compact ? 'size-3.5' : 'size-4', iconTones[tone])}
        strokeWidth={2}
      />
      <div className="min-w-0 flex-1 text-fine leading-relaxed">
        {/* `data-notice__title` rather than a bare `text-ivory`: this notice is
            used on dark sections AND on the ivory sections of Quality, Packages
            and the estimator, where fixed ivory renders at 1.07:1 on white —
            an invisible title. The rule lives in @layer utilities so it can
            out-specify a same-layer colour utility, and it follows whichever
            surface the section is on. */}
        {title && (
          <p className="data-notice__title font-sans font-semibold">{title}</p>
        )}
        <div className={cn(title && 'mt-1')}>{children}</div>
      </div>
    </div>
  );
}

/** Small status pill. Colour is paired with a text label and a dot. */
export function StatusBadge({ label, tone = 'neutral', className, icon: Icon }) {
  const tones = {
    neutral: 'border-white/15 bg-white/5 text-text-secondary',
    gold: 'border-gold/50 bg-gold/10 text-gold-light',
    dark: 'border-gold/50 bg-gold/10 text-gold-light',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1',
        'font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em]',
        tones[tone],
        className,
      )}
    >
      {Icon ? (
        <Icon aria-hidden="true" className="size-3" strokeWidth={2.25} />
      ) : (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current opacity-70" />
      )}
      {label}
    </span>
  );
}

export default DataNotice;