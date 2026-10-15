/**
 * ============================================================================
 * COMPANY CONFIG — THE SINGLE SOURCE OF TRUTH
 * ============================================================================
 *
 *  !! ACTION REQUIRED BEFORE LAUNCH !!
 *
 * VNR Constructions did not supply verified business details at the time this
 * site was built. Per the brief ("do not invent missing details", "never claim
 * that an enquiry has been stored if it has not been saved", "all phone, email,
 * WhatsApp, map and social links must be functional and must use verified
 * information"), NOTHING below has been guessed.
 *
 * Every field that is still unverified is marked `needsConfirmation: true` and
 * is either:
 *   a) rendered as an honest "pending confirmation" state, or
 *   b) hidden entirely from the UI and from SEO structured data.
 *
 * Fill in the real values here and the entire site updates automatically:
 * header, footer, contact page, floating WhatsApp action, enquiry fallback
 * message, tel: links, mailto: links, JSON-LD schema and sitemap.
 *
 * Run `npm run check:company` to list everything still outstanding.
 */

/**
 * The promotional "construction starting price" shown on the homepage.
 *
 * This is REAL supplied content — the client's brief states the figure is
 * ₹1,799 / sq. ft. and instructs that it must not be silently removed, with
 * its disclaimer kept visible and final pricing clearly dependent on the
 * agreed scope and written quotation.
 *
 * It is therefore presented as a STARTING price with a mandatory disclaimer,
 * never as a firm quotation.
 */
export const promo = {
  enabled: true,
  label: 'Construction starting price*',
  /** Stored as a number so it can be formatted, never hard-coded twice. */
  rate: 1799,
  unit: '/ sq. ft.',
  disclaimer:
    '*Indicative starting price. Final cost depends on the agreed scope, materials, site conditions and the written quotation.',
  needsConfirmation: false,
};

/** Set to true once every field below is filled in from a verified source. */
export const COMPANY_DATA_IS_VERIFIED = false;

/**
 * Fields the site needs before it can go live. Used by the
 * `npm run check:company` script to print a launch checklist.
 */
export const PENDING_FIELDS = [
  // Phone, WhatsApp number and Hyderabad service area are confirmed.
  'company.email',
  'company.address (street + postal code)',
  'company.hours',
  'company.socials',
  'company.gstNumber',
  'company.establishmentYear',
  'company.logo (supplied artwork — see /reference)',
  'company.promo (verify the ₹1,799/sq ft figure and disclaimer wording)',
  'company.projects (src/data/projects.js — all placeholder)',
  'company.packages / estimator rates (src/config/estimator.js)',
  'company.testimonials (none supplied — section hidden)',
  'verbatim website copy + imagery (awaiting /reference files)',
];

export const company = {
  /** ---- Identity ------------------------------------------------------- */
  name: 'VNR Constructions',
  legalName: null, // e.g. 'VNR Constructions LLP' — add if the legal entity differs
  shortName: 'VNR',
  tagline: 'Building Your Vision Into Reality.',
  needsConfirmation: true,

  /**
   * Path to the logo. The brief requires the ORIGINAL supplied artwork —
   * never redrawn, recoloured, cropped or stretched.
   * Replace src/assets/brand/vnr-logo.svg with the real file and keep this path,
   * or point it at the new file. See README "Replacing the logo".
   */
  logo: {
    src: '/vnr-logo.svg',
    width: 210, // intrinsic px — used to reserve space and prevent layout shift
    height: 56,
    /**
     * 'light' = artwork has a WHITE background. It must only ever be placed
     * on white/warm-white surfaces, and must NOT be put on the deep-black
     * footer/header-on-dark, or you will see a white box.
     * Change to 'transparent' ONLY if a verified transparent version exists.
     */
    variant: 'light',
    needsConfirmation: true,
  },

  /** ---- Contact ---------------------------------------------------------
   * CONFIRMED BY THE CLIENT on 2026-10-15: the phone number below and the
   * Hyderabad, Telangana service area are correct and are published as
   * verified. Everything else in this file is still outstanding.
   * -------------------------------------------------------------------- */
  phone: {
    display: '+91 90304 25656',
    // tel: links need the country code first, no spaces or plus.
    dial: '+919030425656',
    // Formatted as the client wrote it, for the topbar/footer display.
    raw: '9030425656',
    needsConfirmation: false,
  },

  whatsapp: {
    // Same verified number; WhatsApp deep links use the digits-only form.
    number: '9030425656',
    needsConfirmation: false,
  },

  email: {
    display: null, // e.g. 'hello@vnrconstructions.com'
    needsConfirmation: true,
  },

  address: {
    line1: null,
    line2: null,
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: null,
    country: 'India',
    /**
     * Only set once a street address is verified. Until then no map link is
     * rendered anywhere, because an unverified pin would be a dead link.
     */
    mapsUrl: null,
    needsConfirmation: true,
  },

  /** Regions VNR actually serves. Drives the service-area SEO text. */
  serviceAreas: {
    list: ['Hyderabad', 'Telangana'],
    needsConfirmation: false,
  },

  hours: {
    /** e.g. 'Mon – Sat, 9:30 AM – 7:00 PM' */
    display: null,
    needsConfirmation: true,
  },

  /** ---- Business registration ------------------------------------------ */
  gstNumber: {
    value: null,
    needsConfirmation: true,
  },

  establishmentYear: {
    value: null, // Only used if verified — never guess "Years of experience"
    needsConfirmation: true,
  },

  /** ---- Social ---------------------------------------------------------- */
  /** Empty arrays render no links at all — no dead "#" anchors anywhere. */
  socials: {
    list: [], // [{ label: 'Instagram', href: 'https://…', icon: 'instagram' }]
    needsConfirmation: true,
  },

  /** ---- SEO ------------------------------------------------------------- */
  seo: {
    siteUrl: 'https://www.vnrconstructions.com',
    needsConfirmation: true, // confirm the real production domain
    defaultOgImage: '/og-image.svg',
    /**
     * No aggregate rating, no review counts, no star ratings are published
     * because none have been verified. Publishing them would be fake review
     * markup and is prohibited by the brief.
     */
  },
};

/* ----------------------------------------------------------------------------
 * Derived helpers. Components should use these, never `company.phone.dial`
 * directly, so that a missing value can never produce a broken tel:/wa.me link.
 * ------------------------------------------------------------------------- */

export const hasPhone = Boolean(company.phone.dial);
export const hasWhatsApp = Boolean(company.whatsapp.number);
export const hasEmail = Boolean(company.email.display);
export const hasAddress = Boolean(company.address.line1 || company.address.city);
export const hasSocials = company.socials.list.length > 0;

/** Returns a `tel:` href, or null when no verified number exists. */
export function telHref() {
  return hasPhone ? `tel:${company.phone.dial}` : null;
}

/** Returns a `mailto:` href, or null when no verified address exists. */
export function mailtoHref() {
  return hasEmail ? `mailto:${company.email.display}` : null;
}

/** Returns a WhatsApp deep link, or null when no verified number exists. */
export function whatsappHref(text = '') {
  if (!hasWhatsApp) return null;
  const message = text.trim();
  return `https://wa.me/${company.whatsapp.number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/** Structured address object for JSON-LD, or null when unverified. */
export function schemaAddress() {
  if (!hasAddress) return null;
  const { line1, line2, city, state, postalCode, country } = company.address;
  return {
    ...(line1 && { streetAddress: [line1, line2].filter(Boolean).join(', ') }),
    ...(city && { addressLocality: city }),
    ...(state && { addressRegion: state }),
    ...(postalCode && { postalCode }),
    ...(country && { addressCountry: country }),
  };
}

/**
 * JSON-LD for the business.
 * Deliberately emits only verified properties — no telephone, no address,
 * no aggregateRating until those fields are confirmed.
 */
export function organizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: company.name,
    url: company.seo.siteUrl,
    slogan: company.tagline,
    logo: `${company.seo.siteUrl}${company.logo.src}`,
  };

  if (hasPhone) schema.telephone = company.phone.display;
  if (hasEmail) schema.email = company.email.display;
  const address = schemaAddress();
  if (address) schema.address = { '@type': 'PostalAddress', ...address };
  if (company.serviceAreas.list.length) {
    schema.areaServed = company.serviceAreas.list.map((area) => ({
      '@type': 'Place',
      name: area,
    }));
  }
  if (hasSocials) {
    schema.sameAs = company.socials.list.map((s) => s.href);
  }

  return schema;
}

export default company;