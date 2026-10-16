/**
 * Services offered by VNR Constructions.
 *
 * The brief lists these as "candidate categories until VNR confirms its actual
 * offerings", so each entry carries `confirmed: false` and the UI discloses
 * that rather than presenting a service menu as a verified capability list.
 *
 * Content is written per-service rather than templated: every entry has its own
 * planning considerations, process shape and failure modes. A generic
 * paragraph reused across eight services is worse than no page at all.
 */

export const services = [
  {
    id: 'residential-construction',
    slug: 'residential-construction',
    title: 'Residential Construction',
    shortTitle: 'Residential',
    icon: 'House',
    summary:
      'Ground-up construction of individual residences, planned around your plot, budget and how you actually want to live.',
    intro: [
      'We build independent homes from foundation to handover, coordinating structure, masonry, services and finishes as one continuous programme rather than a chain of separate contractors.',
      'You get a documented scope, a clear bill of quantities, and scheduled progress updates so the build stays on track and inside the agreed cost.',
    ],
    suitableFor: [
      'Plot owners starting from bare land',
      'Families who want one party accountable for structure and finishes',
      'Anyone who wants the scope written down before the first brick',
    ],
    planning: [
      'Room layout and circulation are cheapest to change on paper and most expensive once slab work starts.',
      'Services routing (plumbing, electrical) should be resolved alongside structural openings, not after.',
      'Wet-zone locations drive both plumbing cost and waterproofing risk — decide them early and deliberately.',
    ],
    process: [
      { title: 'Requirement brief', detail: 'Rooms, budget split, and how the family will actually use the space.' },
      { title: 'Layout & structure', detail: 'Floor plan and frame coordinated so services have somewhere to go.' },
      { title: 'Services coordination', detail: 'Plumbing and electrical routed and checked against the structure.' },
      { title: 'Structure & envelope', detail: 'Foundation through roofing, with inspections before each is covered.' },
      { title: 'Finishing & handover', detail: 'Flooring, joinery, paint, snag closure, joint walkthrough.' },
    ],
    inclusions: [
      'Site assessment and structural design coordination',
      'Documented material specification',
      'Stage-wise inspections with recorded results',
      'Progress reporting against agreed milestones',
      'Snag closure and joint handover walkthrough',
    ],
    exclusions: [
      'Municipal fees, statutory charges and deposit payments',
      'Plot acquisition cost and any encumbrance clearance',
      'Offsite utility connection charges in some jurisdictions',
      'Furniture, appliances and landscaping beyond an agreed line',
    ],
    faqs: [
      {
        q: 'Can we change the design once construction has started?',
        a: 'Changes are possible but they are priced and approved in writing before the work happens. The expensive point to change is the structure, so we ask for design decisions to be settled before that stage — not because we want to restrict you, but because a change after the pour is paid for twice.',
      },
      {
        q: 'Do you work from our architect’s drawings?',
        a: 'Yes, provided the drawings are complete and coordinated. We review them first, because drawings that look fine on their own can conflict with each other when structure, plumbing and electrical are overlaid. Any conflicts are raised before work starts.',
      },
    ],
    order: 1,
    confirmed: false,
  },
  {
    id: 'independent-homes',
    slug: 'independent-homes',
    title: 'Independent Homes',
    shortTitle: 'Independent Homes',
    icon: 'Home',
    summary:
      'Single-family homes for families building on their own land, from compact city plots to larger suburban sites.',
    intro: [
      'An independent home is a long-horizon decision. We plan for the family you have now and the space you may need later — circulation, storage and service access are considered early, while they are cheap to change.',
      'Pacing is agreed up front so the project can be delivered in realistic stages rather than stalling on one expensive decision.',
    ],
    suitableFor: [
      'Families building their first or second home on their own land',
      'Buyers who want phased spending rather than one large outlay',
      'Owners who will live in the house and care about how it ages',
    ],
    planning: [
      'On a narrow plot, the stair and service shaft often dictate the whole plan — fix their position first.',
      'Future expansion (a floor, a terrace) should be designed for now even if it is built later, or it becomes structurally awkward.',
      'Parking and compound access compete for the same frontage; decide early which wins.',
    ],
    process: [
      { title: 'Family brief', detail: 'A working session on rooms, storage, routines and non-negotiables.' },
      { title: 'Plot feasibility', detail: 'Access, setbacks, drainage and services checked against the plan.' },
      { title: 'Space planning', detail: 'Circulation and storage resolved before the structure is drawn.' },
      { title: 'Phased build plan', detail: 'Work split into realistic stages with costs per stage.' },
      { title: 'Delivery & handover', detail: 'Stages completed in order, each one inspected and signed off.' },
    ],
    inclusions: [
      'Room-by-room requirement workshop',
      'Space planning and circulation study',
      'Phased build plan with per-stage costing',
      'Family walkthroughs at each stage',
      'Handover documentation and snag closure',
    ],
    exclusions: [
      'Land and registration costs',
      'Statutory fees and municipal deposits',
      'Unforeseen major repairs to an existing structure',
      'Appliances and soft furnishings',
    ],
    faqs: [
      {
        q: 'Can we build in phases if the budget is tight this year?',
        a: 'Usually yes, and we prefer to plan it that way from the start rather than cutting scope mid-build. A phased plan keeps the structure and waterproofing coherent and tells you exactly what each stage costs, so nothing is left in a half-finished state.',
      },
      {
        q: 'How much space should we allow for future expansion?',
        a: 'That depends on the structure and the services layout rather than a rule of thumb. We look at where a future floor or extension would land and make sure the current design does not block it — for example, ceiling heights and stair geometry that would need rebuilding later.',
      },
    ],
    order: 2,
    confirmed: false,
  },
  {
    id: 'villas-duplexes',
    slug: 'villas-duplexes',
    title: 'Villas & Duplexes',
    shortTitle: 'Villas & Duplexes',
    icon: 'Landmark',
    summary:
      'Multi-level residences with stair cores, higher structural loads and more demanding finish detailing.',
    intro: [
      'Multi-level homes introduce problems that single-storey builds do not: slab and stair design, waterproofing at every wet zone, and consistent alignment across floors.',
      'We sequence this work so that upper-storey structure is right before finishes are locked in — the expensive errors happen early, and we make sure they happen in the plan, not on site.',
    ],
    suitableFor: [
      'Large families wanting bedrooms on separate floors',
      'Buyers who want vertical separation between public and private space',
      'Plots where a single-storey spread-out plan is not possible',
    ],
    planning: [
      'The stair is the single most load-critical and most disruptive element on a duplex — it cannot be added later.',
      'Every wet zone needs its own fall and its own waterproofing; repeating one mistake upstairs repeats it everywhere.',
      'Services risers must be planned for the full height from the first floor.',
    ],
    process: [
      { title: 'Multi-level brief', detail: 'How the floors divide, and how circulation should feel.' },
      { title: 'Stair & slab engineering', detail: 'Core and slab design resolved before any structure is built.' },
      { title: 'Wet-zone detailing', detail: 'Every level’s wet areas detailed and specified separately.' },
      { title: 'Staged structural build', detail: 'Lower levels completed and inspected before upper levels rise.' },
      { title: 'Interior stair finishes', detail: 'Stair finishes installed last, once structural movement has settled.' },
    ],
    inclusions: [
      'Multi-level structural planning',
      'Stair core and slab detailing',
      'Per-floor wet-zone waterproofing',
      'Elevation and facade detailing',
      'Interior stair finishes at completion',
    ],
    exclusions: [
      'Lift installation and shaft construction where not agreed',
      'Terrace landscaping beyond the agreed line',
      'Specialist systems such as home automation',
      'Statutory approvals and consultant fees',
    ],
    faqs: [
      {
        q: 'What makes a duplex build cost more than the same area single-storey?',
        a: 'Mostly structure and repetition. Stairs, slab edges and extra waterproofing per level add real cost, and there is more vertical service routing. The total area stays similar but the complexity does not — which is why a duplex is usually better value per square foot than people expect, and per rupee worse than they assume.',
      },
      {
        q: 'Can wet areas on upper floors be made reliable?',
        a: 'Yes, but only with deliberate detailing: correct falls, continuous waterproofing across wall and floor junctions, and penetrations detailed rather than left to site judgement. This is exactly why upper-floor wet zones are inspected before tiling rather than after.',
      },
    ],
    order: 3,
    confirmed: false,
  },
  {
    id: 'apartments',
    slug: 'apartments',
    title: 'Apartment Buildings',
    shortTitle: 'Apartments',
    icon: 'Building2',
    summary:
      'Multi-unit residential blocks where repetition, standardisation and services coordination drive cost.',
    intro: [
      'In apartment work, consistency is efficiency. Repeating a well-resolved unit type controls cost far more effectively than negotiating individual discounts on materials.',
      'We focus on the things that make multi-storey living work: services routing, waterproofing between floors, and access that stays usable while later floors are still being built.',
    ],
    suitableFor: [
      'Landowners planning a multi-unit residential block',
      'Developers who want a repeatable unit type across floors',
      'Buyers building for rental rather than single occupancy',
    ],
    planning: [
      'Unit repetition is the main cost lever — vary the plan and you multiply the cost of every error.',
      'Shafts and risers must be planned for the full building height from the first floor slab.',
      'Inter-floor waterproofing is what stops a leak travelling down through three flats.',
    ],
    process: [
      { title: 'Unit type design', detail: 'A small number of well-resolved unit types rather than many variations.' },
      { title: 'Services & shaft plan', detail: 'Risers, ducts and drainage planned for the full height.' },
      { title: 'Common areas & access', detail: 'Stairs, lift lobbies and circulation planned for phased occupancy.' },
      { title: 'Staged delivery', detail: 'Floors delivered in sequence with inspection between them.' },
      { title: 'Defect management', detail: 'Per-unit snag lists tracked and closed before handover.' },
    ],
    inclusions: [
      'Repeated unit planning and standardisation',
      'Services and shaft coordination',
      'Common area works',
      'Staged handover planning',
      'Per-unit defect tracking and closure',
    ],
    exclusions: [
      'Lift manufacture and installation',
      'Approval fees, deposits and statutory charges',
      'Land cost and any builder-to-land agreement',
      'Ongoing maintenance and facilities management',
    ],
    faqs: [
      {
        q: 'How many unit types should a block have?',
        a: 'As few as the market will accept. Every additional type adds cost through lost repetition, not just through the extra design work. We would generally rather standardise on two and offer variety through orientation and floor position than through a different plan on every floor.',
      },
      {
        q: 'Can tenants move in before the whole building is finished?',
        a: 'It is possible if planned for — services risers, access routes and common areas need to be usable and complete at that point, not just the flats. We plan phased occupancy up front, because discovering access problems after the first handover is expensive.',
      },
    ],
    order: 4,
    confirmed: false,
  },
  {
    id: 'commercial-buildings',
    slug: 'commercial-buildings',
    title: 'Commercial Buildings',
    shortTitle: 'Commercial',
    icon: 'Store',
    summary:
      'Offices, showrooms and mixed-use structures built to work commercially, not just to look finished.',
    intro: [
      'Commercial buildings live or die on flexibility: how easily services can move, how open the floor plate stays, and whether the facade can be maintained without shutting the business.',
      'We resolve those decisions at design stage, when changing them costs a line on a drawing instead of a demolition on site.',
    ],
    suitableFor: [
      'Offices and co-working floors',
      'Retail showrooms and experience stores',
      'Mixed-use ground floor with offices above',
    ],
    planning: [
      'Floor-to-floor height drives both the service routes and the structural depth — set it early.',
      'An open plate that cannot be subdivided later loses tenants within a few years.',
      'Access for maintenance matters commercially: a facade that needs scaffolding every few years has a running cost.',
    ],
    process: [
      { title: 'Use and flexibility brief', detail: 'How the space must adapt over its life.' },
      { title: 'Floor plate & services', detail: 'Open spans, ducts and risers resolved together.' },
      { title: 'Facade & access strategy', detail: 'Maintenance and replacement access planned in.' },
      { title: 'Life-safety coordination', detail: 'Fire and egress requirements coordinated with the plan.' },
      { title: 'Phased occupancy', detail: 'Fit-out and handover sequenced around trading requirements.' },
    ],
    inclusions: [
      'Open floor plate planning',
      'Services access and maintenance strategy',
      'Facade and maintenance planning',
      'Fire and life-safety coordination',
      'Phased occupancy planning',
    ],
    exclusions: [
      'Interior fit-out beyond the agreed scope',
      'Specialist equipment and process systems',
      'Statutory fees, deposits and consultant fees',
      'Brand signage and marketing installations',
    ],
    faqs: [
      {
        q: 'How much should I allow for services access?',
        a: 'More than most first-time commercial owners expect. If ducts, drains and cable trays cannot be reached without opening finished surfaces, every future repair becomes a destructive event. Planning accessible voids and service zones up front costs space once and saves it repeatedly.',
      },
      {
        q: 'Can we open on a phased basis while the upper floors are built?',
        a: 'Only if planned that way from the start — access routes, safety systems and services all need to be usable independently of the unfinished structure above. Where it is not designed for, phased opening typically requires temporary arrangements that cost more than finishing in order.',
      },
    ],
    order: 5,
    confirmed: false,
  },
  {
    id: 'renovation',
    slug: 'renovation',
    title: 'Renovation',
    shortTitle: 'Renovation',
    icon: 'Hammer',
    summary:
      'Repair, refurbishment and change of use — often the most cost-effective route to the building you actually want.',
    intro: [
      'Renovation is investigative work. What is behind the wall, above the slab or under the floor changes the estimate more than any finish selection, so we survey before we promise.',
      'Existing buildings also constrain what is possible. We tell you early where an idea will not work, so you can spend your budget on changes that actually pay off.',
    ],
    suitableFor: [
      'Owners of older houses that need structural repair',
      'Change-of-use projects where the existing layout no longer fits',
      'Buyers who want to avoid the cost of building new',
    ],
    planning: [
      'Opening up is where the budget is really decided — allowances for unknown conditions matter more here than anywhere else.',
      'An older building may not have been designed for the loads you now want to place on it.',
      'Existing drainage and electrical often need replacement rather than repair; treat that as the default assumption.',
    ],
    process: [
      { title: 'Condition survey', detail: 'Opportunistic opening to understand what is actually there.' },
      { title: 'Structural feasibility', detail: 'Whether the existing structure can carry the intended change.' },
      { title: 'Salvage & reuse plan', detail: 'What can be kept, which saves cost and character.' },
      { title: 'Phased works', detail: 'Occupied or partially occupied site handled in stages.' },
      { title: 'Waterproofing renewal', detail: 'Roofs, terraces and wet areas renewed before finishes.' },
    ],
    inclusions: [
      'Detailed condition survey with selective opening',
      'Structural feasibility assessment',
      'Salvage and reuse planning',
      'Phased works around continued occupation',
      'Roof, terrace and wet-area waterproofing renewal',
    ],
    exclusions: [
      'Undiscovered concealed conditions beyond the surveyed scope',
      'Unpermitted alterations needing retrospective approval',
      'Asbestos, termite or hazardous material treatment',
      'Major underpinning unless identified and agreed beforehand',
    ],
    faqs: [
      {
        q: 'How accurate is a renovation estimate before demolition?',
        a: 'Less accurate than a new-build estimate, and honestly so. We survey and selectively open so the estimate is as informed as it can be before work starts, but concealed conditions in an older structure are genuinely uncertain. We set an allowance for that rather than pretending to a precision we do not have.',
      },
      {
        q: 'Is renovating cheaper than rebuilding?',
        a: 'Often, especially where the structure and shell are sound. It stops paying when the existing frame needs significant repair, when services are all at end of life, or when the layout you need cannot be achieved without gutting the building anyway. That judgement is the reason to survey first.',
      },
    ],
    order: 6,
    confirmed: false,
  },
  {
    id: 'interiors-finishing',
    slug: 'interiors-finishing',
    title: 'Interiors & Finishing',
    shortTitle: 'Interiors',
    icon: 'PaintbrushVertical',
    summary:
      'Interior fit-out and finishing work that turns a completed structure into a space you want to use.',
    intro: [
      'Finishing is where budgets quietly escape, because small decisions multiply across a large area. We fix finishes and their quantities before procurement starts.',
      'The same discipline applies to the less visible parts: shadow gaps, edge protection, and handing over a clean finished floor rather than a construction site.',
    ],
    suitableFor: [
      'Homes approaching handover that need finishing scope',
      'Builders wanting to subcontract interiors',
      'Owners who want a single finish standard across a large area',
    ],
    planning: [
      'Quantities drive interior cost more than unit rates — measure once, accurately, before ordering.',
      'Substrate condition decides the paint system; skipping preparation shows up as peeling within a year.',
      'Fixing joinery and lighting positions before final painting avoids visible rework.',
    ],
    process: [
      { title: 'Finish schedule', detail: 'Every material and its location agreed and sampled.' },
      { title: 'Quantity take-off', detail: 'Measured quantities confirmed before procurement.' },
      { title: 'Joinery & carpentry', detail: 'Doors, windows and built-ins fitted and adjusted.' },
      { title: 'Wall & ceiling finishes', detail: 'Preparation, specified coats and wall treatments.' },
      { title: 'Final clean & handover', detail: 'Protected, cleaned, and ready to furnish.' },
    ],
    inclusions: [
      'Finish schedule with physical samples approved by you',
      'Measured quantity take-off',
      'Joinery and carpentry',
      'Wall treatments, paint and false ceiling',
      'Final deep clean and protection',
    ],
    exclusions: [
      'Furniture, appliances and soft furnishings',
      'Loose decorative items and art',
      'Specialist systems such as automation or AV',
      'Structural or service alterations unless separately scoped',
    ],
    faqs: [
      {
        q: 'How do you prevent the finishes budget from creeping?',
        a: 'By fixing the schedule and the quantities before procurement. Once materials are ordered, changes cost full price plus rework. The discipline is deciding everything up front — including the unglamorous items like edge profiles and skirting — because those are exactly what get decided late and expensively.',
      },
      {
        q: 'Can you match an existing interior style or finish?',
        a: 'Yes, and we will sample it for approval first. Matching an existing material or colour is straightforward; matching across different substrates and lighting conditions is where it needs care, which is why an approved sample is worth the extra week.',
      },
    ],
    order: 7,
    confirmed: false,
  },
  {
    id: 'construction-consultation',
    slug: 'construction-consultation',
    title: 'Construction Consultation',
    shortTitle: 'Consultation',
    icon: 'ClipboardList',
    summary:
      'Independent guidance if you already have a design, or want a second opinion before you commit to anything.',
    intro: [
      'Sometimes the most valuable thing we can do is talk you out of an expensive mistake. Consultation covers design review, scope definition, and helping you understand what a fair price should look like.',
      'It also suits clients who have a separate contractor but want a technical review of drawings, quantities or quotations.',
    ],
    suitableFor: [
      'Buyers who already have quotations and want them sanity-checked',
      'Owners who have drawings but are unsure they are complete',
      'Anyone deciding between builders on price alone',
    ],
    planning: [
      'A quotation is only comparable if the inclusions match — comparing scope, not numbers, is the whole point.',
      'Missing drawings are the usual reason a quotation is optimistic.',
      'Understanding the payment schedule matters as much as the headline price.',
    ],
    process: [
      { title: 'Review call', detail: 'Understanding the project and what you want assessed.' },
      { title: 'Document review', detail: 'Drawings, specifications and quotations read critically.' },
      { title: 'Gap analysis', detail: 'What is missing, unpriced or internally inconsistent.' },
      { title: 'Recommendations', detail: 'Practical next steps, regardless of who builds it.' },
    ],
    inclusions: [
      'Design and drawing review',
      'Scope definition and gap analysis',
      'Quantity sanity check',
      'Quotation review and comparison guidance',
      'Technical advisory',
    ],
    exclusions: [
      'Site investigation and testing',
      'Structural or geotechnical certification',
      'Acting as project manager for a third-party contractor',
      'Legal or contractual advice',
    ],
    faqs: [
      {
        q: 'Will you tell me what is wrong with my builder’s quote?',
        a: 'We will tell you what we can substantiate — missing items, unclear inclusions, quantities that do not reconcile. That is the deliverable. We do not give opinions we cannot evidence, and we do not take on work as a precondition of the review.',
      },
      {
        q: 'What should I bring to a consultation?',
        a: 'Whatever exists: survey drawings, architect drawings, quotations, a brief, even just photos of the plot. A review with incomplete information is still useful — it shows you what to obtain next, which is often the most valuable part.',
      },
    ],
    order: 8,
    confirmed: false,
  },
];

/** Services are shown as confirmed only once VNR signs the list off. */
export const servicesConfirmed = services.every((s) => s.confirmed);

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug);

/** Services sharing a category with the given one, for the detail page rail. */
export function getRelatedServices(service, limit = 3) {
  if (!service) return [];
  return services
    .filter((s) => s.id !== service.id)
    .sort((a, b) => Math.abs(a.order - service.order) - Math.abs(b.order - service.order))
    .slice(0, limit);
}

export default services;