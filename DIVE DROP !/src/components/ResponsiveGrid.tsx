import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Responsive Grid Component
 * Grid layout that adapts to breakpoints:
 * - Mobile: 1 column (320px - 640px)
 * - Tablet: 2 columns (640px - 1024px)
 * - Desktop: 3+ columns (1024px+)
 *
 * Features:
 * - Responsive column count based on screen size
 * - Configurable gap spacing
 * - Auto-fit and auto-fill modes
 * - Custom breakpoint behavior
 * - Proper aspect ratio support
 */

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children: React.ReactNode;
  /** Number of columns to span (for desktop) */
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Span on tablet breakpoint */
  spanMd?: 1 | 2 | 3 | 4;
  /** Span on mobile breakpoint */
  spanSm?: 1 | 2;
  /** Additional CSS classes */
  className?: string;
}

export interface ResponsiveGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children: React.ReactNode;
  /** Number of columns (desktop) */
  columns?: 2 | 3 | 4 | 6;
  /** Columns on tablet (md breakpoint) */
  columnsMd?: 2 | 3;
  /** Columns on mobile (sm breakpoint) */
  columnsSm?: 1 | 2;
  /** Gap between grid items */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Auto-fit mode (items fill available space) */
  autoFit?: boolean;
  /** Responsive variant (default: 'balanced') */
  variant?: 'balanced' | 'compact' | 'spacious' | 'cards';
  /** Minimum item width for auto-fit */
  minItemWidth?: string;
  /** Additional CSS classes */
  className?: string;
}

const gapMap = {
  xs: 'gap-2',
  sm: 'gap-3 md:gap-4',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8',
  xl: 'gap-8 md:gap-10',
};

const variantMap = {
  balanced: {
    sm: 'grid-cols-1',
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-3',
    gap: 'gap-4 md:gap-6',
  },
  compact: {
    sm: 'grid-cols-1',
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-4',
    gap: 'gap-2 md:gap-3',
  },
  spacious: {
    sm: 'grid-cols-1',
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-2',
    gap: 'gap-6 md:gap-8',
  },
  cards: {
    sm: 'grid-cols-1',
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-3',
    gap: 'gap-4 md:gap-6',
  },
};

const spanMap = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  6: 'col-span-6',
  12: 'col-span-12',
};

const spanMdMap = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
};

const spanSmMap = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
};

/**
 * GridItem component - individual grid item with responsive spanning
 * @example
 * ```tsx
 * <GridItem span={2} spanMd={1}>
 *   Content that spans 2 cols on desktop, 1 on tablet
 * </GridItem>
 * ```
 */
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    { children, span = 1, spanMd, spanSm, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          spanMap[span],
          spanMd && spanMdMap[spanMd],
          spanSm && spanSmMap[spanSm],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';

/**
 * ResponsiveGrid component - responsive grid layout
 * @example
 * ```tsx
 * <ResponsiveGrid columns={3} gap="md" variant="cards">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ResponsiveGrid>
 * ```
 *
 * @example
 * ```tsx
 * // Fully responsive with different column counts per breakpoint
 * <ResponsiveGrid columnsSm={1} columnsMd={2} columns={3} gap="lg">
 *   <GridItem>Item 1</GridItem>
 *   <GridItem span={2}>Item 2 (spans 2 cols on desktop)</GridItem>
 * </ResponsiveGrid>
 * ```
 */
export const ResponsiveGrid = React.forwardRef<
  HTMLDivElement,
  ResponsiveGridProps
>(
  (
    {
      children,
      columns = 3,
      columnsMd = 2,
      columnsSm = 1,
      gap = 'md',
      autoFit = false,
      variant = 'balanced',
      minItemWidth = '250px',
      className,
      ...props
    },
    ref
  ) => {
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
    };

    const mdColumnClasses = {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
    };

    const smColumnClasses = {
      1: 'sm:grid-cols-1',
      2: 'sm:grid-cols-2',
    };

    // Build grid template
    const gridClasses = autoFit
      ? `grid auto-fit gap-4`
      : cn(
          'grid',
          columnClasses[columnsSm as keyof typeof columnClasses],
          mdColumnClasses[columnsMd as keyof typeof mdColumnClasses],
          columnClasses[columns as keyof typeof columnClasses] || 'lg:grid-cols-3',
          gapMap[gap]
        );

    return (
      <div
        ref={ref}
        className={cn(
          gridClasses,
          // Auto-fit CSS Grid if enabled
          autoFit && 'auto-cols-fr',
          className
        )}
        style={
          autoFit
            ? {
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
                gap: gap === 'xs' ? '8px' : gap === 'sm' ? '12px' : gap === 'md' ? '16px' : gap === 'lg' ? '24px' : '32px',
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = 'ResponsiveGrid';

/**
 * useGridBreakpoint hook - determine current grid columns
 * Useful for dynamic item rendering based on breakpoint
 */
export const useGridBreakpoint = () => {
  const [columns, setColumns] = React.useState<1 | 2 | 3>(1);

  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();

    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(document.documentElement);

    window.addEventListener('resize', updateColumns);

    return () => {
      window.removeEventListener('resize', updateColumns);
      resizeObserver.disconnect();
    };
  }, []);

  return columns;
};
