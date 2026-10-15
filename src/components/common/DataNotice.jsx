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

  const tones = {
    info: 'border-gold/25 bg-white/[0.03] text-text-secondary',
    warning: 'border-gold/45 bg-gold/[0.07] text-text-secondary',
    dark: 'border-gold/25 bg-white/[0.03] text-text-secondary',
  };

  const iconTones = {
    info: 'text-gold',
    warning: 'text-gold',
    dark: 'text-gold-light',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-sm border',
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
        {title && <p className="font-sans font-semibold text-ivory">{title}</p>}
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