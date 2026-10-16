/**
 * ============================================================================
 * MEDIA MANIFEST — the shot list for VNR's own photography
 * ============================================================================
 *
 * WHAT THIS IS
 * ------------
 * A single, authoritative list of every image slot on the site: what it is for,
 * where it appears, the exact aspect ratio and minimum resolution it must be
 * exported at, what the photograph should show, what its alt text must say,
 * and what its current fallback is.
 *
 * It also REPORTS. Run it and it tells you, per slot, whether a real photograph
 * has been dropped in yet. That turns "we need photography" from a vague
 * request into a checklist with a done-state.
 *
 * WHY THE PORTFOLIO IS EXCLUDED
 * -----------------------------
 * Hero, interiors and gallery slots can eventually use licensed stock or a
 * commissioned shoot, because nothing about them claims to be VNR's own work.
 * Project photography cannot. A stock photograph of someone else's apartment
 * captioned as a VNR project is the single most damaging thing this site could
 * ship, so those slots are marked `vnrOwn: true` and accept nothing but
 * photographs of real VNR work.
 *
 * HOW TO SUPPLY A PHOTOGRAPH
 * --------------------------
 *   1. Export the image to public/images/photos/<slot>.jpg
 *        - the exact aspect ratio below, not approximately
 *        - sRGB, quality 78-85, progressive
 *        - at or above the minimum pixel width below
 *   2. Re-run `npm run media` and the slot flips to "supplied".
 *   3. For project slots, also add the record to src/data/projects.js
 *      `images[]` and set `verified: true`.
 *
 * Nothing else has to change. No component edits, no import changes: the
 * components already read this manifest.
 *
 * USAGE:
 *   node scripts/media-manifest.mjs          # report to stdout
 *   node scripts/media-manifest.mjs --write  # also write docs/MEDIA.md
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PHOTO_DIR = resolve(ROOT, 'public/images/photos');
const DOC = resolve(ROOT, '../docs/MEDIA.md');

/**
 * @typedef {object} Slot
 * @property {string}  id           filename stem under public/images/photos/
 * @property {string}  where        rendered locations
 * @property {string}  purpose      why this slot exists
 * @property {string}  fallback     what renders until a photo is supplied
 * @property {string}  ratio        REQUIRED export aspect ratio
 * @property {number}  minWidth     REQUIRED minimum pixel width
 * @property {string}  subject      what the photograph must show
 * @property {string}  alt          alt text, written as if the photo existed
 * @property {boolean} vnrOwn       true => must be real VNR work, never stock
 * @property {number}  count        how many distinct files this slot needs
 */

/** @type {Slot[]} */
const SLOTS = [
  {
    id: 'hero',
    where: 'Home and Services hero, behind the headline',
    purpose:
      'The single most important image on the site. It sets the tone before a visitor reads a word.',
    fallback: 'illustration: hero-interiors.svg (dusk elevation, lit windows)',
    ratio: '3/2',
    minWidth: 2400,
    subject:
      'A VNR-built home at dusk, three-quarter exterior, warm interior light visible through the glazing. Shoot at blue hour so the sky still holds detail and the windows read as lit. Leave the left third comparatively quiet — the headline sits there.',
    alt: 'A residential home built by VNR Constructions, photographed at dusk with the interior lights on.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'about-profile',
    where: 'Home "Building Better Tomorrows" panel; /about-vnr',
    purpose: 'Company profile. Should show the people and the site, not a building.',
    fallback: 'illustration: about-project.svg (floor plan)',
    ratio: '4/3',
    minWidth: 1600,
    subject:
      'VNR staff or a supervised site walk on a live plot in Hyderabad. Real faces, real site, PPE where appropriate. Candid, not posed for a handshake.',
    alt: 'The VNR Constructions team on site during a construction walkthrough.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'interiors-promo',
    where: 'Home Interiors panel',
    purpose: 'Introduces the interiors half of the business.',
    fallback: 'illustration: interiors-promo.svg (interior perspective)',
    ratio: '4/3',
    minWidth: 1800,
    subject:
      'A finished VNR interior — living, dining or master bedroom. Show joinery and lighting, which is the actual service being sold. Horizontal, eye level, no wide-angle distortion.',
    alt: 'A finished living room interior designed and built by VNR Constructions.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'gallery-01',
    where: 'Home gallery mosaic',
    purpose: 'Mosaic lead tile.',
    fallback: 'illustration: gallery-01.svg',
    ratio: '4/3',
    minWidth: 1600,
    subject: 'A completed VNR project — exterior or principal interior, whichever is strongest.',
    alt: 'Completed VNR Constructions project.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'gallery-02',
    where: 'Home gallery mosaic',
    purpose: 'Mosaic tile — a different project from gallery-01.',
    fallback: 'illustration: gallery-02.svg',
    ratio: '4/3',
    minWidth: 1600,
    subject: 'A different completed VNR project, ideally a different typology.',
    alt: 'Completed VNR Constructions project.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'gallery-03',
    where: 'Home gallery mosaic',
    purpose: 'Mosaic tile.',
    fallback: 'illustration: gallery-03.svg',
    ratio: '4/3',
    minWidth: 1600,
    subject: 'A completed VNR project exterior.',
    alt: 'Completed VNR Constructions project.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'gallery-04',
    where: 'Home gallery mosaic',
    purpose: 'Mosaic tile.',
    fallback: 'illustration: gallery-04.svg',
    ratio: '4/3',
    minWidth: 1600,
    subject: 'A completed VNR project detail — joinery, staircase or facade.',
    alt: 'Construction detail on a completed VNR Constructions project.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'gallery-05',
    where: 'Home gallery mosaic',
    purpose: 'Mosaic tile.',
    fallback: 'illustration: gallery-05.svg',
    ratio: '4/3',
    minWidth: 1600,
    subject: 'A finished VNR kitchen or utility interior.',
    alt: 'A finished kitchen interior built by VNR Constructions.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'gallery-06',
    where: 'Home gallery mosaic',
    purpose: 'Mosaic tile.',
    fallback: 'illustration: gallery-06.svg',
    ratio: '4/3',
    minWidth: 1600,
    subject: 'A completed VNR project exterior.',
    alt: 'Completed VNR Constructions project.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'quality-interiors',
    where: '/quality, beside the inspection-practice copy',
    purpose:
      'Supports the argument that finishing quality is inspected, not assumed. A photograph of a real finished junction is more persuasive than any illustration.',
    fallback: 'illustration: quality-interiors.svg',
    ratio: '3/2',
    minWidth: 1600,
    subject:
      'Close, well-lit detail of a finished VNR junction — a skirting-to-floor meet, a plaster-to-joinery return, a neat services run.',
    alt: 'A finished construction junction on a VNR Constructions project, photographed to show the level of finish.',
    vnrOwn: true,
    count: 1,
  },
  {
    id: 'project-<slug>',
    where: 'Portfolio cards, /projects grid and each project detail page',
    purpose:
      'THE ONLY IMAGES THAT MAY BE CALLED A VNR PROJECT. Nothing else on the site is held to this standard, and nothing else should be.',
    fallback: 'components/common/PhotoPending.jsx — an honest "photography pending" plate',
    ratio: '3/2',
    minWidth: 1600,
    subject:
      'Per project: the finished exterior, then each principal room, then any detail worth showing. Consistent framing across the set. Include the location and month in the file name, e.g. independent-home-01-begumpet-2026-03-01.jpg.',
    alt: 'Describe what is actually visible, e.g. "Ground-floor living room of a completed independent home in Begumpet, Hyderabad." Never "project photo".',
    vnrOwn: true,
    count: 3,
  },
];

/* ---- Report -------------------------------------------------------------- */
function supplied() {
  if (!existsSync(PHOTO_DIR)) return new Set();
  return new Set(
    readdirSync(PHOTO_DIR)
      .filter((f) => /\.(jpe?g|png|avif|webp)$/i.test(f))
      .map((f) => f.replace(/\.[^.]+$/, '')),
  );
}

const have = supplied();
const rows = SLOTS.map((s) => ({ ...s, ready: have.has(s.id) }));

console.log('\nVNR CONSTRUCTIONS — MEDIA MANIFEST\n' + '='.repeat(60));
for (const s of rows) {
  const state = s.ready ? 'SUPPLIED' : 'pending ';
  console.log(
    `[${state}] ${s.id.padEnd(18)} ${s.ratio.padEnd(5)} >=${s.minWidth}px  ${s.where}`,
  );
}
const pending = rows.filter((s) => !s.ready);
console.log('='.repeat(60));
console.log(`${rows.length - pending.length}/${rows.length} slots supplied.`);
if (pending.length) {
  console.log(`\nAWAITING PHOTOGRAPHY (${pending.length}):`);
  for (const s of pending) console.log(`  - ${s.id}  (${s.vnrOwn ? 'VNR-owned only' : 'stock OK'})`);
}
console.log(
  `\nDrop files into public/images/photos/<id>.jpg at the listed ratio and resolution.\n`,
);

if (process.argv.includes('--write')) {
  mkdirSync(dirname(DOC), { recursive: true });
  const body = [
    '# Media manifest',
    '',
    'Generated by `npm run media -- --write`. Do not hand-edit; edit',
    '`scripts/media-manifest.mjs` and regenerate.',
    '',
    'The site currently ships **illustrations, not photographs**. Every slot below',
    'renders a drawn blueprint/elevation until a real image is supplied. This file',
    'is the shot list that closes that gap.',
    '',
    '## Hard rule',
    '',
    '> Every slot is marked **VNR-owned only**. A stock photograph of someone else’s',
    '> building, captioned as a VNR project, is the single most damaging asset this',
    '> site could publish. It is not an acceptable substitute at any resolution.',
    '',
    '## Slots',
    '',
    '| Slot | Status | Ratio | Min width | Where it appears |',
    '|---|---|---|---|---|',
    ...rows.map(
      (s) =>
        `| \`${s.id}\` | ${s.ready ? 'supplied' : '**pending**'} | ${s.ratio} | ${s.minWidth}px | ${s.where} |`,
    ),
    '',
    '## Shot briefs',
    '',
    ...rows.flatMap((s) => [
      `### \`${s.id}\``,
      '',
      `- **Purpose:** ${s.purpose}`,
      `- **Fallback until supplied:** ${s.fallback}`,
      `- **Export:** ${s.ratio}, at least ${s.minWidth}px wide, sRGB, q78-85, progressive`,
      `- **Subject:** ${s.subject}`,
      `- **Alt text:** ${s.alt}`,
      '',
    ]),
    '## Sources if stock is ever considered',
    '',
    'Not currently used, and not a substitute for the above — recorded so the',
    'option is documented rather than improvised:',
    '',
    '- **Unsplash License** — free for commercial use, no attribution required.',
    '- **Pexels License** — free for commercial use, no attribution required.',
    '- **Adobe Stock** — paid subscription; check the specific asset, not the plan.',
    '- **Wikimedia Commons** — only where the file is public domain or CC0, and the',
    '  author and licence are recorded in `ATTRIBUTIONS.md`.',
    '',
    'All four require an account and an API key, and none of them are configured in',
    'this repository. That is why no third-party photograph is bundled.',
    '',
  ].join('\n');
  writeFileSync(DOC, body, 'utf8');
  console.log(`wrote ${DOC}`);
}