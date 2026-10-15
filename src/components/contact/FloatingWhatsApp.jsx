import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { ROUTES } from '../../config/site.js';
import { company, hasWhatsApp, whatsappHref } from '../../config/company.js';

/**
 * ============================================================================
 * FLOATING WHATSAPP ACTION
 * ============================================================================
 *
 * Guarded against every failure mode the brief lists:
 *
 * - RENDERS NOTHING unless a verified WhatsApp number exists. It is never
 *   added "just for decoration".
 * - SUPPRESSED on /contact, where the full enquiry form already provides the
 *   action and a floating button would sit on top of the submit button.
 * - SUPPRESSED while the footer is on screen, so it cannot cover contact
 *   details or the legal links.
 * - HIDES while the user scrolls down and returns when they scroll up or
 *   stop, so it never obstructs content being read.
 * - Sits inside the safe-area inset on notched devices.
 * - Labelled for screen readers; the icon is aria-hidden so it is not
 *   announced twice.
 */
export function FloatingWhatsApp() {
  const lastScrollY = useRef(0);
  const { pathname } = useLocation();

  const onContactRoute = pathname === ROUTES.contact || pathname.startsWith(`${ROUTES.contact}?`);
  const suppressed = onContactRoute || !hasWhatsApp;

  // Resolved in the initialiser rather than an effect, so there is no
  // mount-time setState cascade.
  const [scrolledPastTop, setScrolledPastTop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.scrollY >= 200;
  });

  useEffect(() => {
    if (suppressed) return undefined;

    lastScrollY.current = window.scrollY;
    let ticking = false;

    const evaluate = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      // Ignore tiny jitters (iOS rubber-banding, momentum settle).
      if (Math.abs(delta) > 8) {
        setScrolledPastTop(delta >= 0 && y >= 200);
        lastScrollY.current = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(evaluate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [suppressed]);

  // Hide once the footer is visible.
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    if (suppressed) return undefined;
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [suppressed]);

  if (suppressed) return null;

  const href = whatsappHref(
    `Hello ${company.name}, I would like to discuss a construction project.`,
  );

  // Visible at the top and while scrolling back up; hidden while the visitor
  // is scrolling down through content, and hidden over the footer.
  const isShowing = !scrolledPastTop && !footerVisible;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${company.name} on WhatsApp`}
      className={cn(
        'group fixed right-4 z-30 sm:right-6',
        // Safe-area aware: clear of the home indicator on iOS.
        'bottom-[max(1rem,env(safe-area-inset-bottom))]',
        'grid size-14 place-items-center rounded-full',
        'bg-brand-black text-brand-white',
        'shadow-lift ring-1 ring-black/10',
        'transition-all duration-300 ease-[var(--ease-architectural)]',
        'hover:bg-brand-deep hover:ring-brand-gold/50',
        'motion-reduce:transition-none',
        isShowing
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <MessageCircle className="size-6" strokeWidth={1.75} aria-hidden="true" />
      {/* Gold ring accent — decorative only. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full ring-1 ring-inset ring-brand-gold/40"
      />
    </a>
  );
}

export default FloatingWhatsApp;