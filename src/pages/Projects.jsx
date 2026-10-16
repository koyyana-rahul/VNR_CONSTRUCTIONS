import { useEffect, useMemo, useState } from 'react';
import { Seo } from '../components/common/Seo.jsx';
import { PageHero } from '../components/common/PageHero.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { SectionHeading, Button } from '../components/common/Button.jsx';
import { SurfaceCard } from '../components/common/SurfaceCard.jsx';
import { DataNotice } from '../components/common/DataNotice.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { FilterTabs } from '../components/projects/FilterTabs.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { CtaBanner } from '../components/home/CtaBanner.jsx';
import { ROUTES } from '../config/site.js';
import {
  fetchProjects,
  PROJECT_CATEGORIES,
  hasPlaceholderProjects,
} from '../data/projects.js';

const ALL = 'all';

/**
 * ============================================================================
 * PROJECT PORTFOLIO
 * ============================================================================
 *
 * Demonstrates all four required states explicitly:
 *   1. LOADING — skeleton cards keep the grid height stable while the
 *      simulated fetch resolves, so there is no layout jump.
 *   2. ERROR   — if the fetch rejects for any reason other than an abort, a
 *      real message with a working Retry button is shown. Never a blank page.
 *   3. EMPTY   — a filter with no matches renders the EmptyState, not an
 *      empty <ul>.
 *   4. LOADED  — the filtered grid, announced politely to screen readers so
 *      the result count changes are perceivable without sight.
 *
 * The abort controller in the effect prevents a state update after unmount,
 * which is the classic source of React warnings during fast navigation.
 * ============================================================================
 */
export function Projects() {
  const [projects, setProjects] = useState(null); // null = loading
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(ALL);

  // Bumped to kick off a refetch (used by the Retry button).
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchProjects({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        // An abort is an expected navigation, not a failure.
        if (err.name === 'AbortError') return;
        setProjects(null);
        setError(err);
      });

    return () => controller.abort();
  }, [attempt]);

  const counts = useMemo(() => {
    const map = { [ALL]: projects?.length ?? 0 };
    projects?.forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + 1;
    });
    return map;
  }, [projects]);

  const filtered = useMemo(() => {
    if (!projects) return [];
    return activeCategory === ALL
      ? projects
      : projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const tabOptions = [{ id: ALL, label: 'All' }, ...PROJECT_CATEGORIES];

  return (
    <>
      <Seo path={ROUTES.projects} />

      <PageHero
        eyebrow="Portfolio"
        title="Projects, by category and stage."
        lead="Browse work by project type and completion status. Every record here is published once it has been verified with VNR."
        breadcrumbs={[{ label: 'Home', to: ROUTES.home }, { label: 'Projects' }]}
      />

      <Section tone="white">
        <Container size="page">
          <SectionHeading
            eyebrow="Browse"
            title="Filter the portfolio."
            as="h2"
            className="sr-only"
          />

          {hasPlaceholderProjects && (
            <DataNotice tone="warning" title="Illustrative portfolio" className="mb-8">
              These records are development placeholders that demonstrate the
              filtering, gallery and detail-page system. They are not real
              completed VNR projects and should not be relied upon. Real projects
              appear here once verified.
            </DataNotice>
          )}

          <FilterTabs
            options={tabOptions}
            activeId={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
            panelId="projects-results"
            label="Filter projects by category"
          />

          {/* ---- LOADING ---- */}
          {projects === null && !error && (
            <div
              role="status"
              aria-live="polite"
              aria-busy="true"
              className="mt-10"
            >
              <span className="sr-only">Loading projects…</span>
              <ul
                aria-hidden="true"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <li key={i}>
                    {/* The skeleton is a SurfaceCard with `pad="none"` so the
                        loading state is the SAME box the loaded card becomes —
                        same border, same radius, same height. It was a separate
                        hand-rolled shell, which meant the grid jumped the moment
                        the skeletons were replaced. */}
                    <SurfaceCard pad="none" className="overflow-hidden">
                      <div className="aspect-[16/10] w-full animate-pulse bg-brand-mist motion-reduce:animate-none" />
                      <div className="space-y-3 p-5">
                        <div className="h-3 w-24 animate-pulse rounded bg-brand-mist motion-reduce:animate-none" />
                        <div className="h-5 w-3/4 animate-pulse rounded bg-brand-mist motion-reduce:animate-none" />
                        <div className="h-3 w-full animate-pulse rounded bg-brand-mist motion-reduce:animate-none" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-brand-mist motion-reduce:animate-none" />
                      </div>
                    </SurfaceCard>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ---- ERROR ----
              The failure panel is a SurfaceCard too, so a fetch error looks
              like part of the page rather than a raw alert that appeared.
              `role="alert"` stays on the wrapper: this is the one place that
              must interrupt, because the visitor asked for data and did not get
              it. */}
          {error && (
            <div role="alert" className="mt-10">
              <SurfaceCard className="flex flex-col items-center px-6 py-14 text-center">
                <h3 className="font-display text-h4 font-bold text-brand-black">
                  We could not load the portfolio.
                </h3>
                <p className="mt-2 max-w-sm text-fine text-text">
                  Something went wrong fetching the project list. Please try again —
                  if it keeps happening, contact us directly and we will help.
                </p>
                <Button
                  onClick={() => {
                    setProjects(null);
                    setError(null);
                    setAttempt((n) => n + 1);
                  }}
                  variant="goldGradient"
                  size="md"
                  className="mt-6"
                >
                  Try again
                </Button>
              </SurfaceCard>
            </div>
          )}

          {/* ---- LOADED / EMPTY ---- */}
          {projects !== null && !error && (
            <>
              <p aria-live="polite" className="sr-only">
                {filtered.length === 0
                  ? 'No projects match this category.'
                  : `${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'} shown.`}
              </p>

              {/* The tabpanel the filter tabs point at via aria-controls. */}
              {filtered.length > 0 ? (
                <ul
                  id="projects-results"
                  role="tabpanel"
                  aria-label={`Projects, filtered by ${
                    PROJECT_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? 'all categories'
                  }`}
                  className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                >
                  {filtered.map((project) => (
                    <li key={project.id} className="h-full">
                      <ProjectCard project={project} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div id="projects-results" role="tabpanel" aria-label="Projects" className="mt-10">
                  <EmptyState />
                </div>
              )}
            </>
          )}
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}

export default Projects;