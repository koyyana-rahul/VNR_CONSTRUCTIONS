/**
 * Confirms each visible icon group renders DISTINCT shapes.
 *
 * The original bug was four interiors features and two home services all
 * rendering the same glyph. Shape is compared via the rendered SVG's geometry,
 * not the requested icon name, so an alias or a fallback shows up as a
 * collision here regardless of what the data asked for.
 */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

function shapeOf(svg) {
  return [...svg.querySelectorAll('path,rect,circle,line,polyline,polygon')]
    .map((n) => n.tagName + (n.getAttribute('d') || '').slice(0, 26) + (n.getAttribute('width') || ''))
    .join('|')
    .slice(0, 150);
}

export default async function run(page, ui) {
  const out = { groups: [], collisions: [], fallbacks: [] };

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(900);

  const groups = await page.evaluate(() => {
    const badges = [...document.querySelectorAll('.grid.shrink-0.place-items-center')];
    return badges.map((b) => {
      const svg = b.querySelector('svg');
      // Find the nearest heading for context
      const h = b.closest('article,li,div')?.querySelector('h2,h3,h4');
      return { label: h?.textContent?.trim().slice(0, 40) || '(no heading)', hasSvg: !!svg };
    });
  });

  // Compare real geometry per group by section
  const bySection = await page.evaluate(() => {
    const read = (rootSel) => {
      const root = document.querySelector(rootSel);
      if (!root) return [];
      return [...root.querySelectorAll('.grid.shrink-0.place-items-center')].map((b) => {
        const svg = b.querySelector('svg');
        const h = b.closest('article,li,div')?.querySelector('h2,h3,h4');
        return {
          label: h?.textContent?.trim().slice(0, 42) || '(none)',
          shape: svg
            ? [...svg.querySelectorAll('path,rect,circle,line,polyline,polygon')]
                .map((n) => n.tagName + (n.getAttribute('d') || '').slice(0, 24))
                .join('|')
                .slice(0, 140)
            : 'NO-SVG',
        };
      });
    };
    return {
      highlights: read('#highlights'),
      services: read('#services'),
      interiors: read('#interiors'),
      contact: read('#contact'),
    };
  });

  for (const [name, items] of Object.entries(bySection)) {
    if (!items.length) continue;
    const seen = new Map();
    out.groups.push({ name, count: items.length });
    for (const it of items) {
      if (it.shape === 'NO-SVG') {
        out.fallbacks.push(`${name}: ${it.label} has no svg`);
        continue;
      }
      if (seen.has(it.shape)) {
        out.collisions.push(`${name}: "${it.label}" === "${seen.get(it.shape)}"`);
      } else {
        seen.set(it.shape, it.label);
      }
    }
  }

  out.totalBadges = groups.length;
  return out;
}
