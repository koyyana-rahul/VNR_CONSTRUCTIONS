/**
 * ============================================================================
 * PROJECT-SCOPE COMPARISON TOOL
 * ============================================================================
 *
 * VNR Constructions has NOT supplied official construction packages.
 * The brief instructs:
 *   "If official packages do not exist, use a project-scope comparison tool
 *    instead."
 *   "Never invent rates, material brands, warranties, or contractual
 *    commitments."
 *
 * So there are deliberately NO prices, NO brands, NO warranties and NO
 * "guaranteed" claims anywhere in this file. What it compares is the DECISION
 * a plot owner faces before talking to any builder: how much of the design and
 * finish work do you want to carry yourself versus hand over.
 *
 * Each scope has a boolean per capability. `true` = VNR handles that scope.
 * `false` = it sits outside the agreed scope; the note explains the
 * consequence honestly rather than implying a refund or a penalty.
 *
 * TO GO LIVE: replace with real packages (price, inclusions, exclusions) once
 * VNR supplies an approved rate card.
 */

export const scopeOptions = [
  {
    id: 'structure-shell',
    title: 'Structure & Shell',
    tagline: 'Build the envelope, keep the decisions.',
    summary:
      'Foundation, structure, masonry, roofing and basic waterproofing — everything needed to make a weather-tight building, with finishes left to you.',
    bestFor: 'Plot owners who already have an interior design or want to stage spending.',
    durationNote: 'Shortest on site.',
    capabilities: {
      design: false,
      approvals: false,
      structure: true,
      masonry: true,
      waterproofing: true,
      plumbing: true,
      electrical: true,
      flooring: false,
      painting: false,
      joinery: false,
      interiors: false,
      handoverDocs: true,
    },
    tradeoffs: [
      'You need your own designer and contractors for finishes.',
      'Multiple contractors on site at once can slow the programme.',
    ],
  },
  {
    id: 'full-build',
    title: 'Full Build',
    tagline: 'A single scope from slab to handover.',
    summary:
      'Structure through to finishing, with one scope and one point of accountability. The most common way VNR projects are run.',
    bestFor: 'Most first-time builders who want one team and one schedule.',
    durationNote: 'Longest on site, single mobilisation.',
    capabilities: {
      design: true,
      approvals: true,
      structure: true,
      masonry: true,
      waterproofing: true,
      plumbing: true,
      electrical: true,
      flooring: true,
      painting: true,
      joinery: true,
      interiors: false,
      handoverDocs: true,
    },
    tradeoffs: [
      'A larger single scope means a larger single payment schedule.',
      'Interior styling beyond the standard finish package is a separate scope.',
    ],
  },
  {
    id: 'turnkey-interiors',
    title: 'Turnkey Interiors',
    tagline: 'A finished, usable building.',
    summary:
      'Full build plus interior fit-out, joinery, final flooring and finishing — handed over ready to furnish and occupy.',
    bestFor: 'NRI owners, relocating families and anyone who cannot manage site regularly.',
    durationNote: 'Longest programme, but no client site presence required.',
    capabilities: {
      design: true,
      approvals: true,
      structure: true,
      masonry: true,
      waterproofing: true,
      plumbing: true,
      electrical: true,
      flooring: true,
      painting: true,
      joinery: true,
      interiors: true,
      handoverDocs: true,
    },
    tradeoffs: [
      'Highest initial scope, so it needs the largest committed budget up front.',
      'Interior selections must be frozen early to protect the programme.',
    ],
  },
];

/** Row definitions for the comparison grid — order controls display. */
export const comparisonRows = [
  { id: 'design', label: 'Design & drawings', hint: 'Layout, structural and services drawings prepared for you.' },
  { id: 'approvals', label: 'Approval support', hint: 'Assistance with sanction drawings and authority submissions.' },
  { id: 'structure', label: 'Structure', hint: 'Foundation, frame, slabs and load-bearing elements.' },
  { id: 'masonry', label: 'Masonry', hint: 'Load-bearing and non-load-bearing wall construction.' },
  { id: 'waterproofing', label: 'Waterproofing', hint: 'Terrace, wet areas and exposed surfaces.' },
  { id: 'plumbing', label: 'Plumbing', hint: 'Water distribution, drainage and sanitary fittings.' },
  { id: 'electrical', label: 'Electrical', hint: 'Wiring, earthing, distribution and lighting.' },
  { id: 'flooring', label: 'Flooring', hint: 'Base preparation and finished floor surfaces.' },
  { id: 'painting', label: 'Painting & walls', hint: 'Wall and ceiling preparation, paint and treatments.' },
  { id: 'joinery', label: 'Joinery & carpentry', hint: 'Doors, windows, wardrobes and kitchen carpentry.' },
  { id: 'interiors', label: 'Interior fit-out', hint: 'Interior styling, soft and hard finishes as an integrated scope.' },
  { id: 'handoverDocs', label: 'Handover documentation', hint: 'As-built information and agreed documentation at completion.' },
];

/**
 * Whether VNR publishes official priced packages.
 * False in this build, which is why the page presents a SCOPE comparison
 * rather than a price comparison.
 */
export const officialPackagesAvailable = false;

export const getScopeOption = (id) => scopeOptions.find((o) => o.id === id);

/**
 * Build the row-by-row comparison between two scope options.
 * Only rows where the two actually DIFFER are marked, so the UI can highlight
 * the genuine decision points rather than flooding the table with identicals.
 *
 * @returns {Array<{id,label,hint,values:{a:boolean,b:boolean},differs:boolean}>}
 */
export function compareScopes(idA, idB) {
  const a = getScopeOption(idA);
  const b = getScopeOption(idB);
  if (!a || !b) return [];

  return comparisonRows.map((row) => {
    const av = Boolean(a.capabilities[row.id]);
    const bv = Boolean(b.capabilities[row.id]);
    return {
      id: row.id,
      label: row.label,
      hint: row.hint,
      values: { a: av, b: bv },
      differs: av !== bv,
    };
  });
}

/** Count how many capabilities each option covers — shown as a headline stat. */
export function countCapabilities(option) {
  if (!option) return 0;
  return Object.values(option.capabilities).filter(Boolean).length;
}

export default scopeOptions;