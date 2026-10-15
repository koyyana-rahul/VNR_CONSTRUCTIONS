# VNR Constructions — Website

React 19 · Vite · Tailwind CSS v4 · React Router v7 · Motion for React
Midnight navy + champagne gold.

---

## Verification status

Everything below was **executed**, not assumed:

| Check | Result |
|---|---|
| Production build | ✅ passes, `dist/` generated |
| ESLint | ✅ 0 problems |
| Vitest | ✅ **85 tests passing** across 5 suites |
| Responsive audit | ✅ **195/195** route × viewport combinations, `"PASS": true` |
| Browser console | ✅ 0 errors |
| Glass/transparency | ✅ verified live via computed styles (see below) |

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # regenerates imagery + sitemap, then builds
npm run preview    # serves dist/ on :5199
npm run verify     # lint → test → build
```

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Image + sitemap generation, then production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint (includes React Compiler rules) |
| `npm run test` | Vitest + React Testing Library |
| `npm run verify` | lint → test → build |
| `npm run check:company` | **Pre-launch gate.** Prints every unverified/outstanding item; exits non-zero. |
| `npm run images` / `npm run sitemap` | Regenerate brand artwork / sitemap |
| `npm run fix:imports` | Deterministic import-path repair |

---

## Verification tooling

Four scripts under `scripts/` do real work rather than asserting:

- **`audit-responsive.mjs`** — drives a real browser across **13 routes × 15
  viewports = 195 combinations**, checking horizontal overflow (by attempting an
  actual scroll, not by reading `scrollWidth`), broken images, missing `alt`,
  image aspect-ratio integrity, exactly one `<h1>`, brand-colour conformance
  against a palette allowlist, effective tap-target size, and
  `aria-controls` → `role="tabpanel"` wiring. Then exercises the drawer
  (open/Escape/focus-restore/navigate), estimator maths, form validation,
  project filters and the skip link.
- **`verify-glass.mjs`** — reads the *computed* `backdrop-filter` and background
  of the header, cards, panel and drawer to prove the transparency is real
  rather than merely declared in a stylesheet.
- **`capture.mjs`** — screenshots at 320/390/768/1024/1366/1920 (hero, services,
  contact) plus the open mobile drawer. Scrolls before capturing, because the
  page uses scroll-triggered reveals and an unscrolled full-page capture shows
  sections that have not animated in yet.
- **`generate-brand-images.mjs`** — deterministic navy/champagne line artwork,
  so nothing can 404 and every image is on-palette.

---

## Verified responsive results

| Viewport | Overflow | Notes |
|---|---|---|
| 320 | none | single-column services + process, full-width CTAs |
| 360 / 375 / 390 / 414 / 430 / 480 | none | standard mobile |
| 600 / 640 | none | large mobile |
| 768 / 820 | none | tablet portrait, 2-col services |
| 950 / 1024 | none | tablet landscape |
| 1280 / 1366 / 1440 / 1600 | none | desktop, full nav at `xl` |
| 1920 | none | controlled 1320px measure, content centred |

`overflow-x: hidden` is **not** used anywhere. An earlier build used
`overflow-x: clip`, which made the audit pass while elements still extended past
the viewport — it concealed bugs rather than fixing them. It was removed and the
offending elements fixed at source (the header logo was rendering at its full
320px intrinsic width).

### Effective transparency (measured, not assumed)

| Surface | `backdrop-filter` | Background |
|---|---|---|
| Header (top) | `blur(16px) saturate(1.3)` | `rgb(4 13 22 / 88%)` |
| Header (scrolled) | — | `rgb(3 10 18 / 96%)`, gold border 42% |
| Glass card | `blur(10px)` | `rgb(13 32 48 / 82%)` |
| Glass panel | `blur(16px) saturate(1.3)` | `rgb(4 13 22 / 88%)` |
| Mobile drawer | `blur(20px)` | `rgb(4 13 22 / 92%)` |

`backdrop-filter` is gated behind `@supports`; unsupported browsers get a **solid**
navy fallback, never a washed-out translucent panel.

---

## Architecture

```
src/
├── config/       company.js · site.js (routes/nav/SEO)
├── data/         home.js (all 11 sections' copy) · faqs · projects
├── utils/        format.js (INR) · validation.js (Indian phone) · estimatorMath.js
├── services/     enquiry.js (submission adapter + WhatsApp handoff)
├── hooks/        useMediaQuery · useBodyScrollLock · useScrollProgress
├── styles/       index.css — THE design token file
├── components/
│   ├── brand/    Logo
│   ├── common/   Button · Container · Section · SmartImage · Accordion ·
│   │             DataNotice · SourceCopyPending · EmptyState · PageHero
│   ├── motion/   variants · Reveal/Stagger/HeroEnter · AnimatedNumber · Modal
│   ├── layout/   TopBar · Header · MobileDrawer · Footer · ScrollProgressBar
│   ├── home/     Hero · Highlights · Services · About · Process · Interiors ·
│   │             Gallery · ContactSection · CtaBanner · FaqSection
│   ├── projects/ ProjectCard · FilterTabs · Gallery (lightbox)
│   ├── packages/ ScopeComparison
│   ├── estimator/CostEstimator
│   └── forms/    Fields · ConsultationForm · ConsultationModal
└── pages/        one file per route
```

**State management: React local state throughout.** Redux Toolkit was
deliberately not added — no state genuinely crosses unrelated components or
routes, and the estimator is pure derived state. A store here would be ceremony,
not architecture.

---

## Design system

All colour lives in `src/styles/index.css`, in two layers:

1. **Tailwind `@theme`** — generates the utilities (`bg-navy`, `text-gold`).
2. **Named `--vnr-*` variables** — the greppable alias from the brand brief,
   reachable from hand-written CSS.

There is exactly one source of truth, and **no component contains a hex value**.

Surface hierarchy follows the brief's three levels:

- **Level 1** solid midnight / deep navy — main backgrounds
- **Level 2** translucent navy + low-opacity border — secondary panels
- **Level 3** translucent + backdrop blur — interactive glass

Typography: `Playfair Display`/Georgia for headings, `DM Sans`/Arial for body.
Georgia and Arial are named **first** in the stacks so the brand character
survives with no network and no webfont; the webfonts load non-blockingly and
improve on that.

Fluid type via `clamp()` in the token file — no breakpoint ladder.

---

## Content honesty

The brief repeatedly says *preserve the existing description* / *retain the
existing paragraph* while reproducing only the headings. Rather than inventing
copy in the client's voice, those fields are `null` in `src/data/home.js` and
render through **`<SourceCopyPending />`** — a visible, quiet marker. They
disappear automatically once the real text is pasted in.

**Nothing is fabricated.** In particular:

- The **₹1,799/sq ft** price renders as a *starting* price with its disclaimer
  permanently attached, never as a firm quotation. A test asserts this.
- **Gallery visuals are labelled as development visuals**, in the visible
  notice, in every tile's `alt`, and in the lightbox caption.
- The **contact form never claims an enquiry was stored.** With no backend it
  hands off to WhatsApp with the answers pre-filled and says plainly that
  nothing has been transmitted. Set `VITE_ENQUIRY_ENDPOINT` to POST somewhere
  real; success is only reported after an actual 2xx.
- **No invented statistics** — no "500+ projects", no "15 years". A test scans
  the rendered output for those patterns.

---

## Outstanding before launch

Run `npm run check:company` for the live list (currently 11 blocking).

**Blocking:**

- [ ] Supply `vnr-logo.jpg` → drop in `../reference/`
- [ ] Supply `vnr-interiors-promo.png` → `src/assets/images/`
- [ ] Real VNR project photography → replace the gallery placeholders
- [ ] Verbatim copy: About introduction, 4 value statements, 6 service
      descriptions, 4 process step descriptions, interiors paragraph
- [ ] Verify the ₹1,799 figure and disclaimer wording
- [ ] Email, street address, business hours, GST
- [ ] Confirm the production domain
- [ ] Review the privacy policy (contains placeholders)
- [ ] Export `public/og-image.png` — social platforms don't render SVG
- [ ] Legal review of the privacy policy

**Advisory:**

- Real project list (currently clearly-labelled placeholders)
- Real estimator rate card (currently `rateIsVerified: false`)
- Connect the enquiry form to a backend

---

## Deployment

`dist/` is static. **SPA rewrites are required** or deep links 404 on refresh.

| Host | Config |
|---|---|
| Netlify | `netlify.toml` |
| Vercel | `vercel.json` |
| Apache / cPanel | rename `public/_redirects` → `.htaccess` |
| nginx / GitHub Pages / Firebase | see comments in `public/_redirects` |

Both host configs set a strict CSP (no inline scripts, no `eval`), immutable
caching for hashed assets, and forced HTTPS.

---

## Accessibility

- Skip link is the **first focusable element**, before the TopBar — an earlier
  version put it inside `<Header>`, so the first Tab landed on the topbar phone
  link. Caught by the browser audit.
- All dialogs (drawer, gallery lightbox, consultation modal) share one `<Modal>`:
  `role="dialog"`, `aria-modal`, Escape, focus trap, focus restoration, scroll
  lock. Behaviour cannot drift between them.
- Accordion follows the WAI-ARIA APG pattern with arrow/Home/End roving focus.
- Filter tabs are a real `role="tablist"` whose `aria-controls` points at an
  element that exists (asserted in the audit).
- Errors use `role="alert"` + `aria-invalid` + an icon — never colour alone.
- Indian mobile numbers are validated to the `6-9` prefix range.
- Inputs are 16px minimum, which prevents iOS zoom-on-focus.
- `prefers-reduced-motion` fully honoured.
- **Content can never be permanently invisible:** Motion's `whileInView`
  depends on an observer firing; if it never does, a timer force-reveals
  everything after 2s. Losing an animation is acceptable, losing content is not.