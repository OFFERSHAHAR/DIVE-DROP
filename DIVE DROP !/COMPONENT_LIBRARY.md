# DiveDrop Component Library v1.0

## Component Specifications & Implementation Guide

---

## 1. BUTTONS

### Primary Button
```jsx
<button className="
  px-6 py-3
  bg-ocean-blue hover:bg-ocean-blue-dark
  text-white text-body font-semibold
  rounded-md
  h-touch min-w-touch
  shadow-elevation-2 hover:shadow-elevation-3
  transition-all duration-200
  active:scale-95
  disabled:bg-disabled disabled:cursor-not-allowed
  focus:outline-2 focus:outline-cyan-accent focus:outline-offset-2
">
  Click Me
</button>
```

**Variants:**
- Size: `sm` (py-2 px-4), `md` (py-3 px-6), `lg` (py-4 px-8)
- State: Default, Hover, Pressed, Disabled, Loading
- Full Width: `w-full`

---

### Secondary Button
```jsx
<button className="
  px-6 py-3
  bg-light-surface dark:bg-dark-surface
  text-ocean-blue dark:text-cyan-accent
  border border-border-light dark:border-border-dark
  text-body font-semibold
  rounded-md
  h-touch min-w-touch
  transition-all duration-200
  hover:bg-gray-50 dark:hover:bg-dark-surface-elevated
  focus:outline-2 focus:outline-ocean-blue
">
  Secondary
</button>
```

---

### Ghost Button
```jsx
<button className="
  px-4 py-2
  text-ocean-blue dark:text-cyan-accent
  rounded-md
  transition-all duration-200
  hover:bg-blue-50 dark:hover:bg-opacity-5
  font-semibold
  focus:outline-2 focus:outline-cyan-accent
">
  Ghost
</button>
```

---

### Icon Button
```jsx
<button className="
  w-10 h-10
  flex items-center justify-center
  rounded-md
  bg-light-surface dark:bg-dark-surface
  text-text-dark dark:text-text-light
  hover:bg-gray-100 dark:hover:bg-dark-surface-elevated
  transition-colors duration-200
  focus:outline-2 focus:outline-cyan-accent
">
  <svg className="w-6 h-6" />
</button>
```

---

## 2. CARDS

### Basic Card
```jsx
<div className="
  p-4 md:p-6
  bg-light-surface dark:bg-dark-surface
  rounded-lg
  border border-border-light dark:border-border-dark
  shadow-elevation-2
  transition-all duration-200
  hover:shadow-elevation-3 hover:scale-102
">
  Card Content
</div>
```

### Image Card (Dive Site)
```jsx
<div className="rounded-lg overflow-hidden shadow-elevation-3 hover:shadow-elevation-4 transition-shadow">
  <img 
    src="dive-site.jpg" 
    alt="Blue Lagoon"
    className="w-full h-48 object-cover"
  />
  <div className="p-4">
    <h4 className="text-h4 font-bold text-text-dark dark:text-text-light mb-1">
      Blue Lagoon
    </h4>
    <p className="text-body-sm text-text-secondary-dark dark:text-text-secondary-light mb-3">
      Depth: 25-40m • Difficulty: Medium
    </p>
    <button className="btn-primary">View Details</button>
  </div>
</div>
```

---

## 3. INPUT FIELDS

### Text Input
```jsx
<input
  type="text"
  placeholder="Search dive sites..."
  className="
    w-full
    px-4 py-3
    h-touch
    bg-light-surface dark:bg-dark-surface
    text-text-dark dark:text-text-light
    border border-border-light dark:border-border-dark
    rounded-md
    placeholder:text-disabled
    transition-all duration-200
    focus:border-ocean-blue focus:ring-2 focus:ring-blue-200 focus:outline-none
    dark:focus:ring-blue-900
    disabled:bg-disabled disabled:opacity-50 disabled:cursor-not-allowed
  "
/>
```

### Input with Icon
```jsx
<div className="relative">
  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-disabled">
    {/* Search Icon */}
  </svg>
  <input
    type="text"
    placeholder="Search..."
    className="
      w-full pl-12 pr-4 py-3 h-touch
      bg-light-surface dark:bg-dark-surface
      border border-border-light dark:border-border-dark
      rounded-md
      focus:border-ocean-blue focus:ring-2 focus:ring-blue-200
    "
  />
</div>
```

### Input with Error State
```jsx
<div>
  <input
    type="email"
    className="
      w-full px-4 py-3 h-touch
      bg-light-surface dark:bg-dark-surface
      border-2 border-error
      rounded-md
      focus:ring-2 focus:ring-red-200
    "
  />
  <p className="mt-2 text-body-sm text-error">
    Please enter a valid email
  </p>
</div>
```

---

## 4. NAVIGATION

### Bottom Tab Navigation
```jsx
<nav className="
  fixed bottom-0 left-0 right-0
  h-16 pb-safe-bottom
  bg-dark-bg
  glass
  border-t border-border-dark
  flex items-center justify-around
  z-modal
">
  <NavLink href="/" icon={HomeIcon} label="Home" />
  <NavLink href="/explore" icon={CompassIcon} label="Explore" />
  <NavLink href="/log" icon={BookIcon} label="Log" />
  <NavLink href="/profile" icon={UserIcon} label="Profile" />
</nav>
```

### NavLink Component
```jsx
function NavLink({ href, icon: Icon, label, active }) {
  return (
    <a
      href={href}
      className={`
        flex flex-col items-center justify-center
        w-12 h-12
        rounded-md
        transition-colors duration-200
        ${active ? 'text-cyan-accent' : 'text-disabled hover:text-text-light'}
      `}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-caption">{label}</span>
    </a>
  );
}
```

### Top Navigation Header
```jsx
<header className="
  h-16
  pt-safe-top
  bg-dark-bg
  glass
  border-b border-border-dark
  flex items-center justify-between
  px-4
  sticky top-0 z-sticky
">
  <h1 className="text-h4 font-bold text-text-light">DiveDrop</h1>
  <button className="w-10 h-10 rounded-md hover:bg-dark-surface">
    {/* Menu or settings icon */}
  </button>
</header>
```

---

## 5. MODALS & DIALOGS

### Basic Modal
```jsx
<div className="
  fixed inset-0
  glass-modal
  flex items-center justify-center
  z-modal
">
  <div className="
    w-full max-w-md
    bg-light-surface dark:bg-dark-surface
    rounded-lg
    shadow-elevation-4
    p-6
    animate-scale-in
  ">
    <h2 className="text-h3 font-bold text-text-dark dark:text-text-light mb-4">
      Confirm Action
    </h2>
    <p className="text-body text-text-secondary-dark dark:text-text-secondary-light mb-6">
      Are you sure you want to proceed?
    </p>
    <div className="flex gap-3">
      <button className="flex-1 btn-secondary">Cancel</button>
      <button className="flex-1 btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## 6. LOADING STATES

### Spinner
```jsx
<div className="
  w-8 h-8
  rounded-full
  border-3 border-border-dark
  border-t-cyan-accent
  animate-spin
" />
```

### Skeleton Loading
```jsx
<div className="space-y-4">
  <div className="h-12 bg-dark-surface rounded-md animate-pulse" />
  <div className="h-24 bg-dark-surface rounded-md animate-pulse" />
  <div className="h-12 bg-dark-surface rounded-md animate-pulse" />
</div>
```

### Shimmer Effect
```jsx
<div className="
  h-32
  bg-shimmer
  bg-no-repeat
  rounded-md
  animate-shimmer
" style={{ backgroundSize: "200% 100%" }} />
```

---

## 7. ALERTS & TOASTS

### Alert Component
```jsx
<div className={`
  p-4
  rounded-md
  flex items-start gap-3
  ${variant === 'error' ? 'bg-red-50 border border-error text-error' : ''}
  ${variant === 'success' ? 'bg-green-50 border border-success text-success' : ''}
  ${variant === 'warning' ? 'bg-yellow-50 border border-warning text-warning' : ''}
`}>
  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" />
  <div>
    <h4 className="font-semibold">{title}</h4>
    <p className="text-body-sm">{message}</p>
  </div>
</div>
```

### Toast Notification
```jsx
<div className="
  fixed bottom-4 right-4
  bg-dark-surface
  text-text-light
  px-4 py-3
  rounded-md
  shadow-elevation-4
  animate-slide-up
  z-tooltip
">
  ✓ Dive log saved successfully!
</div>
```

---

## 8. FORMS

### Form Group
```jsx
<div className="mb-6">
  <label className="
    block
    text-body font-semibold
    text-text-dark dark:text-text-light
    mb-2
  ">
    Dive Site Name
  </label>
  <input
    type="text"
    className="input-base w-full"
    placeholder="Enter site name"
  />
</div>
```

### Form with Multiple Fields
```jsx
<form className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <input type="text" placeholder="First Name" className="input-base" />
    <input type="text" placeholder="Last Name" className="input-base" />
  </div>
  
  <textarea
    placeholder="Dive Notes"
    className="
      w-full px-4 py-3
      bg-light-surface dark:bg-dark-surface
      border border-border-light dark:border-border-dark
      rounded-md
      focus:border-ocean-blue focus:ring-2 focus:ring-blue-200
      min-h-24
    "
  />
  
  <button type="submit" className="btn-primary w-full">
    Save Log
  </button>
</form>
```

---

## 9. BADGES & PILLS

### Badge
```jsx
<span className="
  inline-block
  px-3 py-1
  text-caption font-semibold
  rounded-full
  bg-cyan-accent text-dark-bg
">
  Beginner
</span>
```

### Skill Badge
```jsx
<span className="
  inline-flex items-center gap-1
  px-3 py-1
  rounded-full
  text-caption font-semibold
  bg-dark-surface border border-cyan-accent
  text-cyan-accent
">
  <svg className="w-4 h-4" />
  Open Water
</span>
```

---

## 10. PAGINATION

### Pagination Component
```jsx
<div className="flex items-center justify-center gap-2 mt-8">
  <button className="btn-ghost px-3 py-2">← Prev</button>
  
  {[1, 2, 3].map(num => (
    <button
      key={num}
      className={`
        px-3 py-2 rounded-md transition-colors
        ${active ? 'bg-ocean-blue text-white' : 'hover:bg-dark-surface'}
      `}
    >
      {num}
    </button>
  ))}
  
  <button className="btn-ghost px-3 py-2">Next →</button>
</div>
```

---

## 11. GRID LAYOUTS

### Card Grid
```jsx
<div className="
  grid
  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
  gap-4 md:gap-6
  p-4 md:p-6
">
  {dives.map(dive => (
    <DiveCard key={dive.id} dive={dive} />
  ))}
</div>
```

### Responsive Container
```jsx
<div className="
  w-full max-w-4xl
  mx-auto
  px-4 sm:px-6 md:px-8
  py-6 md:py-8
">
  {/* Content */}
</div>
```

---

## 12. TABS

### Tab Component
```jsx
<div className="border-b border-border-dark">
  <div className="flex gap-8">
    {tabs.map(tab => (
      <button
        key={tab.id}
        className={`
          pb-3
          border-b-2 transition-colors
          ${active === tab.id
            ? 'border-cyan-accent text-cyan-accent'
            : 'border-transparent text-disabled hover:text-text-light'
          }
        `}
        onClick={() => setActive(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
</div>

<div className="pt-4">
  {/* Tab content */}
</div>
```

---

## 13. ANIMATIONS QUICK REFERENCE

### Button Hover
```css
@apply hover:scale-105 hover:shadow-elevation-3 transition-all duration-200
```

### Card Hover
```css
@apply hover:shadow-elevation-4 hover:scale-102 transition-all duration-300
```

### Page Entry
```css
@apply animate-slide-up
```

### Loading Spinner
```css
@apply border-t-cyan-accent animate-spin
```

### Success Pulse
```css
@apply animate-bounce-in
```

### Error Shake
```css
@apply animate-shake
```

---

## 14. DARK MODE PATTERN

Every component should support dark mode:

```jsx
<div className="
  bg-light-surface dark:bg-dark-surface
  text-text-dark dark:text-text-light
  border border-border-light dark:border-border-dark
  shadow-elevation-2
">
  Dark mode ready
</div>
```

---

## 15. ACCESSIBILITY CHECKLIST

For each component:

- [ ] Touch targets are 44px minimum
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible (outline or ring)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] ARIA labels on icons & buttons
- [ ] Screen reader friendly
- [ ] No color used as only indicator
- [ ] Motion respects `prefers-reduced-motion`

---

## 16. iOS SAFE AREA INTEGRATION

```jsx
<div className="pt-safe-top pb-safe-bottom">
  {/* Content with safe area padding */}
</div>
```

Automatically applies safe area insets for notch/dynamic island.

---

## 17. TESTING COMPONENTS

### Visual Regression
- Screenshot components at different states
- Test dark & light mode
- Test mobile, tablet, desktop

### A11y Testing
- Use axe DevTools
- Test with screen readers
- Verify color contrast
- Check keyboard navigation

### Responsive Testing
- Test at: 320px, 640px, 1024px, 1280px
- Check layout shifts
- Verify touch targets on mobile

---

## Next Steps

1. **Coder:** Build React/Vue components from these specs
2. **Figma:** Create component library with variants
3. **QA:** Test accessibility & responsiveness
4. **Team:** Add to Storybook for documentation

---

**Version:** 1.0  
**Last Updated:** 2026-06-18  
**Status:** ✅ Component specifications complete
