import { FolderOpen } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { Button } from './Button.jsx';
import { ROUTES } from '../../config/site.js';

/**
 * Empty state — a filtered list with no results.
 *
 * Never a blank grid. It explains what happened, offers the obvious next step,
 * and keeps a path out so the visitor is never stranded.
 */
export function EmptyState({
  title = 'Nothing here yet',
  description = 'This category is still being compiled. Try another filter, or get in touch and we will walk you through comparable work.',
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-sm border border-dashed border-gold/25 bg-white/[0.03]',
        'px-6 py-14 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full border border-gold/30 text-gold"
      >
        <FolderOpen className="size-5" strokeWidth={1.5} />
      </span>

      <h3 className="mt-4 font-display text-h4 font-bold text-ivory">{title}</h3>
      <p className="mt-2 max-w-sm text-fine text-text-muted">{description}</p>

      <Button to={ROUTES.contact} variant="outline" size="sm" className="mt-6">
        Get in touch
      </Button>
    </div>
  );
}

export default EmptyState;