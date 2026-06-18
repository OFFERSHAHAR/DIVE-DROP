import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-base disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap min-h-touch touch-target',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-elevation-1 hover:shadow-elevation-2 focus-visible:outline-accent',
        secondary:
          'bg-transparent border-2 border-primary text-primary hover:bg-blue-50 active:scale-95 dark:hover:bg-dark-surface focus-visible:outline-primary',
        outline: 'border-2 border-border-primary text-text-primary hover:bg-bg-secondary active:scale-95 focus-visible:outline-primary',
        danger: 'bg-error-hard text-white hover:bg-red-700 active:scale-95 shadow-elevation-1 hover:shadow-elevation-2 focus-visible:outline-error-hard',
        ghost: 'text-text-primary hover:bg-bg-secondary active:scale-95 focus-visible:outline-primary',
        success: 'bg-success-easy text-white hover:bg-green-700 active:scale-95 shadow-elevation-1 hover:shadow-elevation-2 focus-visible:outline-success-easy',
      },
      size: {
        sm: 'h-10 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      loading: {
        true: 'opacity-70 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, loading, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(buttonVariants({ variant, size, fullWidth, loading }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export default Button;
