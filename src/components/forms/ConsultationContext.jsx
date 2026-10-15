import { useCallback, useMemo, useState } from 'react';
import { ConsultationModalContext } from './consultationModalContext.js';

/**
 * ============================================================================
 * CONSULTATION MODAL PROVIDER
 * ============================================================================
 *
 * Mounts the quick-capture dialog as a sibling of the page content, so it is
 * never inside a route's <main> and therefore never affects document flow.
 *
 * Renders nothing until it is actually opened. The dialog itself is lazy, so
 * it is not part of the initial bundle.
 *
 * The context object lives in ./consultationModalContext.js and the consumer
 * hook in ./useConsultation.js, so this file exports only a component and Vite
 * Fast Refresh keeps working.
 *
 *   const { open } = useConsultation();
 *   <Button onClick={() => open()}>Get a Free Consultation</Button>
 */
export function ConsultationModalProvider({ children, renderModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);

  const open = useCallback((values = null) => {
    setPrefill(values);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Discard the prefill so the next open starts clean.
    setPrefill(null);
  }, []);

  const value = useMemo(
    () => ({ open, close, isOpen, prefill }),
    [open, close, isOpen, prefill],
  );

  return (
    <ConsultationModalContext.Provider value={value}>
      {children}
      {renderModal?.({ isOpen, close, prefill })}
    </ConsultationModalContext.Provider>
  );
}

export default ConsultationModalProvider;