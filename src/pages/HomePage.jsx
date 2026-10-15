import { Seo } from '../components/common/Seo.jsx';
import { Hero } from '../components/home/Hero.jsx';
import { Highlights } from '../components/home/Highlights.jsx';
import { Services } from '../components/home/Services.jsx';
import { About } from '../components/home/About.jsx';
import { Process } from '../components/home/Process.jsx';
import { Interiors } from '../components/home/Interiors.jsx';
import { Gallery } from '../components/home/Gallery.jsx';
import { ContactSection } from '../components/home/ContactSection.jsx';
import { ROUTES } from '../config/site.js';

/**
 * ============================================================================
 * HOMEPAGE — the reference site's 11 sections, in order
 * ============================================================================
 *  1. TopBar                            (in Layout)
 *  2. Sticky glass Header               (in Layout)
 *  3. Hero — headline + starting price
 *  4. Highlights strip
 *  5. Services — six cards
 *  6. About VNR
 *  7. Construction process — four steps
 *  8. Premium interiors
 *  9. Inspiration gallery
 * 10. Contact + Request a Callback form
 * 11. Footer                            (in Layout)
 *
 * Section 1, 2 and 11 live in the shared Layout so they persist across routes
 * exactly as they do on the original single-page site.
 *
 * All copy is supplied verbatim in src/data/home.js. Fields the brief
 * references without reproducing are rendered through <SourceCopyPending />
 * rather than invented — see that component for the rationale.
 */
export function HomePage() {
  return (
    <>
      <Seo path={ROUTES.home} />

      <Hero />
      <Highlights />
      <Services />
      <About />
      <Process />
      <Interiors />
      <Gallery />
      <ContactSection />
    </>
  );
}

export default HomePage;