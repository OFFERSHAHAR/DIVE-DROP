# DiveDrop Tailwind CSS - Quick Reference Guide

## Color System

### Primary Colors
```tailwind
text-primary          /* Ocean Blue #0066CC */
text-primary-dark     /* Dark Blue #003D8C */
text-primary-light    /* Light Blue #1A5FBD */
text-accent          /* Cyan/Turquoise #00BCD4 */
text-accent-light    /* Light Cyan #48D1E0 */
```

### Status Colors (Difficulty Levels)
```tailwind
bg-success-easy      /* Green #00C853 */
bg-warning-intermediate /* Yellow #FFC400 */
bg-error-hard        /* Red #FF3D00 */
```

### Background Colors
```tailwind
bg-bg-primary        /* Light/Dark Primary */
bg-bg-secondary      /* Light/Dark Secondary */
bg-dark-bg          /* Dark Mode Background */
bg-dark-surface     /* Dark Mode Surface */
```

### Text Colors
```tailwind
text-text-primary      /* Main text */
text-text-secondary    /* Secondary text */
text-text-tertiary     /* Tertiary/disabled text */
text-text-light        /* Light mode text */
```

---

## Responsive Breakpoints

```tailwind
/* Mobile First Approach */
default              /* xs: 320px - 640px */
sm:                 /* sm: 640px - 1024px */
md:                 /* md: 1024px - 1280px */
lg:                 /* lg: 1280px - 1536px */
xl:                 /* xl: 1536px+ */
```

### Examples:
```jsx
/* Typography Scaling */
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
  Welcome to DiveDrop
</h1>

/* Grid Layouts */
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* Content */}
</div>

/* Padding Scaling */
<div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
  {/* Content */}
</div>
```

---

## Component Usage

### Button Variants
```jsx
/* Primary Button */
<Button variant="primary" size="md">
  Register
</Button>

/* Secondary Button */
<Button variant="secondary" size="md">
  Login
</Button>

/* Danger/Error Button */
<Button variant="danger" size="md">
  Delete
</Button>

/* Ghost Button */
<Button variant="ghost" size="md">
  Cancel
</Button>

/* Success Button */
<Button variant="success" size="md">
  Submit
</Button>
```

### Button Sizes
```jsx
<Button size="sm">Small (h-10)</Button>
<Button size="md">Medium (h-11)</Button>
<Button size="lg">Large (h-12)</Button>
<Button fullWidth={true}>Full Width</Button>
```

---

### Card Component
```jsx
/* Default Card */
<Card variant="default">
  <CardBody>Content</CardBody>
</Card>

/* Elevated Card (with hover) */
<Card variant="elevated" hover={true}>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>

/* Outlined Card */
<Card variant="outlined">
  <CardBody>Content</CardBody>
</Card>
```

---

### Input Component
```jsx
/* Basic Input */
<Input
  id="email"
  type="email"
  placeholder="Enter your email"
  label="Email"
/>

/* With Error */
<Input
  id="password"
  type="password"
  label="Password"
  error="Password is required"
/>

/* With Helper Text */
<Input
  id="username"
  type="text"
  label="Username"
  helperText="3-20 characters"
/>

/* Textarea */
<TextArea
  id="bio"
  label="Bio"
  placeholder="Tell us about yourself"
/>
```

---

## Spacing System

### 8px Grid
```
xs  = 8px
sm  = 16px
md  = 24px
lg  = 32px
xl  = 40px
2xl = 48px
3xl = 64px
4xl = 80px
```

### Usage Examples
```jsx
/* Margin */
<div className="mb-4">        {/* 16px bottom margin */}
<div className="mt-6">        {/* 24px top margin */}
<div className="mx-auto">     {/* center horizontally */}

/* Padding */
<div className="p-4">         {/* 16px all sides */}
<div className="px-6 py-4">  {/* 24px horizontal, 16px vertical */}

/* Gaps (flex/grid) */
<div className="gap-4">       {/* 16px gap */}
<div className="gap-6 sm:gap-8"> {/* responsive gaps */}
```

---

## Shadow System

### Elevation Levels
```jsx
shadow-elevation-1  /* Subtle shadow */
shadow-elevation-2  /* Default card shadow */
shadow-elevation-3  /* Hover shadow */
shadow-elevation-4  /* Maximum elevation */
```

### Usage
```jsx
<Card className="shadow-elevation-2 hover:shadow-elevation-3">
  {/* Card with elevation */}
</Card>
```

---

## Hover & Interactive States

### Common Patterns
```jsx
/* Hover with shadow increase */
<Card className="hover:shadow-elevation-3">

/* Hover with lift effect */
<Card className="hover:translate-y-[-2px]">

/* Hover with scale */
<img className="hover:scale-110" />

/* Hover with background change */
<div className="hover:bg-bg-secondary dark:hover:bg-dark-surface">

/* Active/Pressed state */
<Button className="active:scale-95">

/* Focus visible */
<Button className="focus-visible:outline-2 focus-visible:outline-accent">
```

---

## Dark Mode

### Approach: `class` based toggle
```jsx
/* Conditional dark mode colors */
<div className="bg-bg-primary dark:bg-dark-bg">
  <h1 className="text-text-primary dark:text-text-light">
    Hello
  </h1>
</div>

/* Dark mode wrapper */
<div className="dark">
  {/* Everything inside will use dark colors */}
</div>
```

### Common Dark Mode Pairs
```
bg-bg-primary          → dark:bg-dark-bg
bg-bg-secondary        → dark:bg-dark-surface
text-text-primary      → dark:text-text-light
text-text-secondary    → dark:text-text-secondary-light
border-border-primary  → dark:border-border-dark
shadow-elevation-2     → (shadows adapt automatically)
```

---

## Touch & Accessibility

### Touch Target Sizing
```jsx
/* Minimum 44x44px touch targets */
<Button className="touch-target">Touch Me</Button>
<input className="min-h-touch min-w-touch" />

/* Accessible focus states */
<button className="focus-visible:outline-2 focus-visible:outline-offset-2">
```

### Semantic HTML & ARIA
```jsx
<button aria-label="Close dialog">✕</button>
<input aria-invalid={hasError} aria-describedby="error-msg" />
<p id="error-msg">Error message</p>
```

---

## RTL (Right-to-Left) Support

```jsx
/* RTL Container */
<div className={isRTL ? 'rtl' : 'ltr'}>
  {/* Content */}
</div>

/* Conditional Positioning */
<div className={`absolute ${isRTL ? 'right-4' : 'left-4'}`}>

/* Badge Positioning */
<span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}>
```

---

## Image Optimization

### Aspect Ratios
```jsx
/* Square Cards */
<div className="aspect-square">
  <img src="..." alt="..." />
</div>

/* Video/Landscape */
<div className="aspect-video">
  <img src="..." alt="..." />
</div>

/* Portrait */
<div className="aspect-portrait">
  <img src="..." alt="..." />
</div>
```

### Best Practices
```jsx
/* With Lazy Loading */
<img
  src="..."
  alt="Descriptive text"
  loading="lazy"
  className="w-full h-full object-cover"
/>

/* With Fallback */
<div className="bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
  {imageUrl ? (
    <img src={imageUrl} alt="..." />
  ) : (
    <div className="text-4xl">🌊</div>
  )}
</div>
```

---

## Common Layouts

### Hero Section
```jsx
<section className="relative h-screen bg-gradient-to-r from-primary to-primary-dark">
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full" />
  </div>
  <div className="relative h-full flex items-center justify-center px-4">
    <h1 className="text-5xl md:text-7xl font-bold text-white">
      Hero Title
    </h1>
  </div>
</section>
```

### Feature Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
  {features.map((feature) => (
    <Card key={feature.id} variant="elevated">
      <CardBody className="text-center">
        <div className="text-5xl mb-4">{feature.icon}</div>
        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
        <p className="text-sm text-text-secondary">{feature.desc}</p>
      </CardBody>
    </Card>
  ))}
</div>
```

### Dive Site Card
```jsx
<Card variant="elevated" hover={true}>
  <div className="aspect-square bg-gradient-to-br from-accent/30 to-primary/30">
    <img src="..." alt="..." className="w-full h-full object-cover" />
    <div className="absolute top-4 left-4">
      <span className="bg-success-easy text-white px-3 py-1 rounded-full text-sm">
        🟢 Easy
      </span>
    </div>
  </div>
  <CardBody>
    <h3 className="text-lg font-bold line-clamp-2">{site.name}</h3>
    <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
      📍 {site.location}
    </div>
    <div className="bg-bg-secondary rounded-md p-3 mt-3">
      <p className="text-xs text-text-tertiary">Max Depth</p>
      <p className="font-bold">{site.depth}m</p>
    </div>
  </CardBody>
</Card>
```

---

## Performance Tips

1. **Use Responsive Images**: Always specify responsive sizes
2. **Lazy Load Images**: Add `loading="lazy"` to all images
3. **Optimize SVGs**: Use native SVG instead of PNG where possible
4. **Minimize CSS**: Tailwind purges unused styles in production
5. **Use CSS Variables**: Leverages design-system.css for theming

---

## Troubleshooting

### Dark Mode Not Working
- Ensure dark class is applied to html/body
- Check tailwind.config.js: `darkMode: "class"`

### Touch Targets Too Small
- Apply `min-h-touch min-w-touch` to interactive elements
- Minimum: 44x44px

### Contrast Issues
- Test with accessibility checker
- Verify color combinations meet WCAG AA

### Responsive Layout Breaking
- Use mobile-first approach (default → sm → md → lg)
- Test all breakpoints: 320px, 640px, 1024px, 1280px

---

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Resources

- Tailwind Documentation: https://tailwindcss.com/docs
- Next.js Responsive Design: https://nextjs.org
- DiveDrop Design System: See `src/styles/design-system.css`
- Component Examples: See `src/components/`

---

**Last Updated:** 2026-06-19
**Version:** 1.0
