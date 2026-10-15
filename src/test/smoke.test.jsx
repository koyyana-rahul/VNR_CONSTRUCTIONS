import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  HomePage,
  Services,
  About,
  ProcessPage,
  InteriorsPage,
  Contact,
  NotFoundPage,
} from '../pages-registry.js';
import { ConsultationModalProvider } from '../components/forms/ConsultationContext.jsx';

/**
 * ============================================================================
 * RENDER SMOKE TESTS
 * ============================================================================
 *
 * These exist because a single undefined property in a card previously blanked
 * the ENTIRE site — React unmounted the tree, #root stayed empty, and the only
 * symptom in a browser was a white page. A render test catches that instantly
 * and names the component.
 *
 * Every page renders inside the same provider stack the real app uses, so a
 * component reaching for useConsultation() outside its provider fails here
 * rather than in production.
 */

function renderPage(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ConsultationModalProvider>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </ConsultationModalProvider>
    </MemoryRouter>,
  );
}

const PAGES = [
  ['HomePage', <HomePage key="h" />],
  ['Services', <Services key="s" />],
  ['About', <About key="a" />],
  ['ProcessPage', <ProcessPage key="p" />],
  ['InteriorsPage', <InteriorsPage key="i" />],
  ['Contact', <Contact key="c" />],
  ['NotFoundPage', <NotFoundPage key="n" />, 200],
];

describe('every page renders without crashing', () => {
  it.each(PAGES)('%s has exactly one h1 and substantial content', (_name, element, min = 300) => {
    const { container } = renderPage(element);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(container.textContent.length).toBeGreaterThan(min);
  });
});

describe('Home renders without crashing', () => {
  it('renders all eleven reference sections', () => {
    const { container } = renderPage(<HomePage />);
    const text = container.textContent;

    [
      // 1-2 are in Layout, 11 is the footer
      'Your Dream Home. Our Commitment.', // 3 Hero
      'Quality Materials', // 4 Highlights
      'Complete Solutions for Your Home', // 5 Services
      'Building Better Tomorrows.', // 6 About
      'Your Project, Step by Step', // 7 Process
      'Rich Details. Thoughtful Living.', // 8 Interiors
      'Imagine the Possibilities', // 9 Gallery
      'Tell Us About Your Project.', // 10 Contact
    ].forEach((heading) => {
      expect(text, heading).toContain(heading);
    });
  });

  it('publishes no fabricated statistics', () => {
    const { container } = renderPage(<HomePage />);
    const text = container.textContent;

    // Patterns that would indicate invented "500+ projects" style claims.
    expect(text).not.toMatch(/\d+\+\s*(projects|homes|buildings|clients)/i);
    expect(text).not.toMatch(/\d+\s*years of experience/i);
    expect(text).not.toMatch(/\d+(\.\d+)?%\s*(on time|happy|satisfaction)/i);
  });

  it('does not present development visuals as completed projects', () => {
    const { container } = renderPage(<HomePage />);
    expect(container.textContent).toMatch(/not vnr project photography/i);
  });
});