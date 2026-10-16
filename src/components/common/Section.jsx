import { cn } from '../../utils/cn.js';

/**
 * Section wrapper — owns the vertical rhythm and the surface treatment.
 *
 * TONES are now the navy family, since this is a dark-luxury site:
 *   navy        #030A12  main ground
 *   navy2       #071727  raised surface
 *   navy3       #102A3D  cards
 *   navyGradient          gradient ground for the highlights strip
 *   blackBlue   #02070D  deepest — used behind the footer/topbar
 *
 * Spacing is mobile-first: 16-unit vertical rhythm on a 320px phone still
 * breathes, opening up to 24/32 once there is room.
 */
export function Section({
  as: Tag = 'section',
  tone = 'navy',
  spacing = 'default',
  id,
  className,
  children,
  ...rest
}) {
  const tones = {
    navy: 'bg-navy text-text-secondary',
    navy2: 'bg-navy-2 text-text-secondary',
    navy3: 'bg-navy-3 text-text-secondary',
    blackBlue: 'bg-black-blue text-text-secondary',
    navyGradient: 'bg-gradient-to-b from-navy-2 via-navy to-navy text-text-secondary',
    ivory: 'bg-ivory text-navy on-light',
    white: 'bg-white text-navy on-light',
    mist: 'bg-ivory text-navy on-light',
  };

  const spacings = {
    none: '',
    tight: 'py-12 sm:py-16 lg:py-20',
    default: 'py-16 sm:py-20 lg:py-28',
    loose: 'py-20 sm:py-28 lg:py-32',
  };

  return (
    <Tag id={id} className={cn(tones[tone], spacings[spacing], className)} {...rest}>
      {children}
    </Tag>
  );
}

export default Section;