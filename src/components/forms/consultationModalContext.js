import { createContext } from 'react';

/**
 * The context object itself, in its own module.
 *
 * Keeping it separate from the provider satisfies react-refresh's rule that a
 * file must export only components (context objects are not components), and
 * it means useConsultation.js can read the context without pulling in the
 * provider or the dialog.
 *
 * The default value is `null` rather than a stub object, so a component used
 * outside its provider fails loudly instead of silently no-opping.
 */
export const ConsultationModalContext = createContext(null);

export default ConsultationModalContext;