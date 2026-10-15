import { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn.js';

/**
 * ============================================================================
 * FORM FIELD PRIMITIVES
 * ============================================================================
 *
 * Accessibility contract enforced here once, rather than at every call site:
 *
 *  - Every control has a real <label htmlFor>.
 *  - Error text is referenced by aria-describedby AND marked role="alert", so
 *    it is announced when it appears.
 *  - aria-invalid is set on the control, not just styled.
 *  - Errors are never signalled by colour alone: there is an AlertCircle icon
 *    and the border thickens.
 *  - A 16px base font on inputs prevents iOS Safari auto-zoom on focus, which
 *    is one of the most common mobile form bugs.
 *  - Optional fields say so, rather than leaving users guessing.
 */

const CONTROL_BASE =
  'w-full min-h-12 rounded-sm border bg-field px-4 py-3 text-brand-black ' +
  'transition-colors duration-200 placeholder:text-text-muted ' +
  'focus:border-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-brand-gold-muted';

const CONTROL_ERROR = 'border-red-600 bg-red-50/40';
const CONTROL_OK = 'border-line';

export function Field({
  label,
  error,
  hint,
  required = false,
  optional = false,
  children,
  className,
  htmlFor,
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <label
        htmlFor={htmlFor}
        className="flex flex-wrap items-baseline gap-x-2 font-display text-sm font-semibold text-brand-black"
      >
        {label}
        {required ? (
          <span className="text-brand-gold-muted" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional && (
          <span className="text-fine font-normal text-text-muted">(optional)</span>
        )}
      </label>

      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="mt-1 text-fine text-text-muted">
          {hint}
        </p>
      )}

      <div className="mt-2">{children}</div>

      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-fine font-medium text-red-700"
        >
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({
  label,
  error,
  hint,
  required,
  optional,
  className,
  id: providedId,
  ...rest
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <Field
      label={label}
      error={error?.message}
      hint={hint}
      required={required}
      optional={optional}
      htmlFor={id}
      className={className}
    >
      <input
        id={id}
        // 16px minimum prevents iOS zoom-on-focus.
        style={{ fontSize: 'max(1rem, 16px)' }}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(CONTROL_BASE, error ? CONTROL_ERROR : CONTROL_OK)}
        {...rest}
      />
    </Field>
  );
}

export function Textarea({ label, error, hint, required, optional, className, id: providedId, rows = 4, ...rest }) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <Field
      label={label}
      error={error?.message}
      hint={hint}
      required={required}
      optional={optional}
      htmlFor={id}
      className={className}
    >
      <textarea
        id={id}
        rows={rows}
        style={{ fontSize: 'max(1rem, 16px)' }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(CONTROL_BASE, 'resize-y', error ? CONTROL_ERROR : CONTROL_OK)}
        {...rest}
      />
    </Field>
  );
}

export function Select({ label, error, hint, required, optional, className, id: providedId, children, ...rest }) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <Field
      label={label}
      error={error?.message}
      hint={hint}
      required={required}
      optional={optional}
      htmlFor={id}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          style={{ fontSize: 'max(1rem, 16px)' }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            CONTROL_BASE,
            'appearance-none pr-11',
            error ? CONTROL_ERROR : CONTROL_OK,
          )}
          {...rest}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold-muted"
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </Field>
  );
}

export default Input;