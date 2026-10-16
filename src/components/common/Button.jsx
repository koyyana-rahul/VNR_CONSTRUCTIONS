import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * THE ONE BUTTON IN THE SYSTEM
 * ============================================================================
 * Every CTA on the site uses this, so hover, focus and disabled states can
 * never drift apart between sections.
 *
 * VARIANTS
 *   goldGradient  champagne gradient, navy text   — the primary CTA
 *   gold          flat champagne, black text     — secondary emphasis
 *   outline       transparent, gold border        — secondary on dark
 *   onDark        ivory fill, navy text          — inverse CTA
 *   ghost         transparent, inherits colour    — tertiary / in-card links
 *
 * CONTRAST: champagne #D9AD45 with navy #030A12 text is roughly 9:1, well past
 * WCAG AA. Gold TEXT on navy is also strong; gold text on IVORY would not be,
 * which is why the ivory form surfaces use navy text.
 *
 * SIZES use min-height rather than fixed height so a wrapped label can still
 * grow, and every size clears the 44px touch target.
 */
const VARIANTS = {
  goldGradient:
    'border border-transparent bg-gradient-to-b from-gold-button-light to-gold-button-dark text-navy ' +
    'shadow-[0_8px_22px_-10px_rgba(217,173,69,0.7)] hover:shadow-[0_12px_28px_-10px_rgba(217,173,69,0.85)]',
  gold:
    'border border-gold-button-dark bg-gold-button-light text-navy ' +
    'hover:border-gold-button-dark hover:bg-gold-button-dark',
  outline:
    'border border-gold-medium bg-transparent text-text-primary hover:border-gold hover:bg-gold/10 hover:text-gold-light',
  onDark: 'border border-transparent bg-ivory text-navy hover:bg-white',
  ghost:
    'border border-transparent bg-transparent text-text-secondary hover:text-gold-light',
  onLight:
    'border border-transparent bg-navy text-ivory hover:bg-black-blue',
};

const SIZES = {
  sm: 'min-h-10 px-4 py-2 text-sm gap-1.5',
  md: 'min-h-11 px-5 py-2.5 text-[0.9375rem] gap-2',
  lg: 'min-h-13 px-7 py-3.5 text-base gap-2.5 sm:min-h-14 sm:px-8',
};

/* A misspelled variant must not degrade silently.
 *
 * `cn()` drops undefined values, so `variant="primry"` — or `variant="primary"`,
 * which six call sites across Quality, Projects, ProjectDetail and
 * ServiceDetail were using — resolves to no variant classes AT ALL. The button
 * still renders, still passes its test, and looks like an unadorned text link.
 * Four of those were the primary CTA of their page.
 *
 * So an unknown variant throws in development. In production it falls back to
 * `goldGradient` rather than throwing inside a render: a build-time mistake
 * must not take a live page down. */
function resolveVariant(variant) {
  if (VARIANTS[variant]) return VARIANTS[variant];

  if (import.meta.env?.DEV) {
    throw new Error(
      `Button: unknown variant "${variant}". Use one of: ${Object.keys(VARIANTS).join(', ')}.`,
    );
  }
  return VARIANTS.goldGradient;
}

export function Button({
  as,
  to,
  href,
  variant = 'goldGradient',
  size = 'md',
  fullWidth = false,
  icon = null,
  iconPosition = 'right',
  className,
  children,
  ...rest
}) {
  const Tag = as ?? (to ? Link : href ? 'a' : 'button');

  const extraProps = {};
  if (Tag === 'a') {
    extraProps.href = href;
    // External links open safely and are announced as such.
    if (href?.startsWith('http')) {
      extraProps.target = '_blank';
      extraProps.rel = 'noopener noreferrer';
    }
  }
  if (Tag === Link) extraProps.to = to;

  const classes = cn(
    'group inline-flex items-center justify-center rounded-sm font-sans font-semibold tracking-tight',
    // Brief: "small upward movement" on hover.
    'transition-[transform,box-shadow,background-color,border-color,color]',
    'duration-200 ease-[var(--ease-architectural)] motion-reduce:transform-none',
    'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold',
    'disabled:pointer-events-none disabled:opacity-45 disabled:hover:translate-y-0',
    resolveVariant(variant),
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const iconEl = icon ? (
    <span
      aria-hidden="true"
      className={cn(
        'shrink-0 transition-transform duration-200 ease-[var(--ease-architectural)]',
        iconPosition === 'right' && 'group-hover:translate-x-0.5',
        iconPosition === 'left' && 'group-hover:-translate-x-0.5',
        'motion-reduce:transform-none',
      )}
    >
      {icon}
    </span>
  ) : null;

  return (
    <Tag className={classes} {...extraProps} {...rest}>
      {iconPosition === 'left' && iconEl}
      <span>{children}</span>
      {iconPosition === 'right' && iconEl}
    </Tag>
  );
}

/** Small uppercase gold rule + label, used above every section heading. */
export function Eyebrow({ children, center = false, className }) {
  return (
    <span className={cn('eyebrow', center && 'eyebrow--center', className)}>{children}</span>
  );
}

/**
 * Standard section heading block.
 * On mobile it always stacks — a right-aligned heading beside a left-aligned
 * eyebrow looks broken narrow.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  as: Tag = 'h2',
  size = 'md',
  className,
  children,
}) {
  const isCenter = align === 'center';
  const titleSizes = { sm: 'text-h4', md: 'text-h2', lg: 'text-display' };

  return (
    <div
      className={cn(
        'flex flex-col',
        isCenter ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow && <Eyebrow center={isCenter}>{eyebrow}</Eyebrow>}

      <Tag
        className={cn(
          'mt-4 text-balance',
          titleSizes[size],
          'text-text-primary',
        )}
      >
        {title}
      </Tag>

      {lead && (
        <p
          className={cn(
            'mt-5 max-w-[60ch] text-lead text-text-secondary',
            isCenter && 'mx-auto',
          )}
        >
          {lead}
        </p>
      )}

      {children}
    </div>
  );
}

export { ArrowRight };
export default Button;