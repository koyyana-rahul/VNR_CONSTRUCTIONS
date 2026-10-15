/**
 * Quality-control practices by trade.
 *
 * The brief warns: "Do not publish unsupported engineering specifications."
 * These entries describe WHAT WE CHECK and WHY — deliberately avoiding concrete
 * grades, mix ratios, thicknesses, brand names and warranty periods, none of
 * which VNR has verified. Replace with approved technical detail at handover of
 * final drawings.
 */
export const qualityStandards = [
  {
    id: 'structural',
    title: 'Structural Work',
    icon: 'Layers',
    summary: 'Foundation and frame checked before anything is built on top of them.',
    checks: [
      'Excavation and foundation inspected before reinforcement is placed',
      'Reinforcement layout, laps and cover verified against the approved drawings',
      'Formwork checked for alignment, support and safe bearing before a pour',
      'Structural members inspected at each stage prior to being built over',
    ],
  },
  {
    id: 'masonry',
    title: 'Masonry',
    icon: 'Grid3x3',
    summary: 'Wall construction checked for bond, alignment and dimensional accuracy.',
    checks: [
      'Bond and joint filling reviewed during construction, not only at completion',
      'Wall alignment checked against set-out lines before plastering begins',
      'Openings and jambs verified for size and position',
      'Openings checked for sill height and lintel provision before closing',
    ],
  },
  {
    id: 'waterproofing',
    title: 'Waterproofing',
    icon: 'CloudRain',
    summary: 'Wet areas and exposed surfaces protected — the cheapest fix is done early.',
    checks: [
      'Substrate prepared and inspected before any waterproofing is applied',
      'Terrace and wet-area falls confirmed so water drains rather than ponds',
      'Junctions, penetrations and upstands checked as the most failure-prone points',
      'Protective screeds and tiling verified over completed waterproofing',
    ],
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    icon: 'Droplets',
    summary: 'Water distribution and drainage tested before walls and finishes close them in.',
    checks: [
      'Pipe routing reviewed for clashes with structure and electrical before concealment',
      'Pressure testing of lines before any part of the system is hidden',
      'Soil, waste and vent slopes checked against the drainage design',
      'Bathroom and kitchen fittings checked for leaks before final finishes',
    ],
  },
  {
    id: 'electrical',
    title: 'Electrical',
    icon: 'Zap',
    summary: 'Wiring, earthing and load distribution verified prior to concealment.',
    checks: [
      'Cable sizing and circuit layout checked against the load schedule',
      'Earthing and continuity verified before conduits are concealed',
      'Distribution board layout and labelling checked at commissioning',
      'Fixtures, switches and fittings tested before final handover',
    ],
  },
  {
    id: 'flooring',
    title: 'Flooring',
    icon: 'Grid2x2',
    summary: 'Base preparation and laying checked so finished floors stay flat and quiet.',
    checks: [
      'Base surfaces checked for level and moisture before laying',
      'Expansion joints and movement gaps provided as specified',
      'Tile or stone laying checked for alignment and joint consistency',
      'Final levels confirmed against door thresholds and adjoining finishes',
    ],
  },
  {
    id: 'finishing',
    title: 'Finishing',
    icon: 'PaintbrushVertical',
    summary: 'The visible layer gets the most attention, because it is what you see.',
    checks: [
      'Wall and ceiling preparation reviewed before paint or wall treatment',
      'Paint systems applied to the specified number of coats',
      'Joinery and carpentry checked for fit, movement and finish quality',
      'Complete snag walkthrough before handover',
    ],
  },
];

export default qualityStandards;