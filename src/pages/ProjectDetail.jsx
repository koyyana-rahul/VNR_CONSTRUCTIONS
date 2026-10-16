import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Seo } from '../components/common/Seo.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { Button } from '../components/common/Button.jsx';
import { DataNotice, StatusBadge } from '../components/common/DataNotice.jsx';
import { Gallery } from '../components/projects/Gallery.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { CtaBanner } from '../components/home/CtaBanner.jsx';
import { ROUTES } from '../config/site.js';
import {
  fetchProjectBySlug,
  getCategoryLabel,
  getStatusMeta,
  getRelatedProjects,
} from '../data/projects.js';
import { formatLocation } from '../utils/format.js';

/**
 * ============================================================================
 * PROJECT DETAIL — /projects/:slug
 * ============================================================================
 *
 * Handles every required state:
 *   loading -> spinner-free skeleton with reserved height
 *   error   -> an unknown slug renders a proper "not found" panel with a way
 *              back, rather than a blank page or a crash
 *   loaded  -> hero, summary, specs, gallery, related projects
 *
 * Placeholder specs (null values) are skipped from the spec grid rather than
 * rendering "—" rows, so an unverified field is visibly absent instead of
 * looking like a real value of "—".
 */
export function ProjectDetail() {
  const { slug } = useParams();
  // The slug is stored alongside the state so a slug change can be detected
  // during render (React's documented pattern for derived state) rather than in
  // an effect — which would briefly show the previous project under a new URL.
  const [state, setState] = useState({ status: 'loading', project: null, slug });
  const [attempt, setAttempt] = useState(0);

  if (state.slug !== slug) {
    setState({ status: 'loading', project: null, slug });
  }

  useEffect(() => {
    const controller = new AbortController();

    fetchProjectBySlug(slug, { signal: controller.signal })
      .then((project) => {
        if (controller.signal.aborted) return;
        setState({ status: 'ready', project, slug });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ status: 'error', project: null, slug });
      });

    return () => controller.abort();
    // `attempt` is included deliberately: bumping it forces a refetch,
    // which is how the Retry button works.
  }, [slug, attempt]);

  if (state.status === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="py-24"
      >
        <span className="sr-only">Loading project…</span>
        <Container size="page">
          <div
            aria-hidden="true"
            className="h-4 w-40 animate-pulse rounded bg-brand-mist motion-reduce:animate-none"
          />
          <div
            aria-hidden="true"
            className="mt-6 aspect-[16/9] w-full animate-pulse rounded bg-brand-mist motion-reduce:animate-none"
          />
        </Container>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <>
        <Seo path={ROUTES.projects} noIndex />
        <Section tone="mist" spacing="loose">
          <Container size="page">
            <div className="mx-auto max-w-xl text-center">
              <h1 className="font-display text-h1 font-extrabold text-brand-black">
                Project not found
              </h1>
              <p className="mt-4 text-lead text-text">
                We could not find a project at that address. It may have been
                renamed, or the link may be incorrect.
              </p>
              <Button to={ROUTES.projects} variant="goldGradient" size="lg" className="mt-8">
                Back to all projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="mt-3"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Try loading again
              </Button>
            </div>
          </Container>
        </Section>
        <CtaBanner />
      </>
    );
  }

  const project = state.project;
  const status = getStatusMeta(project.status);
  const location = formatLocation(project.location.city, project.location.area);
  const related = getRelatedProjects(project);
  const specs = project.specs.filter((s) => s.value);

  return (
    <>
      <Seo
        path={ROUTES.project}
        structuredData={{
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          ...(project.year && { dateCreated: String(project.year) }),
        }}
      />

      {/* ---- Breadcrumb + title band ---- */}
      <Section tone="mist" spacing="tight" className="border-b border-line">
        <Container size="page">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-fine text-text-muted">
              <li>
                <Link to={ROUTES.home} className="inline-flex min-h-11 items-center rounded-sm hover:text-brand-gold-muted">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-line-strong">/</li>
              <li>
                <Link to={ROUTES.projects} className="inline-flex min-h-11 items-center rounded-sm hover:text-brand-gold-muted">
                  Projects
                </Link>
              </li>
              <li aria-hidden="true" className="text-line-strong">/</li>
              <li aria-current="page" className="text-text">
                {project.title}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={status.label}
                  tone={status.tone === 'gold' ? 'gold' : 'neutral'}
                />
                {!project.verified && <StatusBadge label="Illustrative record" tone="neutral" />}
              </div>

              <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-0.025em] text-brand-black text-balance">
                {project.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-fine text-text-muted">
                <span className="font-display font-semibold uppercase tracking-[0.12em] text-brand-gold-muted">
                  {getCategoryLabel(project.category)}
                </span>
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-brand-gold-muted" aria-hidden="true" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            <Button to={ROUTES.contact} variant="goldGradient" size="md" className="shrink-0">
              Discuss a similar project
            </Button>
          </div>
        </Container>
      </Section>

      {/* ---- Gallery ---- */}
      <Section tone="white" spacing="tight">
        <Container size="page">
          <Gallery images={project.images} title={project.title} />
        </Container>
      </Section>

      {/* ---- Summary + specs ---- */}
      <Section tone="white">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
            <Reveal className="lg:col-span-7">
              <h2 className="font-display text-h2 font-bold text-brand-black">Overview</h2>
              <div className="mt-5 flex flex-col gap-4 text-lead text-text">
                {project.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <Button to={ROUTES.projects} variant="outline" size="sm" className="mt-8">
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to portfolio
                </span>
              </Button>
            </Reveal>

            <Reveal delay={80} className="lg:col-span-5">
              {specs.length > 0 && (
                <div className="rounded-sm border border-line bg-surface-warm p-6">
                  <h2 className="font-display text-label font-bold uppercase tracking-[0.16em] text-brand-gold-muted">
                    Specifications
                  </h2>
                  <dl className="mt-5 divide-y divide-line">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-fine text-text-muted">{spec.label}</dt>
                        <dd className="text-right font-display text-sm font-semibold text-brand-black">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {!project.verified && (
                <DataNotice tone="warning" title="Placeholder record" className="mt-6">
                  This entry is development data demonstrating the portfolio
                  detail page. Location, year and specifications are empty
                  because they have not been verified with VNR, and are
                  intentionally left blank rather than filled with guesses.
                </DataNotice>
              )}
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Related ---- */}
      {related.length > 0 && (
        <Section tone="mist">
          <Container size="page">
            <Reveal>
              <h2 className="font-display text-h2 font-bold text-brand-black">
                Related projects
              </h2>
            </Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id} className="h-full">
                  <ProjectCard project={item} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBanner />
    </>
  );
}

export default ProjectDetail;