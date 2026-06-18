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
      <div className={clsx({ 'w-full': fullWidth })}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={clsx(
            'w-full px-4 py-3.5 rounded-md text-base font-body transition-all duration-200',
            'border-2 bg-white text-text-primary placeholder-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            {
              'border-border-primary focus:border-primary focus:ring-primary': !error,
              'border-error focus:border-error focus:ring-error': error,
            },
            'disabled:bg-bg-tertiary disabled:text-text-tertiary disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...inputAttributes}
          {...props}
        />
        {error && <p id={errorId} className="text-sm text-error mt-2">{error}</p>}
        {helperText && !error && <p className="text-sm text-text-tertiary mt-2">{helperText}</p>}
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
      <div className={clsx({ 'w-full': fullWidth })}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-4 py-3.5 rounded-md text-base font-body transition-all duration-200',
            'border-2 bg-white text-text-primary placeholder-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'resize-none',
            {
              'border-border-primary focus:border-primary focus:ring-primary': !error,
              'border-error focus:border-error focus:ring-error': error,
            },
            'disabled:bg-bg-tertiary disabled:text-text-tertiary disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        {error && <p id={errorId} className="text-sm text-error mt-2">{error}</p>}
        {helperText && !error && <p className="text-sm text-text-tertiary mt-2">{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default Input;
