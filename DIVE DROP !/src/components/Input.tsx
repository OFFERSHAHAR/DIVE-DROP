import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth, className, id, type, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;

    // Set inputmode and autocomplete based on type
    const getInputAttributes = (): React.InputHTMLAttributes<HTMLInputElement> => {
      switch (type) {
        case 'email':
          return { inputMode: 'email', autoComplete: 'email' };
        case 'password':
          return { autoComplete: 'current-password' };
        case 'tel':
          return { inputMode: 'tel', autoComplete: 'tel' };
        case 'url':
          return { inputMode: 'url', autoComplete: 'url' };
        case 'number':
          return { inputMode: 'numeric', autoComplete: 'off' };
        default:
          return {};
      }
    };

    const inputAttributes = getInputAttributes();

    return (
      <div className={clsx('w-full', { 'w-full': fullWidth })}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-primary dark:text-text-light mb-2"
          >
            {label}
            {props.required && <span className="text-error-hard ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={clsx(
            'w-full px-4 py-3 h-11 rounded-md text-sm sm:text-base font-body transition-all duration-base',
            'border-2 bg-bg-primary dark:bg-dark-surface text-text-primary dark:text-text-light placeholder-text-tertiary dark:placeholder-text-secondary',
            'focus-visible:outline-none focus-visible:border-primary dark:focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-primary/20',
            'touch-target min-h-touch',
            {
              'border-border-primary dark:border-border-dark focus-visible:border-primary': !error,
              'border-error-hard dark:border-error-hard focus-visible:border-error-hard focus-visible:ring-error-hard/20':
                error,
            },
            'disabled:bg-disabled/10 disabled:text-text-tertiary disabled:border-border-primary/50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...inputAttributes}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs sm:text-sm text-error-hard mt-2">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs sm:text-sm text-text-tertiary dark:text-text-secondary mt-2">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, fullWidth, className, id, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;
    return (
      <div className={clsx('w-full', { 'w-full': fullWidth })}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-primary dark:text-text-light mb-2"
          >
            {label}
            {props.required && <span className="text-error-hard ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-4 py-3 rounded-md text-sm sm:text-base font-body transition-all duration-base',
            'border-2 bg-bg-primary dark:bg-dark-surface text-text-primary dark:text-text-light placeholder-text-tertiary dark:placeholder-text-secondary',
            'focus-visible:outline-none focus-visible:border-primary dark:focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-primary/20',
            'resize-none min-h-32',
            {
              'border-border-primary dark:border-border-dark focus-visible:border-primary': !error,
              'border-error-hard dark:border-error-hard focus-visible:border-error-hard focus-visible:ring-error-hard/20':
                error,
            },
            'disabled:bg-disabled/10 disabled:text-text-tertiary disabled:border-border-primary/50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs sm:text-sm text-error-hard mt-2">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs sm:text-sm text-text-tertiary dark:text-text-secondary mt-2">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default Input;
