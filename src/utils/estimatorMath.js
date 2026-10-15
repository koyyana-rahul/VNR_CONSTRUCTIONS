/**
 * ============================================================================
 * ESTIMATOR MATHEMATICS — PURE FUNCTIONS
 * ============================================================================
 *
 * Formulae are fixed by the brief and must not be "improved":
 *
 *   areaSqFt      = areaSqM x 10.7639
 *   baseEstimate  = areaSqFt x configuredRatePerSqFt
 *   subtotal      = baseEstimate + additionalCosts
 *   contingency   = subtotal x contingencyPercentage / 100
 *   estimatedTotal= subtotal + contingency
 *
 * Keeping this pure (no React, no config side effects beyond lookups) means
 * every branch — including invalid input — is unit-testable without mounting
 * a component.
 */

import {
  AREA_LIMITS,
  CONTINGENCY_LIMITS,
  BASE_RATES_PER_SQFT,
  ADDITIONAL_OPTIONS,
  getConstructionType,
  getFinishLevel,
  getUnit,
} from '../config/estimator.js';

/**
 * Validate a raw area entry.
 * @returns {{ valid: boolean, value: number, error: string|null }}
 */
export function validateArea(rawArea, unitId) {
  const raw = typeof rawArea === 'string' ? rawArea.trim() : rawArea;

  if (raw === '' || raw === null || raw === undefined) {
    return { valid: false, value: 0, error: 'Enter your built-up area.' };
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return { valid: false, value: 0, error: 'Area must be a number.' };
  }
  if (parsed <= 0) {
    return { valid: false, value: 0, error: 'Area must be greater than zero.' };
  }
  if (parsed < AREA_LIMITS.min) {
    return {
      valid: false,
      value: parsed,
      error: `Area must be at least ${AREA_LIMITS.min.toLocaleString('en-IN')} ${getUnit(unitId).short}.`,
    };
  }
  if (parsed > AREA_LIMITS.max) {
    return {
      valid: false,
      value: parsed,
      error: `Area must be below ${AREA_LIMITS.max.toLocaleString('en-IN')} ${getUnit(unitId).short}.`,
    };
  }
  return { valid: true, value: parsed, error: null };
}

/**
 * Validate a raw contingency entry.
 * @returns {{ valid: boolean, value: number, error: string|null }}
 */
export function validateContingency(raw) {
  const parsed = typeof raw === 'string' ? Number(raw.trim()) : Number(raw);
  if (!Number.isFinite(parsed)) {
    return { valid: false, value: 0, error: 'Contingency must be a number.' };
  }
  if (parsed < CONTINGENCY_LIMITS.min || parsed > CONTINGENCY_LIMITS.max) {
    return {
      valid: false,
      value: parsed,
      error: `Use ${CONTINGENCY_LIMITS.min}–${CONTINGENCY_LIMITS.max}%.`,
    };
  }
  return { valid: true, value: parsed, error: null };
}

/** Convert any supported unit to square feet. */
export function toSquareFeet(area, unitId) {
  const unit = getUnit(unitId);
  return area * unit.conversionToSqFt;
}

/** Base rate (INR/sq ft) after applying the finish-level multiplier. */
export function getEffectiveRate(constructionTypeId, finishLevelId) {
  const base = BASE_RATES_PER_SQFT[constructionTypeId] ?? 0;
  const finish = getFinishLevel(finishLevelId);
  return base * (finish.multiplier ?? 1);
}

/**
 * Full estimate breakdown.
 *
 * @param {object} input
 * @param {string} input.constructionTypeId
 * @param {string} input.finishLevelId
 * @param {string|number} input.area
 * @param {string} input.unitId
 * @param {string[]} input.additionalIds
 * @param {string|number} input.contingencyPercent
 * @returns {{
 *   valid: boolean,
 *   errors: string[],
 *   areaSqFt: number,
 *   ratePerSqFt: number,
 *   baseEstimate: number,
 *   additionalCosts: number,
 *   additions: Array,
 *   subtotal: number,
 *   contingencyPercent: number,
 *   contingency: number,
 *   estimatedTotal: number
 * }}
 */
export function calculateEstimate(input) {
  const {
    constructionTypeId,
    finishLevelId,
    area,
    unitId,
    additionalIds = [],
    contingencyPercent = 0,
  } = input ?? {};

  const errors = [];

  const areaResult = validateArea(area, unitId);
  if (!areaResult.valid) errors.push(areaResult.error);

  const contingencyResult = validateContingency(contingencyPercent);
  if (!contingencyResult.valid) errors.push(contingencyResult.error);

  // Selections that fell back to a default still produce a valid estimate, so
  // we compute with the resolved values but surface the validation errors.
  const constructionType = getConstructionType(constructionTypeId);
  const finishLevel = getFinishLevel(finishLevelId);

  const areaSqFt = areaResult.valid ? toSquareFeet(areaResult.value, unitId) : 0;
  const ratePerSqFt = getEffectiveRate(constructionTypeId, finishLevelId);
  const baseEstimate = areaSqFt * ratePerSqFt;

  // Only count additions the estimator knows about — protects against a stale
  // or hand-edited state referencing an option that no longer exists.
  const selected = new Set(additionalIds);
  const additions = ADDITIONAL_OPTIONS.filter((option) => selected.has(option.id)).map(
    (option) => ({
      id: option.id,
      label: option.label,
      price: option.price,
      // Surfaced in the UI so it is obvious which extras are already inside
      // the base rate and therefore switched off by default.
      includedInRate: !option.notIncludedInRate,
    }),
  );
  const additionalCosts = additions.reduce((sum, item) => sum + item.price, 0);

  const subtotal = baseEstimate + additionalCosts;
  const contingency = subtotal * (contingencyResult.valid ? contingencyResult.value : 0) / 100;
  const estimatedTotal = subtotal + contingency;

  return {
    valid: errors.length === 0,
    errors,
    areaSqFt,
    ratePerSqFt,
    baseEstimate,
    additionalCosts,
    additions,
    subtotal,
    contingencyPercent: contingencyResult.valid ? contingencyResult.value : 0,
    contingency,
    estimatedTotal,
    constructionType,
    finishLevel,
  };
}

/**
 * Turn estimator state into a plain-text summary for the quotation request.
 * Prefilled into the enquiry form so the user never retypes their numbers.
 */
export function buildEstimateSummary(estimate) {
  if (!estimate?.valid) return '';
  const lines = [
    `Construction type: ${estimate.constructionType.label}`,
    `Finish level: ${estimate.finishLevel.label}`,
    `Built-up area: ~${Math.round(estimate.areaSqFt).toLocaleString('en-IN')} sq ft`,
    `Indicative total: INR ${Math.round(estimate.estimatedTotal).toLocaleString('en-IN')} (illustrative)`,
  ];
  return lines.join('\n');
}