import { lazy, Suspense } from 'react';
import { LazyMotion } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout.jsx';
import { ConsultationModalProvider } from './components/forms/ConsultationContext.jsx';
import { RouteFallback } from './components/common/RouteFallback.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * ============================================================================
 * ROUTER + MOTION ROOT
 * ============================================================================
 *
 * ROUTING
 *   HomePage is imported eagerly — it is the entry point, so deferring it only
 *   adds a round trip. Every other route is code-split, which keeps the initial
 *   bundle to the homepage plus the shared shell.
 *   /estimator redirects to /estimate so previously-shared links still work.
 *
 * MOTION BUNDLE
 *   <LazyMotion features={...} strict> defers Motion's animation features into
 *   a separate async chunk, loaded as soon as anything animates — roughly a
 *   40% smaller initial bundle than importing the full runtime.
 *
 *   `strict` makes a stray `motion.*` import throw rather than silently
 *   pulling the whole runtime back into the main chunk; this codebase uses `m.*`.
 *
 *   If that chunk ever fails, Motion renders children un-animated, so content
 *   never depends on it.
 */
const Services = lazy(() => import('./pages/Services.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const ProcessPage = lazy(() => import('./pages/ProcessPage.jsx'));
const InteriorsPage = lazy(() => import('./pages/InteriorsPage.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Packages = lazy(() => import('./pages/Packages.jsx'));
const Estimator = lazy(() => import('./pages/Estimator.jsx'));
const Quality = lazy(() => import('./pages/Quality.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));

const LazyConsultationModal = lazy(() =>
  import('./components/forms/ConsultationModal.jsx').then((m) => ({
    default: m.ConsultationModal,
  })),
);

export function App() {
  return (
    <BrowserRouter>
      <LazyMotion
        features={() => import('./components/motion/features.js').then((m) => m.default)}
        strict
      >
        <ConsultationModalProvider renderModal={() => <LazyConsultationModal />}>
          <Layout>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/process" element={<ProcessPage />} />
                <Route path="/interiors" element={<InteriorsPage />} />
                <Route path="/contact" element={<Contact />} />
                {/* Supporting pages, retained from the wider build */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/estimate" element={<Estimator />} />
                <Route path="/estimator" element={<Navigate to="/estimate" replace />} />
                <Route path="/quality" element={<Quality />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </ConsultationModalProvider>
      </LazyMotion>
    </BrowserRouter>
  );
}

export default App;