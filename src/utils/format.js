/**
 * Number & currency formatting.
 *
 * The estimator must render Indian currency correctly: the Indian numbering
 * system groups the last three digits, then every pair before them —
 * 1,23,45,678 — which `Intl.NumberFormat('en-IN')` handles natively.
 *
 * All public functions are defensive: they receive values straight from form
 * inputs and must never throw or return "NaN"/"Infinity" to the screen.
 */

/** Coerce anything to a finite number, or fall back. */
export function toFiniteNumber(value, fallback = 0) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return fallback;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrFormatterPrecise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

/**
 * Format as Indian rupees, rounded to the nearest rupee.
 * @example formatINR(12345678) === '₹1,23,45,678'
 * @example formatINR(NaN)        === '₹0'
 */
export function formatINR(value, { precise = false } = {}) {
  const amount = toFiniteNumber(value, 0);
  return (precise ? inrFormatterPrecise : inrFormatter).format(amount);
}

/** Format a plain number with Indian grouping (no currency symbol). */
export function formatNumber(value) {
  return numberFormatter.format(toFiniteNumber(value, 0));
}

/**
 * Compact Indian notation for headline figures, e.g. ₹1.24 Cr / ₹8.5 L.
 * Returns null for non-positive input so callers can skip rendering entirely
 * rather than showing a meaningless "₹0".
 */
export function formatINRCompact(value) {
  const amount = toFiniteNumber(value, 0);
  if (amount <= 0) return null;

  const crore = 10_000_000;
  const lakh = 100_000;

  if (amount >= crore) {
    return `₹${trim(amount / crore)} Cr`;
  }
  if (amount >= lakh) {
    return `₹${trim(amount / lakh)} L`;
  }
  return formatINR(amount);
}

/** Up to 2 decimals, trailing zeros removed. */
function trim(value) {
  return Number(value.toFixed(2)).toString();
}

/** Current year, for the footer copyright. Evaluated at render time. */
export function currentYear() {
  return new Date().getFullYear();
}

/**
 * Build a readable address string, skipping unverified/empty parts.
 * Returns null when there is nothing verified to show.
 */
export function formatAddress(address) {
  if (!address) return null;
  const parts = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(', '),
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.length ? parts.join('\n') : null;
}

/** Turn "12-34/5, 3rd Cross, Indiranagar" into "12-34/5, 3rd Cross, Indiranagar". */
export function formatLocation(city, area) {
  return [area, city].filter(Boolean).join(', ');
}