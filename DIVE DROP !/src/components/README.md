# DiveDrop Responsive Mobile Components

Production-ready iOS/mobile-friendly components for responsive design.

## Quick Start

### Import Components
```tsx
import {
  ResponsiveContainer,
  TouchButton,
  MobileForm,
  FormField,
  ResponsiveGrid,
  GridItem,
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from '@/components';
```

### Setup SafeAreaProvider at App Root

In your root layout or app component:

```tsx
import { SafeAreaProvider } from '@/components';

export default function RootLayout() {
  return (
    <html>
      <body>
        <SafeAreaProvider>
          {/* Your app content */}
        </SafeAreaProvider>
      </body>
    </html>
  );
}
```

### Add Viewport Meta Tag

In `src/app/layout.tsx`:

```tsx
export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover', // iOS safe area support
    userScalable: 'no',
  },
};
```

### CSS Setup

Add to your global CSS (`app/globals.css`):

```css
:root {
  /* Safe area insets - set by viewport-fit=cover */
  --safe-area-inset-top: env(safe-area-inset-top, 0);
  --safe-area-inset-right: env(safe-area-inset-right, 0);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0);
  --safe-area-inset-left: env(safe-area-inset-left, 0);
}

/* Prevent zoom on input focus (iOS) */
input,
textarea,
select {
  font-size: 16px;
  line-height: 1.5;
}

/* Touch feedback */
button,
[role="button"] {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Component Reference

### 1. ResponsiveContainer
Safe area aware container with responsive padding.

```tsx
<ResponsiveContainer safeArea variant="default" px="sm" py="md">
  <h1>Page Content</h1>
</ResponsiveContainer>
```

### 2. TouchButton
iOS HIG compliant button (44x44px minimum).

```tsx
<TouchButton
  variant="primary"
  size="lg"
  fullWidth
  hapticFeedback="medium"
  onClick={handleClick}
>
  Tap Me
</TouchButton>
```

### 3. MobileForm & FormField
Mobile-optimized forms with zoom prevention.

```tsx
<MobileForm
  title="Login"
  onSubmit={handleSubmit}
>
  <FormField
    name="email"
    label="Email"
    type="email"
    required
  />
  <FormField
    name="password"
    label="Password"
    type="password"
    required
  />
</MobileForm>
```

### 4. ResponsiveGrid & GridItem
Responsive grid that adapts to breakpoints.

```tsx
<ResponsiveGrid columns={3} columnsMd={2} columnsSm={1} gap="md">
  <GridItem>Item 1</GridItem>
  <GridItem span={2}>Wide Item</GridItem>
</ResponsiveGrid>
```

### 5. SafeAreaView
Fixed/sticky elements with safe area support.

```tsx
<SafeAreaView
  position="fixed"
  alignTo="top"
  edges={['top']}
  elevation="2"
>
  <Header />
</SafeAreaView>
```

---

## Features

- ✅ iOS notch & home indicator support
- ✅ Android safe area support
- ✅ 44x44px touch targets (iOS HIG)
- ✅ Haptic feedback support
- ✅ Responsive breakpoints (1→2→3+ columns)
- ✅ Input zoom prevention
- ✅ Proper keyboard management
- ✅ Accessibility-first design
- ✅ TypeScript support
- ✅ Tailwind CSS integration
- ✅ Production-ready

---

## Files

- `ResponsiveContainer.tsx` - Safe area container (2.3 KB)
- `TouchButton.tsx` - Touch-optimized button (5.2 KB)
- `MobileForm.tsx` - Mobile form with FormField (8.2 KB)
- `ResponsiveGrid.tsx` - Adaptive grid layout (6.3 KB)
- `SafeAreaView.tsx` - Safe area wrapper (6.7 KB)
- `index.ts` - Component exports
- `MOBILE_COMPONENTS_GUIDE.md` - Comprehensive guide

**Total: ~29 KB of production-ready components**

---

## Testing

### Mobile Testing Checklist

- [ ] Test on iPhone with notch (iPhone 12+)
- [ ] Test on iPhone with home indicator
- [ ] Test landscape/portrait orientations
- [ ] Test form inputs without zoom
- [ ] Test touch button 44px+ targets
- [ ] Test keyboard opening/closing
- [ ] Test safe area on Android
- [ ] Test on different screen sizes

### Browser DevTools

Use Chrome DevTools device simulation:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select specific device or custom dimensions
4. Rotate orientation

---

## Browser Support

| Browser | iOS | Android |
| ------- | --- | ------- |
| Safari  | 12+ | N/A     |
| Chrome  | 13+ | 6+      |
| Firefox | 13+ | 6+      |
| Edge    | 13+ | 6+      |

---

## Related Documentation

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/)
- [Material Design - Touch targets](https://m3.material.io/content/material-you/overview)
- [Tailwind CSS Responsive](https://tailwindcss.com/docs/responsive-design)
- [MOBILE_COMPONENTS_GUIDE.md](./MOBILE_COMPONENTS_GUIDE.md) - Full usage guide

---

## License

Part of DiveDrop project. MIT License.
