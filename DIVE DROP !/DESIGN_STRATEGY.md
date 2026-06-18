# DiveDrop Design Strategy & Component Inventory
**Created:** 2026-06-19 | **Status:** Implementation Ready | **Priority:** Critical for Next 30 Minutes

---

## 1. MOCKUP ANALYSIS FINDINGS

### Layout Breakdown (Mobile-First)
The mockup shows two distinct screens:

**Screen 1: Home/Hero Page**
- **Hero Section (50vh)**
  - Background: High-quality underwater boat + diver image with gradient overlay
  - Branding: DiveDrop logo (white) with badge icon (top-left, 48px)
  - Headline Text: "DiveDrop" + Hebrew subtitle with depth indicator icon
  - CTA: Blue button with rounded corners (full-width on mobile)

- **Search Panel (160px)**
  - 4 input fields in 2x2 grid layout:
    - Location (dropdown/autocomplete)
    - Date picker (calendar icon)
    - Certification Level dropdown
    - Dive Type dropdown (icons visible: fish, wreck, reef)

- **Featured Sites (120px)**
  - 2 featured dive site cards (horizontal scroll on mobile)
  - Each shows: image thumbnail, name, 1-2 metadata labels

- **Bottom Navigation (60px)**
  - 5 fixed icons: Home, Explore, Bookings, Messages, Profile
  - Active state: Primary blue color + scale-up effect
  - Safe area padding for iOS notch

**Screen 2: Explore/Card Grid Page**
- **Header** with back button + filter toggle
- **Card Stack (full viewport height)**
  - Vertical scroll through dive site cards
  - Each card: 280-320px height, full-width with 16px padding
  - Right-aligned filter sidebar in Hebrew (RTL layout)
  - Filters: Depth range, difficulty, distance

### Color Palette (From Mockup)
| Element | Color | Usage |
|---------|-------|-------|
| Primary Blue | `#0066CC` | Buttons, active nav, headings |
| Cyan/Turquoise | `#00B4D8` | Accents, secondary actions, active indicators |
| Ocean Dark | `#003D8C` | Text on light, dark mode primary |
| Background | `#FFFFFF` / `#0A1428` | Light/dark mode |
| Beginner | `#4CAF50` (Green) | Difficulty badge |
| Intermediate | `#FF9800` (Orange) | Difficulty badge |
| Advanced | `#F44336` (Red) | Difficulty badge |
| Border | `#D0D5DB` | Cards, inputs, dividers |

### Typography (From Design System)
- **Headings:** Poppins, 700 weight, letter-spacing -0.5px
  - H1: 48px / 56px (mobile: 36px)
  - H2: 36px / 44px (mobile: 28px)
  - H3: 28px / 36px
  - H4: 20px / 28px (card titles)
- **Body:** Inter, 400-600 weight
  - Body Large: 16px / 24px
  - Body: 14px / 20px
  - Body Small: 12px / 16px
  - Caption: 11px / 14px (labels)

---

## 2. COMPONENT INVENTORY

### Core Primitives (Already Exist ✓)
| Component | Status | Path | Notes |
|-----------|--------|------|-------|
| Button | ✓ Exists | `src/components/Button.tsx` | CVA variants: primary, secondary, outline, ghost, danger, success |
| Card | ✓ Exists | `src/components/Card.tsx` | Variants: default, elevated, outlined |
| Input | ✓ Exists | `src/components/Input.tsx` | Base form input with validation states |
| BottomNavigation | ✓ Exists | `src/components/templates/BottomNavigation.tsx` | 5-item nav with badges, active indicators |
| DiveSiteCard | ✓ Exists | `src/components/templates/DiveSiteCard.tsx` | Image, rating, depth, difficulty, actions |

### Required New Components (Priority Order)

#### PRIORITY 1: Homepage Hero Section (Build First)
| Component | Purpose | Props | Status |
|-----------|---------|-------|--------|
| `HeroSection` | Full-height image background with overlay, branding | `image`, `headline`, `subtitle`, `cta` | NEW |
| `HeroOverlay` | Gradient overlay (top=transparent, bottom=opaque dark) | `opacity`, `direction` | NEW |
| `SearchPanel` | 2x2 grid form with 4 input dropdowns | `onSearch`, `initialValues` | NEW |
| `SearchField` | Single dropdown/autocomplete input | `label`, `options`, `icon`, `value` | NEW |

#### PRIORITY 2: Search Results & Filtering
| Component | Purpose | Props | Status |
|-----------|---------|-------|--------|
| `FilterSidebar` | Right-aligned RTL filter panel (Hebrew) | `filters`, `onChange`, `rtl` | NEW |
| `FilterGroup` | Range slider or checkbox group | `title`, `options`, `type` | NEW |
| `DepthRangeSlider` | Dual-handle slider (0-100m) | `min`, `max`, `onChange` | NEW |
| `DifficultyFilter` | Checkbox group: Beginner/Intermediate/Advanced | `selected`, `onChange` | NEW |

#### PRIORITY 3: Navigation & Layout
| Component | Purpose | Props | Status |
|-----------|---------|-------|--------|
| `MobileLayout` | Wrapper with safe area + bottom nav padding | `children`, `safeArea` | NEW |
| `PageHeader` | Header with back button + title + filter toggle | `title`, `onBack`, `onFilterToggle` | NEW |
| `BottomNavBar` | Already exists but needs locale integration | - | EXISTS ✓ |

#### PRIORITY 4: Feature Cards & Showcases
| Component | Purpose | Props | Status |
|-----------|---------|-------|--------|
| `FeaturedSiteCarousel` | Horizontal scroll section (mobile) | `sites`, `onSelect` | NEW |
| `DiveSiteDetailModal` | Full details modal overlay | `site`, `onClose`, `onBook` | NEW |

#### PRIORITY 5: Hebrew/RTL Support
| Component | Purpose | Props | Status |
|-----------|---------|-------|--------|
| `RTLProvider` | Wraps app with RTL direction context | `locale`, `children` | NEW |
| `LocalizedText` | Handles text direction per field | `text`, `locale` | NEW |

---

## 3. DESIGN BREAKDOWN BY PAGE

### Page 1: `/[locale]` (Home/Hero)
**Current Status:** Basic template exists at `src/app/[locale]/page.tsx`
**Target:** Match mockup hero + search panel

**Structure:**
```
<MobileLayout>
  <HeroSection
    image="/images/hero-diver.jpg"
    headline="DiveDrop"
    subtitle="יצאו לשחיקה הטובה ביותר"
  >
    <HeroOverlay />
    <BrandingBadge />
  </HeroSection>
  
  <SearchPanel
    onSearch={handleSearch}
    fields={[
      { name: 'location', label: 'Location', type: 'dropdown' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'certification', label: 'Cert Level', type: 'dropdown' },
      { name: 'diveType', label: 'Type', type: 'dropdown' }
    ]}
  />
  
  <FeaturedSiteCarousel
    sites={featuredSites}
    onViewDetails={handleViewDetails}
  />
  
  <BottomNavigation items={navItems} activeId="home" />
</MobileLayout>
```

**Styling Notes:**
- Hero section: `h-screen` (100vh) or `h-[60vh]` + search pulls up via negative margin
- Search panel: White background, rounded corners top-left/top-right, shadow-lg
- Grid layout: `grid-cols-2 gap-4` for 2x2 search fields
- Featured carousel: Horizontal scroll, `overflow-x-auto`, snap-scroll

---

### Page 2: `/[locale]/explore` (Dive Sites Grid + Filters)
**Current Status:** Exists at `src/app/[locale]/explore/page.tsx`
**Target:** Card grid with RTL sidebar filters

**Structure:**
```
<MobileLayout>
  <PageHeader
    title="Explore Dive Sites"
    onBack={goBack}
    onFilterToggle={toggleFilterSidebar}
  />
  
  <div className="flex gap-4">
    {/* Main content */}
    <div className="flex-1 overflow-y-auto">
      <DiveSiteGrid
        sites={sites}
        onViewDetails={handleViewDetails}
        onAddFavorite={handleFavorite}
      />
    </div>
    
    {/* Right sidebar filters (RTL) */}
    {showFilters && (
      <FilterSidebar
        dir="rtl"
        filters={filters}
        onChange={handleFilterChange}
      >
        <FilterGroup title="Depth" type="range">
          <DepthRangeSlider />
        </FilterGroup>
        <FilterGroup title="Difficulty" type="checkbox">
          <DifficultyFilter />
        </FilterGroup>
      </FilterSidebar>
    )}
  </div>
  
  <BottomNavigation items={navItems} activeId="explore" />
</MobileLayout>
```

**Responsive Behavior:**
- Mobile (<640px): Filters in collapsible overlay modal
- Tablet (640-1024px): Filters in right sidebar, cards in 2-column grid
- Desktop (>1024px): Cards in 3-column grid, filters permanently visible

---

### Page 3: `/[locale]/dashboard` (User Dashboard)
**Current Status:** Exists at `src/app/[locale]/dashboard/page.tsx`
**Target:** User stats + recent dives + recommendations

**Structure:**
```
<MobileLayout>
  <PageHeader title="Dashboard" />
  
  <div className="space-y-6 pb-20">
    {/* User Stats Cards */}
    <StatsCard
      stats={[
        { label: 'Total Dives', value: 47 },
        { label: 'Logged Hours', value: '126.5h' },
        { label: 'Favorite Sites', value: 12 }
      ]}
    />
    
    {/* Recent Dives */}
    <div>
      <h2 className="text-lg font-bold mb-4">Recent Dives</h2>
      {recentDives.map(dive => (
        <DiveHistoryItem key={dive.id} dive={dive} />
      ))}
    </div>
    
    {/* Recommended Sites */}
    <div>
      <h2 className="text-lg font-bold mb-4">Recommended For You</h2>
      <DiveSiteGrid sites={recommendedSites} />
    </div>
  </div>
  
  <BottomNavigation items={navItems} activeId="dashboard" />
</MobileLayout>
```

---

### Page 4: `/[locale]/my-dives` (Dive History)
**Current Status:** Exists at `src/app/[locale]/my-dives/page.tsx`
**Target:** Chronological list with detail cards

**Structure:**
```
<MobileLayout>
  <PageHeader title="My Dives" />
  
  <div className="space-y-3 pb-20">
    {dives.map(dive => (
      <DiveHistoryCard
        key={dive.id}
        dive={dive}
        onViewDetails={handleViewDetails}
        expanded={expandedId === dive.id}
      />
    ))}
  </div>
  
  <BottomNavigation items={navItems} activeId="my-dives" />
</MobileLayout>
```

---

### Page 5: `/[locale]/settings` (User Preferences)
**Current Status:** Partial at `src/app/[locale]/settings/page.tsx`
**Target:** Form-based settings with toggles/selects

**Structure:**
```
<MobileLayout>
  <PageHeader title="Settings" />
  
  <form className="space-y-6 pb-20">
    <FormSection title="Account">
      <FormField label="Email" value={user.email} disabled />
      <FormField label="Full Name" value={user.name} onChange={...} />
    </FormSection>
    
    <FormSection title="Diving Preferences">
      <SelectField label="Certification Level" options={levels} />
      <SelectField label="Experience Level" options={experiences} />
    </FormSection>
    
    <FormSection title="Notifications">
      <ToggleField label="Email Notifications" checked={true} />
      <ToggleField label="Push Notifications" checked={true} />
    </FormSection>
    
    <FormSection title="Accessibility">
      <SelectField label="Language" options={languages} value={locale} />
      <ToggleField label="Dark Mode" checked={isDarkMode} />
    </FormSection>
    
    <div className="flex gap-2">
      <Button variant="primary" fullWidth>Save Changes</Button>
      <Button variant="secondary" fullWidth>Logout</Button>
    </div>
  </form>
  
  <BottomNavigation items={navItems} activeId="settings" />
</MobileLayout>
```

---

## 4. COLOR PALETTE & DESIGN TOKENS

### CSS Variables (Already in `design-system.css` ✓)
```css
/* Primary Brand Colors */
--color-primary: #0066CC;           /* Main blue */
--color-primary-dark: #003D8C;      /* Darker blue for hover */
--color-primary-light: #1A5FBD;     /* Lighter blue for focus */
--color-accent: #00B4D8;            /* Cyan/turquoise */
--color-accent-light: #48D1E0;      /* Light cyan */

/* Status Colors */
--color-success: #00C853;           /* Green (beginner) */
--color-warning: #FFC400;           /* Orange (intermediate) */
--color-error: #FF3D00;             /* Red (advanced) */
--color-info: #00B4D8;              /* Blue */

/* Difficulty-Specific Overrides (New) */
--difficulty-beginner: #4CAF50;     /* Bright green */
--difficulty-intermediate: #FF9800; /* Orange */
--difficulty-advanced: #F44336;     /* Red */

/* Spacing Scale (Baseline 8px) */
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 40px;
--space-2xl: 48px;

/* Border Radius */
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-full: 9999px;

/* Shadows (Enhanced) */
--shadow-1: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-2: 0 4px 12px rgba(0, 0, 0, 0.12);
--shadow-3: 0 8px 24px rgba(0, 0, 0, 0.16);
--shadow-elevation: 0 16px 40px rgba(0, 102, 204, 0.15); /* Blue shadow for elevation */

/* Typography Hierarchy */
--font-heading: "Poppins", system-ui;
--font-sans: "Inter", system-ui;

/* Motion */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--easing-out: cubic-bezier(0.4, 0, 0.2, 1);
--easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### New Tailwind Utilities (Add to config)
```js
// tailwind.config.ts additions
theme: {
  extend: {
    colors: {
      'dive-primary': '#0066CC',
      'dive-accent': '#00B4D8',
      'difficulty': {
        'beginner': '#4CAF50',
        'intermediate': '#FF9800',
        'advanced': '#F44336',
      }
    },
    spacing: {
      'safe-bottom': 'env(safe-area-inset-bottom)',
      'safe-top': 'env(safe-area-inset-top)',
    }
  }
}
```

---

## 5. RESPONSIVE DESIGN STRATEGY

### Breakpoints (Mobile-First)
| Screen | Breakpoint | Device | Cards | Nav | Layout |
|--------|-----------|--------|-------|-----|--------|
| Mobile | <640px | iPhone, small Android | 1 col full-width | Bottom bar (fixed) | Stack vertical |
| Tablet | 640-1024px | iPad, large Android | 2 cols | Bottom bar or side | 2-col layout |
| Desktop | >1024px | Web browser | 3 cols | Horizontal top | 3-col + sidebar |

### Mobile-First CSS Grid
```css
/* Default: 1 column (mobile) */
.grid-dive-sites {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

/* Tablet: 2 columns */
@media (min-width: 640px) {
  .grid-dive-sites {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .grid-dive-sites {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Safe Area Handling (iOS)
```css
/* Hero section with safe area */
.hero {
  padding-top: max(24px, env(safe-area-inset-top));
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Bottom nav with safe area */
.nav-bottom {
  padding-bottom: env(safe-area-inset-bottom);
  height: calc(60px + env(safe-area-inset-bottom));
}
```

### RTL (Right-to-Left) Support
```css
/* Arabic/Hebrew right-to-left */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Logical properties for RTL */
.filter-panel {
  margin-inline-end: 16px;  /* Right margin in LTR, left in RTL */
  padding-inline-start: 16px; /* Left padding in LTR, right in RTL */
}

/* Flex reversal */
[dir="rtl"] .flex {
  flex-direction: row-reverse;
}
```

---

## 6. IMPLEMENTATION PRIORITY (Next 30 Minutes)

### Phase 1: Critical Foundation (10 minutes)
- [ ] Create `HeroSection.tsx` component with image background + overlay
- [ ] Create `SearchPanel.tsx` with 2x2 grid layout
- [ ] Update home page to use new components
- [ ] Verify bottom navigation appears and is styled correctly

### Phase 2: Search & Filtering (10 minutes)
- [ ] Create `FilterSidebar.tsx` with RTL support
- [ ] Create `FilterGroup.tsx` for filter organization
- [ ] Create `DepthRangeSlider.tsx` component
- [ ] Create `DifficultyFilter.tsx` checkbox group
- [ ] Wire explore page to use new filters

### Phase 3: Mobile Layout & Navigation (5 minutes)
- [ ] Create `MobileLayout.tsx` wrapper with safe area handling
- [ ] Create `PageHeader.tsx` with back button + title
- [ ] Update all pages to use MobileLayout
- [ ] Test bottom navigation active states on each page
- [ ] Verify RTL layout on settings/profile pages

### Phase 4: Refinement & Polish (5 minutes)
- [ ] Add hero image asset paths
- [ ] Test responsive breakpoints (mobile/tablet/desktop)
- [ ] Verify colors match mockup (especially difficulty badges)
- [ ] Add loading states to DiveSiteCard
- [ ] Test dark mode across all components

---

## 7. FILE STRUCTURE PLAN

### New Components to Create
```
src/components/
├── HeroSection.tsx          (Hero image + overlay + branding)
├── SearchPanel.tsx          (2x2 search grid)
├── SearchField.tsx          (Single input + dropdown)
├── FilterSidebar.tsx        (RTL-aware filter panel)
├── FilterGroup.tsx          (Filter section container)
├── DepthRangeSlider.tsx     (Dual-handle range input)
├── DifficultyFilter.tsx     (Checkbox group for difficulty)
├── MobileLayout.tsx         (Wrapper with safe area + nav)
├── PageHeader.tsx           (Header with back button)
├── FeaturedSiteCarousel.tsx (Horizontal scroll cards)
├── DiveHistoryCard.tsx      (Expandable dive entry)
├── DiveHistoryItem.tsx      (Compact dive entry)
├── StatsCard.tsx            (Grid of stat cards)
├── FormSection.tsx          (Settings form section)
├── FormField.tsx            (Text input with label)
├── SelectField.tsx          (Dropdown select field)
├── ToggleField.tsx          (On/off toggle switch)
├── RTLProvider.tsx          (Context provider for RTL)
└── LocalizedText.tsx        (Text direction helper)

src/app/[locale]/
├── layout.tsx               (UPDATE: Add RTLProvider, update nav)
├── page.tsx                 (UPDATE: Use HeroSection + SearchPanel)
├── explore/
│   └── page.tsx             (UPDATE: Use FilterSidebar)
├── dashboard/
│   └── page.tsx             (UPDATE: Use StatsCard, DiveHistoryCard)
├── my-dives/
│   └── page.tsx             (UPDATE: Use DiveHistoryCard)
└── settings/
    └── page.tsx             (UPDATE: Use FormSection components)

public/images/
├── hero-diver.jpg           (Hero background)
├── hero-boat.jpg            (Alternative hero)
├── logo-white.png           (Logo asset)
└── dive-type-icons/         (Fish, wreck, reef SVGs)
```

---

## 8. IMPLEMENTATION CHECKLIST

### Required Dependencies (Check package.json)
- [x] React 19.2.4 - Core framework
- [x] Next.js 16.2.9 - Framework
- [x] Tailwind CSS 4 - Styling (CSS only, no components)
- [x] class-variance-authority - CVA variants
- [x] clsx - Class merging
- [x] next-intl - i18n for RTL/LTR
- [ ] (Optional) rc-slider - Range slider component

### Completed Components (Already Exist)
- [x] Button (with variants: primary, secondary, outline, ghost, danger, success)
- [x] Card (with variants: default, elevated, outlined)
- [x] Input (base form input)
- [x] BottomNavigation (5-item with badges)
- [x] DiveSiteCard (with image, rating, depth, difficulty)
- [x] Design System CSS (colors, spacing, typography, animations)

### New Components to Build
- [ ] HeroSection
- [ ] SearchPanel + SearchField
- [ ] FilterSidebar + FilterGroup + DepthRangeSlider + DifficultyFilter
- [ ] MobileLayout + PageHeader
- [ ] FeaturedSiteCarousel
- [ ] DiveHistoryCard + StatsCard
- [ ] Form components (FormSection, FormField, SelectField, ToggleField)
- [ ] RTL utilities (RTLProvider, LocalizedText)

---

## 9. STYLING APPROACH

### CSS Strategy
- **No Tailwind components library** (project uses CSS Variables + custom CSS)
- Use Tailwind for utility classes (flex, grid, spacing, etc.)
- Use CSS variables from `design-system.css` for colors
- Use CVA (class-variance-authority) for component variants
- Use `clsx` for conditional class merging

### Example Component Pattern
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const heroProp = cva(
  'relative w-full overflow-hidden',
  {
    variants: {
      height: {
        full: 'h-screen',
        half: 'h-[60vh]',
        small: 'h-96',
      },
    },
    defaultVariants: {
      height: 'full',
    },
  }
);

export const HeroSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof heroProp>
>(({ height, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(heroProp({ height }), className)}
    {...props}
  />
));
```

---

## 10. PERFORMANCE & ACCESSIBILITY NOTES

### Mobile Performance
- Images: Use `loading="lazy"` for cards below fold
- Navigation: Use Link prefetch on next/link
- Modals: Use portal pattern to avoid layout thrashing
- Safe area: Use CSS env() variables (no JS required)

### Accessibility (WCAG 2.1 AA)
- [ ] All interactive elements ≥44px touch target
- [ ] Focus visible on all buttons (ring-2 focus-visible)
- [ ] Color contrast ≥4.5:1 for text
- [ ] Semantic HTML: nav, section, article, button
- [ ] ARIA labels for icons
- [ ] Keyboard navigation for all controls
- [ ] Screen reader support for badges/notifications

### Dark Mode
- Use `prefers-color-scheme: dark` media query
- CSS variables automatically switch (already in design-system.css)
- Test color contrast in both modes

---

## 11. NEXT IMMEDIATE STEPS (0-5 minutes)

1. **Start with HeroSection component**
   - File: `src/components/HeroSection.tsx`
   - Use `bgImage` prop for flexible image source
   - Include overlay gradient (transparent top → dark bottom)
   - Position branding elements absolutely

2. **Create SearchPanel component**
   - File: `src/components/SearchPanel.tsx`
   - 2x2 grid layout with gap
   - White background, rounded corners, shadow
   - 4 dropdown fields: location, date, cert, type

3. **Update home page**
   - File: `src/app/[locale]/page.tsx`
   - Remove gradient placeholder
   - Add HeroSection + SearchPanel above fold
   - Keep featured sites carousel below
   - Ensure mobile-first layout

4. **Verify styling**
   - Colors match design-system.css variables
   - Spacing uses `--space-*` variables
   - Buttons use Button component with variants
   - No hardcoded colors (use CSS variables)

---

## 12. DESIGN SYSTEM QUICK REFERENCE

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #0066CC | Primary CTA, active nav |
| `--color-accent` | #00B4D8 | Secondary actions, highlights |
| `--color-error` | #FF3D00 | Alerts, destructive actions |
| `--space-md` | 24px | Standard padding/margin |
| `--space-sm` | 16px | Compact spacing |
| `--radius-lg` | 16px | Card border radius |
| `--shadow-2` | Medium shadow | Cards |
| `--shadow-3` | Large shadow | Modals, hover states |
| `--duration-base` | 200ms | Standard transitions |

---

**Total Estimated Build Time: 30 minutes**
- Phase 1: 10 min (Hero + Search)
- Phase 2: 10 min (Filters)
- Phase 3: 5 min (Layout + Nav)
- Phase 4: 5 min (Polish + Testing)

**Deliverable:** All components built, home page matches mockup, navigation functional across all pages.
