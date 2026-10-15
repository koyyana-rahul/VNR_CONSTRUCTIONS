import { describe, it, expect } from 'vitest';
import {
  calculateEstimate,
  validateArea,
  validateContingency,
  toSquareFeet,
  getEffectiveRate,
  buildEstimateSummary,
} from '../utils/estimatorMath.js';
import { SQUARE_FEET_PER_SQUARE_METRE } from '../config/estimator.js';

/**
 * The estimator formulas are fixed by the brief, so these tests assert the
 * exact arithmetic rather than approximate output.
 */
describe('unit conversion', () => {
  it('converts square metres using the mandated factor of 10.7639', () => {
    expect(SQUARE_FEET_PER_SQUARE_METRE).toBe(10.7639);
    expect(toSquareFeet(100, 'sqm')).toBeCloseTo(1076.39, 2);
    expect(toSquareFeet(1, 'sqm')).toBeCloseTo(10.7639, 4);
  });

  it('leaves square feet unchanged', () => {
    expect(toSquareFeet(2000, 'sqft')).toBe(2000);
  });
});

describe('validateArea', () => {
  it('rejects empty input', () => {
    const r = validateArea('', 'sqft');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/enter/i);
  });

  it('rejects zero and negative areas', () => {
    expect(validateArea(0, 'sqft').valid).toBe(false);
    expect(validateArea(-500, 'sqft').valid).toBe(false);
  });

  it('rejects non-numeric input', () => {
    expect(validateArea('abc', 'sqft').valid).toBe(false);
  });

  it('enforces the configured bounds', () => {
    expect(validateArea(50, 'sqft').valid).toBe(false);
    expect(validateArea(999999, 'sqft').valid).toBe(false);
    expect(validateArea(2000, 'sqft').valid).toBe(true);
  });
});

describe('validateContingency', () => {
  it('accepts 0 through 30', () => {
    expect(validateContingency(0).valid).toBe(true);
    expect(validateContingency(15).valid).toBe(true);
    expect(validateContingency(30).valid).toBe(true);
  });

  it('rejects out-of-range and non-numeric values', () => {
    expect(validateContingency(-1).valid).toBe(false);
    expect(validateContingency(31).valid).toBe(false);
    expect(validateContingency('abc').valid).toBe(false);
  });
});

describe('calculateEstimate', () => {
  const base = {
    constructionTypeId: 'independent-home',
    finishLevelId: 'essential',
    area: 2000,
    unitId: 'sqft',
    additionalIds: [],
    contingencyPercent: 0,
  };

  it('applies baseEstimate = area x rate', () => {
    const rate = getEffectiveRate('independent-home', 'essential');
    const result = calculateEstimate(base);
    expect(result.ratePerSqFt).toBe(rate);
    expect(result.baseEstimate).toBe(2000 * rate);
  });

  it('applies the finish-level multiplier to the rate', () => {
    const essential = getEffectiveRate('independent-home', 'essential');
    const luxury = getEffectiveRate('independent-home', 'luxury');
    expect(luxury).toBeCloseTo(essential * 1.65, 5);
  });

  it('computes subtotal = base + additions', () => {
    const result = calculateEstimate({ ...base, additionalIds: ['borewell', 'carport'] });
    expect(result.additions).toHaveLength(2);
    expect(result.additionalCosts).toBe(185000 + 240000);
    expect(result.subtotal).toBe(result.baseEstimate + result.additionalCosts);
  });

  it('computes contingency = subtotal x pct / 100 and adds it to the total', () => {
    const result = calculateEstimate({ ...base, contingencyPercent: 10 });
    expect(result.contingency).toBeCloseTo(result.subtotal * 0.1, 6);
    expect(result.estimatedTotal).toBeCloseTo(result.subtotal + result.contingency, 6);
  });

  it('follows the full chain end to end for a sqm input', () => {
    const result = calculateEstimate({
      constructionTypeId: 'villa-duplex',
      finishLevelId: 'premium',
      area: 100,
      unitId: 'sqm',
      additionalIds: ['solar'],
      contingencyPercent: 5,
    });

    const areaSqFt = 100 * 10.7639;
    const rate = getEffectiveRate('villa-duplex', 'premium');
    const baseEstimate = areaSqFt * rate;
    const subtotal = baseEstimate + 165000;
    const contingency = subtotal * 0.05;

    expect(result.areaSqFt).toBeCloseTo(areaSqFt, 6);
    expect(result.baseEstimate).toBeCloseTo(baseEstimate, 6);
    expect(result.subtotal).toBeCloseTo(subtotal, 6);
    expect(result.contingency).toBeCloseTo(contingency, 6);
    expect(result.estimatedTotal).toBeCloseTo(subtotal + contingency, 6);
    expect(result.valid).toBe(true);
  });

  it('reports invalid input instead of producing a bogus figure', () => {
    const result = calculateEstimate({ ...base, area: -100 });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.baseEstimate).toBe(0);
    expect(result.estimatedTotal).toBe(0);
  });

  it('ignores unknown additional-work ids rather than crashing', () => {
    const result = calculateEstimate({
      ...base,
      additionalIds: ['not-a-real-option', 'borewell'],
    });
    expect(result.additions).toHaveLength(1);
    expect(result.additionalCosts).toBe(185000);
  });

  it('marks items already inside the base rate', () => {
    const result = calculateEstimate({
      ...base,
      additionalIds: ['compound-wall', 'solar'],
    });
    const [compoundWall, solar] = result.additions;
    expect(compoundWall.label).toBe('Compound / boundary wall');
    expect(solar.id).toBe('solar');
  });

  it('survives being called with no arguments at all', () => {
    expect(() => calculateEstimate()).not.toThrow();
    expect(calculateEstimate().valid).toBe(false);
  });
});

describe('buildEstimateSummary', () => {
  it('returns an empty string for an invalid estimate', () => {
    expect(buildEstimateSummary(calculateEstimate({ area: 0 }))).toBe('');
  });

  it('produces a readable multi-line summary', () => {
    const summary = buildEstimateSummary(
      calculateEstimate({
        constructionTypeId: 'independent-home',
        finishLevelId: 'essential',
        area: 2000,
        unitId: 'sqft',
        additionalIds: [],
        contingencyPercent: 5,
      }),
    );
    expect(summary).toContain('Independent House');
    expect(summary).toContain('2,000 sq ft');
    expect(summary).toContain('illustrative');
  });
});