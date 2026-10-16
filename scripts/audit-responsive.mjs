/**
 * ============================================================================
 * RESPONSIVE AUDIT
 * ============================================================================
 *
 * Loads every route at every mandated viewport and checks the 12 acceptance
 * criteria from the brief programmatically, so the audit is evidence rather
 * than an impression.
 *
 * The key check is horizontal overflow: it compares the document's scrollWidth
 * against the viewport width. That is the single most common responsive bug
 * and the one that silently ruins a mobile experience.
 *
 * Run against a production preview build:
 *   npm run build && npm run preview
 *   node scripts/audit-responsive.mjs
 */

export const ROUTES = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Process', path: '/process' },
  { name: 'Interiors', path: '/interiors' },
  { name: 'Contact', path: '/contact' },
  { name: 'Projects', path: '/projects' },
  { name: 'Project detail', path: '/projects/sample-villa-01' },
  { name: 'Packages', path: '/packages' },
  { name: 'Estimate', path: '/estimate' },
  { name: 'Quality', path: '/quality' },
  { name: 'Privacy', path: '/privacy-policy' },
  { name: '404', path: '/this-route-does-not-exist' },
];

/** The six widths the priority brief demands, plus the wider matrix. */
export const VIEWPORTS = [
  { name: '320', width: 320, height: 568 },
  { name: '360', width: 360, height: 800 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '414', width: 414, height: 896 },
  { name: '430', width: 430, height: 932 },
  { name: '600', width: 600, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '820', width: 820, height: 1180 },
  { name: '950', width: 950, height: 900 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1366', width: 1366, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

export default async function run(page, ui) {
  const base = process.env.AUDIT_BASE || 'http://localhost:4173';
  const failures = [];
  const warnings = [];

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of ROUTES) {
      await page.goto(`${base}${route.path}`, { waitUntil: 'load' });

      // Wait for the ROUTE to render, not just for a fixed number of
      // milliseconds.
      //
      // This sweep makes 195 sequential navigations, and a single fixed 650ms
      // settle is a race: on a cold production preview one of them reported
      // `expected exactly 1 <h1>, found 0` on a page that reliably has one at
      // every width (verified directly at 320/360/375/390). A gate that fails
      // intermittently is worse than no gate, because the next person stops
      // reading it.
      //
      // The `<h1>` is the right thing to wait on: the h1-count check below
      // requires exactly one on every route, so if it never arrives that is a
      // genuine failure and the timeout surfaces it as `found 0` anyway.
      await page
        .waitForSelector('h1', { timeout: 5000 })
        .catch(() => { /* reported as an h1 failure below */ });

      // Scroll-reveal animations set opacity:0 on anything not yet in view,
      // so give Motion time to settle before measuring.
      await page.waitForTimeout(650);

      const report = await page.evaluate(() => {
        const doc = document.documentElement;
        const vw = doc.clientWidth;

        /* ---- 1. Horizontal overflow ---- */
        const overflowBy = doc.scrollWidth - vw;

        // Identify the specific offending elements, so a failure is actionable.
        const offenders = [];
        if (overflowBy > 1) {
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const style = getComputedStyle(el);
            if (style.position === 'fixed') continue;
            if (r.right > vw + 1 || r.left < -1) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className?.toString?.() || '').slice(0, 70),
                left: Math.round(r.left),
                right: Math.round(r.right),
              });
            }
            if (offenders.length >= 6) break;
          }
        }

        /* ---- 2. Tap targets under 44px on touch widths ---- */
        const smallTargets = [];
        if (vw < 1024) {
          for (const el of document.querySelectorAll('a, button, input, select, [role="tab"], [role="radio"]')) {
            // BRING IT INTO VIEW FIRST.
            //
            // The effective-hit-area test below works by hit-testing the
            // element's own centre, and a centre below the fold cannot be hit
            // at all. Without this, EVERY small link on a long page was
            // reported as an undersized tap target regardless of how large its
            // real hit area was — which is why every Projects card title
            // ("Villa / Duplex — Sample Entry", 23px) was flagged at every
            // width even though each one carries an `absolute inset-0` overlay
            // that makes the entire card tappable.
            //
            // `scrollIntoView` is synchronous with respect to layout, so the
            // rect read immediately after it is the post-scroll one.
            //
            // `behavior: 'instant'` is REQUIRED, not a nicety: index.css sets
            // `html { scroll-behavior: smooth }`, so a default scrollIntoView
            // begins an animation and the rect read on the very next line is
            // still the PRE-scroll one. The hit test then runs against a
            // centre thousands of pixels below the viewport, elementFromPoint
            // returns null, and every link below the fold is reported as
            // undersized — which is the exact false positive this fixes.
            if (el.getBoundingClientRect().top > window.innerHeight || el.getBoundingClientRect().bottom < 0) {
              el.scrollIntoView({ block: 'center', behavior: 'instant' });
            }

            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            // sr-only elements are visually hidden until focused, at which point
            // they render at full size. Their 1px box is not a tap target, so
            // excluding them removes a false positive on every single page.
            if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
            if (el.closest('[aria-hidden="true"]') && el.closest('[aria-hidden="true"]') !== document.body) continue;
            // A 20px checkbox inside a 52px <label> IS a 52px target — the
            // label is what the user taps.
            const wrapLabel = el.closest('label');
            if (wrapLabel && wrapLabel.getBoundingClientRect().height >= 40) continue;
            // EFFECTIVE hit area, not element box. A card link is a 23px <a>
            // inside a card whose whole surface is clickable via a stretched
            // `absolute inset-0` overlay — that IS a large target.
            // elementFromPoint at the element centre tells us what a user
            // would actually hit.
            //
            // The overlay case is ALSO checked structurally, without a hit
            // test. Hit-testing is viewport-dependent: a card that happens to
            // sit under the sticky header when the sweep reaches it returns
            // the header, the link looks undersized, and the audit reports a
            // target that is verifiably fine. A descendant positioned at
            // `inset-0` is a declaration of intent that needs no viewport.
            if (r.height < 40) {
              const stretched = [...el.querySelectorAll('span, i, b, em')].some(
                (c) => c.getAttribute('aria-hidden') === 'true' && /\binset-0\b/.test(c.className?.toString?.() || ''),
              );
              if (stretched) continue;

              const cx = r.left + r.width / 2;
              const cy = r.top + r.height / 2;
              if (cx >= 0 && cy >= 0 && cx <= vw && cy <= (window.innerHeight)) {
                const hit = document.elementFromPoint(cx, cy);
                const effective = hit && (hit === el || el.contains(hit) || hit.contains(el));
                if (effective) continue;
              }
            }
            if (r.height < 40) {
              smallTargets.push({
                tag: el.tagName.toLowerCase(),
                text: (el.textContent || '').trim().slice(0, 32),
                h: Math.round(r.height),
              });
            }
            if (smallTargets.length >= 6) break;
          }
        }

        /* ---- 3. Images: broken, missing alt ----
           `complete && naturalWidth === 0` is only meaningful once loading has
           actually settled. Lazy images below the fold have not started, so
           check the network result too: an image is genuinely broken only if
           it has attempted to load and failed. */
        const images = [...document.querySelectorAll('img')];
        const brokenImages = images.filter((i) => {
          if (!i.complete) return false;
          if (i.naturalWidth > 0) return false;
          // Deferred, not-yet-started lazy images are not broken.
          return i.loading !== 'lazy' || i.currentSrc;
        }).length;
        const missingAlt = images.filter((i) => !i.hasAttribute('alt')).length;

        /* ---- 3b. Aspect-ratio integrity ----
           Every content image should sit in a ratio-locked box, so the
           rendered box must not be wildly out of proportion. */
        const distorted = images.filter((i) => {
          const r = i.getBoundingClientRect();
          if (r.width < 40 || r.height < 40) return false;
          const ar = r.width / r.height;
          return ar > 4.2 || ar < 0.24;
        }).map((i) => ({ src: i.currentSrc?.slice(-28), ar: +(i.getBoundingClientRect().width / i.getBoundingClientRect().height).toFixed(2) }));

        /* ---- 4. Heading hierarchy ---- */
        const h1s = document.querySelectorAll('h1').length;

        /* ---- 5. Brand-colour conformance ----
         An ALLOWLIST derived from src/styles/index.css is far more reliable
         than a "looks blue" heuristic — a naive regex flagged the brand's own
         gold and body-grey as violations.
         Only UI chrome is checked; images keep their natural colours by design.
         Alpha variants of token colours are allowed, since opacity utilities
         produce rgba() with the same RGB.

         THE `.on-light` HALF OF THE PALETTE
         ------------------------------------
         index.css re-points the text/line/gold tokens inside `.on-light` so
         the ivory and white sections pass WCAG AA — on ivory, the dark-theme
         #F1EEE6 heading ran at 1.08:1. That override block introduces four
         values that exist NOWHERE ELSE in the stylesheet:

             #12283A  14.1:1   text-primary / text-strong
             #3E5261   7.6:1   text / text-secondary
             #5A6D7D   5.0:1   text-muted
             #7A5A12   5.9:1   the light-surface champagne
             #DDD6C4           line
             #C6BCA4           line-strong

         They were missing here, so every light-surface page failed this check
         at every viewport — 90 failures that had nothing to do with brand
         discipline, and a PASS:false that meant nothing. They are the documented
         fix for a real accessibility bug, so they belong in the allowlist. */
        const ALLOWED_RGB = new Set([
          '3, 10, 18',    // navy
          '7, 23, 39',    // navy-2
          '16, 42, 61',   // navy-3
          '2, 7, 13',     // black-blue
          '217, 173, 69', // gold
          '255, 227, 160',// gold-light
          '201, 149, 45', // gold-button-dark
          '255, 232, 166',// gold-button-light
          '248, 247, 242',// ivory
          '255, 255, 255',
          '241, 238, 230',// text-primary
          '208, 219, 225',// text-secondary
          '170, 182, 191',// text-muted
          '36, 55, 70',   // border-dark
          '47, 70, 90',   // line-strong
          '21, 35, 49',   // input-text
          '215, 201, 169',// input-border
          '255, 253, 248',// input-background
          '251, 249, 243',// surface-warm (ivory-section cards)
          // --- `.on-light` overrides, index.css ---
          '18, 40, 58',   // #12283A  on-light text-primary / text-strong
          '62, 82, 97',   // #3E5261  on-light text / text-secondary
          '90, 109, 125', // #5A6D7D  on-light text-muted
          '122, 90, 18',  // #7A5A12  on-light champagne
          '107, 78, 15',  // #6B4E0F  on-light gold-light
          '221, 214, 196',// #DDD6C4  on-light line
          '198, 188, 164',// #C6BCA4  on-light line-strong
        ]);

        const parseRgb = (value) => {
          const m = value.match(/rgba?\(([^)]+)\)/);
          if (!m) return null;
          const [r, g, b] = m[1].split(/[,/]/).map((n) => parseFloat(n.trim()));
          if ([r, g, b].some((n) => Number.isNaN(n))) return null;
          return `${r}, ${g}, ${b}`;
        };

        // Elements whose colour comes from the brand chrome we intend.
        const INSPECT = 'h1,h2,h3,h4,h5,h6,p,a,button,span,li,dt,dd,legend,label,summary,th,td';
        void INSPECT;
        const offBrand = [];
        for (const el of document.querySelectorAll(INSPECT)) {
          if (el.children.length > 0) continue;
          const text = (el.textContent || '').trim();
          if (!text) continue;
          const s = getComputedStyle(el);
          for (const prop of ['color', 'backgroundColor', 'borderTopColor']) {
            const rgb = parseRgb(s[prop]);
            // Ignore transparent and fully-white-on-dark text handled by tokens.
            if (!rgb) continue;
            const [r, g, b] = rgb.split(',').map(Number);
            if (r === 0 && g === 0 && b === 0 && prop !== 'color') continue;
            if (!ALLOWED_RGB.has(rgb)) {
              offBrand.push({
                tag: el.tagName.toLowerCase(),
                prop,
                color: s[prop],
                text: text.slice(0, 28),
              });
            }
          }
          if (offBrand.length >= 8) break;
        }

        /* ---- 6. Fixed-position elements overlapping content ---- */
        const fixed = [...document.querySelectorAll('body *')]
          .filter((el) => getComputedStyle(el).position === 'fixed')
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { cls: (el.className?.toString?.() || '').slice(0, 50), w: Math.round(r.width), h: Math.round(r.height) };
          });

        return {
          vw,
          scrollWidth: doc.scrollWidth,
          overflowBy,
          offenders,
          smallTargets,
          imageCount: images.length,
          brokenImages,
          distorted,
          missingAlt,
          h1s,
          offBrand,
          fixed,
          title: document.title,
          bodyChars: document.body.innerText.trim().length,
        };
      });

      const key = `${vp.width}px ${route.name}`;

      if (report.bodyChars < 200) {
        failures.push(`${key}: page appears blank (${report.bodyChars} chars)`);
      }
      if (report.overflowBy > 1) {
        failures.push(
          `${key}: horizontal overflow +${report.overflowBy}px — ${report.offenders
            .map((o) => `${o.tag}.${o.cls} [${o.left}..${o.right}]`)
            .join(' | ')}`,
        );
      }
      if (report.brokenImages > 0) {
        failures.push(`${key}: ${report.brokenImages} broken image(s)`);
      }
      if (report.missingAlt > 0) {
        failures.push(`${key}: ${report.missingAlt} image(s) missing alt attribute`);
      }
      if (report.distorted?.length > 0) {
        failures.push(`${key}: distorted image ratio — ${JSON.stringify(report.distorted)}`);
      }
      if (report.h1s !== 1) {
        failures.push(`${key}: expected exactly 1 <h1>, found ${report.h1s}`);
      }
      if (report.offBrand.length > 0) {
        failures.push(`${key}: off-brand colour — ${JSON.stringify(report.offBrand)}`);
      }
      if (report.smallTargets.length > 0) {
        warnings.push(
          `${key}: ${report.smallTargets.length} small tap target(s) — ${report.smallTargets
            .map((t) => `${t.tag}"${t.text}" ${t.h}px`)
            .join(', ')}`,
        );
      }
    }
  }

  /* ---------------- Interactive checks at one width ---------------- */
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/`, { waitUntil: 'load' });

  const interactive = await (async () => {
    const out = {};

    // Mobile drawer: open, focus trap, Escape, close.
    const toggle = page.getByRole('button', { name: /open menu/i });
    await toggle.click();
    await page.waitForTimeout(350);
    out.drawerOpened = await page.getByRole('dialog', { name: /site navigation/i }).isVisible();
    out.drawerLocksScroll = await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(350);
    out.drawerClosedByEscape = !(await page.getByRole('dialog', { name: /site navigation/i }).isVisible().catch(() => false));
    out.scrollRestored = await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden');

    // Drawer nav navigates and closes.
    await toggle.click();
    await page.waitForTimeout(350);
    // Locate by href rather than accessible name: the drawer links carry an
    // aria-description, which can affect Playwright's name matching.
    const drawerLink = page.locator('[role="dialog"] a[href="/interiors"]').first();
    await drawerLink.click();
    await page.waitForTimeout(600);
    out.drawerNavigates = page.url().includes('/interiors');
    out.drawerAutoClosed = await page
      .locator('[role="dialog"]')
      .isVisible()
      .catch(() => false)
      .then((visible) => !visible);

    return out;
  })();

  if (!interactive.drawerOpened) failures.push('Mobile drawer did not open');
  if (!interactive.drawerLocksScroll) failures.push('Mobile drawer did not lock background scroll');
  if (!interactive.drawerClosedByEscape) failures.push('Escape did not close the mobile drawer');
  if (!interactive.scrollRestored) failures.push('Background scroll not restored after drawer close');
  if (!interactive.drawerNavigates) failures.push('Drawer navigation did not change route');
  if (!interactive.drawerAutoClosed) failures.push('Drawer did not auto-close after navigating');

  /* ---------------- Estimator behaviour ---------------- */
  await page.goto(`${base}/estimate`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const estimator = await (async () => {
    const out = {};
    // Read the stable test id rather than a class: the total now wraps an
    // AnimatedNumber, so the class list on the element is not a contract.
    // The total animates via AnimatedNumber, so read it only once the count-up
  // has settled — otherwise we sample a mid-flight value.
  const total = async () => {
    const before = await page.getByTestId('estimate-total').innerText();
    await page.waitForTimeout(750);
    const after = await page.getByTestId('estimate-total').innerText();
    // If it is still moving, wait once more.
    if (before !== after) await page.waitForTimeout(600);
    return page.getByTestId('estimate-total').innerText();
  };

    out.initial = await total();

    const area = page.getByLabel(/total built-up area/i);
    await area.fill('4000');
    await page.waitForTimeout(200);
    out.doubled = await total();

    // Negative area must block the CTA.
    await area.fill('-100');
    await page.waitForTimeout(200);
    out.ctaDisabledOnInvalid = await page.getByRole('button', { name: /request a quotation/i }).isDisabled();

    await area.fill('2000');
    await page.getByRole('radio', { name: /sq m/i }).click();
    await page.waitForTimeout(200);
    out.afterUnitSwitch = await total();

    // Reset
    await page.getByRole('button', { name: /^reset$/i }).click();
    await page.waitForTimeout(200);
    out.afterReset = await total();

    return out;
  })();

  if (estimator.initial === estimator.doubled) {
    failures.push('Estimator total did not change when area changed');
  }
  if (!estimator.ctaDisabledOnInvalid) {
    failures.push('Estimator CTA stayed enabled with a negative area');
  }
  if (estimator.afterReset !== estimator.initial) {
    failures.push(
      `Estimator reset did not restore defaults (${estimator.afterReset} vs ${estimator.initial})`,
    );
  }

  /* ---------------- Form validation ---------------- */
  await page.goto(`${base}/contact`, { waitUntil: 'load' });
  const form = await (async () => {
    await page.getByRole('button', { name: /request a callback/i }).click();
    await page.waitForTimeout(300);
    return page.evaluate(() => ({
      alerts: document.querySelectorAll('[role="alert"]').length,
      // The critical assertion: nothing may claim the enquiry was stored.
      claimsStored: /your enquiry has been received/i.test(document.body.innerText),
    }));
  })();

  if (form.alerts < 3) failures.push(`Expected multiple validation alerts, got ${form.alerts}`);
  if (form.claimsStored) failures.push('Form falsely claims the enquiry was stored');

  /* ---------------- Filters ---------------- */
  await page.goto(`${base}/projects`, { waitUntil: 'load' });
  await page.waitForSelector('[role="tabpanel"]', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  const filters = await (async () => {
    // Count cards inside whichever element currently carries role="tabpanel",
    // so this does not depend on the panel being a <ul> or a <div>.
    const countCards = () =>
      page.locator('[role="tabpanel"] > li, [role="tabpanel"] ul > li').count();

    await page.waitForFunction(
      () => document.querySelectorAll('[role="tabpanel"] li').length > 0,
      { timeout: 6000 },
    );

    const before = await countCards();

    const commercial = page.locator('[role="tab"]:has-text("Commercial")').first();
    await commercial.click();
    await page.waitForTimeout(400);
    const after = await countCards();

    return {
      before,
      after,
      selected: await commercial.getAttribute('aria-selected'),
      // aria-controls must point at an id that really exists.
      controlsResolves: await page.evaluate(() =>
        [...document.querySelectorAll('[role="tab"]')].every((t) => {
          const id = t.getAttribute('aria-controls');
          return !id || !!document.getElementById(id);
        }),
      ),
    };
  })();

  if (!filters.controlsResolves) {
    failures.push('A filter tab has aria-controls pointing at a non-existent id');
  }

  if (filters.before === filters.after) {
    failures.push('Project filter did not change the result count');
  }
  if (filters.selected !== 'true') {
    failures.push('Active filter is not marked aria-selected');
  }

  /* ---------------- Keyboard: skip link ---------------- */
  await page.goto(`${base}/`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  // Focus has to live in the document before Tab moves to the first control.
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    return { text: el.textContent?.trim(), visible: el.getBoundingClientRect().width > 0 };
  });
  if (!/skip to content/i.test(skip.text || '') || !skip.visible) {
    failures.push(`Skip link not reachable/visible on first Tab (got "${skip.text}")`);
  }

  /* ---------------- Final verdict ---------------- */
  return {
    viewports: VIEWPORTS.length,
    routes: ROUTES.length,
    combinationsTested: VIEWPORTS.length * ROUTES.length,
    interactive,
    estimator,
    form,
    filters,
    skipLink: skip,
    warnings,
    failures,
    PASS: failures.length === 0,
  };
}