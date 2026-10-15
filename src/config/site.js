/**
 * Site configuration: routes, navigation and per-page SEO.
 * Separate from company.js so business facts and app structure change
 * independently.
 */

import { company } from './company.js';

export const site = {
  url: company.seo.siteUrl,
  locale: 'en_IN',
  themeColor: '#030A12', // matches --color-navy
};

export const ROUTES = {
  home: '/',
  services: '/services',
  about: '/about',
  process: '/process',
  interiors: '/interiors',
  contact: '/contact',
  // Supporting pages retained from the wider build
  projects: '/projects',
  project: '/projects/:slug',
  packages: '/packages',
  estimate: '/estimate',
  quality: '/quality',
  privacy: '/privacy-policy',
};

/**
 * Header navigation — the reference's five items plus Contact.
 * Kept in sync with src/data/home.js `nav`, which the header and footer both
 * render; this list is only the SEO/suggestion source.
 */
export const PRIMARY_NAV = [
  { to: ROUTES.services, label: 'Services', description: 'Construction and interior services' },
  { to: ROUTES.about, label: 'About VNR', description: 'Who VNR Constructions is' },
  { to: ROUTES.process, label: 'Our Process', description: 'Your project, step by step' },
  { to: ROUTES.interiors, label: 'Interiors', description: 'Premium interior solutions' },
  { to: ROUTES.contact, label: 'Contact', description: 'Tell us about your project' },
];

export const PAGE_SEO = {
  [ROUTES.home]: {
    title: `${company.name} | Home Construction & Premium Interiors`,
    description: `${company.name} brings home construction and premium interior solutions together in ${company.serviceAreas.list.join(' and ')} — considered design, quality-conscious materials and clear project discussions. Construction starting price ₹1,799/sq. ft.*`,
    path: '/',
  },
  [ROUTES.services]: {
    title: `Construction & Interior Services — ${company.name}`,
    description:
      'Independent house construction, complete interior solutions, modular kitchens, elevation and exterior design, bathrooms and fittings, lighting and wardrobes.',
    path: '/services',
  },
  [ROUTES.about]: {
    title: `About ${company.name} — Building Better Tomorrows`,
    description: `Construction and premium interiors under one roof. ${company.name} serves ${company.serviceAreas.list.join(' and ')}.`,
    path: '/about',
  },
  [ROUTES.process]: {
    title: `Our Process — ${company.name}`,
    description:
      'Share your vision, site visit and discussion, scope and estimate, plan the work. Four clear stages from first conversation to a scheduled plan.',
    path: '/process',
  },
  [ROUTES.interiors]: {
    title: `Premium Interiors — ${company.name}`,
    description:
      'Rich details and thoughtful living. Modular kitchens, living rooms, bedrooms and wardrobes, lighting and fittings.',
    path: '/interiors',
  },
  [ROUTES.contact]: {
    title: `Contact ${company.name} — Book a Consultation`,
    description: `Tell us about your construction or interior project in ${company.serviceAreas.list.join(', ')}. Request a callback from ${company.name}.`,
    path: '/contact',
  },
  [ROUTES.projects]: {
    title: `Project Portfolio — ${company.name}`,
    description: `Browse ${company.name} projects by category, location and completion status.`,
    path: '/projects',
  },
  [ROUTES.packages]: {
    title: `Scope Options & Comparison — ${company.name}`,
    description:
      'Compare how much of your build you want to hand over, from structure and shell through to a full turnkey delivery.',
    path: '/packages',
  },
  [ROUTES.estimate]: {
    title: `Construction Cost Estimator — ${company.name}`,
    description:
      'Get an indicative construction budget in seconds. Adjust area, specification level and contingency to see a live estimate.',
    path: '/estimate',
  },
  [ROUTES.quality]: {
    title: `Quality Standards — ${company.name}`,
    description: `How ${company.name} handles structure, masonry, waterproofing, plumbing, electrical, flooring and finishing.`,
    path: '/quality',
  },
  [ROUTES.privacy]: {
    title: `Privacy Policy — ${company.name}`,
    description: `How ${company.name} collects, uses and protects the information you share with us.`,
    path: '/privacy-policy',
  },
};

export default site;