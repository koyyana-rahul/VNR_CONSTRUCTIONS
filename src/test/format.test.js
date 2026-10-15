import { describe, it, expect } from 'vitest';
import { formatINR, formatNumber, formatINRCompact, toFiniteNumber } from '../utils/format.js';

describe('formatINR', () => {
  it('uses Indian digit grouping, not Western', () => {
    // The critical case: Western formatting would produce "12,345,678".
    expect(formatINR(12345678)).toBe('₹1,23,45,678');
    expect(formatINR(100000)).toBe('₹1,00,000');
    expect(formatINR(1000)).toBe('₹1,000');
  });

  it('never returns NaN or Infinity for hostile input', () => {
    expect(formatINR(NaN)).toBe('₹0');
    expect(formatINR(Infinity)).toBe('₹0');
    expect(formatINR(-Infinity)).toBe('₹0');
    expect(formatINR(undefined)).toBe('₹0');
    expect(formatINR(null)).toBe('₹0');
    expect(formatINR({})).toBe('₹0');
    expect(formatINR('not a number')).toBe('₹0');
  });

  it('accepts numeric strings', () => {
    expect(formatINR('250000')).toBe('₹2,50,000');
    expect(formatINR(' 250000 ')).toBe('₹2,50,000');
  });

  it('supports precise output when asked', () => {
    expect(formatINR(1234.567, { precise: true })).toContain('1,234.57');
  });
});

describe('formatNumber', () => {
  it('groups Indian digits without a currency symbol', () => {
    expect(formatNumber(12345678)).toBe('1,23,45,678');
  });
});

describe('formatINRCompact', () => {
  it('collapses large figures into Cr and L', () => {
    expect(formatINRCompact(25000000)).toBe('₹2.5 Cr');
    expect(formatINRCompact(1850000)).toBe('₹18.5 L');
    expect(formatINRCompact(45000)).toBe('₹45,000');
  });

  it('returns null for non-positive values so callers can skip rendering', () => {
    expect(formatINRCompact(0)).toBeNull();
    expect(formatINRCompact(-500)).toBeNull();
    expect(formatINRCompact(NaN)).toBeNull();
  });
});

describe('toFiniteNumber', () => {
  it('coerces safely with a fallback', () => {
    expect(toFiniteNumber('42')).toBe(42);
    expect(toFiniteNumber('', 7)).toBe(7);
    expect(toFiniteNumber('abc', 7)).toBe(7);
    expect(toFiniteNumber(undefined, 7)).toBe(7);
  });
});