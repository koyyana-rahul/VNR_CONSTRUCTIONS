import { whatsappHref, hasWhatsApp, company } from '../config/company.js';
import { CONSTRUCTION_TYPES } from '../config/estimator.js';

/**
 * ============================================================================
 * ENQUIRY SUBMISSION ADAPTER
 * ============================================================================
 *
 * WHAT THIS DOES — and, more importantly, what it does NOT do:
 *
 * It does NOT claim your enquiry has been stored unless a real endpoint has
 * been configured and the request actually succeeded. There is no backend and
 * no verified contact channel in this build, so the honest outcome is a clear
 * handoff to the visitor, never a fake "Thanks! We'll be in touch shortly."
 *
 * THREE CONFIGURED MODES:
 *
 *  1. REMOTE  — set VITE_ENQUIRY_ENDPOINT to a URL that accepts JSON. The
 *               payload is POSTed and success is reported only on a 2xx.
 *               No credentials are ever embedded here; if your endpoint needs
 *               auth, proxy it through your own server.
 *
 *  2. HANDOFF — no endpoint configured. The user is offered WhatsApp, with
 *               their typed details pre-filled into the message so nothing is
 *               retyped. The UI states plainly that nothing was transmitted.
 *
 *  3. UNAVAILABLE — no endpoint AND no verified WhatsApp number. The user is
 *               told plainly that online submission is not yet available.
 *
 * `buildWhatsAppMessage` is exported separately so it can be unit-tested —
 * message construction is easy to get subtly wrong (truncation, encoding).
 */

const ENDPOINT = import.meta.env?.VITE_ENQUIRY_ENDPOINT;

/** Trim to WhatsApp's practical body limit so the message is never cut off. */
const MAX_MESSAGE_LENGTH = 1200;

/**
 * Builds the WhatsApp message from the contact form's fields.
 *
 * The field names differ between the homepage form (`service`) and the
 * estimator handoff (`projectType`), so both are accepted — that keeps one
 * formatter for both flows rather than two that can drift.
 *
 * `buildQuickEnquiryMessage` (below) is the shorter variant used by the
 * quick-capture modal.
 */
export function buildWhatsAppMessage(data) {
  const lines = [
    `New enquiry via ${company.name} website`,
    '',
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
  ];

  if (data.email) lines.push(`Email: ${data.email}`);

  const service = data.service ?? data.projectType;
  if (service) lines.push(`Service required: ${service}`);

  if (data.location) lines.push(`Project location: ${data.location}`);
  if (data.plotArea) lines.push(`Plot area: ${data.plotArea}`);
  if (data.builtUpArea) lines.push(`Built-up area: ${data.builtUpArea}`);
  if (data.floors) lines.push(`Floors: ${data.floors}`);
  if (data.budgetRange) lines.push(`Budget range: ${data.budgetRange}`);
  if (data.expectedStart) lines.push(`Expected start: ${data.expectedStart}`);

  if (data.estimateSummary) {
    lines.push('', '--- Estimator result ---', data.estimateSummary);
  }
  if (data.message) lines.push('', `Project details: ${data.message}`);

  return lines.join('\n').slice(0, MAX_MESSAGE_LENGTH);
}

/**
 * Compact message for the quick-capture consultation modal.
 * Kept separate from buildWhatsAppMessage so the modal's wording can stay short
 * without weakening the full form's detail.
 */
export function buildQuickEnquiryMessage(data) {
  const lines = [`Hello ${company.name}, I would like to talk about a project.`];
  if (data.fullName) lines.push(`Name: ${data.fullName}`);
  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.projectType) {
    const label =
      CONSTRUCTION_TYPES.find((t) => t.id === data.projectType)?.label ?? data.projectType;
    lines.push(`Project type: ${label}`);
  }
  return lines.join('\n').slice(0, MAX_MESSAGE_LENGTH);
}

/**
 * @returns {Promise<{
 *   status: 'sent' | 'handoff' | 'unavailable' | 'error',
 *   message: string,
 *   whatsappUrl?: string,
 *   messageBody?: string,
 * }>}
 */
export async function submitEnquiry(data) {
  // ---- Mode 1: a real endpoint is configured ----
  if (ENDPOINT) {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Honeypot: real bots fill hidden fields.
        ...(data.website ? {} : { body: JSON.stringify(data) }),
      });

      if (!response.ok) {
        return {
          status: 'error',
          message:
            'We could not send your enquiry just now. Please try again in a moment, or contact us directly.',
        };
      }

      // Only claim success once a 2xx has actually come back.
      return {
        status: 'sent',
        message:
          'Thank you — your enquiry has been received. We will get back to you shortly.',
      };
    } catch {
      return {
        status: 'error',
        message:
          'We could not reach our server. Please check your connection and try again.',
      };
    }
  }

  // ---- Mode 2: hand off to WhatsApp ----
  const messageBody = buildWhatsAppMessage(data);
  const whatsappUrl = whatsappHref(messageBody);

  if (hasWhatsApp) {
    return {
      status: 'handoff',
      message:
        'Your details are ready to send. Tap below to send them to us on WhatsApp — nothing has been transmitted from this page yet.',
      whatsappUrl,
      messageBody,
    };
  }

  // ---- Mode 3: nothing configured ----
  return {
    status: 'unavailable',
    message:
      'Online enquiry submission is not yet connected, and no contact channel has been verified for this website. Please add verified contact details to src/config/company.js.',
  };
}

export default submitEnquiry;