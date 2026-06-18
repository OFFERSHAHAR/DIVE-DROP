import React, { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * FormPage - Complete form layout template
 *
 * Features:
 * - Responsive grid for form fields (1 col mobile → 2 col desktop)
 * - Proper spacing with Tailwind gap utilities
 * - Submit button (full width mobile, auto desktop)
 * - Error state handling with field-level and form-level errors
 * - Loading state management
 * - Safe area awareness
 * - Dark mode support
 * - Accessibility: labels, error messages, ARIA attributes
 * - Form field wrapper with validation styling
 */

interface FormFieldError {
  field: string;
  message: string;
}

export interface FormPageProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  errors?: FormFieldError[];
  formError?: string;
  successMessage?: string;
  cols?: 'single' | 'double';
  safeAreaInsets?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  className?: string;
}

/**
 * FormField - Wrapper for form inputs with validation
 */
export interface FormFieldProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  children: ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, label, error, required, helperText, className, children }, ref) => {
    return (
      <div ref={ref} className={clsx('flex flex-col gap-2', className)}>
        {label && (
          <label
            htmlFor={name}
            className={clsx(
              'text-sm font-semibold text-text-primary dark:text-text-primary-dark',
              required && "after:ml-1 after:text-error after:content-['*']"
            )}
          >
            {label}
          </label>
        )}

        {/* Children (input/textarea/select) */}
        <div className="flex flex-col gap-1">{children}</div>

        {/* Error message */}
        {error && (
          <p
            role="alert"
            className="text-xs font-semibold text-error dark:text-error-dark"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

/**
 * FormInput - Styled input component for use within FormField
 */
export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, className, disabled, ...props }, ref) => (
    <input
      ref={ref}
      disabled={disabled}
      className={clsx(
        'rounded-lg border-2 bg-white px-4 py-3 text-base transition-all dark:bg-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark',
        'placeholder:text-text-tertiary dark:placeholder:text-text-tertiary-dark',
        'disabled:bg-bg-secondary dark:disabled:bg-bg-secondary-dark disabled:cursor-not-allowed',
        error
          ? 'border-error focus:ring-error dark:border-error-dark'
          : 'border-border-primary hover:border-primary dark:border-border-secondary dark:hover:border-primary',
        className
      )}
      {...props}
    />
  )
);

FormInput.displayName = 'FormInput';

/**
 * FormTextarea - Styled textarea for use within FormField
 */
export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ error, className, disabled, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      disabled={disabled}
      rows={rows}
      className={clsx(
        'rounded-lg border-2 bg-white px-4 py-3 text-base font-normal transition-all dark:bg-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark',
        'placeholder:text-text-tertiary dark:placeholder:text-text-tertiary-dark',
        'disabled:bg-bg-secondary dark:disabled:bg-bg-secondary-dark disabled:cursor-not-allowed',
        'resize-none',
        error
          ? 'border-error focus:ring-error dark:border-error-dark'
          : 'border-border-primary hover:border-primary dark:border-border-secondary dark:hover:border-primary',
        className
      )}
      {...props}
    />
  )
);

FormTextarea.displayName = 'FormTextarea';

/**
 * FormSelect - Styled select for use within FormField
 */
export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ error, className, disabled, options, ...props }, ref) => (
    <select
      ref={ref}
      disabled={disabled}
      className={clsx(
        'rounded-lg border-2 bg-white px-4 py-3 text-base transition-all dark:bg-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark',
        'disabled:bg-bg-secondary dark:disabled:bg-bg-secondary-dark disabled:cursor-not-allowed',
        error
          ? 'border-error focus:ring-error dark:border-error-dark'
          : 'border-border-primary hover:border-primary dark:border-border-secondary dark:hover:border-primary',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
);

FormSelect.displayName = 'FormSelect';

/**
 * FormPage component - Main layout wrapper
 */
export const FormPage = React.forwardRef<HTMLFormElement, FormPageProps>(
  (
    {
      title,
      subtitle,
      description,
      children,
      onSubmit,
      submitText = 'Submit',
      cancelText = 'Cancel',
      onCancel,
      isLoading = false,
      errors = [],
      formError,
      successMessage,
      cols = 'single',
      safeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 },
      className,
    },
    ref
  ) => {
    const fieldErrors = errors.reduce(
      (acc, err) => {
        acc[err.field] = err.message;
        return acc;
      },
      {} as Record<string, string>
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await Promise.resolve(onSubmit(e));
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={clsx(
          'flex flex-col gap-6 bg-card px-4 py-6 dark:bg-card-dark sm:px-6 sm:py-8 md:px-8 md:py-10',
          className
        )}
        style={{
          paddingTop: `calc(1.5rem + ${safeAreaInsets.top}px)`,
          paddingBottom: `calc(1.5rem + ${safeAreaInsets.bottom}px)`,
          paddingLeft: `calc(1rem + ${safeAreaInsets.left}px)`,
          paddingRight: `calc(1rem + ${safeAreaInsets.right}px)`,
        }}
      >
        {/* Header section */}
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg font-semibold text-text-secondary dark:text-text-secondary-dark sm:text-base">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-base text-text-tertiary dark:text-text-tertiary-dark">
              {description}
            </p>
          )}
        </header>

        {/* Alerts */}
        {formError && (
          <div
            role="alert"
            className="rounded-lg border-l-4 border-error bg-error/10 p-4 text-error dark:border-error-dark dark:bg-error-dark/10 dark:text-error-dark"
          >
            <p className="font-semibold">{formError}</p>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-lg border-l-4 border-success bg-success/10 p-4 text-success dark:border-success-dark dark:bg-success-dark/10 dark:text-success-dark"
          >
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Form fields */}
        <fieldset disabled={isLoading} className="flex flex-col gap-4">
          <div
            className={clsx(
              'grid gap-4',
              cols === 'double'
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1'
            )}
          >
            {/* Inject FormFields with error state */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === FormField) {
                const typedChild = child as React.ReactElement<FormFieldProps>;
                return React.cloneElement(typedChild, {
                  error: fieldErrors[typedChild.props.name] || typedChild.props.error,
                });
              }
              return child;
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-lg border-2 border-border-primary bg-transparent px-6 py-3 font-semibold text-text-primary transition-all hover:bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-border-secondary dark:text-text-primary-dark dark:hover:bg-bg-secondary-dark sm:order-2"
              >
                {cancelText}
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                'w-full rounded-lg px-6 py-3 font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-dark sm:w-auto',
                'bg-primary hover:bg-primary-dark focus:ring-primary',
                onCancel && 'sm:order-3'
              )}
            >
              {isLoading ? 'Loading...' : submitText}
            </button>
          </div>
        </fieldset>
      </form>
    );
  }
);

FormPage.displayName = 'FormPage';

/**
 * Helper hook for form state management
 */
export const useFormState = (initialValues: Record<string, any> = {}) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<FormFieldError[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues((prev) => ({ ...prev, [name]: finalValue }));
    // Clear error for this field when user starts typing
    setErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const setFieldError = (field: string, message: string) => {
    setErrors((prev) => [
      ...prev.filter((err) => err.field !== field),
      { field, message },
    ]);
  };

  const clearErrors = () => setErrors([]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    isLoading,
    setIsLoading,
    handleChange,
    setFieldError,
    clearErrors,
  };
};
