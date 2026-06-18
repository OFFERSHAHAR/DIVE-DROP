# DiveDrop iOS & Responsive Design Guide

## 1. iOS SAFE AREA IMPLEMENTATION

### What is Safe Area?
On modern iPhones with notch/Dynamic Island (iPhone 12+), the safe area is the region of the screen where content can be displayed without being obscured by the notch, rounded corners, or home indicator.

### Safe Area Insets
```javascript
// Top: 44px - 50px (notch/Dynamic Island)
// Bottom: 34px - 40px (home indicator)
// Left: 0px (landscape: may be 44px)
// Right: 0px (landscape: may be 44px)
```

### JavaScript Implementation (Auto-detect)
```javascript
// In your app initialization
function applySafeAreaInsets() {
  const safeAreaInsetTop = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')
  );
  const safeAreaInsetBottom = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')
  );

  document.documentElement.style.setProperty(
    '--safe-area-inset-top',
    `${safeAreaInsetTop}px`
  );
  document.documentElement.style.setProperty(
    '--safe-area-inset-bottom',
    `${safeAreaInsetBottom}px`
  );
}

// Call on load and orientation change
window.addEventListener('load', applySafeAreaInsets);
window.addEventListener('orientationchange', applySafeAreaInsets);
```

### CSS Usage
```css
/* Header with safe area */
.header {
  padding-top: max(16px, env(safe-area-inset-top));
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}

/* Bottom navigation with safe area */
.nav-bottom {
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}

/* Full-screen content with safe area */
.screen {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
}
```

### Viewport Meta Tag (Required)
```html
<meta name="viewport" content="
  width=device-width,
  initial-scale=1,
  viewport-fit=cover,
  user-scalable=no,
  minimum-scale=1,
  maximum-scale=1
">
```

The `viewport-fit=cover` is crucial for enabling safe area support.

---

## 2. RESPONSIVE BREAKPOINTS

### Screen Sizes by Device

**iPhones:**
- iPhone SE: 375px width
- iPhone 13/14/15: 390px width
- iPhone 14 Plus: 430px width
- iPhone Max: 430px width

**Android:**
- Small phone: 360px
- Standard: 412px
- Large: 480px

**Tablets:**
- iPad: 768px - 1024px
- iPad Pro: 1024px - 1366px

**Desktop:**
- Small: 1024px
- Medium: 1280px
- Large: 1536px+

### Breakpoint Strategy
```css
/* Mobile-first approach */

/* Base (320px - 639px) */
.card {
  grid-column: 1;
}

/* Tablet (640px - 1023px) */
@media (min-width: 640px) {
  .card {
    grid-column: span 2;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .card {
    grid-column: span 3;
  }
}
```

### Tailwind Breakpoints Used in DiveDrop
- `sm`: 640px (tablet portrait)
- `md`: 1024px (tablet landscape / small desktop)
- `lg`: 1280px (desktop)
- `xl`: 1536px (large desktop)

---

## 3. TOUCH-FRIENDLY DESIGN

### Touch Target Sizes
```
Minimum: 44px × 44px (Apple Human Interface Guidelines)
Recommended: 48px × 48px
Spacing: 8px minimum between targets
```

### Implementation
```css
/* Buttons should be minimum 44px */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* Touch spacing */
.btn + .btn {
  margin-left: 8px;
}

/* Tap highlight */
.btn {
  -webkit-tap-highlight-color: rgba(0, 102, 204, 0.1);
}
```

### Gesture-Friendly Spacing
```jsx
<div className="flex flex-col gap-4 p-4">
  {/* 16px gap between items = comfortable for thumb */}
  <button className="h-12">Option 1</button>
  <button className="h-12">Option 2</button>
  <button className="h-12">Option 3</button>
</div>
```

---

## 4. MOBILE LAYOUT PATTERNS

### Pattern: Full-Screen with Bottom Nav
```jsx
<div className="flex flex-col h-screen">
  {/* Header */}
  <header className="h-16 bg-dark-bg glass pt-safe-top">
    {/* Header content */}
  </header>

  {/* Scrollable Content */}
  <main className="flex-1 overflow-y-auto">
    {/* Content with padding for safe area */}
    <div className="p-4">
      {/* Page content */}
    </div>
  </main>

  {/* Bottom Navigation */}
  <nav className="h-16 bg-dark-bg glass pb-safe-bottom border-t border-border-dark">
    {/* Nav items */}
  </nav>
</div>
```

### Pattern: Scrollable Content with Safe Area
```jsx
<div className="min-h-screen flex flex-col">
  <div className="pt-safe-top" />
  
  <main className="flex-1 px-4 py-6">
    {/* Main content */}
  </main>
  
  <div className="pb-safe-bottom h-16" />
</div>
```

### Pattern: Modal with Safe Area
```jsx
<div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center">
  <div className="w-90 max-w-sm bg-dark-surface rounded-lg shadow-elevation-4 
                  max-h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-32px)]
                  overflow-y-auto
                  mx-4">
    {/* Modal content */}
  </div>
</div>
```

---

## 5. RESPONSIVE IMAGE HANDLING

### Responsive Images
```html
<img 
  src="image.webp"
  srcset="
    image-320w.webp 320w,
    image-640w.webp 640w,
    image-1024w.webp 1024w,
    image-1280w.webp 1280w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 640px,
    1024px
  "
  alt="Dive site"
  className="w-full h-auto"
/>
```

### Container Queries (Modern Approach)
```css
@container (min-width: 320px) {
  .card { grid-column: 1; }
}

@container (min-width: 600px) {
  .card { grid-column: span 2; }
}

@container (min-width: 1000px) {
  .card { grid-column: span 3; }
}
```

---

## 6. VIEWPORT UNITS & DYNAMIC SIZING

### Safe Viewport Units
```css
/* Use these for responsive sizing */

/* Full height minus safe areas */
.full-height {
  height: 100dvh; /* Dynamic viewport height (respects address bar) */
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* Width-relative sizing */
.card {
  width: calc(100vw - 32px); /* Account for padding */
  max-width: 500px;
}

/* Font scaling */
.responsive-text {
  font-size: clamp(14px, 4vw, 24px); /* Min, preferred, max */
}
```

---

## 7. ORIENTATION HANDLING

### Portrait & Landscape
```css
/* Portrait orientation */
@media (orientation: portrait) {
  .bottom-nav {
    height: 64px;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Landscape orientation */
@media (orientation: landscape) {
  .bottom-nav {
    height: 48px;
    padding-bottom: 0;
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }

  .card {
    /* Adjust grid for landscape */
    grid-column: span 4;
  }
}
```

### JavaScript Orientation Detection
```javascript
window.addEventListener('orientationchange', () => {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  document.documentElement.setAttribute('data-orientation', 
    isPortrait ? 'portrait' : 'landscape'
  );
});
```

---

## 8. FIXED & STICKY POSITIONING WITH SAFE AREA

### Fixed Header
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding-top: max(16px, env(safe-area-inset-top));
  z-index: 1000;
}

/* Content below header */
main {
  margin-top: calc(64px + max(16px, env(safe-area-inset-top)));
}
```

### Sticky Navigation
```css
.sticky-header {
  position: sticky;
  top: max(0px, env(safe-area-inset-top));
  background: var(--bg-secondary);
  z-index: 100;
}
```

---

## 9. SCROLLING & SCROLLBAR BEHAVIOR

### Smooth Scrolling
```css
html {
  scroll-behavior: smooth;
  -webkit-scroll-snap-type: y mandatory;
  scroll-snap-type: y mandatory;
}

section {
  scroll-snap-align: start;
}
```

### Hide Scrollbar (but keep functionality)
```css
.scrollable {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
  display: none;
}
```

### Custom Scrollbar
```css
.scrollable::-webkit-scrollbar {
  width: 6px;
}

.scrollable::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.scrollable::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 3px;
}

.scrollable::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}
```

---

## 10. FORM INPUTS ON MOBILE

### Better Input Experience
```html
<!-- Email input with mobile keyboard -->
<input 
  type="email"
  inputmode="email"
  autocomplete="email"
  placeholder="Email"
/>

<!-- Phone with numeric keyboard -->
<input 
  type="tel"
  inputmode="tel"
  autocomplete="tel"
  placeholder="Phone"
/>

<!-- Search with search keyboard -->
<input 
  type="search"
  placeholder="Search"
/>

<!-- Number input -->
<input 
  type="number"
  inputmode="numeric"
  placeholder="Depth (m)"
/>

<!-- Date picker -->
<input 
  type="date"
  inputmode="none"
/>

<!-- Time picker -->
<input 
  type="time"
  inputmode="none"
/>
```

### Preventing Zoom on Input Focus (iOS)
```css
input,
textarea,
select {
  font-size: 16px; /* Prevents zoom on iOS */
  -webkit-user-select: text;
  user-select: text;
}
```

---

## 11. TESTING CHECKLIST

### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 13/14/15 (390px)
- [ ] iPhone Plus (430px)
- [ ] iPad (768px)
- [ ] Android (360px, 412px)
- [ ] Desktop (1024px+)

### Orientation Testing
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Orientation change (no layout shift)

### Safe Area Testing
- [ ] Content not hidden by notch
- [ ] Bottom nav above home indicator
- [ ] Header respects status bar
- [ ] Landscape safe area works

### Touch Testing
- [ ] All buttons are 44px+ tall
- [ ] 8px minimum spacing between targets
- [ ] No unintended selection on long press
- [ ] Tap feedback is immediate

### Performance Testing
- [ ] No layout shift on scroll
- [ ] Smooth scrolling (60fps)
- [ ] Fast page load (<3s on 4G)
- [ ] Images properly optimized

---

## 12. TESTING TOOLS

### Browser DevTools
```javascript
// Simulate iPhone in DevTools
// Chrome/Edge: Ctrl+Shift+M or F12 > Device toolbar

// Test safe area
document.documentElement.style.setProperty(
  '--safe-area-inset-top',
  '48px'
);
```

### Responsive Design Mode
- Firefox: Ctrl+Shift+M
- Chrome: Ctrl+Shift+M or F12 > Device toolbar
- Safari: Develop > Enter Responsive Design Mode

### Real Device Testing
- iPhone: Use iOS Simulator or physical device
- Android: Use Android emulator or physical device

---

## 13. PERFORMANCE OPTIMIZATION FOR MOBILE

### Critical Rendering Path
```html
<head>
  <!-- Critical CSS inline -->
  <style>
    /* Only critical styles: layout, navigation, above-fold */
  </style>
  
  <!-- Deferred non-critical CSS -->
  <link rel="preload" href="styles.css" as="style">
</head>

<body>
  <!-- Content first -->
  <main></main>
  
  <!-- Scripts at end -->
  <script defer src="app.js"></script>
</body>
```

### Image Optimization
```html
<!-- Use WebP with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Dive site" loading="lazy">
</picture>
```

### Lazy Loading
```html
<img 
  src="image.jpg" 
  loading="lazy"
  alt="Dive site"
/>

<iframe 
  src="map.html" 
  loading="lazy"
></iframe>
```

---

## 14. EXAMPLE: RESPONSIVE DIVE SITE CARD

```jsx
// DiveSiteCard.jsx
export function DiveSiteCard({ site }) {
  return (
    <div className="card bg-dark-surface rounded-lg overflow-hidden">
      {/* Image - responsive */}
      <div className="aspect-video overflow-hidden">
        <img 
          src={site.image}
          alt={site.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>

      {/* Content - responsive padding */}
      <div className="p-3 sm:p-4 md:p-5">
        {/* Title - responsive text size */}
        <h3 className="text-h4 sm:text-h3 font-bold text-text-light mb-2">
          {site.name}
        </h3>

        {/* Info - responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <p className="text-caption text-text-secondary">Depth</p>
            <p className="text-body font-semibold text-cyan-accent">
              {site.depth}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-caption text-text-secondary">Rating</p>
            <p className="text-body font-semibold text-success">
              {site.rating}★
            </p>
          </div>
          <div className="text-center">
            <p className="text-caption text-text-secondary">Reviews</p>
            <p className="text-body font-semibold">
              {site.reviews}
            </p>
          </div>
        </div>

        {/* Button - full width on mobile, normal on desktop */}
        <button className="btn-primary w-full sm:w-auto">
          View Details
        </button>
      </div>
    </div>
  );
}
```

### Usage in Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {sites.map(site => (
    <DiveSiteCard key={site.id} site={site} />
  ))}
</div>
```

---

## 15. BEST PRACTICES SUMMARY

✅ DO:
- Use 44px minimum touch targets
- Test on real devices
- Use `viewport-fit=cover` in meta tag
- Apply safe area padding to fixed elements
- Use mobile-first CSS approach
- Optimize images for mobile
- Test all breakpoints
- Support both orientations
- Use semantic HTML
- Lazy load images

❌ DON'T:
- Use viewport units without safe area
- Ignore landscape orientation
- Add elements that overflow width
- Use hover states without fallback
- Rely on touch events only
- Use high-resolution images for mobile
- Set fixed widths (use max-width instead)
- Disable user zoom (viewport meta)
- Forget safe area on modals
- Use complex animations without `prefers-reduced-motion`

---

**Version:** 1.0  
**Last Updated:** 2026-06-18  
**Status:** ✅ Complete
