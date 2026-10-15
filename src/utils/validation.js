import { z } from 'zod';

/**
 * ============================================================================
 * CONTACT FORM VALIDATION (reference section 10)
 * ============================================================================
 * Lives apart from the component so it can be unit-tested directly and so the
 * component file exports only components (which React Fast Refresh requires).
 *
 * PHONE VALIDATION FOR INDIA
 *   Accepts the shapes an Indian customer actually types, and nothing wider:
 *     10 digits starting 6-9            9876543210
 *     +91 / 91 / 0 prefix              +91 98765 43210
 *     spaces, dashes, dots as separators  98765 43210 / 98765-43210
 *   The leading digit is constrained to 6-9, because that is where the
 *   allocated Indian mobile ranges begin. Landlines and VoIP numbers starting
 *   with other digits are deliberately NOT accepted — a "callback" service
 *   number is not the number that reaches a customer.
 *
 *   Digits are normalised before matching, so separators never cause a false
 *   rejection, and the 10-digit core is what actually gets validated.
 */

const PHONE_CORE = /^[6-9]\d{9}$/;

export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Enter your phone number')
  .transform((value) => value.replace(/[\s.\-()]/g, ''))
  .refine(
    (value) => {
      const digits = value.replace(/^\+?91|^0/, '');
      return PHONE_CORE.test(digits);
    },
    {
      message: 'Enter a valid 10-digit Indian mobile number',
    },
  );

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your name')
    .max(80, 'Please keep this under 80 characters'),

  phone: phoneSchema,

  service: z.string().min(1, 'Choose the service you need'),

  location: z
    .string()
    .trim()
    .min(2, 'Tell us where the project is')
    .max(120, 'Please keep this under 120 characters'),

  message: z
    .string()
    .trim()
    .max(1200, 'Please keep this under 1200 characters')
    .optional()
    .or(z.literal('')),

  consent: z.literal(true, {
    message: 'Please agree to be contacted so we can call you back',
  }),

  // Honeypot: invisible to people, irresistible to naive bots.
  website: z.string().optional(),
});

export const contactDefaults = {
  fullName: '',
  phone: '',
  service: '',
  location: '',
  message: '',
  consent: false,
  website: '',
};

/** Strips an empty honeypot before the payload is ever built. */
export function stripHoneypot(values) {
  const { website, ...rest } = values;
  return website ? { ...rest, _bot: true } : rest;
}

export default contactFormSchema;