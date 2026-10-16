/**
 * ============================================================================
 * HOMEPAGE CONTENT
 * ============================================================================
 *
 * PROVENANCE — read this before publishing.
 *
 * Strings fall into two groups:
 *
 * 1. SUPPLIED. Headline, eyebrow, hero body, CTA labels, the ₹1,799/sq. ft.
 *    starting price and its disclaimer, the six service TITLES and their
 *    order, the four process step titles, the highlights, and all business
 *    contact details. These are the client's own words and must not change.
 *
 * 2. DRAFT. The six service descriptions, the About introduction, the four
 *    value statements, the four process step descriptions and the interiors
 *    paragraph. The original site was never supplied (reference/ contains only
 *    a README), so rather than invent claims on the client's behalf these were
 *    written to describe ONLY what each heading already implies — the scope of
 *    work, not any achievement.
 *
 *    Every draft field is tagged `copyStatus: 'draft'` and is reported by
 *    `npm run check:company` as outstanding. Replace the wording with the real
 *    copy, then change the tag to `copyStatus: 'approved'`.
 *
 * WHAT THE DRAFT COPY DELIBERATELY DOES NOT CONTAIN
 *   No project counts, no years in business, no square footage delivered, no
 *   certifications, no awards, no client names, no testimonials, no ratings and
 *   no superlatives. Those are factual claims about a real business and only
 *   VNR can make them. If a sentence needs a number to sound good, that is the
 *   signal that it is not ready to publish.
 */

/* ---- Section 3: Hero --------------------------------------------------- */

export const hero = {
  eyebrow: 'Home Construction & Premium Interiors',
  title: 'Your Dream Home. Our Commitment.',
  /** "Our Commitment." carries the gold accent in the render. */
  body: 'VNR Constructions brings home construction and premium interior solutions together with a focus on considered design, quality-conscious material choices and clear project discussions. Let’s shape a home that reflects your lifestyle and your future.',
  primaryCta: 'Discuss Your Project',
  secondaryCta: 'Explore Our Services',

  /**
   * THE SUPPLIED HERO PHOTOGRAPH.
   *
   * public/images/Hero.png — 1672 x 941 (16:9), an evening construction scene:
   * a tower crane over a building under construction on the left, a completed
   * modern house on the right, and a VNR-branded gold hard hat resting on the
   * working drawings in the foreground.
   *
   * THE COMPOSITION IS THE LAYOUT. The left third of the frame is open sunset
   * sky with almost no detail; the right third carries the house and the hard
   * hat. That is why the copy sits bottom-LEFT over the image as a full-bleed
   * background rather than in a split panel — the headline lands on the
   * photograph's own negative space, so it needs no opaque box and the
   * building stays visible.
   *
   * Intrinsic size is declared so the browser reserves the hero box before the
   * bitmap decodes. The file is 2.0 MB; see scripts/media-manifest.mjs for the
   * recommendation to transcode it once an encoder is available.
   */
  image: '/images/Hero.png',
  imageWidth: 1672,
  imageHeight: 941,
  /**
   * Describes the pixels for a screen reader. It deliberately does not repeat
   * the visible headline — the <h1> already carries the message — it conveys
   * what the photograph actually shows.
   */
  imageAlt:
    'An evening construction site: a tower crane over a building under construction, a completed modern house beside it, and a gold VNR Constructions hard hat resting on working drawings in the foreground.',
  /** No longer a placeholder — this is a real supplied asset. */
  imageNeedsReplacement: false,
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
    // `Building2`, not `Home`: Lucide's `Home` and `House` are the SAME
    // component, so using either here rendered a glyph identical to the
    // "Independent House Construction" service card two sections below.
    icon: 'Building2',
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
   Titles and order are supplied verbatim. Descriptions are DRAFT — see the
   provenance note at the top of this file. */

export const services = [
  {
    id: 'independent-house',
    number: '01',
    title: 'Independent House Construction',
    icon: 'House',
    description:
      'Ground-up construction of independent houses, taking the work from structure and shell through to finishing.',
    copyStatus: 'draft',
  },
  {
    id: 'interior-solutions',
    number: '02',
    title: 'Complete Interior Solutions',
    icon: 'PaintbrushVertical',
    description:
      'Interior work planned as one package, so layout, joinery, surfaces and fittings are decided together rather than in stages.',
    copyStatus: 'draft',
  },
  {
    id: 'modular-kitchens',
    number: '03',
    title: 'Modular Kitchens',
    icon: 'CookingPot',
    description:
      'Modular kitchen layouts with storage, worktops and hardware chosen around how the kitchen is actually used.',
    copyStatus: 'draft',
  },
  {
    id: 'elevation-exterior',
    number: '04',
    title: 'Elevation & Exterior Design',
    // A framed elevation, not another house — `Home` would have been a third
    // identical glyph on the same screen.
    icon: 'Frame',
    description:
      'Exterior elevation and facade decisions considered for proportion, climate response and finish.',
    copyStatus: 'draft',
  },
  {
    id: 'bathrooms-fittings',
    number: '05',
    title: 'Bathrooms & Fittings',
    icon: 'ShowerHead',
    description:
      'Bathroom layouts specified as one coordinated scope, covering waterproofing, tiling and fittings together.',
    copyStatus: 'draft',
  },
  {
    id: 'lighting-wardrobes',
    number: '06',
    title: 'Lighting & Wardrobes',
    icon: 'Lamp',
    description:
      'Lighting placement and built-in wardrobes planned around how each room is used, not fitted in afterwards.',
    copyStatus: 'draft',
  },
];

/* ---- Section 6: About ---------------------------------------------------
   Heading and tagline are supplied. The introduction and the four value
   statements are DRAFT — see the provenance note at the top of this file. */

export const about = {
  title: 'Building Better Tomorrows.',
  tagline: 'Construction and interiors, under one roof.',
  introduction:
    'VNR Constructions works across home construction and premium interiors in Hyderabad and Telangana. Because structure and finishing sit with the same team, a project is discussed as one scope instead of being handed between separate contractors.',
  copyStatus: 'draft',
  values: [
    { id: 'value-1', text: 'One team for construction and interiors.', copyStatus: 'draft' },
    { id: 'value-2', text: 'Material choices discussed before work begins.', copyStatus: 'draft' },
    { id: 'value-3', text: 'Clear scope, pricing and a written quotation.', copyStatus: 'draft' },
    { id: 'value-4', text: 'Familiar with Hyderabad and Telangana sites.', copyStatus: 'draft' },
  ],
  image: '/images/about-project.svg',
  imageNeedsReplacement: true,
};

/* ---- Section 7: Four-step process ----------------------------------------
   Step titles are supplied. Descriptions are DRAFT. */

export const process = [
  {
    step: 1,
    title: 'Share Your Vision',
    description: 'Tell us what the home needs to do, and which services are in scope.',
    copyStatus: 'draft',
  },
  {
    step: 2,
    title: 'Site Visit & Discussion',
    description: 'We visit the plot or property and discuss layout, materials and priorities with you.',
    copyStatus: 'draft',
  },
  {
    step: 3,
    title: 'Scope & Estimate',
    description: 'The agreed scope and a written estimate are prepared before work begins.',
    copyStatus: 'draft',
  },
  {
    step: 4,
    title: 'Plan the Work',
    description: 'A sequenced work plan is agreed, so each stage is clear before it starts.',
    copyStatus: 'draft',
  },
];

/* ---- Section 8: Premium interiors ---------------------------------------
   Title and the four feature labels are supplied. Paragraph is DRAFT. */

export const interiors = {
  title: 'Rich Details. Thoughtful Living.',
  description:
    'Interior work is planned as a whole: layout, joinery, surfaces, lighting and fittings are decided together, so finished rooms feel considered rather than pieced together over time.',
  copyStatus: 'draft',
  image: '/images/interiors-promo.svg',
  imageNeedsReplacement: true,
  features: [
    { id: 'kitchens', title: 'Modular Kitchens', icon: 'CookingPot' },
    { id: 'living', title: 'Living Rooms', icon: 'Sofa' },
    { id: 'bedrooms', title: 'Bedrooms & Wardrobes', icon: 'BedDouble' },
    { id: 'lighting', title: 'Lighting & Fittings', icon: 'Lightbulb' },
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

/**
 * Home is reachable from the logo on every breakpoint, so it is deliberately
 * NOT in the desktop header bar — five links plus a CTA plus a 172px logo is
 * already the limit at 1280px.
 *
 * The mobile drawer is a different surface: it is the ONLY navigation a phone
 * user gets, and it listed five links with no Home at all. This entry exists so
 * the drawer can open with it without changing the header.
 */
export const navHome = {
  to: '/',
  label: 'Home',
  description: 'Back to the top of the site',
};

/**
 * THE SUPPORTING PAGES WERE ORPHANED.
 * -----------------------------------
 * `/projects`, `/packages`, `/estimate` and `/quality` are fully built, have
 * their own SEO entries in config/site.js and their own sitemap rows — and
 * NOTHING linked to them. `nav` above has five items and none of them is one of
 * those routes, and the footer's Explore column was built from `nav` plus Home,
 * so a visitor could not reach any of them from anywhere in the navigation.
 *
 * On desktop the header bar genuinely has no room for four more links, so they
 * live where there IS room: the mobile drawer, and the footer's two-column
 * Explore list. Both were being carried by a large empty area anyway.
 *
 * Kept here, beside `nav`, so the two lists cannot drift apart.
 */
export const navSecondary = [
  {
    to: '/projects',
    label: 'Our Projects',
    description: 'Completed and in-progress work',
  },
  {
    to: '/packages',
    label: 'Packages',
    description: 'Compare three build scopes',
  },
  {
    to: '/estimate',
    label: 'Cost Estimator',
    description: 'Indicative budget in seconds',
  },
  {
    to: '/quality',
    label: 'Quality Standards',
    description: 'How each trade is handled',
  },
];

/**
 * The primary list PLUS Home, for the desktop bar.
 *
 * Home sits in the desktop header as a real link even though the logo already
 * goes home. That is a deliberate reversal of the usual advice — a "Home" item
 * next to a logo that links home is often called redundant — and the reason is
 * that the bar and the drawer have to agree. The drawer lists Home, and a
 * desktop visitor who learned the navigation from a phone should find the same
 * destinations in the same words, not a different set plus a logo.
 *
 * It is first in the list rather than hidden, so it reads as the start of the
 * sequence instead of an afterthought bolted on the right.
 */
export const navWithHome = [navHome, ...nav];

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
  nav,
  navHome,
  navSecondary,
  navWithHome,
};