import { Icon } from './icons.jsx';
import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * ICON BADGE — the one way an icon container is drawn anywhere on this site
 * ============================================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * The highlights, service cards, interiors features and contact rows each
 * hand-rolled their own circular container. They drifted: border-gold/35,
 * /40 and /40+/45 across four different sizes, with three different glyph
 * sizes. The same control rendered as three different components, and there was
 * no single place to change the treatment.
 *
 * All of that now resolves here, from the --color-icon-* tokens in index.css.
 * Sizing is a lookup rather than a free-form class so a card cannot quietly
 * invent a fifth size, and the container is `shrink-0` so flex parents cannot
 * squeeze it — the single most common way icon containers break.
 *
 * ACCESSIBILITY
 * -------------
 * Decorative by default: the badge is aria-hidden, because in every current
 * use the meaning is carried by adjacent text (a heading, a label, a link
 * name). Passing `label` promotes it to a labelled img-role for the rare case
 * where the icon is the only carrier of meaning. Nothing here relies on colour
 * alone — the ring and the glyph both change together with the border.
 */

/* Container size and the glyph size that pairs with it. The ratio is held
   constant so the optical weight of every icon on the site matches. */
const SIZES = {
  sm: { box: 'size-9', glyph: 'size-4', text: 'text-[0.625rem]' },
  md: { box: 'size-10', glyph: 'size-[1.15rem]', text: 'text-[0.6875rem]' },
  lg: { box: 'size-12', glyph: 'size-5', text: 'text-xs' },
  xl: { box: 'size-14', glyph: 'size-6', text: 'text-sm' },
};

/**
 * Two treatments, chosen by the surface behind them.
 *
 * 'dark'  — navy hero/cards. Gold glyph, faint gold ring, gold-tinted fill.
 * 'light' — ivory panels. A gold glyph on white is only ~2:1 and reads as a
 *           smudge, so the glyph becomes charcoal and the gold moves to the
 *           container, which keeps the brand accent present without washing
 *           the icon out.
 *
 * 'light' was four literal hex values (#E4D9BC, #D9AD45/12, #1B2A36, plus the
 * hover pair) written inline here. That put an unbudgeted colour into the one
 * shared icon component in the codebase — #1B2A36 appears nowhere else at all
 * — and it is the treatment the Quality page uses, so Quality was rendering an
 * icon in a colour that no token governs. They are tokens now, alongside the
 * dark pair, for the same reason `dark` is tokens.
 */
const TONES = {
  dark: 'border-icon-ring bg-icon-tint text-gold',
  light: 'border-icon-ring-light bg-icon-tint-light text-text-primary',
};

/** The light pair's interactive state, kept beside the rest for the same reason. */
const TONE_HOVER = {
  dark: 'group-hover:border-icon-ring-strong group-hover:bg-icon-tint-hover',
  light: 'group-hover:border-icon-ring-light-strong group-hover:bg-icon-tint-light-hover',
};

export function IconBadge({
  name,
  size = 'md',
  tone = 'dark',
  strokeWidth = 1.5,
  /** Adds the hover response used on interactive cards. */
  interactive = false,
  /** Stronger ring/fill — reserved for genuinely rare emphasis. */
  emphasis = false,
  /** Rounded-square container. Used where a card already has soft corners. */
  shape = 'circle',
  className,
  label,
}) {
  const s = SIZES[size] ?? SIZES.md;
  const t = TONES[tone] ?? TONES.dark;

  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
      className={cn(
        'grid shrink-0 place-items-center',
        shape === 'square' ? 'rounded-sm' : 'rounded-full',
        t,
        s.box,
        // `group` is the card, so the badge reacts to the whole card's hover
        // rather than only when the pointer is inside a 40px circle.
        interactive &&
          cn(
            'transition-colors duration-300 motion-reduce:transition-none',
            TONE_HOVER[tone] ?? TONE_HOVER.dark,
          ),
        emphasis && cn(
          'border-icon-ring-strong bg-icon-tint-hover',
          tone === 'light' && 'border-icon-ring-light-strong bg-icon-tint-light-hover',
        ),
        className,
      )}
    >
      <Icon
        name={name}
        className={cn(
          s.glyph,
          // A restrained 1.06 lift on hover, not a bounce. Disabled under
          // reduced motion so touch users get no movement they cannot trigger.
          interactive &&
            'origin-center transition-transform duration-300 group-hover:scale-[1.06] motion-reduce:transform-none motion-reduce:group-hover:scale-100',
        )}
        strokeWidth={strokeWidth}
      />
    </span>
  );
}

export default IconBadge;
