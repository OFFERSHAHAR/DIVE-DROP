import React from 'react';
import { cn } from '@/utils/cn';

/**
 * SafeAreaView Component
 * Wrapper component for headers, footers, and fixed elements
 * Handles safe area insets for notches, home indicators, and dynamic islands
 *
 * Features:
 * - Automatic safe area padding for iOS and Android
 * - Support for top, bottom, left, right safe areas
 * - Fixed positioning support with safe area insets
 * - Proper z-index management
 * - Accessibility-first design
 */

export interface SafeAreaViewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children: React.ReactNode;
  /** Area to apply safe area insets */
  edges?: Array<'top' | 'bottom' | 'left' | 'right'> | 'all';
  /** Position type (static, fixed, absolute) */
  position?: 'static' | 'fixed' | 'absolute' | 'sticky';
  /** Align fixed content to edge */
  alignTo?: 'top' | 'bottom';
  /** Background color */
  background?: 'primary' | 'secondary' | 'transparent';
  /** Show border */
  border?: 'top' | 'bottom' | 'none';
  /** Shadow elevation */
  elevation?: 'none' | '1' | '2' | '3';
  /** Z-index layer */
  zIndex?: 'base' | 'dropdown' | 'sticky' | 'modal' | 'popover' | 'tooltip';
  /** Additional CSS classes */
  className?: string;
}

const edgesMap = {
  top: 'pt-safe-top',
  bottom: 'pb-safe-bottom',
  left: 'pl-safe-left',
  right: 'pr-safe-right',
};

const edgesAllMap = 'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right';

const backgroundMap = {
  primary: 'bg-bg-primary',
  secondary: 'bg-bg-secondary',
  transparent: 'bg-transparent',
};

const borderMap = {
  top: 'border-t border-border-primary',
  bottom: 'border-b border-border-primary',
  none: '',
};

const elevationMap = {
  none: '',
  '1': 'shadow-elevation-1',
  '2': 'shadow-elevation-2',
  '3': 'shadow-elevation-3',
};

const zIndexMap = {
  base: 'z-0',
  dropdown: 'z-dropdown',
  sticky: 'z-sticky',
  modal: 'z-modal',
  popover: 'z-popover',
  tooltip: 'z-tooltip',
};

const positionMap = {
  static: 'static',
  fixed: 'fixed',
  absolute: 'absolute',
  sticky: 'sticky',
};

/**
 * Get safe area edge classes
 */
const getSafeAreaEdges = (edges?: SafeAreaViewProps['edges']): string => {
  if (!edges) return '';
  if (edges === 'all') return edgesAllMap;
  if (Array.isArray(edges)) {
    return edges.map((edge) => edgesMap[edge]).join(' ');
  }
  return '';
};

/**
 * SafeAreaView component
 * @example
 * ```tsx
 * // Fixed header with top safe area
 * <SafeAreaView
 *   position="fixed"
 *   alignTo="top"
 *   edges={['top']}
 *   elevation="2"
 * >
 *   <h1>Header</h1>
 * </SafeAreaView>
 * ```
 *
 * @example
 * ```tsx
 * // Sticky footer with bottom safe area and border
 * <SafeAreaView
 *   position="sticky"
 *   alignTo="bottom"
 *   edges={['bottom']}
 *   border="top"
 *   elevation="1"
 * >
 *   <button>Action</button>
 * </SafeAreaView>
 * ```
 */
export const SafeAreaView = React.forwardRef<
  HTMLDivElement,
  SafeAreaViewProps
>(
  (
    {
      children,
      edges = 'all',
      position = 'static',
      alignTo,
      background = 'primary',
      border = 'none',
      elevation = 'none',
      zIndex = 'base',
      className,
      ...props
    },
    ref
  ) => {
    // Build position classes
    const positionClasses = {
      static: {},
      fixed: {
        top: alignTo === 'top' ? 'top-0 left-0 right-0' : 'bottom-0 left-0 right-0',
        bottom: 'bottom-0 left-0 right-0',
      },
      absolute: {
        top: alignTo === 'top' ? 'top-0 left-0 right-0' : 'bottom-0 left-0 right-0',
      },
      sticky: {
        top: alignTo === 'top' ? 'top-0' : 'bottom-0',
      },
    };

    const positionClass =
      position === 'static'
        ? ''
        : Array.isArray(positionClasses[position])
          ? (positionClasses[position] as string[]).join(' ')
          : ((positionClasses[position] as any)[alignTo || 'top']?.join(' ')) || '';

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'w-full',
          // Position
          positionMap[position] === 'fixed' && 'fixed',
          positionMap[position] === 'absolute' && 'absolute',
          positionMap[position] === 'sticky' && 'sticky',
          // Position alignment
          positionClass,
          // Safe area insets
          getSafeAreaEdges(edges),
          // Background
          backgroundMap[background],
          // Border
          borderMap[border],
          // Elevation/shadow
          elevationMap[elevation],
          // Z-index
          zIndexMap[zIndex],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SafeAreaView.displayName = 'SafeAreaView';

/**
 * Safe area inset context and hook
 * For getting safe area values in custom components
 */
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const SafeAreaContext = React.createContext<SafeAreaInsets>({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

/**
 * SafeAreaProvider - provides safe area insets to context
 * @example
 * ```tsx
 * <SafeAreaProvider>
 *   <App />
 * </SafeAreaProvider>
 * ```
 */
export const SafeAreaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [insets, setInsets] = React.useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  React.useEffect(() => {
    // Get safe area insets from CSS variables (set by viewport-fit)
    const getCSSVariable = (variable: string): number => {
      if (typeof window === 'undefined') return 0;
      const value = getComputedStyle(document.documentElement).getPropertyValue(
        variable
      );
      return parseInt(value) || 0;
    };

    const updateInsets = () => {
      setInsets({
        top: getCSSVariable('--safe-area-inset-top'),
        bottom: getCSSVariable('--safe-area-inset-bottom'),
        left: getCSSVariable('--safe-area-inset-left'),
        right: getCSSVariable('--safe-area-inset-right'),
      });
    };

    updateInsets();

    // Update on viewport changes
    window.addEventListener('resize', updateInsets);
    window.addEventListener('orientationchange', updateInsets);

    return () => {
      window.removeEventListener('resize', updateInsets);
      window.removeEventListener('orientationchange', updateInsets);
    };
  }, []);

  return (
    <SafeAreaContext.Provider value={insets}>
      {children}
    </SafeAreaContext.Provider>
  );
};

/**
 * useSafeAreaInsets hook - get safe area insets in components
 * @example
 * ```tsx
 * const { top, bottom } = useSafeAreaInsets();
 * ```
 */
export const useSafeAreaInsets = () => {
  const insets = React.useContext(SafeAreaContext);
  return insets;
};
