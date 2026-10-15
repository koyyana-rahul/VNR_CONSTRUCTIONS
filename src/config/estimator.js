/**
 * ============================================================================
 * CONSTRUCTION COST ESTIMATOR — CONFIGURATION
 * ============================================================================
 *
 * !! RATES BELOW ARE ILLUSTRATIVE DEVELOPMENT VALUES, NOT VNR PRICES !!
 *
 * VNR Constructions has not supplied its official rate card. The brief states:
 *   "Do not invent official VNR construction rates."
 *   "If rates are unknown, mark development values as illustrative and prevent
 *    them from being presented as official prices."
 *
 * So:
 *   - `rateIsVerified` is FALSE, and the UI renders a persistent, unmissable
 *     "illustrative estimate — not a quotation" banner wherever figures appear.
 *   - `disclaimer` is the exact wording mandated by the brief.
 *   - The request-quotation CTA is the only path to a real, binding price.
 *
 * TO GO LIVE: replace `ratePerSqFt` with VNR's signed-off rates, set
 * `rateIsVerified: true`, and delete the illustrative banner in
 * components/estimator/RateNotice.jsx (or let it auto-hide via the flag).
 */

export const SQUARE_FEET_PER_SQUARE_METRE = 10.7639;

/**
 * Units supported by the estimator. Conversion is one-directional from the
 * UI's perspective — everything is normalised to sq ft before maths.
 */
export const UNITS = [
  { id: 'sqft', label: 'Square feet', short: 'sq ft', conversionToSqFt: 1 },
  { id: 'sqm', label: 'Square metres', short: 'sq m', conversionToSqFt: SQUARE_FEET_PER_SQUARE_METRE },
];

/** Construction types. Categories are candidates pending VNR confirmation. */
export const CONSTRUCTION_TYPES = [
  {
    id: 'independent-home',
    label: 'Independent House',
    description: 'A single-family home on your own plot.',
  },
  {
    id: 'villa-duplex',
    label: 'Villa / Duplex',
    description: 'Multi-level residence with higher specification and finish.',
  },
  {
    id: 'apartment',
    label: 'Apartment Building',
    description: 'Multi-unit residential block.',
  },
  {
    id: 'commercial',
    label: 'Commercial Building',
    description: 'Office, showroom or mixed-use commercial structure.',
  },
  {
    id: 'renovation',
    label: 'Renovation',
    description: 'Repair, refurbishment or change of use to an existing building.',
  },
];

/**
 * Finish levels. The multiplier applies to the type's base rate.
 * `included` documents what the level already contains so the estimator can
 * avoid double-counting the optional add-ons below.
 */
export const FINISH_LEVELS = [
  {
    id: 'essential',
    label: 'Essential',
    description: 'Solid, functional construction with a straightforward finish.',
    multiplier: 1,
    includes: ['Standard structural design', 'Basic electrical and plumbing', 'Standard flooring', 'Simple painting'],
  },
  {
    id: 'premium',
    label: 'Premium',
    description: 'Higher-grade materials throughout with refined detailing.',
    multiplier: 1.3,
    includes: [
      'Enhanced structural design',
      'Branded switches and fixtures',
      'Premium flooring',
      'Designer-grade painting',
      'False ceiling',
    ],
  },
  {
    id: 'luxury',
    label: 'Luxury',
    description: 'Architecturally detailed build with bespoke finishes.',
    multiplier: 1.65,
    includes: [
      'Specialised structural design',
      'Premium bath and kitchen fittings',
      'Imported marble or equivalent',
      'Designer wall treatments',
      'Detailed false ceiling and joinery',
    ],
  },
];

/**
 * ILLUSTRATIVE base rates, rupees per square foot.
 * A broad market survey figure used purely to make the tool demonstrable.
 */
export const BASE_RATES_PER_SQFT = {
  'independent-home': 1650,
  'villa-duplex': 2050,
  apartment: 1500,
  commercial: 1850,
  renovation: 1150,
};

/** Contingency presets, in percent. */
export const CONTINGENCY_OPTIONS = [
  { id: 0, label: 'None', value: 0 },
  { id: 5, label: '5%', value: 5 },
  { id: 10, label: '10%', value: 10 },
  { id: 15, label: '15%', value: 15 },
];

/**
 * Optional additional work.
 * `notIncludedInRate` documents whether the item is ALREADY covered by the
 * base rate. Items marked true are switched OFF by default so a user cannot
 * accidentally pay twice for the same scope. The estimator surfaces this as
 * a hint beside each toggle.
 */
export const ADDITIONAL_OPTIONS = [
  {
    id: 'compound-wall',
    label: 'Compound / boundary wall',
    description: 'Perimeter wall, gate and landscaping around the plot.',
    price: 145000,
    defaultSelected: true,
    notIncludedInRate: true,
  },
  {
    id: 'borewell',
    label: 'Borewell & overhead tank',
    description: 'Independent water supply for the property.',
    price: 185000,
    defaultSelected: false,
    notIncludedInRate: true,
  },
  {
    id: 'carport',
    label: 'Carport / porch',
    description: 'Covered parking and entrance porch structure.',
    price: 240000,
    defaultSelected: false,
    notIncludedInRate: true,
  },
  {
    id: 'solar',
    label: 'Solar water heating',
    description: 'Solar collector and associated plumbing.',
    price: 165000,
    defaultSelected: false,
    notIncludedInRate: true,
  },
  {
    id: 'landscaping',
    label: 'Landscaping & hardscape',
    description: 'Driveway, walkways and soft landscaping.',
    price: 210000,
    defaultSelected: false,
    notIncludedInRate: true,
  },
  {
    id: 'site-development',
    label: 'Site development & earth filling',
    description: 'Levelling, filling and site clearance before construction.',
    price: 320000,
    defaultSelected: false,
    notIncludedInRate: true,
  },
];

/** Guards for user-entered numeric input. */
export const AREA_LIMITS = {
  min: 100,
  max: 100000, // 1,00,000 sq ft — far beyond any residential project
  step: 10,
};

export const CONTINGENCY_LIMITS = { min: 0, max: 30 };

/** Mandatory disclaimer wording — reproduced verbatim from the brief. */
export const ESTIMATOR_DISCLAIMER =
  'This is an indicative planning estimate, not a quotation. Final cost depends on approved drawings, site conditions, specifications, inclusions, exclusions, applicable taxes, and the signed agreement.';

/** Whether BASE_RATES_PER_SQFT reflect real, signed-off VNR pricing. */
export const rateIsVerified = false;

export const ESTIMATOR_RATE_NOTICE =
  'Figures below are illustrative planning rates used to demonstrate this tool. They are not VNR Constructions prices. Request a quotation for a figure we can stand behind.';

/** Default state used by the reset button. */
export const ESTIMATOR_DEFAULTS = {
  constructionTypeId: 'independent-home',
  area: 2000,
  unitId: 'sqft',
  finishLevelId: 'essential',
  additionalIds: ADDITIONAL_OPTIONS.filter((o) => o.defaultSelected).map((o) => o.id),
  contingencyPercent: 5,
};

/* ---- Lookup helpers ------------------------------------------------------ */

export const getConstructionType = (id) =>
  CONSTRUCTION_TYPES.find((t) => t.id === id) ?? CONSTRUCTION_TYPES[0];

export const getFinishLevel = (id) =>
  FINISH_LEVELS.find((f) => f.id === id) ?? FINISH_LEVELS[0];

export const getUnit = (id) => UNITS.find((u) => u.id === id) ?? UNITS[0];

export const getContingency = (value) =>
  CONTINGENCY_OPTIONS.find((c) => c.value === value) ??
  CONTINGENCY_OPTIONS.reduce((closest, c) =>
    Math.abs(c.value - value) < Math.abs(closest.value - value) ? c : closest,
  );