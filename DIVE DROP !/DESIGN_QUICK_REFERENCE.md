# DiveDrop Design System - Quick Reference Card

## 🎨 COLORS

### Primary
```
Primary: bg-ocean-blue text-white (#0066CC)
Primary Dark: bg-ocean-blue-dark (#003D8C)
Accent: text-cyan-accent (#00B4D8)
```

### Semantic
```
Success: text-success (#00C853)
Error: text-error (#FF3D00)
Warning: text-warning (#FFC400)
Info: text-info (#00B4D8)
```

### Neutral
```
Light: bg-light-bg text-light (#FFFFFF)
Dark: bg-dark-bg text-dark (#0A1428)
Disabled: text-disabled (#80878F)
```

---

## 📝 TYPOGRAPHY

### Classes
```
.h1, h1          (48px, bold)
.h2, h2          (36px, bold)
.h3, h3          (28px, semibold)
.h4, h4          (20px, semibold)
.text-body-lg    (16px)
.text-body       (14px)
.text-body-sm    (12px)
.text-caption    (11px)
```

### Usage
```jsx
<h1 className="h1">Large Heading</h1>
<h2 className="h2">Section Title</h2>
<p className="text-body">Normal text</p>
<p className="text-caption">Small hint</p>
```

---

## 📏 SPACING (8px grid)

### Values
```
xs   = 8px    → p-xs, m-xs, gap-xs
sm   = 16px   → p-sm, m-sm, gap-sm
md   = 24px   → p-md, m-md, gap-md
lg   = 32px   → p-lg, m-lg, gap-lg
xl   = 40px   → p-xl, m-xl, gap-xl
2xl  = 48px   → p-2xl, m-2xl, gap-2xl
3xl  = 64px   → p-3xl, m-3xl, gap-3xl
4xl  = 80px   → p-4xl, m-4xl, gap-4xl
```

### Quick Examples
```jsx
<div className="p-md">Content with 24px padding</div>
<div className="space-y-md">Items with 24px gap</div>
<div className="mb-lg">Bottom margin 32px</div>
```

---

## 🔘 BUTTONS

### Primary Button
```jsx
<button className="btn-primary">
  Click Me
</button>
```

### Secondary Button
```jsx
<button className="btn-secondary">
  Secondary
</button>
```

### Ghost Button
```jsx
<button className="btn-ghost">
  Ghost
</button>
```

### Icon Button
```jsx
<button className="btn-icon">
  <svg className="w-6 h-6" />
</button>
```

### Sizes
```jsx
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Normal</button>
<button className="btn-primary btn-lg">Large</button>
<button className="btn-primary btn-full">Full Width</button>
```

---

## 💾 CARDS

### Basic Card
```jsx
<div className="card">
  Card content
</div>
```

### With Title
```jsx
<div className="card">
  <div className="card-title">Title</div>
  <p className="text-body">Description</p>
</div>
```

### With Image
```jsx
<div className="card">
  <img src="image.jpg" alt="Card" className="w-full h-48 object-cover" />
  <div className="card-body">
    <div className="card-title">Site Name</div>
  </div>
</div>
```

---

## 📝 INPUTS

### Text Input
```jsx
<input 
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-3 border rounded-md focus:border-ocean-blue"
/>
```

### Input with Label
```jsx
<div className="input-group">
  <label>Email</label>
  <input type="email" placeholder="you@example.com" />
  <p className="input-help">We'll never share your email</p>
</div>
```

### Error State
```jsx
<input 
  type="text"
  className="border-2 border-error"
/>
<p className="input-help error">This field is required</p>
```

---

## 🧭 NAVIGATION

### Bottom Nav (Mobile)
```jsx
<nav className="nav-bottom">
  <a href="/" className="nav-link active">Home</a>
  <a href="/explore" className="nav-link">Explore</a>
  <a href="/log" className="nav-link">Log</a>
  <a href="/profile" className="nav-link">Profile</a>
</nav>
```

### Top Nav
```jsx
<nav className="h-16 bg-dark-bg glass flex items-center px-4">
  <h1>DiveDrop</h1>
</nav>
```

---

## 🔲 MODALS

### Basic Modal
```jsx
<div className="modal-backdrop">
  <div className="modal">
    <div className="modal-header">
      <h2>Modal Title</h2>
    </div>
    <div className="modal-body">
      Content here
    </div>
    <div className="modal-footer">
      <button className="btn-secondary">Cancel</button>
      <button className="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## 🎖️ BADGES

### Badge
```jsx
<span className="badge">Beginner</span>
<span className="badge badge-primary">Advanced</span>
<span className="badge badge-success">Certified</span>
```

---

## 🚨 ALERTS

### Alert Box
```jsx
<div className="alert alert-success">
  <div className="alert-icon">✓</div>
  <div className="alert-content">
    <p className="alert-title">Success!</p>
    <p className="alert-message">Action completed</p>
  </div>
</div>
```

### Alert Types
```jsx
alert-success   // Green
alert-error     // Red
alert-warning   // Yellow
alert-info      // Blue
```

---

## ⚙️ RESPONSIVE

### Breakpoints
```
sm:  640px    (tablet)
md:  1024px   (desktop)
lg:  1280px   (large desktop)
```

### Usage
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

### Text Scaling
```jsx
<h2 className="text-3xl sm:text-4xl md:text-5xl">
  Responsive heading
</h2>
```

---

## 🌙 DARK MODE

### Automatic
```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

### Manual Toggle
```jsx
<div className="dark">
  {/* Everything inside is dark mode */}
</div>
```

### Using CSS Variables
```css
background-color: var(--bg-primary);  /* White in light, dark in dark */
color: var(--text-primary);            /* Black in light, white in dark */
```

---

## 🎬 ANIMATIONS

### Predefined
```jsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-up">Slide up</div>
<div className="animate-scale-in">Scale in</div>
<div className="animate-bounce-in">Bounce in</div>
<div className="animate-shake">Shake</div>
```

### Button Hover
```css
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-3);
}
```

### Spinner
```jsx
<div className="w-8 h-8 border-3 border-t-cyan-accent rounded-full animate-spin" />
```

---

## ✅ iOS SAFE AREA

### Apply to Fixed Elements
```jsx
<header className="pt-safe-top pb-safe-bottom">
  Header with safe area
</header>

<nav className="pb-safe-bottom">
  Bottom nav with home indicator padding
</nav>
```

---

## 🎯 TOUCH TARGETS

### Minimum Size
```jsx
<button className="touch-target">
  {/* 44x44px minimum */}
</button>
```

### Spacing
```jsx
<div className="flex gap-2">
  {/* Minimum 8px between touch targets */}
  <button className="touch-target">Button 1</button>
  <button className="touch-target">Button 2</button>
</div>
```

---

## ♿ ACCESSIBILITY

### Focus Indicators
```jsx
<button className="focus:outline-cyan-accent focus:outline-offset-2">
  Accessible button
</button>
```

### ARIA Labels
```jsx
<button aria-label="Close menu">×</button>
<input aria-label="Search dive sites" type="search" />
```

### Semantic HTML
```jsx
<nav>Navigation</nav>
<main>Main content</main>
<aside>Sidebar</aside>
<article>Post</article>
<section>Section</section>
```

---

## 🌊 GRADIENTS

### Ocean
```jsx
<div className="bg-ocean-gradient">
  {/* Linear gradient from blue to dark blue */}
</div>
```

### Custom
```css
background: linear-gradient(135deg, #0066CC 0%, #003D8C 100%);
```

---

## 📦 UTILITIES

### Container
```jsx
<div className="container">
  {/* Max 1280px, centered */}
</div>
```

### Flexbox
```jsx
<div className="flex items-center justify-between gap-4">
  Left
  <Right />
</div>
```

### Grid
```jsx
<div className="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Visibility
```jsx
<div className="hidden sm:block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>
```

---

## 🔗 USEFUL LINKS

- **Full Specs:** DESIGN_SYSTEM.md
- **Components:** COMPONENT_LIBRARY.md
- **Mobile Guide:** IOS_RESPONSIVE_GUIDE.md
- **Tailwind Config:** tailwind.config.js
- **CSS System:** src/styles/design-system.css

---

## 💡 QUICK TIPS

1. **Always use 44px minimum for touch targets**
2. **Apply safe area to fixed/sticky elements**
3. **Test dark mode in both system preference & manual toggle**
4. **Use responsive classes (sm:, md:, lg:) instead of media queries**
5. **Verify color contrast with axe DevTools**
6. **Use CSS variables for dynamic theming**
7. **Test on real iOS devices (not just simulator)**
8. **Respect prefers-reduced-motion for animations**
9. **Use semantic HTML for accessibility**
10. **Lazy load images on mobile**

---

**Version:** 1.0  
**Last Updated:** 2026-06-18
