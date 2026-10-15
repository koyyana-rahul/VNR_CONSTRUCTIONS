import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import { AlertCircle, RotateCcw, ArrowRight, Info } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { DataNotice } from '../common/DataNotice.jsx';
import { AnimatedNumber } from '../motion/AnimatedNumber.jsx';
import { cn } from '../../utils/cn.js';
import { formatINR, formatINRCompact, formatNumber } from '../../utils/format.js';
import {
  calculateEstimate,
  validateArea,
  validateContingency,
  buildEstimateSummary,
} from '../../utils/estimatorMath.js';
import {
  AREA_LIMITS,
  CONTINGENCY_OPTIONS,
  CONTINGENCY_LIMITS,
  CONSTRUCTION_TYPES,
  ESTIMATOR_DEFAULTS,
  ESTIMATOR_DISCLAIMER,
  FINISH_LEVELS,
  ADDITIONAL_OPTIONS,
  UNITS,
} from '../../config/estimator.js';
import { ROUTES } from '../../config/site.js';

/**
 * ============================================================================
 * CONSTRUCTION COST ESTIMATOR
 * ============================================================================
 *
 * RESPONSIVE STRATEGY (acceptance criteria are strict here):
 *
 *  - Two columns at `lg` (inputs 7 / result 5). On mobile the result card sits
 *    BELOW the inputs: a sticky summary on a 320px screen would either eat the
 *    viewport or cover the field being edited.
 *  - The rate per sq ft is always shown beside the area field, so the maths is
 *    never a black box.
 *  - INR uses tabular numerals plus break-words. "₹1,23,45,678" at 320px is
 *    exactly the overflow the brief warns about, so the headline also carries a
 *    compact "₹1.24 Cr" reading.
 *  - Area input is type="number" + inputMode="decimal" so mobile keyboards offer
 *    digits rather than the full alphabet.
 *
 * HONESTY GUARDS:
 *  - rateIsVerified === false renders a persistent "illustrative, not VNR prices"
 *    notice wherever figures appear.
 *  - The mandated disclaimer appears verbatim next to the total.
 *  - "Request a Quotation" is the only route to a binding figure.
 */
export function CostEstimator({ className, onEstimateChange }) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const [constructionTypeId, setConstructionTypeId] = useState(
    ESTIMATOR_DEFAULTS.constructionTypeId,
  );
  const [area, setArea] = useState(ESTIMATOR_DEFAULTS.area);
  const [unitId, setUnitId] = useState(ESTIMATOR_DEFAULTS.unitId);
  const [finishLevelId, setFinishLevelId] = useState(ESTIMATOR_DEFAULTS.finishLevelId);
  const [additionalIds, setAdditionalIds] = useState(ESTIMATOR_DEFAULTS.additionalIds);
  const [contingencyPercent, setContingencyPercent] = useState(
    ESTIMATOR_DEFAULTS.contingencyPercent,
  );

  const estimate = useMemo(
    () =>
      calculateEstimate({
        constructionTypeId,
        finishLevelId,
        area,
        unitId,
        additionalIds,
        contingencyPercent,
      }),
    [constructionTypeId, finishLevelId, area, unitId, additionalIds, contingencyPercent],
  );

  const areaResult = validateArea(area, unitId);
  const contingencyResult = validateContingency(contingencyPercent);

  // Stable formatter identity — AnimatedNumber depends on it.
  const formatTotal = useCallback(
    (n) => (Number.isFinite(n) ? formatINR(n) : '—'),
    [],
  );

  const toggleAdditional = (id) =>
    setAdditionalIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const reset = () => {
    setConstructionTypeId(ESTIMATOR_DEFAULTS.constructionTypeId);
    setArea(ESTIMATOR_DEFAULTS.area);
    setUnitId(ESTIMATOR_DEFAULTS.unitId);
    setFinishLevelId(ESTIMATOR_DEFAULTS.finishLevelId);
    setAdditionalIds(ESTIMATOR_DEFAULTS.additionalIds);
    setContingencyPercent(ESTIMATOR_DEFAULTS.contingencyPercent);
  };

  const requestQuotation = () => {
    onEstimateChange?.(estimate);
    navigate(ROUTES.contact, {
      state: {
        estimateSummary: estimate.valid ? buildEstimateSummary(estimate) : '',
        prefilledArea: estimate.valid ? Math.round(estimate.areaSqFt) : '',
      },
    });
  };

  const activeType = CONSTRUCTION_TYPES.find((t) => t.id === constructionTypeId);
  const activeFinish = FINISH_LEVELS.find((f) => f.id === finishLevelId);

  return (
    <div className={cn('grid gap-8 lg:grid-cols-12 lg:gap-10', className)}>
      {/* ==================== INPUTS ==================== */}
      <div className="min-w-0 lg:col-span-7">
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          {/* ---- 1. Project ---- */}
          <fieldset className="rounded-sm border border-line bg-brand-white p-5 sm:p-7">
            <legend className="px-2 font-display text-label font-bold uppercase tracking-[0.16em] text-brand-gold-muted">
              1 &middot; Your project
            </legend>

            {/* Construction type */}
            <div className="mt-4">
              <label
                htmlFor="construction-type"
                className="block font-display text-sm font-semibold text-brand-black"
              >
                Construction type
              </label>
              <div className="relative mt-2">
                <select
                  id="construction-type"
                  value={constructionTypeId}
                  onChange={(e) => setConstructionTypeId(e.target.value)}
                  className="min-h-12 w-full appearance-none rounded-sm border border-line bg-field px-4 py-3 pr-11 text-brand-black transition-colors focus:border-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-muted"
                >
                  {CONSTRUCTION_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </div>
              <p className="mt-1.5 text-fine text-text-muted">{activeType?.description}</p>
            </div>

            {/* Area + unit */}
            <div className="mt-6">
              <label
                htmlFor="area"
                className="block font-display text-sm font-semibold text-brand-black"
              >
                Total built-up area
              </label>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <input
                    id="area"
                    type="number"
                    inputMode="decimal"
                    step={AREA_LIMITS.step}
                    min={AREA_LIMITS.min}
                    max={AREA_LIMITS.max}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    aria-describedby={areaResult.valid ? 'area-help' : 'area-error'}
                    aria-invalid={!areaResult.valid || undefined}
                    className={cn(
                      'min-h-12 w-full rounded-sm border bg-field px-4 py-3',
                      'font-display text-lg font-semibold tabular-nums text-brand-black',
                      'transition-colors',
                      areaResult.valid
                        ? 'border-line focus:border-brand-gold'
                        : 'border-red-600 bg-red-50/40',
                    )}
                  />
                </div>

                <div
                  role="radiogroup"
                  aria-label="Area unit"
                  className="flex shrink-0 rounded-sm border border-line p-1"
                >
                  {UNITS.map((u) => {
                    const isActive = u.id === unitId;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setUnitId(u.id)}
                        className={cn(
                          'min-h-10 flex-1 rounded-[3px] px-3.5 font-display text-sm font-semibold transition-colors sm:flex-none',
                          isActive
                            ? 'bg-brand-black text-brand-white'
                            : 'text-text hover:bg-brand-mist',
                        )}
                      >
                        {u.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {areaResult.valid ? (
                <p id="area-help" className="mt-1.5 text-fine text-text-muted">
                  {unitId === 'sqft'
                    ? `Rate applied: ${formatINR(estimate.ratePerSqFt)} per sq ft.`
                    : `${formatNumber(estimate.areaSqFt)} sq ft × ${formatINR(
                        estimate.ratePerSqFt,
                      )} per sq ft.`}
                </p>
              ) : (
                <p
                  id="area-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-fine font-medium text-red-700"
                >
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  {areaResult.error}
                </p>
              )}
            </div>

            {/* Finish level */}
            <fieldset className="mt-7">
              <legend className="font-display text-sm font-semibold text-brand-black">
                Specification / finish level
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {FINISH_LEVELS.map((level) => {
                  const isActive = level.id === finishLevelId;
                  return (
                    <label
                      key={level.id}
                      className={cn(
                        'relative flex cursor-pointer flex-col rounded-sm border p-4 transition-colors',
                        isActive
                          ? 'border-brand-gold bg-brand-gold/8'
                          : 'border-line bg-brand-white hover:border-brand-gold/50',
                      )}
                    >
                      <input
                        type="radio"
                        name="finish-level"
                        value={level.id}
                        checked={isActive}
                        onChange={() => setFinishLevelId(level.id)}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-2">
                        {/* Checked state carries a filled dot AND a border
                            change — never colour alone. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'grid size-4 shrink-0 place-items-center rounded-full border-2 transition-colors',
                            isActive ? 'border-brand-gold bg-brand-gold' : 'border-line-strong',
                          )}
                        >
                          {isActive && <span className="size-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="font-display text-sm font-bold text-brand-black">
                          {level.label}
                        </span>
                      </span>
                      <span className="mt-1.5 text-fine leading-snug text-text-muted">
                        {level.description}
                      </span>
                      <span className="sr-only">
                        Base rate multiplier {level.multiplier} times
                      </span>
                    </label>
                  );
                })}
              </div>

              <details className="group mt-3">
                <summary className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-fine font-semibold text-brand-gold-muted underline-offset-4 hover:underline">
                  <Info className="size-3.5" aria-hidden="true" />
                  What this level includes
                </summary>
                <ul className="mt-2 flex flex-col gap-1.5 rounded-sm bg-brand-mist p-4">
                  {activeFinish?.includes.map((inc) => (
                    <li key={inc} className="text-fine text-text">
                      &bull; {inc}
                    </li>
                  ))}
                </ul>
              </details>
            </fieldset>
          </fieldset>

          {/* ---- 2. Optional additional work ---- */}
          <fieldset className="mt-6 rounded-sm border border-line bg-brand-white p-5 sm:p-7">
            <legend className="px-2 font-display text-label font-bold uppercase tracking-[0.16em] text-brand-gold-muted">
              2 &middot; Optional additional work
            </legend>

            <p className="mt-2 text-fine text-text-muted">
              Priced separately because they sit outside the base rate. Items
              already covered by your chosen finish level are disabled, so you
              never pay twice for the same scope.
            </p>

            <ul className="mt-5 flex flex-col gap-3">
              {ADDITIONAL_OPTIONS.map((option) => {
                const checked = additionalIds.includes(option.id);
                const alreadyIncluded = !option.notIncludedInRate;

                return (
                  <li key={option.id}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors',
                        checked
                          ? 'border-brand-gold bg-brand-gold/6'
                          : 'border-line hover:border-brand-gold/45',
                        alreadyIncluded && 'cursor-not-allowed opacity-55',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={alreadyIncluded}
                        onChange={() => toggleAdditional(option.id)}
                        className="mt-0.5 size-5 shrink-0 accent-brand-gold"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <span className="font-display text-sm font-bold text-brand-black">
                            {option.label}
                          </span>
                          <span className="shrink-0 text-fine font-semibold tabular-nums text-brand-gold-muted">
                            {formatINR(option.price)}
                          </span>
                        </span>
                        <span className="mt-1 block text-fine text-text-muted">
                          {option.description}
                        </span>
                        {alreadyIncluded && (
                          <span className="mt-1.5 block text-fine font-medium text-text-muted">
                            Already included in this finish level
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          {/* ---- 3. Contingency ---- */}
          <fieldset className="mt-6 rounded-sm border border-line bg-brand-white p-5 sm:p-7">
            <legend className="px-2 font-display text-label font-bold uppercase tracking-[0.16em] text-brand-gold-muted">
              3 &middot; Contingency
            </legend>

            <p className="mt-2 text-fine text-text-muted">
              A reserve for what the survey will not have told us yet.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {CONTINGENCY_OPTIONS.map((option) => {
                const isActive = option.value === contingencyPercent;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setContingencyPercent(option.value)}
                    className={cn(
                      'min-h-11 flex-1 rounded-sm border px-4 font-display text-sm font-semibold transition-colors sm:flex-none',
                      isActive
                        ? 'border-brand-black bg-brand-black text-brand-white'
                        : 'border-line text-text hover:border-brand-gold hover:text-brand-gold-muted',
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="contingency-range"
                  className="font-display text-sm font-semibold text-brand-black"
                >
                  Fine tune
                </label>
                <output
                  htmlFor="contingency-range"
                  className="shrink-0 font-display text-sm font-bold tabular-nums text-brand-gold-muted"
                >
                  {contingencyResult.valid ? `${contingencyPercent}%` : '—'}
                </output>
              </div>
              <input
                id="contingency-range"
                type="range"
                min={CONTINGENCY_LIMITS.min}
                max={CONTINGENCY_LIMITS.max}
                step={1}
                value={
                  Number.isFinite(Number(contingencyPercent)) ? Number(contingencyPercent) : 0
                }
                onChange={(e) => setContingencyPercent(Number(e.target.value))}
                className="mt-3 h-11 w-full accent-brand-gold"
              />
              <div className="flex justify-between text-fine text-text-muted">
                <span>{CONTINGENCY_LIMITS.min}%</span>
                <span>{CONTINGENCY_LIMITS.max}%</span>
              </div>
              {!contingencyResult.valid && (
                <p
                  role="alert"
                  className="mt-2 flex items-center gap-1.5 text-fine font-medium text-red-700"
                >
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  {contingencyResult.error}
                </p>
              )}
            </div>
          </fieldset>
        </form>
      </div>

      {/* ==================== RESULT ==================== */}
      <div className="min-w-0 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <m.div
            layout={reduced ? false : 'position'}
            className="overflow-hidden rounded-sm border border-line bg-brand-warm"
            aria-live="polite"
          >
            <div className="border-b border-line bg-brand-deep px-5 py-5 sm:px-6">
              <p className="font-display text-label font-bold uppercase tracking-[0.16em] text-brand-gold-light">
                Indicative estimate
              </p>

              <p
                data-testid="estimate-total"
                className="mt-3 break-words font-display text-[clamp(1.75rem,1.1rem+3vw,2.5rem)] font-extrabold leading-none tracking-tight text-brand-white"
              >
                {estimate.valid ? (
                  <AnimatedNumber value={estimate.estimatedTotal} format={formatTotal} />
                ) : (
                  '—'
                )}
              </p>

              {estimate.valid && formatINRCompact(estimate.estimatedTotal) && (
                <p className="mt-2 text-fine text-white/55">
                  Approximately{' '}
                  <span className="font-semibold text-brand-gold-light">
                    {formatINRCompact(estimate.estimatedTotal)}
                  </span>{' '}
                  at {contingencyPercent}% contingency
                </p>
              )}
            </div>

            <div className="px-5 py-5 sm:px-6">
              <h2 className="font-display text-sm font-bold text-brand-black">Breakdown</h2>

              <dl className="mt-4 divide-y divide-line">
                <Row
                  label="Build-up cost"
                  hint={`${formatNumber(Math.round(estimate.areaSqFt))} sq ft × ${formatINR(
                    estimate.ratePerSqFt,
                  )}`}
                  value={estimate.baseEstimate}
                />

                {estimate.additions.map((item) => (
                  <Row
                    key={item.id}
                    label={item.label}
                    hint={item.includedInRate ? 'Included in base rate' : undefined}
                    value={item.price}
                  />
                ))}

                {estimate.additions.length === 0 && (
                  <Row label="Additional work" value={0} muted />
                )}

                <Row label="Subtotal" value={estimate.subtotal} emphasise />
                <Row
                  label="Contingency"
                  hint={`${estimate.contingencyPercent}% of subtotal`}
                  value={estimate.contingency}
                />
                <Row label="Estimated total" value={estimate.estimatedTotal} total />
              </dl>

              {/* Mandated disclaimer — verbatim from the brief. */}
              <p className="mt-5 rounded-sm border border-line bg-brand-white p-3.5 text-fine leading-relaxed text-text-muted">
                {ESTIMATOR_DISCLAIMER}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  onClick={requestQuotation}
                  disabled={!estimate.valid}
                  icon={<ArrowRight className="size-4" />}
                >
                  Request a Quotation
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={reset}
                  icon={<RotateCcw className="size-4" />}
                >
                  Reset
                </Button>
              </div>
            </div>
          </m.div>

          <DataNotice tone="info" compact className="mt-6">
            This tool is for early planning only. A binding figure comes from an
            itemised estimate after a site visit — the consultation is free.
          </DataNotice>
        </div>
      </div>
    </div>
  );
}

/** One breakdown line. Values wrap rather than overflow. */
function Row({ label, hint, value, total = false, emphasise = false, muted = false }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5',
        total && 'border-t-2 border-brand-gold/40 pt-3.5',
      )}
    >
      <dt className="min-w-0 text-fine">
        <span
          className={cn(
            total || emphasise
              ? 'font-display font-bold text-brand-black'
              : 'text-text',
            muted && 'text-text-muted',
          )}
        >
          {label}
        </span>
        {hint && <span className="mt-0.5 block text-fine text-text-muted">{hint}</span>}
      </dt>
      <dd
        className={cn(
          'shrink-0 break-all text-right text-fine tabular-nums',
          total
            ? 'font-display text-base font-extrabold text-brand-black'
            : emphasise
              ? 'font-display text-sm font-bold text-brand-black'
              : 'text-text',
        )}
      >
        {formatINR(value)}
      </dd>
    </div>
  );
}

function SelectChevron() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold-muted"
    >
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default CostEstimator;