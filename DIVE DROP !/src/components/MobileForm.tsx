import React, { useState } from 'react';
import { cn } from '@/utils/cn';

/**
 * Mobile Form Component
 * Form component optimized for mobile input and touch interactions
 *
 * Features:
 * - Proper input mode handling (email, number, tel, url, etc.)
 * - Zoom prevention on input focus (iOS)
 * - Touch-friendly form controls with minimum 44px targets
 * - Proper spacing for mobile keyboards
 * - Error state management
 * - Accessible label associations
 * - Auto-complete and password management
 */

export interface FormFieldProps {
  /** Field name */
  name: string;
  /** Field label */
  label: string;
  /** Input type with mobile-specific modes */
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'url'
    | 'password'
    | 'search'
    | 'date'
    | 'time';
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Is required field */
  required?: boolean;
  /** Help text below field */
  helpText?: string;
  /** Input mode for better mobile keyboard */
  inputMode?:
    | 'text'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  /** Auto-complete hint */
  autoComplete?: string;
  /** Field value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Additional class name */
  className?: string;
  /** Max length */
  maxLength?: number;
  /** Min length */
  minLength?: number;
  /** Pattern for validation */
  pattern?: string;
  /** Disable field */
  disabled?: boolean;
  /** Read only field */
  readOnly?: boolean;
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Form fields */
  fields?: FormFieldProps[];
  /** Submit button text */
  submitText?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Additional submit button classes */
  submitButtonClass?: string;
  /** Form submission handler */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Children (alternative to fields prop) */
  children?: React.ReactNode;
  /** Additional class name */
  className?: string;
}

/**
 * FormField component - individual form field
 */
export const FormField = React.forwardRef<
  HTMLInputElement,
  FormFieldProps
>(
  (
    {
      name,
      label,
      type = 'text',
      placeholder,
      error,
      required,
      helpText,
      inputMode,
      autoComplete,
      value,
      onChange,
      onBlur,
      className,
      maxLength,
      minLength,
      pattern,
      disabled,
      readOnly,
    },
    ref
  ) => {
    const fieldId = `field-${name}`;
    const errorId = error ? `${fieldId}-error` : undefined;
    const helpId = helpText ? `${fieldId}-help` : undefined;

    // Determine input mode based on type
    const getInputMode = (): FormFieldProps['inputMode'] => {
      if (inputMode) return inputMode;
      switch (type) {
        case 'email':
          return 'email';
        case 'tel':
          return 'tel';
        case 'number':
          return 'numeric';
        case 'url':
          return 'url';
        case 'search':
          return 'search';
        default:
          return 'text';
      }
    };

    // Determine auto-complete value
    const getAutoComplete = (): string => {
      if (autoComplete) return autoComplete;
      switch (type) {
        case 'email':
          return 'email';
        case 'tel':
          return 'tel';
        case 'password':
          return 'current-password';
        case 'url':
          return 'url';
        default:
          return 'off';
      }
    };

    return (
      <div className="mb-5 flex flex-col gap-1">
        <label
          htmlFor={fieldId}
          className="text-sm font-semibold text-text-primary block"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>

        <input
          ref={ref}
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          inputMode={getInputMode()}
          autoComplete={getAutoComplete()}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId || helpId}
          // Zoom prevention: minimum font size of 16px prevents iOS zoom
          className={cn(
            'w-full min-h-touch px-4 py-3 text-base bg-bg-primary rounded-lg',
            'border-2 border-border-primary text-text-primary',
            'transition-all duration-200',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20',
            'disabled:bg-bg-secondary disabled:text-text-secondary disabled:cursor-not-allowed',
            'placeholder:text-text-secondary',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
        />

        {error && (
          <span id={errorId} className="text-xs text-error font-medium">
            {error}
          </span>
        )}

        {helpText && !error && (
          <span id={helpId} className="text-xs text-text-secondary">
            {helpText}
          </span>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

/**
 * MobileForm component - form optimized for mobile
 * @example
 * ```tsx
 * const [formData, setFormData] = useState({});
 *
 * <MobileForm
 *   title="Login"
 *   description="Enter your credentials"
 *   onSubmit={(e) => {
 *     e.preventDefault();
 *     // Handle submission
 *   }}
 * >
 *   <FormField
 *     name="email"
 *     label="Email"
 *     type="email"
 *     required
 *   />
 *   <FormField
 *     name="password"
 *     label="Password"
 *     type="password"
 *     required
 *   />
 * </MobileForm>
 * ```
 */
export const MobileForm = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      title,
      description,
      fields,
      submitText = 'Submit',
      isLoading = false,
      submitButtonClass,
      onSubmit,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <form
        ref={ref}
        onSubmit={onSubmit}
        className={cn('w-full', className)}
        // Prevent zoom on input focus by setting viewport appropriately
        {...props}
      >
        {title && (
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-text-secondary mb-6">{description}</p>
        )}

        {/* Render fields if provided */}
        {fields && (
          <div className="space-y-0">
            {fields.map((field) => (
              <FormField key={field.name} {...field} />
            ))}
          </div>
        )}

        {/* Render children for custom field layouts */}
        {children && <div>{children}</div>}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full min-h-touch mt-8 px-6 py-3 text-base font-semibold',
            'bg-primary text-white rounded-lg',
            'transition-all duration-200',
            'hover:bg-primary-dark active:scale-95 active:bg-primary-dark',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2',
            submitButtonClass
          )}
        >
          {isLoading ? (
            <>
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
              Processing...
            </>
          ) : (
            submitText
          )}
        </button>
      </form>
    );
  }
);

MobileForm.displayName = 'MobileForm';
