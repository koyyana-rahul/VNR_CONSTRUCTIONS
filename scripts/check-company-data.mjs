/**
 * ============================================================================
 * PRE-LAUNCH CHECKLIST
 * ============================================================================
 *
 * Verifies that everything the brief forbids guessing has actually been
 * supplied. Exits non-zero while anything is outstanding, so it can be wired
 * into CI as a launch gate.
 *
 *   npm run check:company
 *
 * This is the honest counterpart to a green build: the site compiles fine with
 * null phone numbers, but it is NOT ready to publish until this passes.
 */

import { readFileSync } from 'node:fs';
import { ROUTES } from '../src/config/site.js';
import { projects } from '../src/data/projects.js';
import { services } from '../src/data/services.js';
import { testimonials } from '../src/data/testimonials.js';
import { officialPackagesAvailable, scopeOptions } from '../src/data/packages.js';
import {
  services as homeServices,
  about,
  process as processSteps,
  interiors,
} from '../src/data/home.js';

const companySource = readFileSync(
  new URL('../src/config/company.js', import.meta.url),
  'utf8',
);

/**
 * Returns the captured string ONLY when the field holds a real quoted value.
 *
 * The previous version of this check used `(?:'([^']*)'|null)` so that an
 * explicit `null` literal also "matched" — which meant an unset phone number
 * reported as complete. This version has no null alternative, so `display: null`
 * correctly fails.
 */
function stringField(pattern) {
  const match = pattern.exec(companySource);
  return match?.[1]?.trim() || null;
}

/**
 * Collects every homepage field still marked `copyStatus: 'draft'`.
 *
 * These render as ordinary finished prose, so nothing in the build, the tests or
 * the browser audits can tell that the client has not yet approved the wording.
 * Reporting them here is what stops a draft sentence being published by
 * accident.
 */
const draftCopy = [
  ...homeServices.map((s) => (s.copyStatus === 'draft' ? `service:${s.id}` : null)),
  about.copyStatus === 'draft' ? 'about:introduction' : null,
  ...about.values.map((v) => (v.copyStatus === 'draft' ? `about:${v.id}` : null)),
  ...processSteps.map((p) => (p.copyStatus === 'draft' ? `process:step-${p.step}` : null)),
  interiors.copyStatus === 'draft' ? 'interiors:description' : null,
].filter(Boolean);

const checks = [  {
    label: 'Company phone (display)',
    ok: !!stringField(/phone:\s*\{[^}]*?display:\s*'([^']*)'/s),
    fix: 'company.phone.display in src/config/company.js',
  },
  {
    label: 'Company phone (dial format)',
    ok: !!stringField(/dial:\s*'([^']*)'/s),
    fix: 'company.phone.dial (digits + country code, no spaces)',
  },
  {
    label: 'WhatsApp number',
    ok: !!stringField(/whatsapp:\s*\{[^}]*?number:\s*'([^']*)'/s),
    fix: 'company.whatsapp.number',
  },
  {
    label: 'Contact email',
    ok: !!stringField(/email:\s*\{[^}]*?display:\s*'([^']*)'/s),
    fix: 'company.email.display',
  },
  {
    label: 'Business address',
    ok: !!stringField(/address:\s*\{[^}]*?line1:\s*'([^']*)'/s),
    fix: 'company.address',
  },
  {
    label: 'Service areas',
    ok: !/list:\s*\[\s*\],\s*needsConfirmation: true/.test(companySource),
    fix: 'company.serviceAreas.list',
  },
  {
    label: 'Social links',
    ok: !/socials:\s*\{\s*list:\s*\[\s*\],\s*needsConfirmation: true/s.test(companySource),
    fix: 'company.socials.list (or leave empty to render no links)',
  },
  {
    label: 'Business hours',
    ok: !!stringField(/hours:\s*\{[^}]*?display:\s*'([^']*)'/s),
    fix: 'company.hours.display',
  },
  {
    label: 'GST / registration number',
    ok: !!stringField(/gstNumber:\s*\{\s*value:\s*'([^']*)'/s),
    fix: 'company.gstNumber.value (or remove the block)',
  },
  {
    label: 'Production domain confirmed',
    ok: !/siteUrl:\s*'[^']*',\s*\n\s*needsConfirmation: true/s.test(companySource),
    fix: 'company.seo.siteUrl',
  },
  {
    label: 'Logo file supplied',
    // The placeholder still contains its own documentation comment.
    ok: !/PLACEHOLDER LOGO/.test(
      readFileSync(new URL('../public/vnr-logo.svg', import.meta.url), 'utf8'),
    ),
    fix: 'Replace public/vnr-logo.svg with the supplied artwork',
  },
  {
    label: 'Logo variant confirmed (light vs transparent)',
    ok: !/variant:\s*'light',\s*\n\s*needsConfirmation: true/s.test(companySource),
    fix: 'company.logo.variant',
  },
  {
    label: 'Services confirmed as offered',
    ok: services.every((s) => s.confirmed),
    fix: 'Set confirmed: true on each entry in src/data/services.js',
  },
  {
    label: 'Projects are real (no placeholders)',
    ok: projects.every((p) => p.verified),
    fix: 'Replace src/data/projects.js with real, verified projects',
  },
  {
    label: 'Project locations populated',
    ok: projects.every((p) => p.location?.city && p.location?.area),
    fix: 'Fill location on each project, or remove the entry',
  },
  {
    label: 'Estimator rates are official',
    ok: !/export const rateIsVerified = false/.test(
      readFileSync(new URL('../src/config/estimator.js', import.meta.url), 'utf8'),
    ),
    fix: 'Set rateIsVerified = true after replacing BASE_RATES_PER_SQFT',
  },
  {
    label: 'Scope options confirmed',
    ok: scopeOptions.length > 0,
    fix: 'src/data/packages.js',
  },
  {
    label: 'Homepage copy approved by VNR (not draft)',
    // The original site copy was never supplied, so these fields were written
    // to describe only what each heading already implies. They read as finished
    // prose on the live site, which means a green build is NOT evidence that the
    // client has signed them off. This check is the only thing that tracks it.
    ok: draftCopy.length === 0,
    fix: 'Replace the draft wording in src/data/home.js, then set copyStatus: "approved"',
    note:
      draftCopy.length > 0
        ? `${draftCopy.length} draft field(s) awaiting client review: ${draftCopy.join(', ')}`
        : undefined,
  },
  {
    label: 'Testimonials reviewed',
    // Not a blocker: the section is hidden while empty. Informational.
    ok: true,
    optional: true,
    note: `${testimonials.length} approved — section stays hidden while empty`,
  },
  {
    label: 'Privacy policy reviewed by VNR',
    ok: false,
    optional: true,
    fix: 'src/pages/PrivacyPolicy.jsx contains placeholders to complete',
  },
];

const blocking = checks.filter((c) => !c.ok && !c.optional);
const advisory = checks.filter((c) => !c.ok && c.optional);
const passed = checks.filter((c) => c.ok);

console.log('\nVNR Constructions — pre-launch data check\n');
console.log('─'.repeat(64));

for (const c of checks) {
  const mark = c.ok ? '✓' : c.optional ? '·' : '✗';
  console.log(`${mark} ${c.label}`);
  if (!c.ok) {
    console.log(`    ${c.note ?? c.fix ?? 'outstanding'}`);
  }
}

console.log('─'.repeat(64));
console.log(
  `${passed.length}/${checks.length} complete · ${blocking.length} blocking · ${advisory.length} advisory`,
);

if (officialPackagesAvailable === false) {
  console.log(
    '\nNote: presenting the scope-comparison tool rather than priced packages.\n' +
      '      This is intentional while no rate card has been supplied.',
  );
}

console.log(
  `\nRoutes configured: ${Object.keys(ROUTES).length} · ` +
    `Projects: ${projects.length} · Services: ${services.length}\n`,
);

if (blocking.length > 0) {
  console.log('NOT READY TO LAUNCH — outstanding items above.\n');
  process.exit(1);
}

console.log('All blocking data supplied. Ready for launch review.\n');