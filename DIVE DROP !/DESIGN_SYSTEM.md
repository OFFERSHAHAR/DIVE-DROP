# DiveDrop Design System v1.0

## Brand Identity

**App Name:** DiveDrop  
**Tagline:** "Explore the Deep"  
**Personality:** Premium, Adventurous, Immersive, Modern  
**Platform:** iOS/Web (Mobile-first)  

---

## 1. COLOR PALETTE

### Primary Colors
- **Ocean Blue** `#0066CC` - Primary actions, nav highlights
- **Deep Blue** `#003D8C` - Darker variant for hover states
- **Cyan Accent** `#00B4D8` - Secondary actions, highlights
- **Aqua** `#48D1E0` - Light accent for depth

### Background Colors
- **Dark Mode Background** `#0A1428` - Main surface
- **Dark Mode Surface** `#1A2332` - Elevated surfaces (cards, modals)
- **Light Mode Background** `#FFFFFF` - Main surface
- **Light Mode Surface** `#F8FAFC` - Elevated surfaces

### Status Colors
- **Success** `#00C853` - Confirmations, achievements
- **Warning** `#FFC400` - Alerts, cautions
- **Error** `#FF3D00` - Errors, destructive actions
- **Info** `#00B4D8` - Information messages

### Neutral Colors
- **Text Dark** `#0A1428` - Primary text on light backgrounds
- **Text Light** `#E8EEF5` - Primary text on dark backgrounds
- **Disabled** `#80878F` - Disabled state, secondary text
- **Border** `#D0D5DB` (light), `#2A3340` (dark)

---

## 2. TYPOGRAPHY

### Font Family
- **Primary:** "Inter" or "SF Pro Display" (system font fallback)
- **Secondary:** "Poppins" (headings, emphasis)

### Scale & Line Height
- **H1 (Hero):** 48px / 56px (1.17) - Bold (700)
- **H2 (Heading):** 36px / 44px (1.22) - Bold (700)
- **H3 (Section):** 28px / 36px (1.29) - Semibold (600)
- **H4 (Subheading):** 20px / 28px (1.4) - Semibold (600)
- **Body Large:** 16px / 24px (1.5) - Regular (400)
- **Body Regular:** 14px / 20px (1.43) - Regular (400)
- **Body Small:** 12px / 16px (1.33) - Regular (400)
- **Caption:** 11px / 14px (1.27) - Regular (400)

---

## 3. SPACING SYSTEM (8px Grid)

```
8px   = 1 unit
16px  = 2 units (xs)
24px  = 3 units (sm)
32px  = 4 units (md)
40px  = 5 units (lg)
48px  = 6 units (xl)
64px  = 8 units (2xl)
80px  = 10 units (3xl)
```

### Common Use Cases
- **Padding (cards):** 16px-24px
- **Padding (buttons):** 12px (vertical) × 20px (horizontal)
- **Gap (grid items):** 16px-24px
- **Margin (sections):** 32px-48px

---

## 4. ELEVATION & SHADOWS

### Shadow System (Depth Levels)

**Surface Elevation 0** (Flat)
```css
box-shadow: none;
```

**Surface Elevation 1** (Subtle Lift)
```css
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08),
            0 1px 2px rgba(0, 0, 0, 0.04);
```

**Surface Elevation 2** (Card/Input)
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12),
            0 2px 4px rgba(0, 0, 0, 0.08);
```

**Surface Elevation 3** (Prominent)
```css
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16),
            0 4px 8px rgba(0, 0, 0, 0.1);
```

**Surface Elevation 4** (Modal/Dropdown)
```css
box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2),
            0 8px 16px rgba(0, 0, 0, 0.12);
```

### Backdrop Blur (Glass Morphism)
- **Navigation:** `backdrop-filter: blur(12px)` + `background: rgba(10, 20, 40, 0.8)`
- **Modal Backdrop:** `backdrop-filter: blur(8px)` + `background: rgba(0, 0, 0, 0.6)`

---

## 5. BORDER RADIUS

- **Sharp:** `0px` - Minimal use
- **Small (Inputs):** `6px`
- **Medium (Cards, Buttons):** `12px`
- **Large (Modals, Containers):** `16px`
- **Full Circle:** `9999px` - Pills, avatars

---

## 6. COMPONENT SPECIFICATIONS

### Buttons

**Primary Button**
- BG: `#0066CC`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Border Radius: `12px`
- Font: Body Regular, Semibold
- Height: `44px` (touch-friendly)

**States:**
- Default: Blue, shadow-2
- Hover: `#003D8C`, shadow-3
- Pressed: `#002E6E`, shadow-2
- Disabled: `#80878F`, no shadow
- Loading: Spinner overlay

**Secondary Button**
- BG: `#F8FAFC` (light) / `#1A2332` (dark)
- Text: `#0066CC`
- Border: `1px solid #D0D5DB` (light) / `#2A3340` (dark)
- Padding: `12px 24px`
- Border Radius: `12px`

**Ghost Button**
- BG: Transparent
- Text: `#0066CC`
- Border: None
- Padding: `12px 24px`
- Hover: BG `rgba(0, 102, 204, 0.08)`

**Icon Button**
- Size: `40px × 40px`
- Icon: `20px × 20px`
- Border Radius: `12px`
- Padding: `8px`

---

### Cards

**Structure:**
- Padding: `16px-24px`
- Border Radius: `16px`
- BG: Surface (elevated)
- Shadow: `shadow-2`
- Border: `1px solid #D0D5DB` (light) / `#2A3340` (dark)

**Hover State:**
- Shadow: `shadow-3`
- Transform: `scale(1.02)`
- Transition: `0.2s ease-out`

---

### Input Fields

**Structure:**
- Height: `44px`
- Padding: `12px 16px`
- Border Radius: `12px`
- Font: Body Regular
- Border: `1px solid #D0D5DB` (light) / `#2A3340` (dark)

**States:**
- **Default:** Border color
- **Focused:** Border `#0066CC`, shadow-2, outline none
- **Filled:** Text color applies
- **Error:** Border `#FF3D00`, helper text red
- **Disabled:** BG `#80878F`, opacity 0.5

---

### Navigation (BottomTab + TopNav)

**Bottom Navigation (Mobile)**
- Height: `60px` + safe area bottom
- BG: `rgba(10, 20, 40, 0.95)` with `backdrop-filter: blur(12px)`
- Icon Size: `24px`
- Label: Caption, secondary text
- Active: Cyan accent (`#00B4D8`)
- Inactive: Disabled gray (`#80878F`)

**Top Navigation (Web/Header)**
- Height: `64px`
- BG: Dark blue with blur glass effect
- Padding: `12px 24px`
- Logo: `32px`
- Border: `1px solid #2A3340` (bottom border)

---

## 7. RESPONSIVE DESIGN

### Breakpoints
- **Mobile:** 320px - 639px (base)
- **Tablet:** 640px - 1023px
- **Desktop:** 1024px - 1279px
- **Ultra-wide:** 1280px+

### Safe Area (iOS)
- **Top:** 44px - 50px (notch/dynamic island)
- **Bottom:** 34px - 40px (home indicator)

### Touch Target Size
- Minimum: `44px × 44px`
- Comfortable: `48px × 48px`
- Safe zone (buttons): 8px minimum between targets

---

## 8. ANIMATION & MICRO-INTERACTIONS

### Timing Functions
- **Quick Actions:** `0.15s cubic-bezier(0.4, 0, 0.2, 1)` (easeOutQuad)
- **Standard:** `0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **Slow/Transitions:** `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (decelerate)
- **Spring:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring-like bounce)

### Button Interactions
- **Hover:** Scale 1.05, shadow-3
- **Press:** Scale 0.98, shadow-2 (tactile)
- **Ripple:** Fade-in circle from center, 0.4s

### Page Transitions
- **Entry:** Slide up + fade, 0.3s
- **Exit:** Slide down + fade, 0.2s
- **Modal:** Zoom in (scale 0.9→1.0) + backdrop fade, 0.25s

### Loading States
- **Spinner:** 1s rotation, infinite
- **Pulse:** 2s opacity pulse
- **Skeleton:** Shimmer gradient moving left→right, 1.5s loop

### Success/Error Animation
- **Success:** Checkmark scale bounce (0→1.2→1), 0.5s
- **Error:** Shake animation (±3px), 0.4s

---

## 9. DARK MODE & LIGHT MODE

### Auto Switching
- Default: System preference (prefers-color-scheme)
- Manual override in settings

### Color Mapping
```css
/* Light Mode (default) */
--bg-primary: #FFFFFF;
--bg-secondary: #F8FAFC;
--text-primary: #0A1428;
--text-secondary: #5A6370;
--border: #D0D5DB;

/* Dark Mode */
--bg-primary: #0A1428;
--bg-secondary: #1A2332;
--text-primary: #E8EEF5;
--text-secondary: #A8B0BC;
--border: #2A3340;
```

### Transition
- Duration: `0.3s`
- Function: `ease-in-out`

---

## 10. ACCESSIBILITY (WCAG AA)

### Color Contrast
- **Text on Background:** 4.5:1 (AA)
- **Large Text (18px+):** 3:1 (AA)
- **Interactive Elements:** 3:1 (AA)

### Testing
- Test with WebAIM Contrast Checker
- Verify with axe DevTools
- Check: Focus visible, keyboard nav, screen reader

### Focus Indicators
- **Color:** `#00B4D8` (cyan)
- **Style:** `outline: 2px solid #00B4D8, outline-offset: 2px`
- **Animation:** None (avoid distraction)

---

## 11. TYPOGRAPHY HIERARCHY

### Example Page Structure
```
H1: "Discover Dive Sites"          (48px, hero)
    └─ Body Large: Subtitle         (16px)

H2: "Popular This Week"             (36px, section)
    └─ Card H4: "Blue Lagoon"       (20px)
        └─ Body Regular: "Depth..."  (14px)
        └─ Caption: "5 reviews"      (11px)
```

---

## 12. ICONS

### Specifications
- **Size:** 16px, 20px, 24px, 32px, 40px
- **Stroke:** 2px (consistent)
- **Family:** Custom SVG or Material Icons
- **Color:** Inherit text color or explicit

### Navigation Icons
- **Home, Explore, Log, Profile, Settings**
- Size: 24px (nav bar)
- Style: Rounded, modern

---

## 13. GRADIENTS (Depth/Water Effect)

### Ocean Gradient
```css
background: linear-gradient(135deg, #0066CC 0%, #003D8C 50%, #001F4D 100%);
```

### Light Overlay Gradient
```css
background: linear-gradient(to bottom, rgba(0, 102, 204, 0.1), transparent);
```

### Shimmer Effect (Loading)
```css
background: linear-gradient(90deg, 
  #1A2332 0%, 
  #2A3340 50%, 
  #1A2332 100%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

---

## 14. IMPLEMENTATION CHECKLIST

- [ ] Tailwind Config updated with custom colors
- [ ] Custom CSS variables defined
- [ ] Component library built (React/Vue)
- [ ] Dark mode toggle functional
- [ ] Mobile navigation responsive
- [ ] Touch targets verified (44px+)
- [ ] Color contrast verified (WCAG AA)
- [ ] Animations tested (no motion accessible)
- [ ] iOS safe areas applied
- [ ] Web breakpoints tested
- [ ] Figma design system created
- [ ] Component storybook set up

---

## 15. DESIGN TOKENS (Exportable)

```json
{
  "colors": {
    "primary": "#0066CC",
    "primary_dark": "#003D8C",
    "accent": "#00B4D8",
    "success": "#00C853",
    "error": "#FF3D00",
    "bg_dark": "#0A1428",
    "bg_surface": "#1A2332",
    "bg_light": "#FFFFFF",
    "text_dark": "#0A1428",
    "text_light": "#E8EEF5"
  },
  "typography": {
    "h1": { "size": "48px", "weight": 700, "lineHeight": "56px" },
    "h2": { "size": "36px", "weight": 700, "lineHeight": "44px" },
    "body": { "size": "16px", "weight": 400, "lineHeight": "24px" },
    "caption": { "size": "11px", "weight": 400, "lineHeight": "14px" }
  },
  "spacing": {
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "32px",
    "xl": "40px"
  },
  "radius": {
    "sm": "6px",
    "md": "12px",
    "lg": "16px",
    "full": "9999px"
  }
}
```

---

## 16. NEXT STEPS FOR TEAM

1. **Coder:** Convert this to Tailwind + CSS in code
2. **QA:** Verify contrast & responsive design
3. **Orchestrator:** Assign component builds
4. **Figma:** Create component library matching this spec

---

**Status:** ✅ Design System Foundation Complete  
**Updated:** 2026-06-18  
**Version:** 1.0
