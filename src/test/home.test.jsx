import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import { ConsultationModalProvider } from '../components/forms/ConsultationContext.jsx';
import { Layout } from '../components/layout/Layout.jsx';
import { nav, headerCta } from '../data/home.js';
import { ROUTES } from '../config/site.js';
import { company } from '../config/company.js';

/**
 * ============================================================================
 * HOMEPAGE STRUCTURE TESTS
 * ============================================================================
 *
 * The rebuild brief says the homepage must retain the reference site's exact
 * section order and content. That is a testable contract, so it is tested:
 * every supplied heading is asserted present, in document order.
 *
 * The pending-copy slots are asserted too — not because they are wanted, but
 * because their presence proves the client can see at a glance which wording
 * still needs to come from the source site.
 */

function renderHome() {
  return render(
    <MemoryRouter>
      <ConsultationModalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </ConsultationModalProvider>
    </MemoryRouter>,
  );
}

/** The topbar lives in the shared Layout, so this test mounts the real shell. */
function renderShell() {
  return render(
    <MemoryRouter>
      <ConsultationModalProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Layout>
      </ConsultationModalProvider>
    </MemoryRouter>,
  );
}

describe('Homepage — reference section order', () => {
  it('renders substantial content with exactly one h1', () => {
    const { container } = renderHome();
    expect(container.textContent.length).toBeGreaterThan(800);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('renders every supplied heading in document order', () => {
    renderHome();

    const order = [
      'Your Dream Home. Our Commitment.', //  3. Hero
      'Quality Materials', //  4. Highlights
      'Complete Solutions for Your Home', //  5. Services
      'Building Better Tomorrows.', //  6. About
      'Your Project, Step by Step', //  7. Process
      'Rich Details. Thoughtful Living.', //  8. Interiors
      'Imagine the Possibilities', //  9. Gallery
      'Tell Us About Your Project.', //  10. Contact
    ];

    const text = document.body.textContent;
    let previousIndex = -1;
    for (const heading of order) {
      const index = text.indexOf(heading);
      expect(index, `"${heading}" should appear`).toBeGreaterThanOrEqual(0);
      expect(index, `"${heading}" should come after the previous section`).toBeGreaterThan(
        previousIndex,
      );
      previousIndex = index;
    }
  });

  it('keeps the promotional starting price and its disclaimer visible', () => {
    renderHome();

    // Must NOT be silently removed or altered — the brief is explicit.
    expect(screen.getByText(/construction starting price/i)).toBeInTheDocument();
    expect(screen.getByText(/₹1,799/)).toBeInTheDocument();
    expect(screen.getByText(/\/ sq\. ft\./)).toBeInTheDocument();

    // The disclaimer must be attached, not deferred to a footnote page.
    expect(
      screen.getByText(/final cost depends on the agreed scope/i),
    ).toBeInTheDocument();
  });

  it('presents the price as a STARTING price, never a quotation', () => {
    renderHome();
    const text = document.body.textContent;
    expect(text).toMatch(/starting price/i);
    expect(text).not.toMatch(/fixed price|guaranteed price|our rates/i);
  });

  it('renders all six services in the supplied order', () => {
    renderHome();
    const titles = [
      'Independent House Construction',
      'Complete Interior Solutions',
      'Modular Kitchens',
      'Elevation & Exterior Design',
      'Bathrooms & Fittings',
      'Lighting & Wardrobes',
    ];

    const text = document.body.textContent;
    let previous = -1;
    for (const title of titles) {
      const index = text.indexOf(title);
      expect(index, `${title} should appear`).toBeGreaterThanOrEqual(0);
      expect(index, `${title} should follow the previous service`).toBeGreaterThan(previous);
      previous = index;
    }
  });

  it('renders the four process steps in order', () => {
    renderHome();
    const steps = [
      'Share Your Vision',
      'Site Visit & Discussion',
      'Scope & Estimate',
      'Plan the Work',
    ];

    const text = document.body.textContent;
    let previous = -1;
    for (const step of steps) {
      const index = text.indexOf(step);
      expect(index, `${step} should appear`).toBeGreaterThanOrEqual(0);
      expect(index, `${step} should follow the previous step`).toBeGreaterThan(previous);
      previous = index;
    }
  });

  it('renders the four interior features', () => {
    renderHome();
    ['Modular Kitchens', 'Living Rooms', 'Bedrooms & Wardrobes', 'Lighting & Fittings'].forEach(
      (feature) => {
        expect(screen.getAllByText(feature).length).toBeGreaterThan(0);
      },
    );
  });

  it('renders the four supplied highlights', () => {
    renderHome();
    [
      ['Quality Materials', 'Thoughtful product selection'],
      ['Modern Designs', 'Style with functionality'],
      ['Construction & Interiors', 'One place to begin'],
      ['Hyderabad Service', 'Local project discussions'],
    ].forEach(([title, description]) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('keeps the hero CTAs and their exact labels', () => {
    renderHome();
    expect(
      screen.getByRole('link', { name: /discuss your project/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /explore our services/i }),
    ).toBeInTheDocument();
  });

  it('shows the topbar service message, location and clickable phone', () => {
    renderShell();
    expect(screen.getByText(/premium home construction & interiors/i)).toBeInTheDocument();
    // Appears in the topbar and again in the footer.
    expect(screen.getAllByText(/hyderabad, telangana/i).length).toBeGreaterThan(0);

    const tel = document.querySelector('a[href="tel:+919030425656"]');
    expect(tel, 'phone must be a real tel: link').not.toBeNull();
    expect(tel.textContent).toContain('9030425656');
  });

  it('labels the gallery visuals as development placeholders, not VNR projects', () => {
    renderHome();
    expect(
      screen.getByText(/not vnr project photography/i),
    ).toBeInTheDocument();

    // Alt text on every tile must not imply these are real completed projects.
    const galleryAlts = [...document.querySelectorAll('img')]
      .map((i) => i.getAttribute('alt') ?? '')
      .filter((alt) => alt.startsWith('Development visual'));
    expect(galleryAlts.length).toBeGreaterThan(0);
  });

  it('flags the copy that still needs to come from the source site', () => {
    renderHome();
    // These slots exist so the gap is visible rather than silently invented.
    const pending = screen.getAllByText(/awaiting the original wording/i);
    expect(pending.length).toBeGreaterThan(0);
  });
});

describe('Contact form', () => {
  it('shows the five supplied fields', () => {
    renderHome();

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service required/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project details/i)).toBeInTheDocument();
  });

  it('rejects an empty submit with visible, announced errors', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole('button', { name: /request a callback/i }));

    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/choose the service you need/i)).toBeInTheDocument();
  });

  it('validates the phone for Indian mobile numbers', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText(/your name/i), 'Anita Rao');
    await user.type(screen.getByLabelText(/phone number/i), '12345');
    await user.selectOptions(screen.getByLabelText(/service required/i), 'Modular Kitchens');
    await user.type(screen.getByLabelText(/project location/i), 'Gachibowli');
    await user.click(screen.getByRole('button', { name: /request a callback/i }));

    expect(
      await screen.findByText(/valid 10-digit indian mobile number/i),
    ).toBeInTheDocument();
  });

  it('never claims an enquiry was stored when nothing was sent', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText(/your name/i), 'Anita Rao');
    await user.type(screen.getByLabelText(/phone number/i), '9876543210');
    await user.selectOptions(screen.getByLabelText(/service required/i), 'Modular Kitchens');
    await user.type(screen.getByLabelText(/project location/i), 'Gachibowli');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /request a callback/i }));

    await screen.findByText(/one last step/i, {}, { timeout: 4000 });
    expect(document.body.textContent).not.toMatch(/enquiry received/i);
  });
});

describe('Navigation config', () => {
  it('exposes the five reference nav items and the consultation CTA', () => {
    expect(nav.map((n) => n.label)).toEqual([
      'Services',
      'About VNR',
      'Our Process',
      'Interiors',
      'Contact',
    ]);
    expect(headerCta).toEqual({ to: ROUTES.contact, label: 'Book a Consultation' });
  });

  it('points every nav item at a real route', () => {
    const valid = new Set(Object.values(ROUTES));
    nav.forEach((item) => {
      expect(valid.has(item.to), `${item.label} -> ${item.to}`).toBe(true);
    });
  });

  it('uses the confirmed phone and service area', () => {
    expect(company.phone.dial).toBe('+919030425656');
    expect(company.phone.needsConfirmation).toBe(false);
    expect(company.serviceAreas.list).toEqual(['Hyderabad', 'Telangana']);
  });
});