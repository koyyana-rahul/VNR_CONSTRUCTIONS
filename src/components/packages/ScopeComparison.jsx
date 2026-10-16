import { useState } from 'react';
import { Minus, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../motion/Reveal.jsx';
import { cn } from '../../utils/cn.js';
import { scopeOptions, compareScopes, countCapabilities } from '../../data/packages.js';

/**
 * ============================================================================
 * SCOPE COMPARISON TOOL
 * ============================================================================
 *
 * The brief asks for a comparison tool that lets a customer choose two
 * options. This is a SCOPE comparison, not a price comparison, because VNR has
 * not supplied a rate card — inventing prices would be the single most
 * damaging thing this site could do.
 *
 * RESPONSIVE STRATEGY for the table (acceptance criterion: "no unreadable
 * package comparisons on phones", "never allow a large desktop table to
 * overflow the mobile viewport"):
 *
 *   >= 768px  a real 3-column grid: capability | option A | option B.
 *             Column headers are sticky so the selected options stay visible
 *             while scrolling a long list.
 *
 *   <  768px  STACKED CARDS, not a shrunken table and not a horizontal
 *             scroller. Each capability becomes its own block showing both
 *             options side by side within that block. Nothing overflows and
 *             nothing needs sideways scrolling.
 *
 * Differences are marked with BOTH a colour change and a textual/graphic
 * signal (a filled check, a dash, and a "Differs" label), so the distinction
 * survives greyscale and colour-blind vision.
 */
export function ScopeComparison() {
  const [firstId, setFirstId] = useState(scopeOptions[0].id);
  const [secondId, setSecondId] = useState(scopeOptions[1].id);

  const first = scopeOptions.find((o) => o.id === firstId) ?? scopeOptions[0];
  const second = scopeOptions.find((o) => o.id === secondId) ?? scopeOptions[1];

  // Cheap pure derivation — no memo needed, and useMemo here would only
  // add a cache the React Compiler cannot preserve.
  const rows = compareScopes(firstId, secondId);
  const differingCount = rows.filter((r) => r.differs).length;

  const swap = () => {
    setFirstId(secondId);
    setSecondId(firstId);
  };

  return (
    <>
      {/* ---- Option pickers ---- */}
      <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        <OptionPicker
          label="Compare"
          value={firstId}
          onChange={setFirstId}
          // Prevent selecting the same option twice — the comparison would be
          // meaningless, and this is clearer than silently rendering identicals.
          disabledOptions={[secondId]}
          tone="a"
        />

        <div className="hidden lg:flex lg:justify-center lg:pb-3">
          <button
            type="button"
            onClick={swap}
            aria-label="Swap the two options"
            className="grid size-12 place-items-center rounded-full border border-line bg-brand-white text-brand-black transition-colors hover:border-brand-gold hover:text-brand-gold-muted"
          >
            <ArrowLeftRight className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="flex justify-center lg:hidden">
          <button
            type="button"
            onClick={swap}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line bg-brand-white px-4 font-display text-sm font-semibold text-text"
          >
            <ArrowLeftRight className="size-4" aria-hidden="true" />
            Swap options
          </button>
        </div>

        <OptionPicker
          label="With"
          value={secondId}
          onChange={setSecondId}
          disabledOptions={[firstId]}
          tone="b"
        />
      </Reveal>

      {/* ---- Summary of the selected pair ---- */}
      <Reveal className="mt-8 grid gap-4 sm:grid-cols-2">
        {[first, second].map((option, index) => (
          <article
            key={option.id}
            className={cn(
              'rounded-sm border p-5',
              index === 0 ? 'border-line bg-surface-warm' : 'border-brand-gold/45 bg-brand-gold/6',
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-h4 font-bold text-brand-black">
                {option.title}
              </h3>
              <span className="font-display text-label font-semibold tracking-[0.12em] text-brand-gold-muted">
                {countCapabilities(option)}/{rows.length} included
              </span>
            </div>
            <p className="mt-1.5 text-fine text-brand-gold-muted">{option.tagline}</p>
            <p className="mt-3 text-fine leading-relaxed text-text">{option.summary}</p>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-fine">
              <div>
                <dt className="font-semibold text-brand-black">Best for</dt>
                <dd className="text-text">{option.bestFor}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-black">Programme</dt>
                <dd className="text-text">{option.durationNote}</dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-line pt-4">
              <p className="font-semibold text-brand-black">Trade-offs</p>
              <ul className="mt-1.5 space-y-1.5">
                {option.tradeoffs.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-text">
                    <Minus className="mt-0.5 size-3.5 shrink-0 text-brand-gold-muted" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </Reveal>

      <p aria-live="polite" className="mt-6 text-fine text-text-muted">
        Comparing <strong className="text-brand-black">{first.title}</strong> with{' '}
        <strong className="text-brand-black">{second.title}</strong> —{' '}
        {differingCount === 0
          ? 'the two cover an identical scope.'
          : `${differingCount} of ${rows.length} capabilities differ.`}
      </p>

      {/* ---- Desktop table ---- */}
      <div className="mt-6 hidden md:block">
        <div className="overflow-hidden rounded-sm border border-line">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Capability comparison between {first.title} and {second.title}
            </caption>
            <thead className="sticky top-16 z-10 bg-brand-deep">
              <tr>
                <th scope="col" className="w-[38%] px-5 py-4 text-left font-display text-label font-bold uppercase tracking-[0.14em] text-brand-gold-light">
                  Capability
                </th>
                <th scope="col" className="px-5 py-4 font-display text-label font-bold uppercase tracking-[0.14em] text-brand-gold-light">
                  {first.title}
                </th>
                <th scope="col" className="px-5 py-4 font-display text-label font-bold uppercase tracking-[0.14em] text-brand-gold-light">
                  {second.title}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    row.differs ? 'bg-brand-gold/6' : 'bg-brand-white',
                  )}
                >
                  <th scope="row" className="px-5 py-4 align-top font-normal">
                    <span className="block font-display text-sm font-semibold text-brand-black">
                      {row.label}
                    </span>
                    <span className="mt-0.5 block text-fine text-text-muted">{row.hint}</span>
                    {row.differs && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-brand-gold/50 px-2 py-0.5 font-display text-[0.625rem] font-bold uppercase tracking-[0.1em] text-brand-gold-muted">
                        Differs
                      </span>
                    )}
                  </th>
                  <td className="px-5 py-4 align-top">
                    <Capability value={row.values.a} name={first.title} />
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Capability value={row.values.b} name={second.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Mobile stacked cards ---- */}
      <ul className="mt-6 flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <li
            key={row.id}
            className={cn(
              'rounded-sm border p-4',
              row.differs ? 'border-brand-gold/50 bg-brand-gold/6' : 'border-line bg-brand-white',
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-display text-sm font-bold text-brand-black">{row.label}</h3>
              {row.differs && (
                <span className="shrink-0 rounded-full border border-brand-gold/50 px-2 py-0.5 font-display text-[0.625rem] font-bold uppercase tracking-[0.1em] text-brand-gold-muted">
                  Differs
                </span>
              )}
            </div>
            <p className="mt-1 text-fine text-text-muted">{row.hint}</p>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  {first.title}
                </dt>
                <dd className="mt-1">
                  <Capability value={row.values.a} name={first.title} compact />
                </dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  {second.title}
                </dt>
                <dd className="mt-1">
                  <Capability value={row.values.b} name={second.title} compact />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Radio-style option picker. */
function OptionPicker({ label, value, onChange, disabledOptions, tone }) {
  return (
    <fieldset className="min-w-0">
      <legend className="font-display text-label font-bold uppercase tracking-[0.14em] text-brand-gold-muted">
        {label}
      </legend>
      <div className="mt-3 flex flex-col gap-2">
        {scopeOptions.map((option) => {
          const isActive = option.id === value;
          const isDisabled = disabledOptions.includes(option.id);
          const inputId = `${tone}-${option.id}`;

          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={cn(
                'flex min-h-14 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 transition-colors',
                isActive
                  ? 'border-brand-gold bg-brand-gold/8'
                  : 'border-line bg-brand-white hover:border-brand-gold/45',
                isDisabled && 'cursor-not-allowed opacity-45 hover:border-line',
              )}
            >
              <input
                type="radio"
                id={inputId}
                name={`scope-${tone}`}
                value={option.id}
                checked={isActive}
                disabled={isDisabled}
                onChange={() => onChange(option.id)}
                className="size-5 shrink-0 accent-brand-gold"
              />
              <span className="min-w-0">
                <span className="block font-display text-sm font-bold text-brand-black">
                  {option.title}
                </span>
                <span className="mt-0.5 block text-fine text-text-muted">
                  {countCapabilities(option)} of {Object.keys(option.capabilities).length} capabilities
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** A single included / excluded cell. Never relies on colour alone. */
function Capability({ value, name, compact = false }) {
  return value ? (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium text-brand-black',
        compact ? 'text-fine' : 'text-sm',
      )}
    >
      <CheckCircle2 className="size-4 shrink-0 text-brand-gold-muted" aria-hidden="true" />
      <span className="sr-only">{name} includes this</span>
      <span aria-hidden="true">Included</span>
    </span>
  ) : (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-text-muted',
        compact ? 'text-fine' : 'text-sm',
      )}
    >
      <Minus className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{name} excludes this</span>
      <span aria-hidden="true">Not included</span>
    </span>
  );
}

export default ScopeComparison;