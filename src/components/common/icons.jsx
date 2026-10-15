import {
  House,
  Home,
  Landmark,
  Building2,
  Store,
  Hammer,
  PaintbrushVertical,
  ClipboardList,
  Layers,
  Grid3x3,
  CloudRain,
  Droplets,
  Zap,
  Grid2x2,
  ShieldCheck,
  FileSearch,
  MessagesSquare,
  Ruler,
  CalendarCheck,
  Handshake,
  IndianRupee,
  Boxes,
  HardHat,
  Compass,
  Scale,
  MapPinned,
  PhoneCall,
  Mail,
} from 'lucide-react';

/**
 * Central Lucide icon registry.
 *
 * Data files store icons by string name so they stay serialisable (and could
 * be fetched from an API later). This is the only place those names are
 * resolved to components — an unknown name renders a neutral fallback rather
 * than crashing the page.
 */
export const ICONS = {
  House,
  Home,
  Landmark,
  Building2,
  Store,
  Hammer,
  PaintbrushVertical,
  ClipboardList,
  Layers,
  Grid3x3,
  CloudRain,
  Droplets,
  Zap,
  Grid2x2,
  ShieldCheck,
  FileSearch,
  MessagesSquare,
  Ruler,
  CalendarCheck,
  Handshake,
  IndianRupee,
  Boxes,
  HardHat,
  Compass,
  Scale,
  MapPinned,
  PhoneCall,
  Mail,
};

/**
 * @param {string} name  key from ICONS
 * @param {Function} props  passed straight to the icon
 */
export function Icon({ name, ...props }) {
  const Cmp = ICONS[name] ?? ShieldCheck;
  return <Cmp aria-hidden="true" {...props} />;
}

export default Icon;