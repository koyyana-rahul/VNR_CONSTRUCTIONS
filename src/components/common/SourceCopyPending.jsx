import { cn } from '../../utils/cn.js';
import { FileText } from 'lucide-react';

/**
 * ============================================================================
 * PENDING SOURCE COPY
 * ============================================================================
 * The rebuild brief repeatedly says "preserve the existing description" /
 * "retain the existing paragraph" while reproducing only the headings. Rather
 * than inventing marketing copy in the client's voice, these slots render an
 * explicit, quiet marker.
 *
 * That marker is:
 *   - visually restrained, so it does not read as a design failure
 *   - visible to the client reviewing the build
 *   - reported by `npm run check:company`
 *   - never reachable in production unless someone forgets to replace it
 *
 * Once the source site is available, paste the real copy into src/data/home.js
 * and the marker disappears on its own — no component changes required.
 */
export function SourceCopyPending({ label = 'Copy', className, tone = 'dark' }) {
  const isDark = tone === 'dark';

  return (
    <p
      className={cn(
        'flex items-start gap-2 rounded-sm border border-dashed px-3 py-2 text-fine leading-relaxed',
        isDark
          ? 'border-white/12 bg-white/[0.03] text-text-muted'
          : 'border-navy/20 bg-navy/5 text-text-muted',
        className,
      )}
    >
      <FileText
        aria-hidden="true"
        className={cn(
          'mt-0.5 size-3.5 shrink-0',
          isDark ? 'text-gold/70' : 'text-gold-button-dark',
        )}
      />
      <span>
        <span className="font-semibold">{label}</span> — awaiting the original
        wording from the source site. Not yet supplied, so it has not been
        invented here.
      </span>
    </p>
  );
}

export default SourceCopyPending;