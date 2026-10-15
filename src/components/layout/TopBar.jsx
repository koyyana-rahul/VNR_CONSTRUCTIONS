import { Phone, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { company, telHref } from '../../config/company.js';

/**
 * ============================================================================
 * TOP BAR (reference section 1)
 * ============================================================================
 *
 * Deep black-blue strip above the header carrying the service message, the
 * location and the phone number.
 *
 * RESPONSIVE BEHAVIOUR: at narrow widths the message and the contact block
 * stack onto separate rows. They share no horizontal space, so the phone can
 * never collide with the service message — the failure the brief calls out.
 * The phone is a real tel: link, but only when a verified number exists.
 */
export function TopBar() {
  const message = 'Premium home construction & interiors';

  return (
    <div className="bg-black-blue text-text-muted">
      <div className="mx-auto flex w-full max-w-page flex-col gap-2 px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.14em] sm:px-7 sm:py-2 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        {/* Service message — truncates rather than pushing the layout */}
        <p className="min-w-0 truncate font-medium">
          <span className="text-gold">{message}</span>
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {company.serviceAreas.list.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3 shrink-0 text-gold" aria-hidden="true" />
              <span className="text-text-secondary">
                {company.serviceAreas.list.join(', ')}
              </span>
            </span>
          )}

          {telHref() && (
            <a
              href={telHref()}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-sm font-semibold text-text-primary',
                'min-h-11 py-1 transition-colors duration-200 hover:text-gold',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
              )}
            >
              <Phone className="size-3 shrink-0 text-gold" aria-hidden="true" />
              <span>{company.phone.raw ?? company.phone.display}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;