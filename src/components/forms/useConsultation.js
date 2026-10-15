import { useContext } from 'react';
import { ConsultationModalContext } from './consultationModalContext.js';

/**
 * Access the consultation modal from anywhere in the tree.
 *
 *   const { open } = useConsultation();
 *   <Button onClick={() => open()}>Get a Free Consultation</Button>
 *
 * Lives in its own module so that importing the hook does not pull the dialog
 * component (and its form dependencies) into the consumer's chunk.
 *
 * Throws a descriptive error when used outside the provider — a silent no-op
 * would be a genuinely confusing bug to track down.
 */
export function useConsultation() {
  const ctx = useContext(ConsultationModalContext);
  if (!ctx) {
    throw new Error('useConsultation must be used inside <ConsultationModalProvider>');
  }
  return ctx;
}

export default useConsultation;