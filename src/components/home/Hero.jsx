import { m, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
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
 *   The supplied composition puts the copy on the LEFT and lets the
 *   architectural artwork show on the RIGHT, so the panel is a two-column
 *   split rather than a full-bleed wash. Below `lg` the copy spans the full
 *   width and `.hero-overlay` switches to a vertical scrim (see index.css) so
 *   the text stays readable against any part of the image.
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

  const image = (
    <img
      src={hero.image}
      alt="Development visual: a lit residential elevation at dusk. Stands in for the supplied VNR interiors promotional image."
      width="1920"
      height="1280"
      fetchPriority="high"
      decoding="sync"
      className="absolute inset-0 h-full w-full object-cover object-[78%_center] lg:object-center"
    />
  );

  const overlay = <div aria-hidden="true" className="hero-overlay absolute inset-0" />;

  // Atmospheric warm light behind the copy.
  //
  // On phones the hero copy fills almost the full panel, so the backdrop is
  // only visible in a narrow band behind the header and the section reads flat.
  // A single large radial bloom gives the composition warm depth at any width
  // and costs one composited element — no filter, no repaint on scroll.
  const bloom = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-32 -left-28 size-[30rem] rounded-full opacity-90 sm:size-[40rem] sm:-bottom-40 sm:-left-32 lg:-left-24"
      style={{
        background:
          'radial-gradient(circle, rgb(217 173 69 / 0.16) 0%, rgb(217 173 69 / 0.05) 42%, transparent 68%)',
      }}
    />
  );

  const content = (
    <Container size="page" className="relative z-10 flex w-full flex-col justify-end py-14 pb-24 sm:py-16 sm:pb-20 lg:py-20 lg:pb-20">
      <div className="max-w-[42rem]">
        <m.p variants={heroItem} className="eyebrow text-gold">
          {hero.eyebrow}
        </m.p>

        {/* "Our Commitment." carries the champagne accent. The explicit space
            between the spans keeps the accessible name of the <h1> correct —
            without it a screen reader reads "Home.Our Commitment." */}
        <m.h1
          id="hero-heading"
          className="mt-6 font-display text-hero font-bold text-white"
        >
          <m.span variants={heroLine} className="block">
            Your Dream Home.
          </m.span>
          {' '}
          <m.span variants={heroLine} className="block">
            Our <span className="text-gold-light">Commitment.</span>
          </m.span>
        </m.h1>

        <m.p
          variants={heroItem}
          className="mt-7 max-w-[46ch] text-lead text-text-secondary"
        >
          {hero.body}
        </m.p>

        {/* ---- Promotional starting price ---- */}
        <m.div
          variants={heroItem}
          className="mt-8 inline-flex flex-col gap-1 rounded-sm border border-gold-medium bg-navy/45 px-5 py-3.5 backdrop-blur-sm"
        >
          <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
            {promo.label}
          </span>
          <span className="font-display text-2xl font-bold tabular-nums text-gold-light sm:text-3xl">
            {formatINR(promo.rate).replace('₹', '₹')}
            <span className="ml-1.5 text-base font-normal text-text-secondary">
              {promo.unit}
            </span>
          </span>
        </m.div>

        <m.div
          variants={heroItem}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
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
            className="sm:w-auto"
            icon={<ArrowRight className="size-4" />}
          >
            {hero.secondaryCta}
          </Button>
        </m.div>

        {/* The disclaimer is permanently attached to the price.
            `pe-14` on mobile keeps the last line clear of the floating action,
            which sits bottom-right; `sm:pe-0` once the FAB is higher up and the
            hero has more horizontal room. */}
        <m.p
          variants={heroItem}
          className="mt-4 max-w-[42ch] pe-14 text-fine text-text-muted sm:pe-0"
        >
          {promo.disclaimer}
        </m.p>
      </div>
    </Container>
  );

  if (reduced) {
    return (
      <section
        aria-labelledby="hero-heading"
        className="relative isolate min-h-[32rem] overflow-hidden bg-navy sm:min-h-[36rem] lg:min-h-[42rem]"
      >
        {image}
        {overlay}
        {bloom}
        <div aria-hidden="true" className="hero-fade absolute inset-x-0 bottom-0 h-40" />
        {content}
      </section>
    );
  }

  return (
    <m.section
      aria-labelledby="hero-heading"
      variants={heroContainer}
      initial="hidden"
      animate="visible"
      className="relative isolate min-h-[32rem] overflow-hidden bg-navy sm:min-h-[36rem] lg:min-h-[42rem]"
    >
      {/* Backdrop enters with a restrained scale — reads as a camera settle. */}
      <m.div variants={heroBackdrop} className="absolute inset-0">
        {image}
      </m.div>
      {overlay}
      {bloom}
      {/* Bottom fade — blends the hero into the highlights section so there is
          no hard horizontal seam where the artwork stops. */}
      <div aria-hidden="true" className="hero-fade absolute inset-x-0 bottom-0 h-40" />
      {content}

      {/* Thin gold frame — the decorative edge the brief asks for. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 hidden border border-gold/25 sm:block lg:inset-8"
      />

      <m.a
        href="#highlights"
        aria-label="Scroll to highlights"
        variants={heroItem}
        className="absolute bottom-6 right-5 hidden size-11 place-items-center rounded-full border border-gold-medium text-gold transition-colors hover:border-gold hover:text-gold-light sm:grid lg:bottom-10 lg:right-10"
      >
        <ChevronDown
          className="size-4 motion-safe:animate-bounce"
          aria-hidden="true"
        />
      </m.a>
    </m.section>
  );
}

export default Hero;