/**
 * Responsive Mobile Components - DiveDrop
 * iOS/Android-friendly components optimized for touch interfaces
 */

// Responsive Container
export { ResponsiveContainer } from './ResponsiveContainer';
export type { ResponsiveContainerProps } from './ResponsiveContainer';

// Touch Button
export { TouchButton } from './TouchButton';
export type { TouchButtonProps } from './TouchButton';

// Mobile Form
export { MobileForm, FormField } from './MobileForm';
export type { FormProps, FormFieldProps } from './MobileForm';

// Responsive Grid
export { ResponsiveGrid, GridItem, useGridBreakpoint } from './ResponsiveGrid';
export type { ResponsiveGridProps, GridItemProps } from './ResponsiveGrid';

// Safe Area View
export {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from './SafeAreaView';
export type { SafeAreaViewProps, SafeAreaInsets } from './SafeAreaView';

// Existing components
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';

// Re-export mobile components
export * from './mobile';
