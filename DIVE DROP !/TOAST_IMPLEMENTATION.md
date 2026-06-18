# Toast Notifications System - Premium Polish Implementation

## Overview

A premium toast notification system with slide-in/fade-out animations, dark mode support, and accessibility features. Fully integrated with the DiveDrop design system.

## Features

✨ **Premium Animations**
- Slide-in from right (desktop)
- Slide-in from bottom (mobile)
- Pulse glow effects per type
- Spring easing for natural motion
- Smooth fade-out exit animation

🌓 **Dark Mode Support**
- Automatic system preference detection
- Manual dark mode toggle support
- Enhanced shadows in dark mode
- Optimized contrast ratios

♿ **Accessibility**
- ARIA live regions for screen readers
- Keyboard navigation support
- Focus management
- Reduced motion preferences respected

📱 **Responsive Design**
- Desktop: Slide-in from right with spring bounce
- Mobile: Slide-in from bottom for thumb accessibility
- Adaptive sizing (280px min on mobile, 320px desktop)

## Components

### 1. Toast Component (`src/components/Toast.tsx`)
Individual toast notification element.

**Props:**
```typescript
interface ToastProps {
  id: string;                    // Unique identifier
  message: string;               // Toast message text
  type?: 'success' | 'error' | 'warning' | 'info';  // Default: 'info'
  duration?: number;             // Auto-close duration in ms (0 = never)
  position?: ToastPosition;      // Position on screen
  action?: {                     // Optional action button
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;          // Called when toast closes
}
```

**Types & Styling:**
- `success` - Green (#00C853) with checkmark icon
- `error` - Red (#FF3D00) with X icon
- `warning` - Yellow (#FFC400) with alert icon
- `info` - Cyan (#00B4D8) with info icon

### 2. ToastContainer Component (`src/components/ToastContainer.tsx`)
Container that manages multiple toasts with positioning and stacking.

**Positions:**
- `top-left`, `top-center`, `top-right`
- `bottom-left`, `bottom-center`, `bottom-right` (default)

### 3. useToast Hook (`src/hooks/useToast.ts`)
Simple hook for managing toasts in components.

```typescript
const { toasts, addToast, success, error, warning, info } = useToastManager();

// Usage:
success('Profile updated!');
error('Failed to save');
warning('Are you sure?');
info('New updates available');
```

## Animations

### Enter Animations
- **Desktop**: `toastSlideInRight` (400px from right, spring easing)
- **Mobile**: `toastSlideInBottom` (400px from bottom, spring easing)
- Includes scale-up (0.9 → 1.0)

### Exit Animations
- Slide out to same direction as entrance
- Fade out with scale-down
- Duration: 300ms (matches CSS variable)

### Pulse Effects
Each type has a subtle pulse glow animation (2s loop):
- Success: Green pulse
- Error: Red pulse
- Warning: Yellow pulse
- Info: Cyan pulse

## Dark Mode Support

The toast system respects both:
1. **System preference** (`prefers-color-scheme: dark`)
2. **Manual toggle** (`.dark` class on root)

Enhanced shadows in dark mode for better contrast and visibility.

## Reduced Motion Support

When user has `prefers-reduced-motion: reduce` enabled:
- All animations disabled
- Instant appearance/disappearance
- Maintains full functionality

## CSS Variables Used

```css
--color-success: #00C853
--color-error: #FF3D00
--color-warning: #FFC400
--color-info: #00B4D8
--duration-base: 200ms
--easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--easing-out: cubic-bezier(0.4, 0, 0.2, 1)
```

## Usage Examples

### Basic Success Toast
```typescript
'use client';
import { useToastManager } from '@/hooks/useToast';

export function MyComponent() {
  const { success } = useToastManager();

  const handleSave = async () => {
    try {
      await saveData();
      success('Data saved successfully!');
    } catch (error) {
      // Handle error
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### With Action Button
```typescript
import Toast from '@/components/Toast';

<Toast
  id="undo-toast"
  message="Message deleted"
  type="info"
  action={{
    label: 'Undo',
    onClick: () => restoreMessage(),
  }}
/>
```

### In Login Form
```typescript
const handleSubmit = async (formData: LoginInput) => {
  const { error, success } = useToastManager();

  try {
    const result = await loginAction(formData);
    if (result.error) {
      error(result.error);
    } else {
      success('Login successful!');
      router.push('/dashboard');
    }
  } catch {
    error('An unexpected error occurred');
  }
};
```

## Customization

### Change Default Position
```typescript
<ToastContainer position="top-right" maxToasts={3} />
```

### Custom Duration
```typescript
success('Quick message', { duration: 2000 }); // 2 seconds
error('Sticky error', { duration: 0 });        // Never closes
```

### Styling with Tailwind
Toast classes support standard Tailwind utilities for customization if needed.

## File Structure

```
src/
├── components/
│   ├── Toast.tsx              # Individual toast element
│   └── ToastContainer.tsx     # Container & context provider
├── hooks/
│   └── useToast.ts            # Hook for managing toasts
├── styles/
│   └── design-system.css      # Toast animations & styles
├── examples/
│   └── ToastExample.tsx       # Interactive examples
└── TOAST_IMPLEMENTATION.md    # This file
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13+)
- Reduced motion: All browsers

## Performance Notes

- Animations use CSS transforms (GPU accelerated)
- No layout thrashing
- Automatic cleanup on unmount
- Maximum 3 toasts stacked by default

## Accessibility Testing

✅ WCAG 2.2 Level AA compliant
- Screen reader announcements
- Keyboard dismissal (Escape key)
- Focus management
- Color contrast ratio ≥ 4.5:1
- Icons + text (not icon-only)

## Troubleshooting

### Toast not appearing
- Check if `ToastProvider` wraps your app
- Verify `z-index: 9999` isn't overridden
- Check browser console for errors

### Animation not smooth
- Verify no `prefers-reduced-motion` media query mismatch
- Check for CSS conflicts
- Test on latest browser version

### Dark mode colors incorrect
- Ensure `.dark` class is on `<html>` or `<body>`
- Check system preference setting
- Verify CSS variables are not overridden

## Next Steps

1. **Integrate with forms**: Use in login/register pages
2. **Add toast history**: Store past notifications
3. **Custom themes**: Extend with brand colors
4. **Sound notifications**: Add optional audio feedback
5. **Toast queue**: Add priority-based ordering

---

**Status**: ✅ Complete and production-ready  
**Last Updated**: 2026-06-18  
**Accessibility**: WCAG 2.2 Level AA
