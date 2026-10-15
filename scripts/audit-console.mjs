/**
 * DEV-MODE CONSOLE AUDIT.
 *
 * The production audit reported "0 console errors" — but React strips
 * unknown-prop warnings in production builds, so that check was blind to this
 * class of bug. This runs against `vite dev`, where React DOES emit them.
 *
 * Navigates every route and collects every console message.
 */
const BASE = process.env.DEV_BASE || 'http://localhost:5188';

const ROUTES = [
  '/',
  '/services',
  '/about',
  '/process',
  '/interiors',
  '/contact',
  '/projects',
  '/estimate',
  '/404-nope',
];

export default async function run(page, ui) {
  const messages = [];
  const perRoute = {};

  page.on('console', (msg) => {
    messages.push({ type: msg.type(), text: msg.text().slice(0, 300) });
  });
  page.on('pageerror', (err) => {
    messages.push({ type: 'pageerror', text: String(err).slice(0, 300) });
  });

  for (const route of ROUTES) {
    const before = messages.length;
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(1400);

    // Scroll through so every Reveal/Stagger mounts.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(500);

    perRoute[route] = messages.slice(before).length;
  }

  const unknownProps = messages.filter((m) =>
    /does not recognize the|Invalid DOM property|React does not recognize/i.test(m.text),
  );
  const warnings = messages.filter((m) => m.type === 'warning');
  const errors = messages.filter((m) => m.type === 'error');

  return {
    routesChecked: ROUTES.length,
    totalConsoleMessages: messages.length,
    unknownPropWarnings: unknownProps.length,
    warnings: warnings.length,
    errors: errors.length,
    perRoute,
    samples: unknownProps.slice(0, 4).map((m) => m.text.slice(0, 180)),
    allWarnings: messages.slice(0, 8),
  };
}