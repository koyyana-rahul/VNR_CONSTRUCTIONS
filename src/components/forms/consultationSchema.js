import { z } from 'zod';

/**
 * ============================================================================
 * CONSULTATION FORM VALIDATION SCHEMA
 * ============================================================================
 *
 * Kept in its own module rather than inside the component file so it can be
 * unit-tested directly, and so the component file exports only components
 * (which Vite's React Fast Refresh requires).
 *
 * Design notes:
 *
 * - Numeric fields stay as STRINGS in the schema, not numbers. This is
 *   deliberate: HTML number inputs hand back '' when empty, and coercing that
 *   to a number produces NaN, which fails validation with a confusing message
 *   instead of being treated as "not provided". validateNumericString below
 *   handles the empty case explicitly.
 *
 * - Phone is validated for length and character set only. We deliberately do
 *   NOT assert a 10-digit Indian mobile format: VNR may serve non-Indian
 *   numbers, and rejecting valid international input is worse than accepting
 *   a mistyped digit which the team will catch when they call back.
 *
 * - `website` is a honeypot. Real users never see it; naive bots fill it.
 */

/** Accepts '' / undefined, otherwise requires a positive finite number. */
const optionalNumericString = z
  .string()
  .trim()
  .refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) > 0), {
    message: 'Enter a positive number',
  });

export const consultationSchema = z.object({
  /* ---- Required ---- */
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name')
    .max(80, 'Please keep this under 80 characters'),

  phone: z
    .string()
    .trim()
    .min(10, 'Enter a 10-digit mobile number')
    .max(15, 'That number looks too long')
    .regex(/^[+]?[\d\s-]+$/, 'Use digits, spaces, + or - only'),

  projectType: z.string().min(1, 'Select a project type'),

  location: z
    .string()
    .trim()
    .min(2, 'Tell us roughly where the project is')
    .max(120, 'Please keep this under 120 characters'),

  consent: z.literal(true, {
    message: 'Please agree to be contacted so we can respond',
  }),

  /* ---- Optional ---- */
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .or(z.literal(''))
    .optional(),

  plotArea: optionalNumericString.optional().or(z.literal('')),
  builtUpArea: optionalNumericString.optional().or(z.literal('')),
  floors: optionalNumericString.optional().or(z.literal('')),

  budgetRange: z.string().max(40).optional().or(z.literal('')),

  expectedStart: z.string().max(20).optional().or(z.literal('')),

  message: z
    .string()
    .trim()
    .max(1200, 'Please keep this under 1200 characters')
    .optional()
    .or(z.literal('')),

  /* ---- Honeypot ---- */
  website: z.string().optional(),
});

/** Default field values, reused by the reset handler. */
export const consultationDefaults = {
  fullName: '',
  phone: '',
  email: '',
  projectType: '',
  location: '',
  plotArea: '',
  builtUpArea: '',
  floors: '',
  budgetRange: '',
  expectedStart: '',
  message: '',
  consent: false,
  website: '',
};

export default consultationSchema;