import { describe, it, expect } from 'vitest';
import {
  phoneSchema,
  contactFormSchema,
  contactDefaults,
} from '../utils/validation.js';
import { contactFormSchema as schema } from '../utils/validation.js';
import {
  formatINR,
  formatNumber,
  formatINRCompact,
  toFiniteNumber,
} from '../utils/format.js';
import {
  calculateEstimate,
  validateArea,
  validateContingency,
  toSquareFeet,
  getEffectiveRate,
  buildEstimateSummary,
} from '../utils/estimatorMath.js';
import { SQUARE_FEET_PER_SQUARE_METRE } from '../config/estimator.js';
import { buildWhatsAppMessage, buildQuickEnquiryMessage } from '../services/enquiry.js';

/* ==========================================================================
   INDIAN PHONE VALIDATION
   ========================================================================== */

describe('phoneSchema', () => {
  it('accepts real Indian mobile formats', () => {
    ['9876543210', '98765 43210', '98765-43210', '+91 98765 43210', '919876543210', '09876543210'].forEach(
      (input) => {
        expect(phoneSchema.safeParse(input).success, input).toBe(true);
      },
    );
  });

  it('rejects numbers that cannot be an Indian mobile', () => {
    ['', '123', '1234567890', '98765432', '987654321012345', 'abcdefghij'].forEach((input) => {
      expect(phoneSchema.safeParse(input).success, input).toBe(false);
    });
  });

  it('rejects landline-style numbers starting below 6', () => {
    expect(phoneSchema.safeParse('5123456789').success).toBe(false);
  });
});

describe('contactFormSchema', () => {
  const valid = {
    fullName: 'Anita Rao',
    phone: '9876543210',
    service: 'Modular Kitchens',
    location: 'Gachibowli, Hyderabad',
    consent: true,
  };

  it('accepts a valid submission', () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it('requires consent to be literally true', () => {
    expect(contactFormSchema.safeParse({ ...valid, consent: 'yes' }).success).toBe(false);
  });

  it('treats an empty optional message as valid', () => {
    expect(contactFormSchema.safeParse({ ...valid, message: '' }).success).toBe(true);
  });

  it('rejects an over-long message', () => {
    expect(contactFormSchema.safeParse({ ...valid, message: 'x'.repeat(1300) }).success).toBe(
      false,
    );
  });

  it('exposes sensible defaults', () => {
    expect(contactDefaults.consent).toBe(false);
    expect(schema).toBe(contactFormSchema);
  });
});

/* ==========================================================================
   INR FORMATTING
   ========================================================================== */

describe('formatINR', () => {
  it('uses Indian digit grouping, not Western', () => {
    // The critical case: Western formatting would give "12,345,678".
    expect(formatINR(12345678)).toBe('₹1,23,45,678');
    expect(formatINR(1799)).toBe('₹1,799');
  });

  it('never returns NaN or Infinity for hostile input', () => {
    [NaN, Infinity, -Infinity, undefined, null, {}, 'not a number'].forEach((v) => {
      expect(formatINR(v)).toBe('₹0');
    });
  });

  it('accepts numeric strings', () => {
    expect(formatINR('250000')).toBe('₹2,50,000');
  });
});

describe('formatNumber / formatINRCompact', () => {
  it('groups Indian digits without a currency symbol', () => {
    expect(formatNumber(12345678)).toBe('1,23,45,678');
  });

  it('collapses large figures into Cr and L', () => {
    expect(formatINRCompact(25000000)).toBe('₹2.5 Cr');
    expect(formatINRCompact(1850000)).toBe('₹18.5 L');
  });

  it('returns null for non-positive values so callers can skip rendering', () => {
    expect(formatINRCompact(0)).toBeNull();
    expect(formatINRCompact(NaN)).toBeNull();
  });
});

describe('toFiniteNumber', () => {
  it('coerces safely with a fallback', () => {
    expect(toFiniteNumber('42')).toBe(42);
    expect(toFiniteNumber('', 7)).toBe(7);
    expect(toFiniteNumber('abc', 7)).toBe(7);
  });
});

/* ==========================================================================
   ESTIMATOR MATHS
   ========================================================================== */

describe('unit conversion', () => {
  it('converts square metres using the mandated factor of 10.7639', () => {
    expect(SQUARE_FEET_PER_SQUARE_METRE).toBe(10.7639);
    expect(toSquareFeet(100, 'sqm')).toBeCloseTo(1076.39, 2);
  });

  it('leaves square feet unchanged', () => {
    expect(toSquareFeet(2000, 'sqft')).toBe(2000);
  });
});

describe('validateArea', () => {
  it('rejects empty, zero, negative and non-numeric input', () => {
    expect(validateArea('', 'sqft').valid).toBe(false);
    expect(validateArea(0, 'sqft').valid).toBe(false);
    expect(validateArea(-500, 'sqft').valid).toBe(false);
    expect(validateArea('abc', 'sqft').valid).toBe(false);
  });

  it('enforces the configured bounds', () => {
    expect(validateArea(50, 'sqft').valid).toBe(false);
    expect(validateArea(999999, 'sqft').valid).toBe(false);
    expect(validateArea(2000, 'sqft').valid).toBe(true);
  });
});

describe('validateContingency', () => {
  it('accepts 0-30 and rejects outside it', () => {
    expect(validateContingency(0).valid).toBe(true);
    expect(validateContingency(30).valid).toBe(true);
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

  it('applies the brief formulas end to end', () => {
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

    expect(result.baseEstimate).toBeCloseTo(baseEstimate, 6);
    expect(result.subtotal).toBeCloseTo(subtotal, 6);
    expect(result.contingency).toBeCloseTo(subtotal * 0.05, 6);
    expect(result.estimatedTotal).toBeCloseTo(subtotal + subtotal * 0.05, 6);
    expect(result.valid).toBe(true);
  });

  it('reports invalid input instead of a bogus figure', () => {
    const result = calculateEstimate({ ...base, area: -100 });
    expect(result.valid).toBe(false);
    expect(result.estimatedTotal).toBe(0);
  });

  it('ignores unknown additional-work ids rather than crashing', () => {
    const result = calculateEstimate({ ...base, additionalIds: ['nope', 'borewell'] });
    expect(result.additions).toHaveLength(1);
  });

  it('survives being called with no arguments at all', () => {
    expect(() => calculateEstimate()).not.toThrow();
    expect(calculateEstimate().valid).toBe(false);
  });

  it('produces an empty summary for an invalid estimate', () => {
    expect(buildEstimateSummary(calculateEstimate({ area: 0 }))).toBe('');
  });
});

/* ==========================================================================
   WHATSAPP MESSAGE BUILDING
   ========================================================================== */

describe('buildWhatsAppMessage', () => {
  it('includes supplied fields and omits the blanks', () => {
    const message = buildWhatsAppMessage({
      fullName: 'Anita Rao',
      phone: '9876543210',
      service: 'Modular Kitchens',
      location: 'Gachibowli',
      message: 'Two bedrooms.',
    });

    expect(message).toContain('Anita Rao');
    expect(message).toContain('9876543210');
    expect(message).toContain('Modular Kitchens');
    expect(message).toContain('Gachibowli');
    expect(message).toContain('Two bedrooms.');
  });

  it('carries the estimator summary through', () => {
    const message = buildWhatsAppMessage({
      fullName: 'Anita Rao',
      phone: '9876543210',
      estimateSummary: 'Indicative total: INR 54,45,000 (illustrative)',
    });
    expect(message).toContain('--- Estimator result ---');
  });

  it('truncates very long messages rather than producing a dead link', () => {
    const message = buildWhatsAppMessage({
      fullName: 'A',
      phone: '9876543210',
      message: 'x'.repeat(5000),
    });
    expect(message.length).toBeLessThanOrEqual(1200);
  });
});

describe('buildQuickEnquiryMessage', () => {
  it('stays short and includes the name', () => {
    const message = buildQuickEnquiryMessage({ fullName: 'Anita Rao' });
    expect(message).toContain('Anita Rao');
    expect(message.length).toBeLessThan(400);
  });
});