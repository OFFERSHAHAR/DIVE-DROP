# DiveDrop Mobile Components - Quick Start

## 30-Second Setup

### 1. Wrap App with SafeAreaProvider
```tsx
// src/app/layout.tsx
import { SafeAreaProvider } from '@/components';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SafeAreaProvider>
          {children}
        </SafeAreaProvider>
      </body>
    </html>
  );
}
```

### 2. Add Viewport Meta & CSS
**HTML:**
```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, user-scalable=no" />
```

**CSS (app/globals.css):**
```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0);
}

input, textarea, select { font-size: 16px; }
```

### 3. Use Components
```tsx
import {
  ResponsiveContainer,
  TouchButton,
  MobileForm,
  FormField,
  ResponsiveGrid,
  GridItem,
  SafeAreaView,
} from '@/components';

export default function Page() {
  return (
    <ResponsiveContainer safeArea>
      <h1>Welcome to DiveDrop</h1>
      
      <ResponsiveGrid columns={3} columnsMd={2} columnsSm={1} gap="md">
        <GridItem>Item 1</GridItem>
        <GridItem>Item 2</GridItem>
        <GridItem>Item 3</GridItem>
      </ResponsiveGrid>

      <TouchButton variant="primary" size="lg" fullWidth>
        Get Started
      </TouchButton>
    </ResponsiveContainer>
  );
}
```

---

## Component Cheat Sheet

### ResponsiveContainer
```tsx
// Safe area container with responsive padding
<ResponsiveContainer safeArea variant="default" px="sm" py="md">
  {children}
</ResponsiveContainer>
```

### TouchButton
```tsx
// iOS HIG compliant button (44x44px minimum)
<TouchButton
  variant="primary|secondary|outline|danger|ghost|success"
  size="sm|md|lg|xl"
  fullWidth={true|false}
  loading={true|false}
  isIcon={true|false}
  hapticFeedback="light|medium|heavy|none"
>
  Click Me
</TouchButton>
```

### FormField & MobileForm
```tsx
// Individual form field
<FormField
  name="email"
  label="Email"
  type="email|tel|number|url|password"
  required
  error="Error message"
  helpText="Help text"
/>

// Complete form
<MobileForm
  title="Login"
  submitText="Sign In"
  isLoading={false}
  onSubmit={(e) => { e.preventDefault(); /* handle */ }}
>
  <FormField name="email" label="Email" type="email" required />
  <FormField name="password" label="Password" type="password" required />
</MobileForm>
```

### ResponsiveGrid & GridItem
```tsx
// Responsive grid (1 col mobile → 2 col tablet → 3 col desktop)
<ResponsiveGrid
  columns={3}
  columnsMd={2}
  columnsSm={1}
  gap="md"
  variant="balanced|compact|spacious|cards"
>
  <GridItem span={1} spanMd={1} spanSm={1}>
    Item 1
  </GridItem>
  <GridItem span={2}>Wide Item</GridItem>
</ResponsiveGrid>
```

### SafeAreaView
```tsx
// Fixed header
<SafeAreaView
  position="fixed"
  alignTo="top"
  edges={['top']}
  elevation="2"
  border="bottom"
  zIndex="sticky"
>
  <Header />
</SafeAreaView>

// Sticky footer
<SafeAreaView
  position="sticky"
  alignTo="bottom"
  edges={['bottom']}
  elevation="1"
  border="top"
>
  <Footer />
</SafeAreaView>
```

---

## Key Props Reference

| Component | Key Props |
| --------- | --------- |
| **ResponsiveContainer** | `safeArea`, `variant`, `px`, `py`, `fullBleed` |
| **TouchButton** | `variant`, `size`, `fullWidth`, `loading`, `isIcon`, `hapticFeedback` |
| **FormField** | `type`, `required`, `error`, `helpText`, `pattern`, `inputMode` |
| **MobileForm** | `title`, `submitText`, `isLoading`, `onSubmit` |
| **ResponsiveGrid** | `columns`, `columnsMd`, `columnsSm`, `gap`, `variant`, `autoFit` |
| **GridItem** | `span`, `spanMd`, `spanSm` |
| **SafeAreaView** | `position`, `alignTo`, `edges`, `elevation`, `border`, `zIndex`, `background` |

---

## Common Patterns

### Full Page Layout
```tsx
<SafeAreaProvider>
  {/* Header */}
  <SafeAreaView position="fixed" alignTo="top" edges={['top']}>
    <h1>DiveDrop</h1>
  </SafeAreaView>

  {/* Content */}
  <ResponsiveContainer safeArea className="mt-20 mb-24">
    <h2>Page Content</h2>
  </ResponsiveContainer>

  {/* Footer */}
  <SafeAreaView position="fixed" alignTo="bottom" edges={['bottom']}>
    <button>Action</button>
  </SafeAreaView>
</SafeAreaProvider>
```

### Card Grid
```tsx
<ResponsiveGrid variant="cards" gap="md">
  {items.map(item => (
    <GridItem key={item.id}>
      <Card {...item} />
    </GridItem>
  ))}
</ResponsiveGrid>
```

### Touch Form
```tsx
<MobileForm title="Contact" onSubmit={handleSubmit}>
  <FormField name="name" label="Name" required />
  <FormField name="email" label="Email" type="email" required />
  <FormField name="phone" label="Phone" type="tel" />
  <FormField name="message" label="Message" />
</MobileForm>
```

---

## Files & Docs

| File | Purpose |
| ---- | ------- |
| `src/components/ResponsiveContainer.tsx` | Safe area container |
| `src/components/TouchButton.tsx` | Touch-optimized button |
| `src/components/MobileForm.tsx` | Mobile form + fields |
| `src/components/ResponsiveGrid.tsx` | Responsive grid + hook |
| `src/components/SafeAreaView.tsx` | Safe area wrapper + provider |
| `src/components/mobile.types.ts` | TypeScript types |
| `src/components/index.ts` | Component exports |
| `MOBILE_COMPONENTS_GUIDE.md` | Full documentation |
| `RESPONSIVE_COMPONENTS_SUMMARY.md` | Detailed summary |
| `QUICK_START.md` | This file |

---

## Testing on Device

**iPhone:**
1. Add `viewport-fit=cover` meta tag
2. Test on iPhone 12+ (has notch)
3. Rotate to landscape
4. Test form inputs (should NOT zoom at 16px+)

**Android:**
1. Test on Android 9+ (has safe areas)
2. Rotate orientation
3. Test keyboard appearance

**Desktop:**
1. Use Chrome DevTools device simulation
2. Toggle "Device Toolbar" (Ctrl+Shift+M)
3. Resize to different breakpoints

---

## Troubleshooting

**Form zooms on input focus:**
→ Add `font-size: 16px;` to input styles

**Safe area padding not showing:**
→ Add `viewport-fit=cover` to meta tag and CSS variables

**Touch button too small:**
→ Use `size="md"` or larger (minimum 44x44px)

**Grid not responsive:**
→ Ensure breakpoints are set (columnsSm, columnsMd, columns)

**SafeAreaView not working:**
→ Wrap app with `<SafeAreaProvider>` at root

---

## Support & Resources

- **Full Guide:** `MOBILE_COMPONENTS_GUIDE.md`
- **Summary:** `RESPONSIVE_COMPONENTS_SUMMARY.md`
- **Component Docs:** `src/components/README.md`
- **Types:** `src/components/mobile.types.ts`

---

**Ready to build responsive mobile experiences! 🚀**
