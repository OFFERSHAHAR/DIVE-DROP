/**
 * Type definitions for DiveDrop Mobile Components
 * Shared types and utilities for responsive mobile components
 */

// Spacing values (8px grid)
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variants
export type ColorVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';

// Button sizes (all minimum 44px for touch)
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

// Input types with mobile-specific modes
export type InputType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'url'
  | 'password'
  | 'search'
  | 'date'
  | 'time'
  | 'checkbox'
  | 'radio';

// Input modes for mobile keyboards
export type InputMode = 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

// Responsive grid columns
export type GridColumns = 1 | 2 | 3 | 4 | 6;

// Grid column span values
export type GridSpan = 1 | 2 | 3 | 4 | 6 | 12;

// Grid variants with predefined responsive behavior
export type GridVariant = 'balanced' | 'compact' | 'spacious' | 'cards';

// Safe area edges
export type SafeAreaEdge = 'top' | 'bottom' | 'left' | 'right';

// Position types for fixed/sticky elements
export type PositionType = 'static' | 'fixed' | 'absolute' | 'sticky';

// Background color options
export type BackgroundColor = 'primary' | 'secondary' | 'transparent';

// Border options
export type BorderOption = 'top' | 'bottom' | 'none';

// Shadow elevation levels (Material Design)
export type ElevationLevel = 'none' | '1' | '2' | '3';

// Z-index layers
export type ZIndexLayer = 'base' | 'dropdown' | 'sticky' | 'modal' | 'popover' | 'tooltip';

// Haptic feedback intensity
export type HapticFeedback = 'light' | 'medium' | 'heavy' | 'none';

// Container variants
export type ContainerVariant = 'default' | 'content' | 'compact';

// Alignment options
export type AlignmentOption = 'top' | 'bottom';

// Safe area insets (platform safe areas)
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// Responsive breakpoint values
export interface BreakpointValues {
  xs: number;   // 320px - Mobile
  sm: number;   // 640px - Tablet small
  md: number;   // 1024px - Tablet large
  lg: number;   // 1280px - Desktop
  xl: number;   // 1536px - Desktop large
}

// Responsive grid configuration
export interface ResponsiveGridConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

// Form field configuration
export interface FormFieldConfig {
  name: string;
  label: string;
  type?: InputType;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  value?: string | number;
}

// Touch button configuration
export interface TouchButtonConfig {
  variant: ButtonVariant;
  size: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  isIcon?: boolean;
  hapticFeedback?: HapticFeedback;
}

// Container configuration
export interface ContainerConfig {
  safeArea: boolean;
  fullBleed: boolean;
  variant: ContainerVariant;
  px: SpacingSize;
  py: SpacingSize;
}

// Grid configuration
export interface GridConfig {
  columns: GridColumns;
  columnsMd: GridColumns;
  columnsSm: 1 | 2;
  gap: SpacingSize;
  variant: GridVariant;
  autoFit: boolean;
}

// Safe area configuration
export interface SafeAreaConfig {
  position: PositionType;
  edges: SafeAreaEdge[] | 'all';
  background: BackgroundColor;
  border: BorderOption;
  elevation: ElevationLevel;
  zIndex: ZIndexLayer;
  alignTo?: AlignmentOption;
}

// Common component props pattern
export interface BaseComponentProps {
  /** Additional CSS classes */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
  /** Data attributes for testing */
  'data-testid'?: string;
}

// Accessibility props pattern
export interface AccessibilityProps {
  /** ARIA label for icon buttons */
  'aria-label'?: string;
  /** ARIA description */
  'aria-description'?: string;
  /** ARIA busy state */
  'aria-busy'?: boolean;
  /** ARIA invalid state */
  'aria-invalid'?: boolean;
  /** ARIA required */
  'aria-required'?: boolean;
  /** ARIA disabled */
  'aria-disabled'?: boolean;
  /** Tab index */
  tabIndex?: number;
}

// Touch interaction state
export interface TouchState {
  isPressed: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isDisabled: boolean;
}

// Responsive state
export interface ResponsiveState {
  columns: GridColumns;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  width: number;
  height: number;
}

// Form state
export interface FormState {
  values: Record<string, string | number | boolean>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

// Component callback types
export type onTouchCallback = (state: TouchState) => void;
export type onResponsiveCallback = (state: ResponsiveState) => void;
export type onFormChangeCallback = (state: FormState) => void;
export type onSafeAreaChangeCallback = (insets: SafeAreaInsets) => void;

// Utility type helpers
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// Screen size detection utility type
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Responsive value type (value or breakpoint-specific values)
export type ResponsiveValue<T> =
  | T
  | {
      xs?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
    };

// All types defined above are exported and ready to use
