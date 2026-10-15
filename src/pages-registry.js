/**
 * Single import surface for the page components used by the test suite.
 *
 * Having one module here means the smoke test can iterate over every page
 * without each test file having to know the file layout — and it keeps the
 * list of pages under test explicit rather than implicit.
 */
export { default as HomePage } from './pages/HomePage.jsx';
export { default as Services } from './pages/Services.jsx';
export { default as About } from './pages/About.jsx';
export { default as ProcessPage } from './pages/ProcessPage.jsx';
export { default as InteriorsPage } from './pages/InteriorsPage.jsx';
export { default as Contact } from './pages/Contact.jsx';
export { default as NotFoundPage } from './pages/NotFoundPage.jsx';
export { default as Projects } from './pages/Projects.jsx';
export { default as ProjectDetail } from './pages/ProjectDetail.jsx';
export { default as Packages } from './pages/Packages.jsx';
export { default as Estimator } from './pages/Estimator.jsx';
export { default as Quality } from './pages/Quality.jsx';
export { default as PrivacyPolicy } from './pages/PrivacyPolicy.jsx';