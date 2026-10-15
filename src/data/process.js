/**
 * The nine-stage customer journey, in order.
 * Rendered as a horizontal multi-column rail on desktop and a vertical
 * timeline on mobile (see components/home/ProcessTimeline.jsx).
 */
export const processSteps = [
  {
    step: 1,
    title: 'Initial Consultation',
    duration: 'Day 1',
    summary: 'A no-obligation conversation about your plot, your budget and what you want to build.',
    detail:
      'We start by understanding the shape of the project before drawing anything. This call is advisory — you will leave it with a clearer brief whether or not you build with us.',
    deliverables: ['Project brief', 'Indicative cost band', 'Next steps'],
  },
  {
    step: 2,
    title: 'Requirement Gathering',
    duration: 'Days 2–5',
    summary: 'Detailed discussions on rooms, finishes, budget split and how you intend to use the building.',
    detail:
      'We go through rooms one at a time, including storage, parking, servants and future expansion. Most scope disputes originate from a requirement that was assumed rather than stated.',
    deliverables: ['Room-by-room requirement list', 'Finish preferences', 'Budget allocation'],
  },
  {
    step: 3,
    title: 'Site Assessment',
    duration: 'Days 6–10',
    summary: 'Physical visit to study soil, access, drainage, setbacks and existing conditions.',
    detail:
      'Site conditions routinely move a budget by a wide margin. Soil classification, access for heavy materials, drainage fall and neighbouring construction all affect cost before a single brick is laid.',
    deliverables: ['Site report', 'Access and logistics note', 'Risk flags'],
  },
  {
    step: 4,
    title: 'Planning & Design',
    duration: 'Weeks 2–6',
    summary: 'Layout, structure and services coordinated so the building works as a whole.',
    detail:
      'Structure, plumbing, electrical and openings are resolved together. Designing these in isolation is the most common cause of expensive rework later.',
    deliverables: ['Layout plans', 'Structural drawings', 'Services coordination'],
  },
  {
    step: 5,
    title: 'Cost Estimation',
    duration: 'Weeks 6–7',
    summary: 'Itemised, quantity-based estimate you can read line by line.',
    detail:
      'You receive a written estimate built from quantities and rates, with inclusions and exclusions stated explicitly, so there is no ambiguity about what the number covers.',
    deliverables: ['Itemised estimate', 'Inclusions & exclusions', 'Payment schedule'],
  },
  {
    step: 6,
    title: 'Agreement & Scheduling',
    duration: 'Week 8',
    summary: 'Scope frozen, contract signed and a dated construction programme issued.',
    detail:
      'Nothing begins until the scope, cost and programme are agreed in writing. This is the point at which both sides know exactly what is being delivered.',
    deliverables: ['Signed agreement', 'Construction programme', 'Start date'],
  },
  {
    step: 7,
    title: 'Construction',
    duration: 'Project duration',
    summary: 'Site execution with staged inspections and regular progress reporting.',
    detail:
      'Work proceeds in a defined sequence. You receive updates at agreed milestones, and material approvals are requested before procurement rather than after.',
    deliverables: ['Progress updates', 'Stage inspections', 'Material approvals'],
  },
  {
    step: 8,
    title: 'Quality Inspection',
    duration: 'Throughout',
    summary: 'Structured checks at structure, services, waterproofing and finishing stages.',
    detail:
      'Defects are far cheaper to fix while the next trade has not yet covered the work. Each stage is inspected before it is closed up.',
    deliverables: ['Stage inspection reports', 'Snag list', 'Rectification records'],
  },
  {
    step: 9,
    title: 'Handover',
    duration: 'Final week',
    summary: 'Joint walkthrough, snag closure and a clean, finished building handed over.',
    detail:
      'We walk the building with you, list every outstanding item, and close them before final handover. Documentation and agreed warranty terms are handed over with the keys.',
    deliverables: ['Joint walkthrough', 'Closed snag list', 'Handover documentation'],
  },
];

export default processSteps;