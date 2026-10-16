/**
 * ============================================================================
 * PROJECT PORTFOLIO — DEVELOPMENT DATA
 * ============================================================================
 *
 *  !! THIS IS PLACEHOLDER DATA — NONE OF THESE ARE REAL VNR PROJECTS !!
 *
 * There is no backend and VNR Constructions has not supplied its completed
 * project list. The brief is explicit:
 *
 *   "Never present fabricated projects as real completed projects."
 *   "use a centralized mock-data file that is clearly identified as
 *    development data."
 *
 * Every record therefore carries `verified: false`. The portfolio renders a
 * persistent notice, and each card shows an "Illustrative" badge in addition
 * to its status, so no visitor can mistake these for a portfolio of real
 * completed work.
 *
 * TO GO LIVE: replace the entries below with real projects, delete
 * `verified: false`, and delete `placeholderNotice` from components/projects/.
 *
 * Shape:
 *   id, slug, title, category, location {area, city}, status, year,
 *   summary, description[], images[], specs[], relatedIds[]
 */

export const PROJECT_CATEGORIES = [
  { id: 'independent-home', label: 'Independent Home' },
  { id: 'villa-duplex', label: 'Villa / Duplex' },
  { id: 'apartment', label: 'Apartment' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'renovation', label: 'Renovation' },
  { id: 'interiors', label: 'Interiors' },
];

export const PROJECT_STATUSES = [
  { id: 'completed', label: 'Completed', tone: 'gold' },
  { id: 'in-progress', label: 'In Progress', tone: 'neutral' },
  { id: 'handed-over', label: 'Handed Over', tone: 'neutral' },
];

export const projects = [
  {
    id: 'p-001',
    slug: 'sample-independent-home-01',
    title: 'Independent Home — Sample Entry',
    category: 'independent-home',
    location: { area: null, city: null },
    status: 'completed',
    year: null,
    verified: false,
    summary:
      'Placeholder record demonstrating the portfolio layout. Replace with a real VNR project, including its city and completion year.',
    description: [
      'This entry exists purely to prove the portfolio, filtering and detail-page system work end to end. It is not a real project.',
      'When you supply real project data, each record should describe the actual challenge, the scope VNR delivered, and anything genuinely notable about the site or the build.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-002', 'p-005'],
  },
  {
    id: 'p-002',
    slug: 'sample-villa-01',
    title: 'Villa / Duplex — Sample Entry',
    category: 'villa-duplex',
    location: { area: null, city: null },
    status: 'in-progress',
    year: null,
    verified: false,
    summary:
      'Placeholder multi-level record used to demonstrate multi-image galleries and the in-progress status badge.',
    description: [
      'Multi-level projects carry different risks from single-storey builds. A real record would describe how slab, stair and wet-zone waterproofing were handled.',
      'Replace this text with the actual project narrative.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-001', 'p-003'],
  },
  {
    id: 'p-003',
    slug: 'sample-apartment-01',
    title: 'Apartment Building — Sample Entry',
    category: 'apartment',
    location: { area: null, city: null },
    status: 'completed',
    year: null,
    verified: false,
    summary:
      'Placeholder multi-unit record demonstrating the apartment category filter and standardisation angle.',
    description: [
      'Apartment work is dominated by repetition. A real entry would explain the unit types, the services strategy and how repetition controlled cost.',
      'Replace this text with the actual project narrative.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-002', 'p-004'],
  },
  {
    id: 'p-004',
    slug: 'sample-commercial-01',
    title: 'Commercial Building — Sample Entry',
    category: 'commercial',
    location: { area: null, city: null },
    status: 'completed',
    year: null,
    verified: false,
    summary:
      'Placeholder commercial record demonstrating the commercial category and open-plan framing.',
    description: [
      'Commercial projects prioritise flexibility and services access. A real entry would describe the floor plate strategy and any phased occupancy.',
      'Replace this text with the actual project narrative.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-003', 'p-006'],
  },
  {
    id: 'p-005',
    slug: 'sample-renovation-01',
    title: 'Renovation — Sample Entry',
    category: 'renovation',
    location: { area: null, city: null },
    status: 'completed',
    year: null,
    verified: false,
    summary:
      'Placeholder renovation record demonstrating the condition-survey angle that dominates refurbishment work.',
    description: [
      'Renovation cost is driven by what is discovered once work starts, so the condition survey matters more than the finish schedule.',
      'Replace this text with the actual project narrative.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-001', 'p-007'],
  },
  {
    id: 'p-006',
    slug: 'sample-interiors-01',
    title: 'Interiors — Sample Entry',
    category: 'interiors',
    location: { area: null, city: null },
    status: 'completed',
    year: null,
    verified: false,
    summary:
      'Placeholder interiors record demonstrating the finish-schedule angle and interiors filter.',
    description: [
      'Interiors budgets are governed by the finish schedule. A real entry would describe the material palette and how quantities were controlled.',
      'Replace this text with the actual project narrative.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-004', 'p-008'],
  },
  {
    id: 'p-007',
    slug: 'sample-independent-home-02',
    title: 'Independent Home — Second Sample',
    category: 'independent-home',
    location: { area: null, city: null },
    status: 'handed-over',
    year: null,
    verified: false,
    summary:
      'Placeholder record demonstrating the "handed over" status and the related-projects rail.',
    description: [
      'A real entry would describe the handover process — snag closure, documentation handed to the owner, and warranty periods.',
      'Replace this text with the actual project narrative.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-005', 'p-001'],
  },
  {
    id: 'p-008',
    slug: 'sample-commercial-02',
    title: 'Commercial — Second Sample',
    category: 'commercial',
    location: { area: null, city: null },
    status: 'in-progress',
    year: null,
    verified: false,
    summary:
      'Placeholder record confirming that the commercial filter returns more than one result.',
    description: [
      'Each category needs at least two records for the filter buttons to demonstrate real filtering behaviour.',
      'Replace this text with the actual project narrative.',
    ],
    /**
     * EMPTY ON PURPOSE. This record has no verified photograph of real VNR work.
     *
     * Twenty-one generated "project elevations" used to sit here. They were
     * not photographs and not buildings, and the grid implied twenty-one
     * completed projects that do not exist. src/components/common/PhotoPending.jsx
     * now renders an honest plate in their place.
     *
     * TO PUBLISH A REAL PROJECT, add its own photographs here:
     *   images: [{ src: '/images/projects/independent-home-01-01.jpg',
 *              alt: '<what is actually shown, for a screen reader>' }],
     * export the files at 3:2 and no smaller than 1600x1067, then set
     * verified: true on this record. See scripts/media-manifest.mjs for the
     * full shot list.
     */
    images: [],
    specs: [
      { label: 'Built-up area', value: null },
      { label: 'Floors', value: null },
      { label: 'Plot area', value: null },
      { label: 'Structural system', value: null },
      { label: 'Completion', value: null },
    ],
    relatedIds: ['p-006', 'p-004'],
  },
];

/** True while any record is still placeholder data. Drives the notice banner. */
export const hasPlaceholderProjects = projects.some((p) => !p.verified);

/* ---- Lookups ------------------------------------------------------------- */

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug);

export const getProjectById = (id) => projects.find((p) => p.id === id);

export const getCategoryLabel = (id) =>
  PROJECT_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const getStatusMeta = (id) =>
  PROJECT_STATUSES.find((s) => s.id === id) ?? { id, label: id, tone: 'neutral' };

/** Projects in the same category, excluding the current one. */
export function getRelatedProjects(project, limit = 3) {
  if (!project) return [];
  const explicit = (project.relatedIds ?? [])
    .map(getProjectById)
    .filter((p) => p && p.id !== project.id);
  if (explicit.length >= limit) return explicit.slice(0, limit);

  const sameCategory = projects.filter(
    (p) => p.id !== project.id && p.category === project.category,
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

/**
 * Simulated async fetch so the UI can exercise real loading and error states.
 * Replaced wholesale by a single API call when a backend exists.
 */
export function fetchProjects({ signal } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(projects), 420);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export function fetchProjectBySlug(slug, { signal } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const project = getProjectBySlug(slug);
      if (project) resolve(project);
      else reject(new Error('PROJECT_NOT_FOUND'));
    }, 300);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export default projects;