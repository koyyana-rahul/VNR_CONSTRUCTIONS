import { cn } from '../../utils/cn.js';

/** Skip-to-content link. Visually hidden until focused, then pinned top-left. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        'sr-only',
        'focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]',
        'focus:rounded-sm focus:bg-brand-black focus:px-5 focus:py-3',
        'focus:font-sans focus:text-sm focus:font-semibold focus:text-brand-white',
        'focus:shadow-lift',
      )}
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;