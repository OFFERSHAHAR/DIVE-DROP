# DiveDrop Mobile Components Guide

Production-ready responsive iOS/mobile-friendly components following iOS Human Interface Guidelines and Material Design principles.

## Components Overview

### 1. ResponsiveContainer
Handles safe area padding and viewport fitting for iOS notches and Android safe areas.

**Features:**
- Automatic safe area inset padding (top/bottom for notches and home indicators)
- Responsive max-width based on breakpoints
- Flexible padding options
- Full bleed mode support

**Usage:**
```tsx
import { ResponsiveContainer } from '@/components';

// Basic usage with safe area
<ResponsiveContainer safeArea>
  <h1>Main Content</h1>
</ResponsiveContainer>

// Full bleed (no max-width constraint)
<ResponsiveContainer fullBleed px="lg" py="md">
  <Hero />
</ResponsiveContainer>

// Different variants for content width
<ResponsiveContainer variant="content" safeArea>
  {/* max-w-3xl */}
</ResponsiveContainer>

<ResponsiveContainer variant="compact" safeArea>
  {/* max-w-2xl */}
</ResponsiveContainer>
```

**Props:**
- `safeArea?: boolean` - Enable safe area insets (default: true)
- `fullBleed?: boolean` - Disable max-width constraint (default: false)
- `px?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Horizontal padding (default: 'sm')
- `py?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Vertical padding (default: 'md')
- `variant?: 'default' | 'content' | 'compact'` - Max-width variant (default: 'default')

---

### 2. TouchButton
Touch-friendly button component optimized for mobile with 44x44px minimum target size (iOS HIG standard).

**Features:**
- Minimum 44x44px touch target (iOS Human Interface Guidelines)
- Haptic feedback support (vibration)
- Active state scaling feedback
- Enhanced focus states for accessibility
- Loading state with spinner
- Icon button support (circular)

**Usage:**
```tsx
import { TouchButton } from '@/components';

// Standard primary button
<TouchButton variant="primary" size="lg" fullWidth>
  Submit
</TouchButton>

// Secondary button
<TouchButton variant="secondary">
  Cancel
</TouchButton>

// Danger button
<TouchButton variant="danger" fullWidth>
  Delete Account
</TouchButton>

// Ghost button (minimal style)
<TouchButton variant="ghost">
  Learn More
</TouchButton>

// Loading state
<TouchButton loading variant="primary">
  Processing...
</TouchButton>

// Icon button (circular with haptic)
<TouchButton
  isIcon
  variant="ghost"
  size="md"
  ariaLabel="Close menu"
  hapticFeedback="light"
>
  ✕
</TouchButton>

// With haptic feedback
<TouchButton
  variant="primary"
  hapticFeedback="medium"
  onClick={() => console.log('tapped')}
>
  Tap Me
</TouchButton>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success'`
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Touch target sizes (min 44px)
- `fullWidth?: boolean` - Full width button
- `loading?: boolean` - Show loading spinner
- `isIcon?: boolean` - Circular icon button
- `ariaLabel?: string` - Accessibility label
- `hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none'` - Vibration feedback

---

### 3. MobileForm & FormField
Form component optimized for mobile input with proper input modes and zoom prevention.

**Features:**
- Proper input modes for different field types (email, tel, number, url)
- Zoom prevention on input focus (16px minimum font size)
- Touch-friendly form controls with 44px minimum height
- Automatic keyboard management
- Error state with message display
- Help text support
- Proper label associations
- Auto-complete and password management

**Usage:**
```tsx
import { MobileForm, FormField } from '@/components';

// Complete form with built-in fields
<MobileForm
  title="Login"
  description="Enter your credentials to continue"
  onSubmit={(e) => {
    e.preventDefault();
    // Handle form submission
  }}
>
  <FormField
    name="email"
    label="Email Address"
    type="email"
    placeholder="you@example.com"
    required
    helpText="We'll never share your email"
  />
  <FormField
    name="password"
    label="Password"
    type="password"
    required
  />
  <FormField
    name="remember"
    label="Remember me"
    type="checkbox"
  />
</MobileForm>

// Custom form with FormField components
const [formData, setFormData] = useState({
  email: '',
  phone: '',
});

<MobileForm
  title="Contact Info"
  submitText="Save"
  isLoading={isSaving}
  onSubmit={(e) => {
    e.preventDefault();
    handleSave(formData);
  }}
>
  <FormField
    name="email"
    label="Email"
    type="email"
    value={formData.email}
    onChange={(value) => setFormData({ ...formData, email: value })}
    required
  />
  <FormField
    name="phone"
    label="Phone Number"
    type="tel"
    inputMode="tel"
    pattern="[0-9\\-\\+\\(\\)]+"
    value={formData.phone}
    onChange={(value) => setFormData({ ...formData, phone: value })}
    autoComplete="tel"
  />
</MobileForm>

// Field with validation error
<FormField
  name="username"
  label="Username"
  value={username}
  onChange={setUsername}
  minLength={3}
  maxLength={20}
  error={username.length > 0 && username.length < 3 ? 'Minimum 3 characters' : undefined}
  required
/>

// Tel input with proper keyboard
<FormField
  name="phone"
  label="Phone"
  type="tel"
  inputMode="tel"
  autoComplete="tel-national"
  pattern="[0-9\\-\\+\\(\\)]+"
/>

// URL input
<FormField
  name="website"
  label="Website"
  type="url"
  inputMode="url"
  autoComplete="url"
  placeholder="https://example.com"
/>

// Number input
<FormField
  name="age"
  label="Age"
  type="number"
  inputMode="numeric"
  min={0}
  max={150}
/>
```

**FormField Props:**
- `name: string` - Field name (required)
- `label: string` - Field label (required)
- `type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'password' | 'search' | 'date' | 'time'`
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message (displays if provided)
- `helpText?: string` - Help text below field
- `required?: boolean` - Mark as required with asterisk
- `inputMode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'`
- `autoComplete?: string` - Auto-complete hint
- `maxLength?: number` - Maximum length
- `minLength?: number` - Minimum length
- `pattern?: string` - Validation pattern
- `disabled?: boolean` - Disable field
- `readOnly?: boolean` - Read-only field

**MobileForm Props:**
- `title?: string` - Form title
- `description?: string` - Form description
- `fields?: FormFieldProps[]` - Array of fields (alternative to children)
- `submitText?: string` - Submit button text (default: 'Submit')
- `isLoading?: boolean` - Loading state
- `submitButtonClass?: string` - Custom submit button classes
- `onSubmit?: (e) => void` - Form submission handler

---

### 4. ResponsiveGrid & GridItem
Grid layout that adapts to breakpoints with responsive column configuration.

**Breakpoints:**
- Mobile (xs-sm): 320px - 640px → 1 column
- Tablet (md): 640px - 1024px → 2 columns
- Desktop (lg+): 1024px+ → 3+ columns

**Features:**
- Responsive column count per breakpoint
- Configurable gap spacing
- Auto-fit and auto-fill modes
- Grid item spanning
- Multiple layout variants (balanced, compact, spacious, cards)

**Usage:**
```tsx
import { ResponsiveGrid, GridItem, useGridBreakpoint } from '@/components';

// Basic 3-column grid (2 on tablet, 1 on mobile)
<ResponsiveGrid columns={3} gap="md">
  <div className="bg-primary text-white p-4 rounded">Item 1</div>
  <div className="bg-primary text-white p-4 rounded">Item 2</div>
  <div className="bg-primary text-white p-4 rounded">Item 3</div>
  <div className="bg-primary text-white p-4 rounded">Item 4</div>
  <div className="bg-primary text-white p-4 rounded">Item 5</div>
  <div className="bg-primary text-white p-4 rounded">Item 6</div>
</ResponsiveGrid>

// Cards layout variant
<ResponsiveGrid variant="cards" gap="lg">
  {posts.map(post => (
    <Card key={post.id} className="flex flex-col">
      <img src={post.image} alt={post.title} />
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </Card>
  ))}
</ResponsiveGrid>

// Compact layout with custom column counts
<ResponsiveGrid
  columnsSm={1}
  columnsMd={2}
  columns={4}
  gap="sm"
  variant="compact"
>
  {items.map(item => <Item key={item.id} {...item} />)}
</ResponsiveGrid>

// Spacious layout
<ResponsiveGrid variant="spacious" gap="xl">
  {sections.map(section => (
    <Section key={section.id} {...section} />
  ))}
</ResponsiveGrid>

// Grid items with spanning
<ResponsiveGrid columns={3} columnsMd={2} columnsSm={1} gap="md">
  <GridItem span={2} spanMd={1}>
    <Hero />
  </GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
  <GridItem span={3} spanMd={2}>
    <FullWidthContent />
  </GridItem>
</ResponsiveGrid>

// Auto-fit mode (items size automatically)
<ResponsiveGrid
  autoFit
  minItemWidth="200px"
  gap="md"
>
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</ResponsiveGrid>

// Hook for dynamic rendering based on breakpoint
function DynamicContent() {
  const columns = useGridBreakpoint();
  // columns is 1, 2, or 3 based on screen size
  
  return (
    <ResponsiveGrid columns={columns}>
      {items.slice(0, columns * 2).map(item => (
        <Item key={item.id} {...item} />
      ))}
    </ResponsiveGrid>
  );
}
```

**ResponsiveGrid Props:**
- `columns?: 2 | 3 | 4 | 6` - Desktop column count (default: 3)
- `columnsMd?: 2 | 3` - Tablet column count (default: 2)
- `columnsSm?: 1 | 2` - Mobile column count (default: 1)
- `gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Gap spacing (default: 'md')
- `autoFit?: boolean` - Enable auto-fit mode
- `variant?: 'balanced' | 'compact' | 'spacious' | 'cards'`
- `minItemWidth?: string` - Minimum width for auto-fit (default: '250px')

**GridItem Props:**
- `span?: 1 | 2 | 3 | 4 | 6 | 12` - Column span on desktop (default: 1)
- `spanMd?: 1 | 2 | 3 | 4` - Column span on tablet
- `spanSm?: 1 | 2` - Column span on mobile

---

### 5. SafeAreaView & SafeAreaProvider
Wrapper component for headers, footers, and fixed elements with safe area support.

**Features:**
- Automatic safe area padding for iOS notches and Android safe areas
- Support for top, bottom, left, right safe areas
- Fixed positioning with safe area insets
- Proper z-index management for stacking context
- SafeAreaProvider for context-based inset access
- useSafeAreaInsets hook for custom components

**Usage:**
```tsx
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from '@/components';

// Wrap your app with provider
<SafeAreaProvider>
  <App />
</SafeAreaProvider>

// Fixed header with top safe area
<SafeAreaView
  position="fixed"
  alignTo="top"
  edges={['top']}
  elevation="2"
  border="bottom"
>
  <nav className="flex items-center justify-between px-4 py-3">
    <Logo />
    <Menu />
  </nav>
</SafeAreaView>

// Sticky footer with bottom safe area
<SafeAreaView
  position="sticky"
  alignTo="bottom"
  edges={['bottom']}
  border="top"
  elevation="1"
>
  <button className="w-full">Continue to Next Step</button>
</SafeAreaView>

// Full safe area (all edges)
<SafeAreaView edges="all" position="static">
  <div className="p-4">Safe content</div>
</SafeAreaView>

// Specific safe area edges
<SafeAreaView edges={['top', 'left', 'right']}>
  {/* Padding on top, left, right only */}
</SafeAreaView>

// Transparent background with shadow
<SafeAreaView
  edges={['top']}
  background="transparent"
  elevation="1"
  position="fixed"
  alignTo="top"
>
  <Header />
</SafeAreaView>

// Dark background for modal overlay
<SafeAreaView
  edges="all"
  background="secondary"
  elevation="3"
>
  <Modal />
</SafeAreaView>

// Custom hook usage
function CustomComponent() {
  const { top, bottom, left, right } = useSafeAreaInsets();
  
  return (
    <div
      style={{
        paddingTop: `${top}px`,
        paddingBottom: `${bottom}px`,
        paddingLeft: `${left}px`,
        paddingRight: `${right}px`,
      }}
    >
      Custom content with safe area padding
    </div>
  );
}
```

**SafeAreaView Props:**
- `edges?: Array<'top' | 'bottom' | 'left' | 'right'> | 'all'` - Which edges to apply insets
- `position?: 'static' | 'fixed' | 'absolute' | 'sticky'` - Position type
- `alignTo?: 'top' | 'bottom'` - Align fixed elements to top or bottom
- `background?: 'primary' | 'secondary' | 'transparent'` - Background color
- `border?: 'top' | 'bottom' | 'none'` - Add border
- `elevation?: 'none' | '1' | '2' | '3'` - Shadow elevation
- `zIndex?: 'base' | 'dropdown' | 'sticky' | 'modal' | 'popover' | 'tooltip'` - Z-index layer

---

## HTML Meta Tags Setup

For proper safe area support on iOS, add to `<head>`:

```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, user-scalable=no" />
```

Add to your root CSS (typically in `globals.css` or layout):

```css
:root {
  /* Safe area insets - set by viewport-fit=cover */
  --safe-area-inset-top: env(safe-area-inset-top, 0);
  --safe-area-inset-right: env(safe-area-inset-right, 0);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0);
  --safe-area-inset-left: env(safe-area-inset-left, 0);

  /* Safe area inset utilities */
  --safe-left: var(--safe-area-inset-left);
  --safe-right: var(--safe-area-inset-right);
  --safe-top: var(--safe-area-inset-top);
  --safe-bottom: var(--safe-area-inset-bottom);
}

/* Prevent zoom on input focus (mobile) */
input,
textarea,
select {
  font-size: 16px; /* Prevents iOS zoom */
  line-height: 1.5;
}

/* Disable default iOS touch behaviors where needed */
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

## Complete Example: Mobile App Layout

```tsx
import React, { useState } from 'react';
import {
  SafeAreaProvider,
  SafeAreaView,
  ResponsiveContainer,
  ResponsiveGrid,
  GridItem,
  TouchButton,
  MobileForm,
  FormField,
} from '@/components';

export default function MobileApp() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <SafeAreaProvider>
      <div className="min-h-screen bg-bg-primary">
        {/* Header */}
        <SafeAreaView
          position="fixed"
          alignTo="top"
          edges={['top']}
          elevation="2"
          zIndex="sticky"
          border="bottom"
        >
          <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto w-full">
            <h1 className="text-xl font-bold">DiveDrop</h1>
            <TouchButton isIcon variant="ghost" ariaLabel="Menu">
              ☰
            </TouchButton>
          </div>
        </SafeAreaView>

        {/* Main content */}
        <ResponsiveContainer safeArea className="mt-20 mb-24">
          <h2 className="text-3xl font-bold mb-6">Welcome</h2>

          {/* Responsive grid of cards */}
          <ResponsiveGrid variant="cards" gap="md" className="mb-8">
            <GridItem>
              <div className="bg-bg-secondary rounded-lg p-4">
                <h3 className="font-semibold mb-2">Feature 1</h3>
                <p className="text-sm text-text-secondary">
                  Responsive design that works on all devices
                </p>
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-bg-secondary rounded-lg p-4">
                <h3 className="font-semibold mb-2">Feature 2</h3>
                <p className="text-sm text-text-secondary">
                  Touch-optimized components with 44px targets
                </p>
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-bg-secondary rounded-lg p-4">
                <h3 className="font-semibold mb-2">Feature 3</h3>
                <p className="text-sm text-text-secondary">
                  iOS safe area support for notches
                </p>
              </div>
            </GridItem>
          </ResponsiveGrid>

          {/* CTA Button */}
          <TouchButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setIsFormOpen(true)}
          >
            Get Started
          </TouchButton>
        </ResponsiveContainer>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-end">
            <ResponsiveContainer fullBleed className="bg-bg-primary rounded-t-lg max-h-96 overflow-y-auto">
              <MobileForm
                title="Join DiveDrop"
                description="Create your account"
                submitText="Create Account"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsFormOpen(false);
                }}
              >
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  required
                />
              </MobileForm>
              <TouchButton
                variant="ghost"
                fullWidth
                className="mt-4"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </TouchButton>
            </ResponsiveContainer>
          </div>
        )}

        {/* Footer */}
        <SafeAreaView
          position="fixed"
          alignTo="bottom"
          edges={['bottom']}
          elevation="2"
          zIndex="sticky"
          border="top"
        >
          <div className="px-4 py-4 max-w-4xl mx-auto w-full">
            <p className="text-center text-sm text-text-secondary">
              © 2024 DiveDrop. All rights reserved.
            </p>
          </div>
        </SafeAreaView>
      </div>
    </SafeAreaProvider>
  );
}
```

---

## Best Practices

### Mobile Input Optimization
- Always use correct `type` and `inputMode` for proper keyboard appearance
- Use 16px+ font size to prevent iOS zoom on input focus
- Add `autoComplete` hints for user convenience
- Test on real devices, not just browser devtools

### Touch Targets
- Minimum 44x44px for touch targets (iOS HIG standard)
- Use `TouchButton` for all interactive elements
- Space touch targets at least 8px apart
- Use haptic feedback for confirmatory actions

### Safe Areas
- Always use `SafeAreaProvider` at app root
- Wrap fixed headers/footers with `SafeAreaView`
- Test on iPhone with notch (iPhone 12+) and home indicator
- Use CSS variables for dynamic safe area access

### Performance
- Use `ResponsiveGrid` with proper `variant` for lazy-loaded content
- Implement `useGridBreakpoint` for dynamic rendering
- Avoid expensive calculations in render methods
- Use `React.memo` for grid items if they're expensive

### Accessibility
- Always provide `ariaLabel` for icon buttons
- Use proper HTML semantics (form, label, input)
- Test keyboard navigation on desktop and mobile
- Ensure sufficient color contrast (WCAG AA+)

---

## Browser & Device Support

- iOS 12+ (notch/safe area support)
- Android 6+ (safe area support)
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Touch devices and hybrid input (mouse + touch)

## Related Files

- `/src/utils/cn.ts` - Class name utility
- `/tailwind.config.js` - Tailwind configuration with safe area variables
- `/src/components/Button.tsx` - Original Button component (for reference)
