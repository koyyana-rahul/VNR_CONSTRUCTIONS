import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ICONS, Icon, ICON_FALLBACK } from '../components/common/icons.jsx';
import { services, highlights, interiors, process } from '../data/home.js';
import { services as servicePages } from '../data/services.js';
import { qualityStandards } from '../data/quality.js';

/**
 * ============================================================================
 * ICON REGISTRY INTEGRITY
 * ============================================================================
 *
 * Guards a real, shipped bug: seven icon names were used by the data but never
 * added to the registry, and the lookup fell through to a catch-all. Every one
 * of them rendered as the SAME icon, so the interiors section advertised
 * "Modular Kitchens", "Living Rooms", "Bedrooms & Wardrobes" and "Lighting &
 * Fittings" behind four identical glyphs, and the WhatsApp contact row showed
 * a quality-assurance shield. No error, no failed test — just wrong meaning.
 *
 * A registry that silently substitutes is worse than one that throws, because
 * the failure is invisible. These tests make it loud.
 */

const allDataIcons = [
  ...highlights.map((h) => h.icon),
  ...services.map((s) => s.icon),
  ...interiors.features.map((f) => f.icon),
  ...servicePages.map((s) => s.icon),
  ...qualityStandards.map((q) => q.icon),
  // `process` carries no icons today, but asserting on it keeps the test honest
  // if steps ever gain one.
  ...process.map((p) => p.icon),
].filter(Boolean);

describe('icon registry', () => {
  it('registers every icon name used by the data files', () => {
    const missing = [...new Set(allDataIcons)].filter((name) => !ICONS[name]);
    expect(missing).toEqual([]);
  });

  it('registers the contact icons used directly in components', () => {
    // These are written as literals in ContactSection.jsx rather than coming
    // from data, so they are not covered by the scan above.
    ['MapPinned', 'PhoneCall', 'MessageCircle', 'Boxes'].forEach((name) => {
      expect(ICONS[name], `"${name}" must be registered`).toBeDefined();
    });
  });

  it('does not fall back to a quality-assurance glyph', () => {
    // A shield-check fallback would imply a standards certification on any
    // typo'd name. The fallback must be visibly "unknown", not authoritative.
    expect(ICON_FALLBACK).not.toBe(ICONS.ShieldCheck);
    expect(ICONS[ICON_FALLBACK.name] ?? true).toBeTruthy();
  });

  it('gives every icon in a visible group a distinguishable shape', () => {
    // Two NAMES may legitimately alias to one component (Lucide ships
    // `Home` and `House` as the same glyph, and the registry is allowed to
    // expose both). What must never happen is two items the visitor can see
    // side by side resolving to the same shape — that is what made four
    // interiors features and two home services look identical.
    const groups = {
      'home highlights': highlights,
      'home services': services,
      'interiors features': interiors.features,
      'quality standards': qualityStandards,
    };

    const collisions = [];
    for (const [label, items] of Object.entries(groups)) {
      const seen = new Map();
      for (const item of items) {
        const Cmp = ICONS[item.icon];
        if (seen.has(Cmp)) {
          collisions.push(
            `${label}: "${item.title}" (${item.icon}) === "${seen.get(Cmp).title}" (${seen.get(Cmp).icon})`,
          );
        } else {
          seen.set(Cmp, item);
        }
      }
    }
    expect(collisions).toEqual([]);
  });

  it('renders an unknown name without throwing', () => {
    expect(() => render(<Icon name="DefinitelyNotAnIcon" />)).not.toThrow();
  });
});
