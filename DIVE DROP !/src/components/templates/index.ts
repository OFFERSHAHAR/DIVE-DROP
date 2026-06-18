/**
 * DiveDrop Templates
 * Production-ready component templates for responsive, mobile-first design
 *
 * All templates include:
 * - TypeScript support
 * - Tailwind CSS with responsive breakpoints
 * - Dark mode support
 * - Accessibility (WCAG 2.1 AA)
 * - Safe area awareness
 * - Touch-friendly interactions (44px+ targets)
 */

// DiveSiteCard - Responsive dive site card with image, rating, and actions
export { DiveSiteCard, DiveSiteGrid } from './DiveSiteCard';
export type { DiveSiteCardProps } from './DiveSiteCard';

// BottomNavigation - Mobile-first bottom navigation with safe area support
export { BottomNavigation, BottomNavigationPresets } from './BottomNavigation';
export type { BottomNavigationProps } from './BottomNavigation';

// ResponsiveModal - Modal respecting safe areas with focus trap
export {
  ResponsiveModal,
  ConfirmModal,
  useModal,
} from './ResponsiveModal';
export type { ResponsiveModalProps } from './ResponsiveModal';

// FormPage - Complete form layout with validation and responsive design
export {
  FormPage,
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
  useFormState,
} from './FormPage';
export type {
  FormPageProps,
  FormFieldProps,
  FormInputProps,
  FormTextareaProps,
  FormSelectProps,
} from './FormPage';
