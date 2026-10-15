import '@testing-library/jest-dom/vitest';

/**
 * Vitest setup.
 *
 * jsdom does not implement several browser APIs the site relies on. Stubbing
 * them here keeps component tests focused on behaviour rather than polyfills.
 */

/* ---- IntersectionObserver ------------------------------------------- */
// Reveal and the floating action use it to gate reveal-on-scroll.
if (!globalThis.IntersectionObserver) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  globalThis.IntersectionObserver = MockIntersectionObserver;
}

/* ---- matchMedia ------------------------------------------------------- */
// useMediaQuery reads it. Defaults to "no match" so desktop-only branches that
// rely on media queries stay predictable in tests.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() { return false; },
  });
}

/* ---- scrollTo / scrollIntoView ---------------------------------------- */
window.scrollTo = window.scrollTo || (() => {});
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});

/* ---- requestAnimationFrame -------------------------------------------- */
globalThis.requestAnimationFrame =
  globalThis.requestAnimationFrame || ((cb) => setTimeout(() => cb(Date.now()), 0));
globalThis.cancelAnimationFrame =
  globalThis.cancelAnimationFrame || ((id) => clearTimeout(id));