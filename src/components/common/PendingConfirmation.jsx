import { cn } from '../../utils/cn.js';
import { ClipboardList } from 'lucide-react';

/**
 * Placeholder shown in place of a business detail that has not been verified.
 *
 * Rationale: shipping a visible "awaiting confirmation" row is far better than
 * either (a) inventing a phone number, or (b) silently omitting the contact
 * section entirely. This keeps the gap obvious to the VNR owner reviewing the
 * build without deceiving a visitor.
 */
export function PendingConfirmation({
  label = 'Contact details',
  tone = 'dark',
  className,
}) {
  const isDark = tone === 'dark';

  return (
    <p
      className={cn(
        'flex items-start gap-2 rounded-sm border border-dashed px-3 py-2.5 text-fine',
        isDark
          ? 'border-white/15 bg-white/[0.03] text-white/50'
          : 'border-line bg-brand-mist/60 text-text-muted',
        className,
      )}
    >
      <ClipboardList
        aria-hidden="true"
        className={cn(
          'mt-0.5 size-3.5 shrink-0',
          isDark ? 'text-brand-gold-light' : 'text-brand-gold-muted',
        )}
      />
      <span>
        <span className="font-semibold">{label}</span> pending confirmation —
        add to <code className="font-mono text-[0.75rem]">src/config/company.js</code>
      </span>
    </p>
  );
}

export default PendingConfirmation;