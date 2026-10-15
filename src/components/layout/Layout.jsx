import { TopBar } from './TopBar.jsx';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { ScrollToTop } from './ScrollToTop.jsx';
import { FloatingWhatsApp } from '../contact/FloatingWhatsApp.jsx';

/**
 * APP SHELL
 *
 * ORDER IS FUNCTIONAL, NOT COSMETIC:
 *
 *   SkipLink → ScrollToTop → TopBar → Header → <main> → Footer → Floating
 *
 * The skip link is rendered FIRST in the DOM, before the TopBar. An earlier
 * version put it inside <Header>, which meant the first Tab press landed on the
 * topbar's phone link instead — so a keyboard user had to tab through the
 * chrome before reaching the content. This was caught by the browser audit.
 *
 * <main id="main"> is the skip-link target. `flex-1` means a short page (404,
 * privacy) still pushes the footer to the bottom instead of leaving a gap.
 * The floating action is a sibling of <main>, never inside it, so it cannot
 * affect page flow or capture focus order within the content.
 */
export function Layout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-navy">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-black-blue"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <TopBar />
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default Layout;