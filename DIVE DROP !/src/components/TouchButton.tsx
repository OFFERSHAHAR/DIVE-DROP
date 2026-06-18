import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/**
 * Touch Button Component
 * Touch-friendly button component optimized for mobile and iOS interfaces
 *
 * Features:
 * - Minimum touch target size of 44x44px (iOS HIG standard)
 * - Proper spacing between touch targets
 * - Haptic feedback ready properties
 * - Enhanced focus states for accessibility
 * - Touch-specific interactions and feedback
 * - Multiple size variants for different contexts
 */

const touchButtonVariants = cva(
  // Base styles with focus visible for accessibility
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 select-none touch-manipulation',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark focus-visible:ring-primary shadow-elevation-1 hover:shadow-elevation-2',
        secondary:
          'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-primary-dark focus-visible:ring-primary',
        outline:
          'border-2 border-border-primary text-text-primary hover:bg-bg-secondary active:bg-bg-secondary focus-visible:ring-primary',
        danger:
          'bg-error text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-error shadow-elevation-1',
        ghost:
          'text-text-primary hover:bg-bg-secondary active:bg-bg-secondary focus-visible:ring-primary',
        success:
          'bg-success text-white hover:bg-green-700 active:bg-green-800 focus-visible:ring-success shadow-elevation-1',
      },
      size: {
        // Minimum 44px height for touch targets (iOS HIG)
        sm: 'min-h-11 min-w-11 px-3 text-sm',
        md: 'min-h-12 min-w-12 px-4 text-base',
        lg: 'min-h-14 min-w-14 px-6 text-lg',
        xl: 'min-h-16 min-w-16 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      loading: {
        true: 'opacity-70 cursor-not-allowed',
      },
      isIcon: {
        true: 'rounded-full min-h-touch min-w-touch p-0',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
      isIcon: false,
    },
  }
);

export interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  /** Loading state with optional spinner */
  loading?: boolean;
  /** Button children */
  children: React.ReactNode;
  /** Icon button (circular with padding) */
  isIcon?: boolean;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Haptic feedback type (requires device support) */
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';
}

/**
 * Trigger haptic feedback if available
 * Works on iOS (webkit) and some Android devices
 */
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' | 'none') => {
  if (typeof window === 'undefined' || intensity === 'none') return;

  if (
    'vibrate' in navigator ||
    'webkitVibrate' in navigator ||
    'mozVibrate' in navigator
  ) {
    const pattern =
      intensity === 'light'
        ? 10
        : intensity === 'medium'
          ? 20
          : intensity === 'heavy'
            ? 40
            : 0;

    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    } else if ('webkitVibrate' in navigator) {
      (navigator as any).webkitVibrate(pattern);
    }
  }
};

/**
 * TouchButton component - touch-optimized button
 * @example
 * ```tsx
 * <TouchButton variant="primary" size="lg" fullWidth>
 *   Press Me
 * </TouchButton>
 * ```
 *
 * @example
 * ```tsx
 * <TouchButton
 *   isIcon
 *   variant="ghost"
 *   ariaLabel="Close menu"
 *   hapticFeedback="light"
 * >
 *   ✕
 * </TouchButton>
 * ```
 */
export const TouchButton = React.forwardRef<
  HTMLButtonElement,
  TouchButtonProps
>(
  (
    {
      variant,
      size,
      fullWidth,
      loading,
      isIcon,
      className,
      disabled,
      ariaLabel,
      hapticFeedback = 'medium',
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      triggerHaptic(hapticFeedback);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          touchButtonVariants({ variant, size, fullWidth, loading, isIcon }),
          className
        )}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-busy={loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

TouchButton.displayName = 'TouchButton';
