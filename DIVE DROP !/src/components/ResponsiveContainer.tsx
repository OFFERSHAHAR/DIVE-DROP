import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Responsive Container Component
 * Handles safe area padding and viewport fitting for iOS and Android devices
 *
 * Features:
 * - Automatic safe area inset padding
 * - Responsive max-width based on breakpoints
 * - Flexible padding options
 * - Support for full bleed mode (no max-width)
 * - Proper viewport fitting for notches and home indicators
 */

export interface ResponsiveContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children: React.ReactNode;
  /** Enable safe area insets (default: true) */
  safeArea?: boolean;
  /** Full width without max-width constraint (default: false) */
  fullBleed?: boolean;
  /** Horizontal padding (default: 'sm') */
  px?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Vertical padding (default: 'md') */
  py?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Responsive variant (default: 'default') */
  variant?: 'default' | 'content' | 'compact';
  /** Additional CSS classes */
  className?: string;
}

const paddingMap = {
  xs: 'px-2 py-2',
  sm: 'px-4 py-4',
  md: 'px-4 py-6 md:px-6',
  lg: 'px-6 py-8 md:px-8',
  xl: 'px-8 py-10 md:px-10',
};

const maxWidthMap = {
  default: 'max-w-4xl',
  content: 'max-w-3xl',
  compact: 'max-w-2xl',
};

/**
 * ResponsiveContainer component
 * @example
 * ```tsx
 * <ResponsiveContainer safeArea>
 *   <h1>Main Content</h1>
 * </ResponsiveContainer>
 * ```
 */
export const ResponsiveContainer = React.forwardRef<
  HTMLDivElement,
  ResponsiveContainerProps
>(
  (
    {
      children,
      safeArea = true,
      fullBleed = false,
      px = 'sm',
      py = 'md',
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'w-full mx-auto',
          // Safe area insets (CSS vars from tailwind config)
          safeArea && 'pt-safe-top pb-safe-bottom',
          // Padding
          paddingMap[px],
          // Max width constraint
          !fullBleed && maxWidthMap[variant],
          // Custom class name
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';
