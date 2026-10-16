import { Link } from 'react-router-dom';
import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';

/**
 * Page hero used by every inner page (About, Services, Process, …).
 *
 * Kept compact so inner pages do not spend a whole viewport above the fold on
 * a title. Uses a subtle mist background rather than photography so the page
 * content becomes the focus immediately.
 *
 * `breadcrumbs` render as a real <nav aria-label="Breadcrumb"> with an
 * ordered list, per the WAI-ARIA breadcrumb pattern.
 */
export function PageHero({ eyebrow, title, lead, breadcrumbs, children }) {
  return (
    <Section tone="mist" spacing="tight" className="border-b border-line">
      <Container size="page">
        {breadcrumbs?.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-fine text-text-muted">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-line-strong">
                      /
                    </span>
                  )}
                  {crumb.to ? (
                    <Link
                      to={crumb.to}
                      className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 transition-colors hover:text-brand-gold-muted hover:underline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-text">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}

          <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-0.025em] text-brand-black text-balance">
            {title}
          </h1>

          {lead && <p className="mt-5 text-lead text-text">{lead}</p>}

          {children}
        </div>
      </Container>
    </Section>
  );
}

export default PageHero;