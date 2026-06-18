import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
        secondary:
          'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        outline: 'border-2 border-border-primary text-text-primary hover:bg-bg-secondary focus:ring-primary',
        danger: 'bg-error text-white hover:bg-red-700 focus:ring-error',
        ghost: 'text-text-primary hover:bg-bg-secondary focus:ring-primary',
        success: 'bg-success text-white hover:bg-green-700 focus:ring-success',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
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
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, loading, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(buttonVariants({ variant, size, fullWidth, loading }), className)}
      disabled={disabled || loading}
      {...props}
    />
  )
);

Button.displayName = 'Button';
