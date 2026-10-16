import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { Container } from '../common/Container.jsx';
import { Section } from '../common/Section.jsx';
import { SectionHeading, Button } from '../common/Button.jsx';
import { IconBadge } from '../common/IconBadge.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { contactFormSchema, contactDefaults } from '../../utils/validation.js';
import { submitEnquiry, buildWhatsAppMessage } from '../../services/enquiry.js';
import { contactServiceOptions } from '../../data/home.js';
import { company, telHref, whatsappHref } from '../../config/company.js';

/**
 * ============================================================================
 * CONTACT SECTION (reference section 10)
 * ============================================================================
 * Two columns: contact details on the left, the "Request a Callback" form on
 * the right, both inside one dark navy card with a gold border.
 *
 * The form is the reference's own five fields — Your Name, Phone Number,
 * Service Required, Project Location, Project Details — plus consent, which
 * is a legal requirement for marketing contact in India (DPDP Act 2023) and
 * cannot be left optional on a form like this.
 *
 * HONESTY: there is no backend. `submitEnquiry` therefore hands the visitor
 * off to WhatsApp with their answers pre-filled and says plainly that nothing
 * has been sent. The success panel is never labelled "Enquiry submitted" —
 * it says what actually happened. The original site used `alert()`, which this
 * replaces with an accessible, styled, keyboard-navigable result.
 */
export function ContactSection() {
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: contactDefaults,
  });

  const onSubmit = async (values) => {
    // Duplicate-submit guard: `sending` disables the button AND this returns.
    if (sending) return;
    setSending(true);
    try {
      setResult(await submitEnquiry(values));
    } finally {
      setSending(false);
    }
  };

  const whatsappHrefWithForm = whatsappHref(
    buildWhatsAppMessage({ fullName: '', phone: '', projectType: '' }),
  );

  return (
    <Section id="contact" tone="navy">
      <Container size="page">
        <Reveal>
          <SectionHeading title="Tell Us About Your Project." align="center" />
        </Reveal>

        <Reveal delay={60}>
          <div className="glass-panel mx-auto mt-12 max-w-5xl rounded-sm border border-gold-medium p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              {/* ---- Details ---- */}
              <div className="lg:col-span-5">
                <h3 className="font-display text-h3 font-bold text-ivory">{company.name}</h3>

                <ul className="mt-6 flex flex-col gap-4 text-fine">
                  <li className="flex items-start gap-3">
                      <IconBadge name="MapPinned" size="sm" className="mt-0.5" />
                    <span>
                      <span className="block font-semibold text-text-primary">Service area</span>
                      <span className="text-text-muted">
                        {company.serviceAreas.list.join(', ')}
                      </span>
                    </span>
                  </li>

                  {telHref() && (
                    <li className="flex items-start gap-3">
                      <IconBadge name="PhoneCall" size="sm" className="mt-0.5" />
                      <a href={telHref()} className="min-w-0 rounded-sm">
                        <span className="block font-semibold text-text-primary">Phone</span>
                        <span className="text-text-muted transition-colors hover:text-gold-light">
                          {company.phone.display}
                        </span>
                      </a>
                    </li>
                  )}

                  {whatsappHrefWithForm && (
                    <li className="flex items-start gap-3">
                      <IconBadge name="MessageCircle" size="sm" className="mt-0.5" />
                      <a
                        href={whatsappHrefWithForm}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 rounded-sm"
                      >
                        <span className="block font-semibold text-text-primary">WhatsApp</span>
                        <span className="text-text-muted transition-colors hover:text-gold-light">
                          Message us directly
                        </span>
                      </a>
                    </li>
                  )}

                  <li className="flex items-start gap-3">
                      <IconBadge name="Boxes" size="sm" className="mt-0.5" />
                    <span>
                      <span className="block font-semibold text-text-primary">
                        Project types
                      </span>
                      <span className="text-text-muted">
                        Home construction &amp; interior projects
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* ---- Form ---- */}
              <div className="lg:col-span-7">
                {result ? (
                  <ResultPanel result={result} onReset={() => { setResult(null); reset(); }} />
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                    <h3 className="font-display text-h4 font-bold text-ivory">
                      Request a Callback
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <LightField
                        label="Your Name"
                        required
                        error={errors.fullName}
                      >
                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your full name"
                          aria-invalid={errors.fullName ? true : undefined}
                          className={lightInput(errors.fullName)}
                          {...register('fullName')}
                        />
                      </LightField>

                      <LightField
                        label="Phone Number"
                        required
                        error={errors.phone}
                      >
                        <input
                          id="contact-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="10-digit mobile number"
                          aria-invalid={errors.phone ? true : undefined}
                          className={lightInput(errors.phone)}
                          {...register('phone')}
                        />
                      </LightField>

                      <LightField label="Service Required" required error={errors.service}>
                        <select
                          id="contact-service"
                          aria-invalid={errors.service ? true : undefined}
                          className={`${lightInput(errors.service)} appearance-none pr-10`}
                          defaultValue=""
                          {...register('service')}
                        >
                          <option value="" disabled>
                            Choose a service
                          </option>
                          {contactServiceOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </LightField>

                      <LightField
                        label="Project Location"
                        required
                        error={errors.location}
                      >
                        <input
                          id="contact-location"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="Area and city"
                          aria-invalid={errors.location ? true : undefined}
                          className={lightInput(errors.location)}
                          {...register('location')}
                        />
                      </LightField>
                    </div>

                    <LightField label="Project Details" optional error={errors.message}>
                      <textarea
                        id="contact-message"
                        rows={4}
                        placeholder="Tell us briefly what you have in mind."
                        aria-invalid={errors.message ? true : undefined}
                        className={`${lightInput(errors.message)} resize-y`}
                        {...register('message')}
                      />
                    </LightField>

                    {/* Consent is legally required for this kind of contact.

                        The surface used to be `bg-ivory/60` — ivory at 60% over
                        the DARK glass panel, which composites to a flat
                        light-silver slab (#9fa0a1) in the middle of a navy
                        card. It is the only off-brand colour on the page, it
                        looks like a disabled control, and it forced
                        `text-navy` to sit beside `text-ivory` labels in the
                        same form.

                        It is a dark translucent panel now, matching every other
                        dark surface in the chrome: a faint white wash, a
                        low-alpha border that still reads as a hit area, and the
                        site's own `--color-line` for the resting border.
                        `accent-gold` rather than `accent-gold-button-dark`,
                        because the checkbox sits on navy here and the darker
                        champagne step is the ivory-section value. */}
                    <label
                      htmlFor="contact-consent"
                      className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3.5 text-fine leading-relaxed transition-colors ${
                        errors.consent
                          ? 'border-red-400/70 bg-red-900/20 text-text-primary'
                          : 'border-white/12 bg-white/[0.04] text-text-secondary hover:border-gold/45 hover:bg-white/[0.07]'
                      }`}
                    >
                      <input
                        id="contact-consent"
                        type="checkbox"
                        className="mt-0.5 size-5 shrink-0 accent-gold"
                        aria-invalid={errors.consent ? true : undefined}
                        {...register('consent')}
                      />
                      <span>
                        I agree that {company.name} may contact me about this
                        enquiry.
                      </span>
                    </label>
                    {errors.consent && (
                      <p role="alert" className="flex items-center gap-1.5 text-fine font-medium text-red-300">
                        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                        {errors.consent.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="goldGradient"
                      size="lg"
                      disabled={sending}
                      className="mt-1 w-full sm:w-auto"
                      icon={<Send className="size-4" />}
                    >
                      {sending ? 'Preparing…' : 'Request a Callback'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---- Form pieces ------------------------------------------------------- */

/** Ivory input surface per the brief. 16px prevents iOS zoom-on-focus. */
const lightInput = (error) =>
  [
    'w-full min-h-12 rounded-sm border bg-input-background px-4 py-3 text-navy',
    'placeholder:text-navy/35 transition-colors',
    'focus:border-gold-button-dark focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-gold-button-dark',
    error ? 'border-red-500' : 'border-input-border',
  ].join(' ');

function LightField({ label, required, optional, error, children }) {
  return (
    <div className="min-w-0">
      <label
        className="flex flex-wrap items-baseline gap-x-2 font-sans text-[0.8125rem] font-semibold text-ivory"
        htmlFor={children.props.id}
      >
        {label}
        {required && (
          <span className="text-gold" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="text-fine font-normal text-text-muted">(optional)</span>}
      </label>

      <div className="relative mt-2">{children}</div>

      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-fine font-medium text-red-300">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error.message}
        </p>
      )}
    </div>
  );
}

/**
 * The result panel states what ACTUALLY happened.
 * "Enquiry received" appears only on a real 2xx from a configured endpoint.
 */
function ResultPanel({ result, onReset }) {
  const sent = result.status === 'sent';
  const tone = sent ? 'border-green-400/50 bg-green-900/20' : 'border-gold-medium bg-white/5';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex h-full flex-col justify-center rounded-sm border p-6 ${tone}`}
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full bg-gold/12 text-gold-light"
      >
        {sent ? (
          <CheckCircle2 className="size-6" strokeWidth={1.75} />
        ) : (
          <MessageCircle className="size-6" strokeWidth={1.75} />
        )}
      </span>

      <h3 className="mt-5 font-display text-h4 font-bold text-ivory">
        {sent && 'Enquiry received'}
        {!sent && result.status === 'handoff' && 'One last step'}
        {!sent && result.status === 'error' && 'Something went wrong'}
        {!sent && result.status === 'unavailable' && 'Enquiry unavailable'}
      </h3>

      <p className="mt-3 text-fine leading-relaxed text-text-secondary">{result.message}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {result.whatsappUrl && (
          <Button href={result.whatsappUrl} variant="goldGradient" size="md">
            Send on WhatsApp
          </Button>
        )}
        <Button variant="outline" size="md" onClick={onReset}>
          Write another
        </Button>
      </div>
    </div>
  );
}

export default ContactSection;