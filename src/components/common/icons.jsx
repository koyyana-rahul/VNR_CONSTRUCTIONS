import {
  // ---- Contact / utility ----
  House,
  Home,
  PhoneCall,
  Phone,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  MessagesSquare,
  Send,
  // ---- Building types ----
  Building2,
  Landmark,
  Store,
  Building,
  Warehouse,
  Frame,
  Lightbulb,
  // ---- Construction & trade ----
  Hammer,
  Wrench,
  Shovel,
  Drill,
  PaintRoller,
  PaintbrushVertical,
  PaintBucket,
  BrickWall,
  Construction,
  HardHat,
  TrafficCone,
  Forklift,
  Truck,
  Container,
  CookingPot,
  ShowerHead,
  Lamp,
  Sofa,
  BedDouble,
  // ---- Drawing, planning, quality ----
  Compass,
  DraftingCompass,
  Ruler,
  Layers,
  Grid2x2,
  Grid3x3,
  LayoutGrid,
  Milestone,
  ClipboardList,
  ClipboardCheck,
  CalendarCheck,
  FileSearch,
  ShieldCheck,
  ShieldAlert,
  Scale,
  Handshake,
  IndianRupee,
  ChartColumn,
  Leaf,
  CloudRain,
  Droplets,
  Zap,
  Plug,
  Boxes,
  // ---- Neutral ----
  CircleHelp,
} from 'lucide-react';

/**
 * Central Lucide icon registry.
 *
 * Data files store icons by string name so they stay serialisable (and could be
 * fetched from an API later). This is the only place those names are resolved
 * to components.
 *
 * A REAL BUG THIS FILE HAD
 * -----------------------
 * Seven names were referenced by the data and by components but were never
 * registered here: CookingPot, ShowerHead, Lamp, Sofa, BedDouble, MessageCircle
 * and `instagram`. Because the lookup fell through to a catch-all, they all
 * silently rendered as the SAME fallback icon — so "Modular Kitchens",
 * "Bathrooms & Fittings", "Lighting & Fittings", "Living Rooms", "Bedrooms &
 * Wardrobes" and the WhatsApp contact row all displayed an identical shield.
 * Nothing errored; the page just quietly lied about what each feature was.
 *
 * The deeper problem was the fallback itself. It was ShieldCheck — a
 * quality-assurance glyph — so any typo in any icon name would have quietly
 * implied a standards certification the company does not hold. It is now
 * CircleHelp (visibly "unknown") and it warns in development. See below.
 */
export const ICONS = {
  // Contact / utility
  House,
  Home,
  PhoneCall,
  Phone,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  MessagesSquare,
  Send,

  // Building types
  Building2,
  Building,
  Landmark,
  Store,
  Warehouse,
  Frame,

  // Construction & trade
  Hammer,
  Wrench,
  Shovel,
  Drill,
  PaintRoller,
  PaintbrushVertical,
  PaintBucket,
  BrickWall,
  Construction,
  HardHat,
  TrafficCone,
  Forklift,
  Truck,
  Container,
  CookingPot,
  ShowerHead,
  Lamp,
  Lightbulb,
  Sofa,
  BedDouble,

  // Drawing, planning, quality
  Compass,
  DraftingCompass,
  Ruler,
  Layers,
  Grid2x2,
  Grid3x3,
  LayoutGrid,
  Milestone,
  ClipboardList,
  ClipboardCheck,
  CalendarCheck,
  FileSearch,
  ShieldCheck,
  ShieldAlert,
  Scale,
  Handshake,
  IndianRupee,
  ChartColumn,
  Leaf,
  CloudRain,
  Droplets,
  Zap,
  Plug,
  Boxes,

  // Neutral
  CircleHelp,
};

/** Names referenced by data or components but absent from the registry.
 *  Kept as an explicit empty set so the check that uses it is self-describing. */
export const ICON_FALLBACK = CircleHelp;

/**
 * @param {string} name  key from ICONS
 * @param {object} props  passed straight to the icon
 */
export function Icon({ name, ...props }) {
  const Cmp = ICONS[name] ?? ICON_FALLBACK;

  // A missing icon is a content bug, not a runtime error, so it must be loud
  // in development and silent in production.
  if (!ICONS[name] && import.meta.env?.DEV) {
    console.warn(
      `[icons] "${name}" is not registered. Add it to ICONS in ` +
        `src/components/common/icons.jsx — falling back to a neutral glyph.`,
    );
  }

  return <Cmp aria-hidden="true" {...props} />;
}

export default Icon;
