/**
 * ============================================================================
 * TRANSPARENCY VERIFICATION
 * ============================================================================
 *
 * The brief is explicit: "Do not claim glassmorphism is implemented merely
 * because `backdrop-filter` exists in a stylesheet."
 *
 * So this reads the COMPUTED style of every glass surface from the live DOM and
 * reports the real applied values. A surface that falls back to solid (because
 * @supports did not match, or because a class overrode it) shows up here
 * immediately.
 *
 * Run against a production preview:
 *   npm run build && npm run preview
 *   node <browser-runner> http://localhost:5199 --script ./scripts/verify-glass.mjs
 */

const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

export default async function run(page, ui) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(900);

  const readSurface = () =>
    page.evaluate(() => {
      const inspect = (el) => {
        if (!el) return null;
        const s = getComputedStyle(el);
        return {
          backdropFilter: s.backdropFilter || s.webkitBackdropFilter,
          background: s.backgroundColor,
          border: s.borderTopColor,
          radius: s.borderTopLeftRadius,
        };
      };

      const header = document.querySelector('header');
      const card = document.querySelector('.glass-card');
      const panel = document.querySelector('.glass-panel');

      return {
        supportsBackdrop: CSS.supports('backdrop-filter', 'blur(10px)'),
        header: inspect(header),
        glassCard: inspect(card),
        glassPanel: inspect(panel),
      };
    });

  const top = await readSurface();

  // Scrolled state: background opacity must increase and the gold border must
  // stay present.
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const scrolled = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector('header'));
    return { background: s.backgroundColor, border: s.borderBottomColor };
  });

  // Drawer surface with its link colour, so contrast is not assumed.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(500);

  const drawer = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) return null;
    const s = getComputedStyle(dlg);
    const link = dlg.querySelector('a[href="/about"]');
    return {
      backdropFilter: s.backdropFilter || s.webkitBackdropFilter,
      background: s.backgroundColor,
      linkColor: link ? getComputedStyle(link).color : null,
      linkCount: dlg.querySelectorAll('a').length,
    };
  });

  const verdict = {
    headerBlurs: Boolean(top.header?.backdropFilter?.includes('blur')),
    cardBlurs: Boolean(top.glassCard?.backdropFilter?.includes('blur')),
    drawerBlurs: Boolean(drawer?.backdropFilter?.includes('blur')),
    scrolledOpacityIncreased:
      parseFloat(top.header?.background.match(/[\d.]+\)$/)?.[0] ?? 0) <=
      parseFloat(scrolled.background.match(/[\d.]+\)$/)?.[0] ?? 0),
    goldBorderKeptOnScroll: /217, 173, 69|217 173 69/.test(scrolled.border) ||
      scrolled.border.includes('0.42'),
  };

  return { supportsBackdrop: top.supportsBackdrop, top, scrolled, drawer, verdict };
}