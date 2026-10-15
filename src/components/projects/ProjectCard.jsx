import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { SmartImage } from '../common/SmartImage.jsx';
import { StatusBadge } from '../common/DataNotice.jsx';
import { cn } from '../../utils/cn.js';
import { getCategoryLabel, getStatusMeta } from '../../data/projects.js';
import { formatLocation } from '../../utils/format.js';

/**
 * Project card.
 *
 * Whole card is one link. On mobile the card is full-width so the tap target
 * is generous; on desktop `md:flex-row` produces a wide landscape card.
 *
 * Location line handles missing data gracefully — an unverified location
 * simply renders no location row rather than an empty or invented one.
 */
export function ProjectCard({ project, className }) {
  const status = getStatusMeta(project.status);
  const location = formatLocation(project.location.city, project.location.area);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-sm border border-line bg-brand-white',
        'transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-architectural)]',
        'hover:-translate-y-1 hover:border-brand-gold/55 hover:shadow-lift',
        'motion-reduce:transform-none motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      <div className="relative">
        <SmartImage
          src={project.images[0]?.src}
          alt={
            project.images[0]?.alt ?? `${project.title} — illustrative architectural rendering`
          }
          ratio="16/10"
          sizes="(min-width: 1280px) 24rem, (min-width: 1024px) 32rem, (min-width: 640px) 45vw, 92vw"
          imgClassName="transition-transform duration-500 ease-[var(--ease-architectural)] group-hover:scale-[1.03] motion-reduce:transform-none"
        />

        {/* Status pill, top-left over the image. */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <StatusBadge label={status.label} tone={status.tone === 'gold' ? 'gold' : 'neutral'} />
          {!project.verified && <StatusBadge label="Illustrative" tone="neutral" />}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-display text-label font-bold uppercase tracking-[0.14em] text-brand-gold-muted">
          {getCategoryLabel(project.category)}
        </p>

        <h3 className="mt-2.5 font-display text-h4 font-bold text-brand-black">
          <Link
            to={`/projects/${project.slug}`}
            className="rounded-sm transition-colors duration-200 hover:text-brand-gold-muted"
          >
            {project.title}
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>
        </h3>

        {location && (
          <p className="mt-2.5 flex items-center gap-1.5 text-fine text-text-muted">
            <MapPin className="size-3.5 shrink-0 text-brand-gold-muted" aria-hidden="true" />
            {location}
          </p>
        )}

        <p className="mt-3 flex-1 text-fine leading-relaxed text-text">
          {project.summary}
        </p>

        <span
          aria-hidden="true"
          className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand-gold-muted"
        >
          View project
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
            strokeWidth={2}
          />
        </span>
      </div>
    </article>
  );
}

export default ProjectCard;