/**
 * ============================================================================
 * HOMEPAGE CONTENT — the reference site's copy
 * ============================================================================
 *
 * Every string here is supplied verbatim in the rebuild brief. Where the brief
 * says "preserve the existing descriptions" without reproducing them (the
 * About introduction, the six service descriptions, the four process steps and
 * the interiors paragraph), those fields are null and the UI renders an
 * explicit "copy pending from source site" state rather than invented text.
 *
 * Each such field carries `needsSourceCopy: true`, and
 * `npm run check:company` reports them, so nothing invented can silently ship
 * as if it were the client's own words.
 *
 * Once reference/index.html is available, paste the real copy in and delete the
 * matching `needsSourceCopy` flag.
 */

/* ---- Section 3: Hero --------------------------------------------------- */

export const hero = {
  eyebrow: 'Home Construction & Premium Interiors',
  title: 'Your Dream Home. Our Commitment.',
  /** "Our Commitment." carries the gold accent in the render. */
  body: 'VNR Constructions brings home construction and premium interior solutions together with a focus on considered design, quality-conscious material choices and clear project discussions. Let’s shape a home that reflects your lifestyle and your future.',
  primaryCta: 'Discuss Your Project',
  secondaryCta: 'Explore Our Services',
  /** Placeholder until vnr-interiors-promo.png is supplied. */
  image: '/images/hero-interiors.svg',
  imageNeedsReplacement: true,
};

/* ---- Section 3b: promotional starting price -----------------------------
   Supplied content. MUST remain visible with its disclaimer, and must always
   read as a STARTING price, never as a quotation. */

export const promo = {
  label: 'Construction starting price*',
  rate: 1799,
  unit: '/ sq. ft.',
  disclaimer:
    '*Indicative starting price. Final cost depends on the agreed scope, materials, site conditions and the written quotation.',
};

/* ---- Section 4: Highlights ---------------------------------------------- */

export const highlights = [
  {
    id: 'materials',
    icon: 'Layers',
    title: 'Quality Materials',
    description: 'Thoughtful product selection',
  },
  {
    id: 'designs',
    icon: 'Compass',
    title: 'Modern Designs',
    description: 'Style with functionality',
  },
  {
    id: 'both',
    icon: 'Home',
    title: 'Construction & Interiors',
    description: 'One place to begin',
  },
  {
    id: 'hyderabad',
    icon: 'MapPinned',
    title: 'Hyderabad Service',
    description: 'Local project discussions',
  },
];

/* ---- Section 5: Services -------------------------------------------------
   Titles and order are supplied verbatim. Descriptions are flagged. */

export const services = [
  {
    id: 'independent-house',
    number: '01',
    title: 'Independent House Construction',
    icon: 'House',
    description: null,
    needsSourceCopy: true,
  },
  {
    id: 'interior-solutions',
    number: '02',
    title: 'Complete Interior Solutions',
    icon: 'PaintbrushVertical',
    description: null,
    needsSourceCopy: true,
  },
  {
    id: 'modular-kitchens',
    number: '03',
    title: 'Modular Kitchens',
    icon: 'CookingPot',
    description: null,
    needsSourceCopy: true,
  },
  {
    id: 'elevation-exterior',
    number: '04',
    title: 'Elevation & Exterior Design',
    icon: 'Home',
    description: null,
    needsSourceCopy: true,
  },
  {
    id: 'bathrooms-fittings',
    number: '05',
    title: 'Bathrooms & Fittings',
    icon: 'ShowerHead',
    description: null,
    needsSourceCopy: true,
  },
  {
    id: 'lighting-wardrobes',
    number: '06',
    title: 'Lighting & Wardrobes',
    icon: 'Lamp',
    description: null,
    needsSourceCopy: true,
  },
];

/* ---- Section 6: About ---------------------------------------------------
   Heading is supplied. The introduction and the four value statements are
   referenced by the brief but not reproduced, so they are pending. */

export const about = {
  title: 'Building Better Tomorrows.',
  tagline: 'Construction and interiors, under one roof.',
  introduction: null,
  needsSourceCopy: true,
  values: [
    { id: 'value-1', text: null, needsSourceCopy: true },
    { id: 'value-2', text: null, needsSourceCopy: true },
    { id: 'value-3', text: null, needsSourceCopy: true },
    { id: 'value-4', text: null, needsSourceCopy: true },
  ],
  image: '/images/about-project.svg',
  imageNeedsReplacement: true,
};

/* ---- Section 7: Four-step process ---------------------------------------- */

export const process = [
  {
    step: 1,
    title: 'Share Your Vision',
    description: null,
    needsSourceCopy: true,
  },
  {
    step: 2,
    title: 'Site Visit & Discussion',
    description: null,
    needsSourceCopy: true,
  },
  {
    step: 3,
    title: 'Scope & Estimate',
    description: null,
    needsSourceCopy: true,
  },
  {
    step: 4,
    title: 'Plan the Work',
    description: null,
    needsSourceCopy: true,
  },
];

/* ---- Section 8: Premium interiors --------------------------------------- */

export const interiors = {
  title: 'Rich Details. Thoughtful Living.',
  description: null,
  needsSourceCopy: true,
  image: '/images/interiors-promo.svg',
  imageNeedsReplacement: true,
  features: [
    { id: 'kitchens', title: 'Modular Kitchens', icon: 'CookingPot' },
    { id: 'living', title: 'Living Rooms', icon: 'Sofa' },
    { id: 'bedrooms', title: 'Bedrooms & Wardrobes', icon: 'BedDouble' },
    { id: 'lighting', title: 'Lighting & Fittings', icon: 'Lamp' },
  ],
};

/* ---- Section 9: Inspiration gallery -------------------------------------
   The brief is explicit: these are DEVELOPMENT VISUALS, not proof of completed
   VNR projects. `isPlaceholder: true` drives a persistent, honest notice. */

export const gallery = {
  title: 'Imagine the Possibilities',
  isPlaceholder: true,
  note: 'These are promotional design visuals, not photographs of completed VNR projects. They must be replaced with actual VNR project photography before publication.',
  items: [
    {
      id: 'g-1',
      src: '/images/gallery-01.svg',
      alt: 'Development visual: contemporary living room concept',
      needsReplacement: true,
    },
    {
      id: 'g-2',
      src: '/images/gallery-02.svg',
      alt: 'Development visual: modular kitchen concept',
      needsReplacement: true,
    },
    {
      id: 'g-3',
      src: '/images/gallery-03.svg',
      alt: 'Development visual: bedroom and wardrobe layout concept',
      needsReplacement: true,
    },
    {
      id: 'g-4',
      src: '/images/gallery-04.svg',
      alt: 'Development visual: bathroom fittings concept',
      needsReplacement: true,
    },
    {
      id: 'g-5',
      src: '/images/gallery-05.svg',
      alt: 'Development visual: lighting design concept',
      needsReplacement: true,
    },
    {
      id: 'g-6',
      src: '/images/gallery-06.svg',
      alt: 'Development visual: exterior elevation concept',
      needsReplacement: true,
    },
  ],
};

/* ---- Navigation ---------------------------------------------------------- */

export const nav = [
  { to: '/services', label: 'Services', description: 'Construction and interior services' },
  { to: '/about', label: 'About VNR', description: 'Who VNR Constructions is' },
  { to: '/process', label: 'Our Process', description: 'Your project, step by step' },
  { to: '/interiors', label: 'Interiors', description: 'Premium interior solutions' },
  { to: '/contact', label: 'Contact', description: 'Tell us about your project' },
];

export const headerCta = { to: '/contact', label: 'Book a Consultation' };

/** Service options in the contact form, per the brief. */
export const contactServiceOptions = [
  'Independent House Construction',
  'Complete Interior Solutions',
  'Modular Kitchens',
  'Elevation & Exterior Design',
  'Bathrooms & Fittings',
  'Lighting & Wardrobes',
  'Something else',
];

export default {
  hero,
  promo,
  highlights,
  services,
  about,
  process,
  interiors,
  gallery,
};