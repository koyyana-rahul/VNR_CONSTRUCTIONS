import { Container } from './Container.jsx';

/**
 * Suspense fallback for lazily-loaded routes.
 *
 * Reserves a realistic amount of vertical space so the layout does not jump
 * when the route chunk arrives, and announces itself politely so a screen
 * reader user knows content is on the way.
 */
export function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[60vh] items-center justify-center py-24"
    >
      <Container size="page">
        <p className="text-center text-fine text-text-muted">
          <span className="eyebrow eyebrow--center">Loading</span>
        </p>
      </Container>
    </div>
  );
}

export default RouteFallback;