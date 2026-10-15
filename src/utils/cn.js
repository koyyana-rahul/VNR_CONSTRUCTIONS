/**
 * Small class-name joiner.
 * Falsy values are dropped so conditional Tailwind classes stay readable:
 *   cn('btn', isGold && 'btn-gold', className)
 */
export function cn(...parts) {
  return parts.flat(Infinity).filter(Boolean).join(' ');
}

export default cn;