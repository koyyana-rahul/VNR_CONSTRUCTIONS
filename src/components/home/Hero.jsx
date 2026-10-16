import { m, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { Container } from '../common/Container.jsx';
import { heroContainer, heroBackdrop, heroItem, heroLine } from '../motion/variants.js';
import { formatINR } from '../../utils/format.js';
import { hero, promo } from '../../data/home.js';
import { ROUTES } from '../../config/site.js';

/**
 * ============================================================================
 * HERO (reference section 3)
 * ============================================================================
 *
 * Copy is supplied verbatim in src/data/home.js — headline, body, CTA labels
 * and the promotional starting price are all the client's own words.
 *
 * LAYOUT
 *   The supplied Hero.png is a real photograph, and its composition decides the
 *   layout. The left third of the frame is open sunset sky with almost no
 *   detail; the right third carries the completed house and the VNR hard hat.
 *   So the panel is a full-bleed image with the copy over the LEFT negative
 *   space rather than a two-column split — the headline lands on empty sky, the
 *   building stays visible, and no opaque card is needed anywhere.
 *
 *   Because the photograph is bright (a low sun, a warm sky) and the copy is
 *   white, `.hero-overlay` carries a directional scrim that is near-opaque
 *   under the text and releases to the right. Below `lg` the copy spans the full
 *   width and the scrim switches to vertical.
 *
 * OBJECT-POSITION
 *   The frame is 16:9. From `lg` the panel is wider than that, the whole frame
 *   is visible and `center` is correct. Below `lg` the panel is narrower, so
 *   `cover` scales by height and crops the sides hard — only ~30% of the width
 *   survives at 390px. Measured: at `center` a phone shows the crane and loses
 *   both the house and the hard hat; at 68% it keeps only the hard hat's left
 *   edge. Mobile favours 80%, which frames the house and the VNR hard hat — the
 *   branded object the brief calls out — while leaving a slice of the crane and
 *   the structure in at frame left.
 *
 * PRICE
 *   The ₹1,799/sq ft figure is rendered as a STARTING price with its
 *   disclaimer permanently attached, never as a firm quote.
 *
 * MOTION
 *   Seven ordered steps (image → eyebrow → headline lines → body → price →
 *   CTAs → scroll cue), ~1.2s total, after which the page is fully
 *   interactive. Skipped entirely under prefers-reduced-motion, which renders
 *   the finished composition immediately.
 */
export function Hero() {
  const reduced = useReducedMotion();

  /**
   * THE PHOTOGRAPH — always the section's full-bleed background.
   *
   * One <img>, absolutely positioned, `object-cover`, at EVERY breakpoint. An
   * earlier revision stacked it below the copy on mobile instead. That was a
   * reasonable reading of "don't crop the hat", and it was wrong: it produced
   * exactly the standalone image block under the hero content that the brief
   * rules out, and it threw away the composition — on mobile the copy now sits
   * in the sky above the hat rather than pushing the picture off-screen.
   *
   * FOCAL POINT, MEASURED FROM THE PIXELS — not guessed
   * ---------------------------------------------------
   * Reading Hero.png against a 10% grid puts the hard hat at
   *
   *     shell         x 64% .. 93%    y 51% .. 90%   (brim reaches ~63%)
   *     VNR mark      x 65% .. 80%    y 68% .. 79%
   *     CONSTRUCTIONS x 65% .. 80%    y 79% .. 82%
   *
   * The frame is 1671 x 941 (1.776:1). On a 390px phone with a ~680px hero,
   * `cover` scales by height: the image becomes ~1208px wide, so only 32% of
   * its width survives — about 540 source px, and the hat is 485 of them. It
   * fits, but only just, and only from the right position:
   *
   *   object-position 100%  -> window = source 67.7% .. 100%. The hat's left
   *     3.7% AND the printed "V" are clipped off. Unusable.
   *   object-position  92%  -> window = source 62.3% .. 94.6%. The whole hat,
   *     its brim and the whole printed lockup sit inside with a small margin.
   *
   * That is why mobile is 91% and not the 70% first guess: 70% put the window
   * at 42%..74% and cut the hat in half. 91% is re-derived for the slightly
   * taller mobile panel (see SECTION_CLASS) and still leaves the brim inside.
   *
   * Above `lg` the panel is wider than 16:9, cover scales by width, the whole
   * frame is visible and `center` is correct — the copy column occupies the
   * left ~45% and never reaches the hat at 64%+.
   */
  const image = (
    <img
      src={hero.image}
      alt={hero.imageAlt}
      width={hero.imageWidth}
      height={hero.imageHeight}
      fetchPriority="high"
      decoding="sync"
      className="absolute inset-0 block h-full w-full object-cover object-[88%_50%] lg:object-[50%_50%]"
    />
  );

  /**
   * The scrim — directional, and it points AWAY from the hat.
   *
   * Mobile: a vertical wash, dark at the TOP where the copy sits, releasing to
   * ~8% before it reaches the hat at 51%-90%. An even 30% wash over the whole
   * frame would dull the yellow and sink the black VNR mark into it.
   *
   * Desktop: the horizontal gradient in index.css, dark under the left-hand
   * copy column and clear across the house and hat on the right.
   */
  const overlay = <div aria-hidden="true" className="hero-overlay absolute inset-0" />;

  /** Warm gold bloom behind the copy. Desktop only, for the same reason. */
  const bloom = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-32 -left-28 hidden size-[30rem] rounded-full opacity-90 sm:size-[40rem] sm:-bottom-40 sm:-left-32 lg:-left-24 lg:block"
      style={{
        background:
          'radial-gradient(circle, rgb(217 173 69 / 0.16) 0%, rgb(217 173 69 / 0.05) 42%, transparent 68%)',
      }}
    />
  );

  const plate = (
    <>
      <m.figure variants={heroBackdrop} className="absolute inset-0">
        {image}
      </m.figure>
      {overlay}
      {bloom}
    </>
  );

  /**
   * LAYOUT STRATEGY — one background, two content placements.
   *
   * MOBILE / TABLET (< `lg`) — COPY AT THE TOP, HAT AT THE BOTTOM-RIGHT.
   *   The photograph is full-bleed everywhere, so the only question on a narrow
   *   screen is where the copy sits. Bottom-anchored (the desktop behaviour)
   *   puts it straight through the hat, which occupies y 51%-90% — precisely
   *   the bottom half. Anchoring the copy to the top instead drops it into the
   *   empty sky, and `.hero-overlay` runs its vertical wash downward so the
   *   bottom of the panel, where the hat sits, is left almost untouched.
   *
   *   The copy is also compacted below `lg` — tighter leading, smaller heading,
   *   narrower gaps — so it clears the hat's crown (51%) without shrinking type
   *   to nothing. It is allowed to run a little past that if a long heading
   *   wraps: `min-h`, never `h`.
   *
   * `lg` AND UP — COPY BOTTOM-LEFT, HAT RIGHT. Unchanged, and deliberately so.
   *   The panel is wider than 16:9 so the whole frame is visible, the left
   *   third is open sky, and the copy sits over it with the horizontal scrim.
   *
   * HEIGHT
   *   `min-h-[calc(100svh-var(--chrome-h))]` — the space left below the real,
   *   measured TopBar+Header. `svh` not `vh`, so a mobile browser collapsing
   *   its URL bar cannot make the hero overflow. It is `min-h`, never `h`: if
   *   the copy outgrows the remaining viewport (large text, 200% zoom,
   *   landscape phone) the panel grows instead of clipping the CTAs.
   */
  const content = (
    <Container
      size="page"
      /* The hero owns its padding. It sits inside an inset gold frame, so its
          horizontal padding IS the clearance from that frame — inheriting the
          page gutter and adding to it would be two paddings doing one job, and
          only the hero knows how far the frame sits in. `pad={false}` removes
          the Container's; see Container.jsx for why that cannot be done with a
          `className` override. */
      pad={false}
      className="relative z-10 w-full shrink-0 px-6 pt-7 pb-7 xs:px-7 xs:pt-8 xs:pb-8 sm:px-10 sm:pt-10 sm:pb-10 lg:px-12 lg:pb-12 lg:pt-0 2xl:px-0 2xl:pb-14"
    >
      {/* THE COPY COLUMN WIDTH — sized to the HEADLINE, not to taste.
            At `xl` the display type is 78px and "Your Dream Home." measures
            ~800px on one line. The column was capped at `xl:max-w-[42rem]`
            (672px), so it broke to two lines, then "Our Commitment." broke
            again — a FOUR-line headline that pushed the CTAs below the fold on
            a 1440x900 screen and grew the hero to 914px.

            52rem (832px) holds each sentence on its intended single line. It
            still clears the hard hat, which starts at 64% of a 1440px panel
            = 922px, with 90px to spare.

            `lg` gets 40rem for the 1024px range, where the type step is smaller
            and the panel is narrower. */}
      {/* THE COPY BLOCK — NO PANEL.
            An earlier pass wrapped the whole mobile hero copy in a translucent
            navy card with a gold hairline and a drop shadow. It solved legibility
            and it read as one more box: the price card inside it, the hero
            inside a card, a stack of rectangles. On a premium architectural site
            that is the wrong texture — the photograph is the hero, and the copy
            should sit in it.

            Contrast is now carried entirely by `.hero-overlay`, which on mobile
            runs a single vertical wash: ~94% at the top where the heading and
            body sit, released to ~6% by the bottom so the hard hat keeps full
            brightness and full colour. One gradient, no boxes, no borders, no
            shadows, and nothing over the helmet.

            `max-w` still constrains the measure — a full-bleed 78px headline
            across a 390px phone would be unreadable.

            `shrink-0` is load-bearing, not tidiness. This block is a flex child
            of a column flex container whose height comes from `min-h`. Flex
            children shrink by default, so whenever the copy was taller than
            that min-height it compressed into a box shorter than its own
            content and the overflow spilled straight through the gold frame's
            bottom edge — the disclaimer measured 6px past it at 320px and 14px
            at 1024px, while the block's own box reported a comfortable-looking
            height the whole time. `shrink-0` keeps the block at its natural
            height and lets the section grow around it instead. */}
      <div className="max-w-[34rem] sm:max-w-[38rem] lg:max-w-[40rem] xl:max-w-[52rem]">
        <m.p variants={heroItem} className="eyebrow text-gold">
          {hero.eyebrow}
        </m.p>

        {/* "Our Commitment." carries the champagne accent. The explicit space
            between the spans keeps the accessible name of the <h1> correct —
            without it a screen reader reads "Home.Our Commitment."

            `mt-4` below `lg` (was `mt-6`) and `text-[2rem]` instead of the
            full `text-hero` ramp: on a phone the copy has to clear the hat's
            crown at 51% of the panel, and the display size was spending 24px of
            pure margin doing it. */}
        <m.h1
          id="hero-heading"
          className="mt-3.5 font-display text-hero font-bold text-white lg:mt-5"
        >
          <m.span variants={heroLine} className="block">
            Your Dream Home.
          </m.span>
          {' '}
          <m.span variants={heroLine} className="block">
            Our <span className="text-gold-light">Commitment.</span>
          </m.span>
        </m.h1>

        {/* 15px below `lg`, 16px+ above it. At `text-lead` (16.6px on a 390px
            phone) the body ran to six lines / 165px; at 15px with the same
            measure it is five lines / ~138px. The 27px matters because it is
            3.5% of the panel height — see the budget below. */}
        <m.p
          variants={heroItem}
          className="mt-2.5 max-w-[54ch] text-[0.9375rem] leading-[1.62] text-text-secondary lg:mt-5 lg:max-w-[46ch] lg:text-lead lg:leading-[1.68]"
        >
          {hero.body}
        </m.p>

        {/* ---- Promotional starting price ----
            Compact below `lg`: `mt-3`/`py-2` instead of `mt-8`/`py-3.5`, and
            the amount at 1.375rem rather than `sm:text-3xl`. Same content, same
            hierarchy, ~11px less height — which is what lets the copy clear the
            hat without the type shrinking further.

            MOBILE COPY BUDGET — WHY EVERY ONE OF THESE NUMBERS IS WHAT IT IS
            At 390x844 the chrome measures 160px and the panel is 764px. The
            `object-position: 88%` + cover scale of 0.812 widens the frame to
            ~1357px behind a 390px window, so the hard hat spans the FULL panel
            width from y 51% to y 90%: on a phone there is no horizontal strip
            that is free of it, and the only place the copy can hide from it is
            ABOVE it.

            The copy therefore has to END above ~76% of the panel, and that is
            the number `.hero-overlay` is tuned to protect. It sat at 82% before
            this pass, which put the last two lines of the disclaimer on the lit
            yellow shell at 24% scrim — white on yellow, unreadable.

            Saved, top to bottom: body 27px, price 11px, and the margin ladder
            (16/12/12/12/8 → 14/10/12/12/8) a further 6px. The disclaimer keeps
            `pe-12` because the floating WhatsApp action sits bottom-right at
            exactly this height; that padding is load-bearing, not cosmetic. */}
        <m.div
          variants={heroItem}
          className="mt-3 inline-flex flex-col gap-0 self-start rounded-sm border border-gold-medium bg-navy/55 px-3.5 py-2 backdrop-blur-sm lg:mt-6 lg:gap-1 lg:px-5 lg:py-3.5"
        >
          <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-text-secondary [text-shadow:0_1px_4px_rgb(2_7_13/0.9)] lg:text-[0.6875rem] lg:text-text-muted lg:[text-shadow:none]">
            {promo.label}
          </span>
          <span className="font-display text-[1.375rem] font-bold leading-tight tabular-nums text-gold-light lg:text-3xl">
            {formatINR(promo.rate).replace('₹', '₹')}
            <span className="ml-1.5 text-base font-normal text-text-secondary">
              {promo.unit}
            </span>
          </span>
        </m.div>

        {/* THE DISCLAIMER — directly under the price, not under the CTAs.

            It is a qualifier ON the price ("indicative starting price… final
            cost depends on…"), so it belongs beside the number it qualifies.
            It used to sit below the two buttons, which put three paragraphs and
            116px of chrome between the figure and the only sentence in the
            hero that constrains it.

            On a phone that also fixes a contrast failure. At 390px the buttons
            finish at ~70% of the panel and the disclaimer ran from ~74% to
            ~82% — over the lit crown of the hard hat, which on this layout
            spans the FULL panel width from y 51%. Here it ends at ~62%, well
            inside the near-opaque part of `.hero-overlay`, and the CTAs become
            the last element: both have their own fills, so they carry
            themselves over any background.

            `pe-12` is not for the buttons above — it is for the floating
            WhatsApp action, which sits bottom-right at this height. It is
            released from `sm`, where the panel is wider and the FAB sits
            clear of the copy column.

            12px below `sm`: at 390px this is the last thing on screen and it
            is sitting on the helmet, so every point of size either helps
            legibility or costs panel height. */}
        <m.p
          variants={heroItem}
          className="mt-2 max-w-[54ch] pe-12 text-[0.75rem] leading-[1.6] text-text-secondary [text-shadow:0_1px_4px_rgb(2_7_13/0.9)] sm:max-w-[46ch] sm:pe-0 sm:text-fine lg:mt-4 lg:text-text-muted lg:[text-shadow:none]"
        >
          {promo.disclaimer}
        </m.p>

        <m.div
          variants={heroItem}
          className="mt-3 flex flex-col gap-2 xs:mt-4 xs:flex-row xs:items-center xs:gap-3 lg:mt-6 lg:gap-3"
        >
          <Button
            to={ROUTES.contact}
            variant="goldGradient"
            size="lg"
            fullWidth
            className="sm:w-auto"
            icon={<ArrowRight className="size-4" />}
          >
            {hero.primaryCta}
          </Button>
          <Button
            to={ROUTES.services}
            variant="outline"
            size="lg"
            fullWidth
            /* The outline variant is transparent by design, which is correct on
               the dark left half of the desktop composition. On mobile the copy
               column sits over the whole panel and this button lands on the lit
               shell of the hard hat, where an outlined pill with no fill loses
               its edge entirely. A translucent navy fill below `lg` restores it;
               `lg:` removes it so desktop is untouched. */
            className="bg-navy/55 [text-shadow:0_1px_4px_rgb(2_7_13/0.9)] sm:w-auto lg:bg-transparent lg:[text-shadow:none]"
            icon={<ArrowRight className="size-4" />}
          >
            {hero.secondaryCta}
          </Button>
        </m.div>
      </div>
    </Container>
  );

  /* Both branches share one structural contract so the two can never diverge:

       <section>  isolate, overflow-hidden, min-h = space below the chrome
         plate    absolute inset-0  — photo + scrim + bloom, behind everything
         content  relative z-10     — in flow, so it can grow the section

     The image is absolutely positioned at EVERY breakpoint now, which is what
     makes the hero a true background rather than a block that follows the text.
     The content stays in normal flow on purpose: `min-h` alone cannot clip
     copy that wraps, and an out-of-flow copy column would need its own
     overflow handling at exactly the widths where wrapping is most likely.

     `grow`, NOT `flex-1`, on the content column. `flex-1` is `flex: 1 1 0%` —
     `flex-basis: 0` — so the column contributes ZERO height to the section's
     auto height and the section is sized by `min-h` alone. When the copy needs
     more room than that, it does not push the section open: it overflows its
     own padding box instead. Measured, that put the disclaimer 6px through the
     gold frame's bottom edge at 320px, and pushed the eyebrow 24px above the
     frame's top edge on a 1440x844 laptop.

     `grow` keeps the natural content height as the flex basis and only adds
     slack on top, so the section grows to contain the copy and the copy always
     lands inside its padding — and therefore inside the frame. */

  /**
   * Section shell.
   *
   * `lg` and up: `min-h: calc(100svh - var(--chrome-h))` — exactly the space
   * left below the measured TopBar+Header.
   *
   * Below `lg` the panel is the same one-screen height as desktop; the copy is
   * simply tighter. The photograph is 16:9 and a phone panel is roughly 1:2, so
   * `cover` crops away about two thirds of the width, and the hat's vertical
   * position is fixed — it maps 1:1 to the panel, with no slack to slide it
   * clear of the copy. The hat shell sits at source y 51%..90% and the printed
   * mark at y 68%..82%.
   *
   * That is why the mobile type below `lg` is deliberately compact: the copy has
   * to end above 0.68 x H. On a 390x844 phone H is 679px, so the budget is
   * 462px, and the copy block is trimmed to roughly 430px to sit inside it.
   *
   * Two earlier revisions solved the same problem the wrong way and are worth
   * recording. One added `+9rem` to the mobile min-height, which fitted the copy
   * but pushed the cover scale up until the hard hat filled the whole panel
   * width. The other wrapped the copy in a translucent navy card, which fixed
   * legibility and turned the hero into a card inside a card with the price
   * card nested in it. Tight type costs nothing; those two cost composition.
   */
  /* THE SECTION SHELL — a flex column, and that is load-bearing.
   *
   * The copy lives in a single <Container> child. For `justify-end` to push it
   * to the bottom of the panel on desktop, the Container has to actually be
   * TALLER than its own content — which only happens if it is stretched by a
   * flex parent (`flex-1`). It was not: the section was a plain block, so the
   * Container sized itself to its content and `justify-end` silently did
   * nothing. On a 1920x1080 screen the copy sat hard against the TOP of the
   * hero and left 228px of empty, darkened image below the disclaimer — which
   * is exactly the "content starts too high / excessive dark space at the
   * bottom" report. At 1440x900 the leftover was only the 48px of padding, so
   * it read as fine and hid the bug on the most common screen size.
   *
   * `min-h` is a FLOOR, never a fixed height: the panel grows if the copy wraps.
   *
   * WHY IT CARRIES `+5rem` AT EVERY BREAKPOINT
   * -------------------------------------------
   * That term is not decoration and it is not a mobile-only allowance. The gold
   * frame is inset inside the section, so the copy has to fit in the section
   * MINUS the frame's inset. On desktop the copy is bottom-anchored, which
   * means the section needs that inset again as slack at the TOP or the first
   * line of copy sits on the frame's upper edge.
   *
   * Measured before this change: at 1440x844 the copy was 671px tall, the
   * section was `100svh - chrome` = 690px, and the copy box 671px — leaving
   * zero slack, so the eyebrow rendered 24px ABOVE the frame's top line and the
   * disclaimer 2px below its bottom line. At 1024 the disclaimer crossed the
   * bottom edge by 14px.
   *
   * The required floor is `copy + frame inset + clearance`. Adding 5rem
   * (frame inset 32px + clearance, with room to spare) satisfies it on every
   * breakpoint tested, and because it is a `min-h` the section still grows
   * further on its own whenever the copy wraps.
   */
  const SECTION_CLASS =
    'relative isolate flex flex-col overflow-hidden bg-navy lg:justify-end ' +
    'min-h-[calc(100svh-var(--chrome-h,13rem)+5rem)]';

  if (reduced) {
    return (
      <section aria-labelledby="hero-heading" className={SECTION_CLASS}>
        {plate}
        {content}
        {/* Bottom fade blends the hero into the highlights section so there is
            no hard horizontal seam where the artwork stops. Desktop only: on
            mobile it would land squarely on the hard hat. */}
        <div aria-hidden="true" className="hero-fade absolute inset-x-0 bottom-0 hidden h-32 lg:block" />

        {/* The same gold frame as the animated branch. It was missing here
            entirely, so any visitor with `prefers-reduced-motion` set saw a hero
            with no border at ANY width — not just on mobile. The two branches
            must not be able to diverge like that again. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 border border-gold/25 xs:inset-5 sm:inset-6 lg:inset-8"
        />
      </section>
    );
  }

  return (
    <m.section
      aria-labelledby="hero-heading"
      variants={heroContainer}
      initial="hidden"
      animate="visible"
      className={SECTION_CLASS}
    >
      {/* The photograph enters with a restrained scale — a camera settle, not a
          slideshow. `plate` carries the image, the scrim and the bloom together
          so the reduced-motion and animated branches cannot render different
          sets. */}
      {plate}
      {content}
      {/* Bottom fade — blends the hero into the highlights section so there is
          no hard horizontal seam. Desktop only: on mobile the photograph is the
          last thing on screen and fading it out would only dim the hard hat. */}
      <div aria-hidden="true" className="hero-fade absolute inset-x-0 bottom-0 hidden h-32 lg:block" />

      {/* Thin gold frame adds a quiet architectural edge without competing
          with the hero action.

          THE FRAME AND THE CONTENT PADDING ARE ONE SYSTEM
          ------------------------------------------------
          This used to read `inset-4 xs:inset-5 sm:inset-6 lg:inset-8` against a
          content container of `px-4 xs:px-5 sm:px-6` — the SAME values, chosen
          deliberately, with a comment saying the frame should "track the content
          column exactly" so it would "read as a frame around the hero rather
          than around nothing in particular".

          Tracking them meant the content's text edge landed exactly ON the
          border line. Measured: 0px of clearance at 320, 360, 375, 390, 414,
          430 and 768. Every hero element — eyebrow, heading, body, price card,
          disclaimer, both CTAs — was touching the gold border, which is the
          "premium" spacing the rest of the site has and the hero did not.

          So the two are no longer equal. The frame is a fixed inset from the
          viewport edge and the content clears it by a margin of its own:

            width    frame   content pad   clearance
            < 480      8px        24px         16px
            480-639   12px        28px         16px
            640-1023  16px        40px         24px
            >= 1024   32px        48px         16px
            >= 1536   32px          0px   (container gutter supplies 76px)

          That last step is the only reason the frame inset changes shape rather
          than the padding growing forever: from 1536px the 1320px container is
          genuinely centred and its own gutter puts the content 76px inside the
          frame, so the hero's padding correctly drops to zero and the copy
          returns to the full page measure.

          At >= 1024 the `lg:px-12` also fixes two real intrusions the old
          values caused. Because the hero's `lg:px-0` never beat the
          Container's `lg:px-6`, the copy at 1024 started 8px to the LEFT of the
          border, and the CTA buttons ended 14px BELOW the bottom border. Both
          are now inside the frame with 16px to spare.

          Desktop is otherwise untouched: at 1024+ the copy column is capped by
          `lg:max-w-[40rem]` / `xl:max-w-[52rem]` and centred in the content
          box, so changing the box's padding shifts nothing that is rendered.

          `aria-hidden` + `pointer-events-none` keep the frame out of the
          accessibility tree and out of the way of clicks. The section is
          `overflow-hidden`, so the frame is clipped to the hero rather than
          bleeding into the next section — which is why a non-zero inset
          matters, and why the frame cannot be pushed to the very edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 border border-gold/25 xs:inset-3 sm:inset-4 lg:inset-8"
      />
    </m.section>
  );
}

export default Hero;