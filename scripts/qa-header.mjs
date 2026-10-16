/**
 * ============================================================================
 * HEADER SWEEP
 * ============================================================================
 *
 * Walks every width band where the header can change state and reports, per
 * width, whether the logo, the primary nav, the CTA and the hamburger are
 * actually rendered — plus whether any nav item is clipped past the header's
 * right edge or collides with the logo.
 *
 * WHY THIS EXISTS
 * ---------------
 * It found a real bug. The header gated the desktop nav and the CTA behind
 * `xl` (1280px) on the stated belief that five links plus a CTA plus the logo
 * "genuinely do not fit at 1024px". Measured, the row needs 817px of a 1024px
 * viewport — 207px of slack. So every width from 900px to 1279px rendered a
 * logo, a hamburger, and nothing else: no navigation, and no "Book a
 * Consultation" CTA at all, on 1024x768 and 1152x864 laptops, every iPad in
 * landscape, and any desktop at 125% browser zoom.
 *
 * None of that is visible at 1440px, which is where a screenshot is usually
 * taken, and none of it is visible at 390px either. It only exists in the band
 * in between, so it has to be swept rather than looked at.
 *
 * USAGE
 *   npm run qa:header
 *
 * Output: C:/…/Temp/vnr-qa/hdr-<width>.png — a clipped strip of the chrome.
 */
import fs from 'node:fs';

const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';
const OUT = 'C:/Users/RAHUL/AppData/Local/Temp/vnr-qa';

const WIDTHS = [900, 1024, 1100, 1180, 1248, 1279, 1280, 1366, 1399, 1400, 1440, 1600, 1920];

export default async function run(page) {
  fs.mkdirSync(OUT, { recursive: true });
  const rows = [];

  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(700);

    const info = await page.evaluate(() => {
      const header = document.querySelector('header');
      const r = header.getBoundingClientRect();

      const vis = (el) => {
        if (!el) return 'absent';
        const b = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || b.width === 0) return 'hidden';
        if (b.right > r.right + 0.5 || b.left < r.left - 0.5) return 'clipped';
        return `ok ${Math.round(b.left)}..${Math.round(b.right)}`;
      };

      const logo = header.querySelector('a[aria-label*="home"]');
      const nav = header.querySelector('nav[aria-label="Primary"]');
      // The CTA is the LAST anchor in the header, not the first `a[href="/contact"]` —
      // the "Contact" nav item shares that href and comes first in the DOM, so
      // `querySelector` measures the nav link and happily reports a CTA that
      // isn't rendering. `at(-1)` is the button.
      const cta = [...header.querySelectorAll('a[href="/contact"]')].at(-1) ?? null;
      // The hamburger is the button labelled "Open menu" / "Close menu". Matching
      // on `[aria-expanded]` alone also matches the "Also worth seeing" disclosure trigger,
      // which reports the hamburger as present at widths where it is hidden.
      const burger = [...header.querySelectorAll('button[aria-expanded]')].find((b) =>
        /open menu|close menu/i.test(b.getAttribute('aria-label') || ''),
      ) ?? null;
      const disclosureTrigger = [...header.querySelectorAll('button[aria-expanded]')].find((b) =>
        /also worth seeing/i.test(b.textContent || ''),
      );

      // A trigger is only "shown" if its OWN wrapper is displayed — checking
      // only the enclosing <nav> reports it as visible at every width, because
      // the nav is always visible; the wrapper around the disclosure is what
      // carries `navfull:hidden`.
      const moreWrapper = disclosureTrigger?.closest('div');
      const moreVisible =
        !!moreWrapper && getComputedStyle(moreWrapper).display !== 'none'
          && moreWrapper.getBoundingClientRect().width > 0;

      // EVERY destination the header must offer, whichever arrangement it is
      // currently using. The two inline lists and the disclosure panel cover the
      // same nine routes in two arrangements; this is the check that both stay
      // complete and that the right one is showing at each width.
      const REQUIRED = [
        'Home', 'Services', 'About VNR', 'Our Process', 'Interiors', 'Contact',
        'Our Projects', 'Packages', 'Cost Estimator', 'Quality Standards',
      ];
      const visibleLabels = new Set(
        [...header.querySelectorAll('a[href^="/"]')]
          .filter((a) => getComputedStyle(a).display !== 'none' && a.getBoundingClientRect().width > 0)
          .map((a) => a.textContent.trim())
          .filter(Boolean),
      );

      // If the disclosure is showing, its contents get read in a SECOND pass
      // below — the panel cannot be opened and read in the same synchronous
      // evaluate, because React has not re-rendered by the time the next line
      // runs and `aria-controls` still points at nothing.
      const missing = REQUIRED.filter((l) => !visibleLabels.has(l));
      const navItems = nav
        ? [...nav.querySelectorAll('a')]
            .filter((a) => getComputedStyle(a).display !== 'none' && a.getBoundingClientRect().width > 0)
            .map((a) => {
              const b = a.getBoundingClientRect();
              return { t: a.textContent.trim(), l: Math.round(b.left), r: Math.round(b.right) };
            })
        : [];

      /* WRAPPING IS A DIFFERENT FAILURE FROM OVERFLOW, AND IT IS WORSE.
         A nav link is one line by definition. If its text wraps it has NOT
         overflowed the header — and the global base reset's `min-width: 0`
         lets flex children shrink below their content width rather than
         overflow, so a row that is 20px too full renders as "Ho me",
         "Servic es", "Conta ct" and still passes every overflow check.

         This is not hypothetical: it is exactly what 1024px produced the first
         time Home was added to the bar, while this script reported ok:true at
         every width.

         The test is a Range over the link's TEXT nodes, counting the client
         rects it produces: one rect is a single line, two is a wrap.

         Comparing the element's height against its line-height does NOT work —
         every link carries `min-h-11`, so its box is 44px against a 23px line
         and the naive check flags all of them. Measure the text, not the box. */
      const wrapped = nav
        ? [...nav.querySelectorAll('a')]
            .filter((a) => getComputedStyle(a).display !== 'none' && a.getBoundingClientRect().width > 0)
            .filter((a) => {
              const range = document.createRange();
              let lines = 0;
              for (const node of a.childNodes) {
                if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
                range.selectNodeContents(node);
                // The underline span is absolutely positioned with a 2px height,
                // so a small height filter keeps decoration out of the count.
                lines += [...range.getClientRects()].filter((r) => r.height > 6).length;
              }
              return lines > 1;
            })
            .map((a) => {
              const b = a.getBoundingClientRect();
              return { t: a.textContent.trim(), w: Math.round(b.width) };
            })
        : [];

      return {
        headerH: Math.round(r.height),
        headerRight: Math.round(r.right),
        headerTop: Math.round(r.top),
        logo: vis(logo),
        nav: vis(nav),
        cta: vis(cta),
        burger: vis(burger),
        navItems,
        navItemsClipped: navItems.filter((i) => i.r > r.right + 0.5 || i.l < r.left - 0.5).map((i) => i.t),
        wrapped,
        moreMenu: moreVisible ? 'shown' : 'hidden',
        inlineCount: visibleLabels.size,
        missing,
        overlap: (() => {
          const l = logo?.getBoundingClientRect();
          const c = cta?.getBoundingClientRect();
          if (!l || !c || c.width === 0 || nav?.getAttribute('class')?.includes('hidden')) return false;
          return c.left < l.right;
        })(),
      };
    });

    const top = Math.max(0, info.headerTop - 10);
    await page.screenshot({ path: `${OUT}/hdr-${w}.png`, clip: { x: 0, y: top, width: w, height: info.headerH + 24 } });

    // Second pass: open the disclosure for real and read the panel, so
    // "reachable" is measured rather than assumed. Opening it also captures
    // the menu itself at this width, which is where a panel that overflows the
    // viewport or sits under the CTA would show up.
    let panel = null;
    if (info.moreMenu === 'shown') {
      await page.getByRole('button', { name: /^also worth seeing$/i }).click();
      await page.waitForTimeout(220);
      panel = await page.evaluate(() => {
        const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) =>
          /also worth seeing/i.test(x.textContent || ''),
        );
        const el = document.getElementById(b?.getAttribute('aria-controls'));
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          labels: [...el.querySelectorAll('a')].map((a) => a.textContent.trim()),
          w: Math.round(r.width),
          right: Math.round(r.right),
          offRight: Math.round(r.right - window.innerWidth),
          bottom: Math.round(r.bottom),
        };
      });
      await page.screenshot({ path: `${OUT}/hdr-${w}-panel.png`, clip: { x: 0, y: top, width: w, height: info.headerH + 260 } });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(160);
    }

    rows.push({
      w,
      ...info,
      panel,
      missing: [
        ...info.missing.filter((l) => !(panel?.labels || []).includes(l)),
      ],
    });
  }

  /* One line per width — this is the whole report, and a 13-object JSON dump
     makes the one thing that matters (MISSING) easy to scroll past. */
  const widths = rows.map((r) => ({
    width: r.w,
    nav: r.nav,
    cta: r.cta,
    burger: r.burger,
    moreMenu: r.moreMenu,
    inlineLabels: r.inlineCount,
    panelLabels: r.panel ? r.panel.labels.length : 0,
    panelOffRight: r.panel ? r.panel.offRight : null,
    navItemsClipped: r.navItemsClipped,
    wrappedNavLinks: r.wrapped,
    logoOverlapsCta: r.overlap,
    MISSING: r.missing,
    // Completeness is only meaningful when the BAR is the active mechanism.
    // Below `lg` the header hands off to the drawer, and the drawer carries all
    // ten routes — that path is asserted by scripts/audit-responsive.mjs, which
    // opens it and checks each link, so counting it here as "missing" would be
    // this script reporting a mechanism it is not testing.
    //
    // `wrapped` is a first-class failure, not a detail: a nav link that wraps
    // has not overflowed the header, so every other check here passes while the
    // bar is unreadable.
    ok:
      r.navItemsClipped.length === 0 &&
      r.wrapped.length === 0 &&
      r.overlap === false &&
      (r.nav === 'hidden' || r.missing.length === 0) &&
      (r.panel ? r.panel.offRight <= 0 : true),
  }));

  /* ---- Phase 2: the disclosure's own behaviour, at 1280px ----

     A correct SHAPE is not a working menu. These are the things a width sweep
     cannot see: does it open, does Escape close it, does focus come back, and
     does a route change from OUTSIDE the panel close it too — the last being
     the one that silently strands an open panel over the wrong page. */
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  const more = page.getByRole('button', { name: /^also worth seeing$/i });
  const expanded = () => more.getAttribute('aria-expanded');

  await more.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  const openedByEnter = (await expanded()) === 'true';
  const panelLinks = await page.locator('nav[aria-label="More pages"] a').count();

  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const closedByEscape = (await expanded()) === 'false';
  /* Focus must return to the TRIGGER, not to a particular string.

     The trigger's visible text depends on the width — "More" below `xl`,
     "Also worth seeing" at and above it — and its accessible name is pinned by
     `aria-label`. Asserting on either would break whenever the label changes,
     and a check that fails on correct code teaches people to ignore it. What
     has to be true is only that focus came back to the button. */
  const focusReturned = await page.evaluate(
    () => document.activeElement?.getAttribute('aria-controls') !== null,
  );

  await more.click();
  await page.waitForTimeout(250);
  await page.locator('nav[aria-label="More pages"] a', { hasText: 'Cost Estimator' }).click();
  await page.waitForTimeout(500);
  const navigated = page.url().includes('/estimate');
  const closedAfterNavigate = (await expanded()) === 'false';

  // A route change from OUTSIDE the panel must close it, not just its own
  // links. The logo is a link outside the disclosure, so it does exactly that.
  // (`goBack()` would not test this: the history is exhausted at the first
  // entry and the browser leaves the app.)
  await more.click();
  await page.waitForTimeout(200);
  await page.getByRole('link', { name: /home$/i }).first().click();
  await page.waitForTimeout(500);
  const closedOnExternalRouteChange = (await expanded()) === 'false';

  return {
    widths,
    disclosure: {
      openedByEnter,
      panelLinks,
      closedByEscape,
      focusReturned,
      navigated,
      closedAfterNavigate,
      closedOnExternalRouteChange,
      ok:
        openedByEnter &&
        panelLinks === 4 &&
        closedByEscape &&
        focusReturned &&
        navigated &&
        closedAfterNavigate &&
        closedOnExternalRouteChange,
    },
  };
}