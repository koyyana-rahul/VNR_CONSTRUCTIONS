import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../motion/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Input, Select } from './Fields.jsx';
import { DataNotice } from '../common/DataNotice.jsx';
import { useConsultation } from './useConsultation.js';
import { whatsappHref, hasWhatsApp } from '../../config/company.js';
import { CONSTRUCTION_TYPES } from '../../config/estimator.js';
import { ROUTES } from '../../config/site.js';
import { buildQuickEnquiryMessage } from '../../services/enquiry.js';

/**
 * ============================================================================
 * CONSULTATION MODAL
 * ============================================================================
 *
 * A QUICK-CAPTURE dialog, not the full enquiry form.
 *
 * Design rationale: the full consultation form asks for ten fields and belongs
 * on its own page where it is not interrupted. A modal demanding the same thing
 * mid-scroll is worse than a page. This asks for the three things genuinely
 * needed to have a useful first conversation, then offers a handoff — either to
 * WhatsApp with the details pre-filled, or to the full form.
 *
 * IMPORTANT: nothing is transmitted from this dialog. There is no backend and
 * no verified contact channel in this build, so the footer CTA is an explicit
 * handoff the visitor completes themselves. The UI never claims an enquiry was
 * received.
 *
 * Accessibility: built on the shared <Modal>, so Escape, focus trap, focus
 * restoration and scroll locking behave identically to the drawer and the
 * gallery lightbox.
 */
export function ConsultationModal() {
  const { isOpen, close, prefill } = useConsultation();
  const [values, setValues] = useState({ fullName: '', phone: '', projectType: '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    // Clear the error as soon as the user starts fixing it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (event) => {
    event.preventDefault();
    const next = {};
    if (values.fullName.trim().length < 2) next.fullName = 'Please enter your name';
    if (values.phone.replace(/\D/g, '').length < 10) {
      next.phone = 'Enter a 10-digit mobile number';
    }
    setErrors(next);
  };

  const whatsappUrl = whatsappHref(buildQuickEnquiryMessage(values));

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="Request a free consultation"
      description="A short conversation about your plot. No obligation — and no obligation to reply either."
      variant="right"
      size="sm"
      footer={
        hasWhatsApp ? (
          <div className="flex flex-col gap-3">
            <Button href={whatsappUrl} variant="gold" size="md" fullWidth onClick={close}>
              Continue on WhatsApp
            </Button>
            <Link
              to={ROUTES.contact}
              onClick={close}
              className="text-center text-fine text-text-muted underline underline-offset-4 hover:text-brand-gold-muted"
            >
              Or use the full enquiry form
            </Link>
          </div>
        ) : (
          <Link
            to={ROUTES.contact}
            onClick={close}
            className="text-center text-fine font-semibold text-brand-gold-muted underline underline-offset-4"
          >
            Open the full enquiry form
          </Link>
        )
      }
    >
      <form onSubmit={validate} noValidate className="flex flex-col gap-5">
        {!hasWhatsApp && (
          <DataNotice tone="warning" compact>
            No verified contact channel is configured yet, so nothing can be sent
            from here. The full enquiry form explains what happens next.
          </DataNotice>
        )}

        {prefill?.estimateSummary && (
          <DataNotice tone="info" compact>
            <span className="font-semibold text-brand-black">From your estimate:</span>{' '}
            <span className="whitespace-pre-line">{prefill.estimateSummary}</span>
          </DataNotice>
        )}

        <Input
          label="Full name"
          required
          autoComplete="name"
          placeholder="Your full name"
          value={values.fullName}
          onChange={set('fullName')}
          error={errors.fullName}
        />

        <Input
          label="Phone number"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          value={values.phone}
          onChange={set('phone')}
          error={errors.phone}
        />

        <Select
          label="Project type"
          optional
          value={values.projectType}
          onChange={set('projectType')}
        >
          <option value="">Not sure yet</option>
          {CONSTRUCTION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </Select>

        <p className="text-fine text-text-muted">
          Used only to reply to your enquiry — see the{' '}
          <Link
            to={ROUTES.privacy}
            onClick={close}
            className="font-semibold text-brand-gold-muted underline underline-offset-2"
          >
            privacy policy
          </Link>
          .
        </p>

        {/* Visually hidden submit, so pressing Enter in a field runs validation
            instead of submitting nothing. The visible CTA is in the footer. */}
        <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
          Continue
        </button>
      </form>
    </Modal>
  );
}

export default ConsultationModal;