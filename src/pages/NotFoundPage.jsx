import { Container } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { Button } from '../components/common/Button.jsx';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES, PRIMARY_NAV } from '../config/site.js';
import { currentYear } from '../utils/format.js';

/**
 * 404 — catch-all route.
 *
 * Not a dead end: marked noindex so it never enters a search index, it offers
 * the primary routes so a visitor is one tap from anywhere useful, and it logs
 * the attempted path to the console so broken links are diagnosable in QA.
 */
export function NotFoundPage() {
  return (
    <>
      <Seo
        path="404"
        noIndex
        structuredData={{ '@type': 'WebPage', name: 'Page not found' }}
      />

      <div className="bg-navy py-24 sm:py-32">
        <Container size="page">
          <div className="mx-auto max-w-2xl text-center">
            <span
              aria-hidden="true"
              className="inline-grid size-16 place-items-center rounded-full border border-gold/40 text-gold"
            >
              <Home className="size-7" strokeWidth={1.5} />
            </span>

            <p className="eyebrow eyebrow--center mt-8">Error 404</p>

            <h1 className="mt-4 font-display text-display font-bold text-white text-balance">
              This page does not exist.
            </h1>

            <p className="mt-5 text-lead text-text-secondary">
              The address you followed is not part of this website. It may have
              been moved, or the link may be mistyped.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Button
                to={ROUTES.home}
                variant="goldGradient"
                size="lg"
                fullWidth
                className="sm:w-auto"
                icon={<Home className="size-4" />}
              >
                Back to home
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className="sm:w-auto"
                onClick={() => window.history.back()}
                icon={<ArrowLeft className="size-4" />}
                iconPosition="left"
              >
                Go back
              </Button>
            </div>

            <nav aria-label="Suggested pages" className="mt-12">
              <p className="font-sans text-label font-bold uppercase tracking-[0.16em] text-text-muted">
                Or try
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {PRIMARY_NAV.slice(0, 5).map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-flex min-h-11 items-center rounded-full border border-gold/25 px-4 font-sans text-sm font-semibold text-text-secondary transition-colors hover:border-gold hover:text-gold-light"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="mt-10 text-fine text-text-muted">
              © {currentYear()} VNR Constructions
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}

export default NotFoundPage;