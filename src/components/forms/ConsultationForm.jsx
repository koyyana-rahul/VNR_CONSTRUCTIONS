import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2, Send, MessageCircle } from 'lucide-react';
import { Input, Textarea, Select } from './Fields.jsx';
import { consultationSchema, consultationDefaults } from './consultationSchema.js';
import { Button } from '../common/Button.jsx';
import { cn } from '../../utils/cn.js';
import { submitEnquiry, buildWhatsAppMessage } from '../../services/enquiry.js';
import { hasWhatsApp, whatsappHref, company } from '../../config/company.js';
import { CONSTRUCTION_TYPES } from '../../config/estimator.js';
import { ROUTES } from '../../config/site.js';

/**
 * ============================================================================
 * CONSULTATION FORM
 * ============================================================================
 *
 * Validation: Zod schema (components/forms/consultationSchema.js), resolved
 * through react-hook-form with mode="onBlur" so a visitor is not told their
 * email is invalid while they are still typing it. Numeric fields are
 * validated as strings in the schema, because an empty HTML number input
 * returns '' — coercing that to a number yields NaN and a confusing message.
 *
 * Duplicate-submission protection: `isSubmitting` from react-hook-form disables
 * the button AND the guard below returns early, so a double-tap on a slow
 * connection cannot fire two requests.
 *
 * HONESTY: the success panel distinguishes between genuinely sent, handed off
 * to WhatsApp, and unavailable. It never says "your enquiry has been received"
 * unless a real endpoint returned 2xx.
 */

const PROJECT_TYPE_OPTIONS = [
  ...CONSTRUCTION_TYPES.map((t) => ({ value: t.id, label: t.label })),
  { value: 'other', label: 'Something else' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Prefer not to say yet' },
  { value: 'under-25', label: 'Under ₹25 lakh' },
  { value: '25-50', label: '₹25 – 50 lakh' },
  { value: '50-100', label: '₹50 lakh – 1 crore' },
  { value: '1-2cr', label: '₹1 – 2 crore' },
  { value: 'over-2cr', label: 'Over ₹2 crore' },
];

/* ----------------------------------------------------------------- form -- */

export function ConsultationForm({ prefill }) {
  const [result, setResult] = useState(null); // { status, message, ... }
  const submitGuard = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(consultationSchema),
    mode: 'onBlur',
    defaultValues: {
      ...consultationDefaults,
      builtUpArea: prefill?.prefilledArea ? String(prefill.prefilledArea) : '',
      message: prefill?.estimateSummary
        ? `Estimator result:\n${prefill.estimateSummary}`
        : '',
    },
  });

  // Move focus to the result panel so screen reader users are told what
  // happened without having to hunt for it.
  const resultRef = useRef(null);
  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  const onSubmit = async (values) => {
    // Belt-and-braces duplicate protection alongside isSubmitting.
    if (submitGuard.current) return;
    submitGuard.current = true;

    try {
      const outcome = await submitEnquiry(values);
      setResult(outcome);
    } finally {
      submitGuard.current = false;
    }
  };

  /* ---- Success / handoff panel replaces the form ---- */
  if (result) {
    const tone =
      result.status === 'sent' ? 'success' : result.status === 'error' ? 'error' : 'info';

    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cn(
          'rounded-sm border p-6 focus:outline-none sm:p-8',
          tone === 'success' && 'border-green-700/40 bg-green-50/50',
          tone === 'error' && 'border-red-600/40 bg-red-50/50',
          tone === 'info' && 'border-brand-gold/50 bg-brand-gold/6',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'grid size-12 place-items-center rounded-full',
            tone === 'success' && 'bg-green-700/12 text-green-800',
            tone === 'error' && 'bg-red-600/12 text-red-700',
            tone === 'info' && 'bg-brand-gold/15 text-brand-gold-muted',
          )}
        >
          {tone === 'success' ? (
            <CheckCircle2 className="size-6" strokeWidth={1.75} />
          ) : tone === 'error' ? (
            <AlertTriangle className="size-6" strokeWidth={1.75} />
          ) : (
            <MessageCircle className="size-6" strokeWidth={1.75} />
          )}
        </span>

        <h3 className="mt-5 font-display text-h3 font-bold text-brand-black">
          {result.status === 'sent' && 'Enquiry received'}
          {result.status === 'handoff' && 'One last step'}
          {result.status === 'error' && 'Something went wrong'}
          {result.status === 'unavailable' && 'Online submission unavailable'}
        </h3>

        <p className="mt-3 text-lead text-text">{result.message}</p>

        {result.whatsappUrl && (
          <Button
            href={result.whatsappUrl}
            variant="gold"
            size="lg"
            className="mt-6"
            icon={<Send className="size-4" />}
          >
            Send on WhatsApp
          </Button>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" size="md" onClick={() => { setResult(null); reset(); }}>
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------- the form itself -- */
  return (
    // `handleSubmit` internally holds refs, so the react-hooks/refs lint rule
    // flags this call. This is the documented react-hook-form API and is safe:
    // it returns a submit handler rather than reading a ref during render.
    // eslint-disable-next-line react-hooks/refs
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0">
      {/* Honeypot: `hidden` + `tabIndex={-1}` + `autoComplete="off"`. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      {/* ---- Required ---- */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          required
          autoComplete="name"
          placeholder="Your full name"
          error={errors.fullName}
          {...register('fullName')}
        />

        <Input
          label="Phone number"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          error={errors.phone}
          {...register('phone')}
        />

        <Select
          label="Project type"
          required
          error={errors.projectType}
          defaultValue=""
          {...register('projectType')}
        >
          <option value="" disabled>
            Select a project type
          </option>
          {PROJECT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input
          label="Project location"
          required
          autoComplete="address-level2"
          placeholder="Area and city"
          error={errors.location}
          {...register('location')}
        />
      </div>

      {/* ---- Optional details ---- */}
      <fieldset className="mt-8 border-t border-line pt-8">
        <legend className="px-1 font-display text-label font-bold uppercase tracking-[0.16em] text-brand-gold-muted">
          Optional details
        </legend>
        <p className="mt-2 text-fine text-text-muted">
          These help us give you a more useful answer. Leave any blank if you
          are not sure yet.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Email"
            type="email"
            inputMode="email"
            optional
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
            className="lg:col-span-2"
            {...register('email')}
          />

          <Input
            label="Plot area"
            optional
            type="number"
            inputMode="decimal"
            placeholder="sq ft"
            error={errors.plotArea}
            {...register('plotArea')}
          />

          <Input
            label="Built-up area"
            optional
            type="number"
            inputMode="decimal"
            placeholder="sq ft"
            error={errors.builtUpArea}
            {...register('builtUpArea')}
          />

          <Input
            label="Floors"
            optional
            type="number"
            inputMode="numeric"
            placeholder="e.g. 2"
            error={errors.floors}
            {...register('floors')}
          />

          <Select
            label="Budget range"
            optional
            error={errors.budgetRange}
            defaultValue=""
            {...register('budgetRange')}
          >
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Input
            label="Expected start"
            optional
            type="month"
            error={errors.expectedStart}
            {...register('expectedStart')}
          />
        </div>

        <Textarea
          label="Tell us about the project"
          optional
          rows={5}
          placeholder="What you want to build, anything unusual about the plot, or questions you have."
          hint="Keep it brief — we'll ask for more detail on the call."
          error={errors.message}
          className="mt-5"
          {...register('message')}
        />
      </fieldset>

      {/* ---- Consent ---- */}
      <div className="mt-8 border-t border-line pt-8">
        <label
          htmlFor="consent"
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors',
            errors.consent
              ? 'border-red-600 bg-red-50/40'
              : 'border-line bg-brand-mist/50 hover:border-brand-gold/50',
          )}
        >
          <input
            id="consent"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-brand-gold"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            {...register('consent')}
          />
          <span className="text-fine leading-relaxed text-text">
            I agree that {company.name} may contact me about this enquiry.
            My details will be used only to respond to it. See our{' '}
            <Link
              to={ROUTES.privacy}
              className="font-semibold text-brand-gold-muted underline underline-offset-2 hover:text-brand-gold"
            >
              privacy policy
            </Link>
            .
          </span>
        </label>

        {errors.consent && (
          <p
            id="consent-error"
            role="alert"
            className="mt-2 flex items-start gap-1.5 text-fine font-medium text-red-700"
          >
            <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            {errors.consent.message}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={isSubmitting}
          icon={isSubmitting ? undefined : <Send className="size-4" />}
          className="sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              <span>Sending…</span>
            </>
          ) : (
            'Send enquiry'
          )}
        </Button>

        {hasWhatsApp && (
          <Button
            variant="outline"
            size="lg"
            className="sm:w-auto"
            href={whatsappHref(buildWhatsAppMessage({ fullName: '', phone: '' }))}
          >
            Chat on WhatsApp
          </Button>
        )}
      </div>

      <p className="mt-4 text-fine text-text-muted">
        Fields marked <span className="text-brand-gold-muted">*</span> are required.
      </p>
    </form>
  );
}

export default ConsultationForm;