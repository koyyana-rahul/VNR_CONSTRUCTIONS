import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from '../components/common/Accordion.jsx';
import { contactFormSchema as consultationSchema } from '../utils/validation.js';

/**
 * ============================================================================
 * ANIMATED ACCORDION
 * ============================================================================
 *
 * The accordion was the one place the brief's "animate accordion height and
 * opacity" requirement was unmet — it used the `hidden` attribute, which makes
 * an element un-animatable. These tests lock in the replacement behaviour:
 * a collapsed panel must be invisible AND untabbable, or keyboard users fall
 * into hidden content.
 */

const ITEMS = [
  { id: 'a', question: 'First question', answer: 'First answer' },
  { id: 'b', question: 'Second question', answer: 'Second answer' },
  { id: 'c', question: 'Third question', answer: 'Third answer' },
];

describe('Accordion', () => {
  it('follows the WAI-ARIA APG pattern', () => {
    render(<Accordion items={ITEMS} defaultOpenIds={['a']} />);

    const first = screen.getByRole('button', { name: /first question/i });
    expect(first).toHaveAttribute('aria-expanded', 'true');

    // aria-controls must resolve to a real element.
    const panelId = first.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId)).not.toBeNull();

    // Panel is a labelled region.
    const region = document.getElementById(panelId);
    expect(region).toHaveAttribute('role', 'region');
    expect(region).toHaveAttribute('aria-labelledby', first.id);
  });

  it('makes a collapsed panel invisible and untabbable', () => {
    render(<Accordion items={ITEMS} defaultOpenIds={['a']} />);

    const closed = screen.getByRole('button', { name: /second question/i });
    const panel = document.getElementById(closed.getAttribute('aria-controls'));

    expect(closed).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    // `inert` removes collapsed content from the tab order. This is the
    // guarantee that a keyboard user cannot tab into a hidden answer.
    expect(panel).toHaveAttribute('inert');
  });

  it('removes inert from the panel once opened', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} defaultOpenIds={[]} />);

    const trigger = screen.getByRole('button', { name: /first question/i });
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));

    expect(panel).toHaveAttribute('inert');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('inert');
  });

  it('closes the previous answer when a new one opens (single mode)', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} defaultOpenIds={['a']} />);

    const second = screen.getByRole('button', { name: /second question/i });
    const first = screen.getByRole('button', { name: /first question/i });

    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports arrow, Home and End roving focus', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} />);

    const first = screen.getByRole('button', { name: /first question/i });
    const second = screen.getByRole('button', { name: /second question/i });
    const third = screen.getByRole('button', { name: /third question/i });

    await user.tab();
    expect(first).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(second).toHaveFocus();

    await user.keyboard('{End}');
    expect(third).toHaveFocus();

    // Wraps from last to first.
    await user.keyboard('{ArrowDown}');
    expect(first).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(third).toHaveFocus();

    await user.keyboard('{Home}');
    expect(first).toHaveFocus();
  });

  it('renders every answer in the DOM regardless of open state', () => {
    // Answers must exist for search engines and for no-JS readers; only
    // their visibility is animated.
    render(<Accordion items={ITEMS} defaultOpenIds={['a']} />);
    ITEMS.forEach((item) => {
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    });
  });
});

/* ==========================================================================
   CONTACT VALIDATION — regression cover for the rebuilt site
   ========================================================================== */

describe('contact validation', () => {
  const base = {
    fullName: 'Anita Rao',
    phone: '9876543210',
    service: 'Modular Kitchens',
    location: 'Gachibowli, Hyderabad',
    consent: true,
  };

  it('accepts the reference form fields', () => {
    expect(consultationSchema.safeParse(base).success).toBe(true);
  });

  it('requires every reference field marked required', () => {
    ['fullName', 'phone', 'service', 'location', 'consent'].forEach((field) => {
      // Drop the field under test to prove it is genuinely required.
      const rest = { ...base };
      delete rest[field];
      expect(consultationSchema.safeParse(rest).success, field).toBe(false);
    });
  });
});