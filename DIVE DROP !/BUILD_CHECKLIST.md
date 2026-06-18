# DiveDrop Design Implementation Checklist
**Quick Reference for Building** | Last Updated: 2026-06-19

---

## 📖 Start Here

Before you begin, read these in order:
- [ ] DESIGN_DOCS_README.md (orientation)
- [ ] DESIGN_QUICK_START.md (phases & timing)
- [ ] This checklist (validation)

---

## ⏱️ Phase 1: Hero & Search (10 minutes)

### Components to Create

- [ ] **src/components/HeroSection.tsx**
  - Props: bgImage, headline, subtitle, height?, children?
  - Features: Background image + gradient overlay
  - Styling: Full-width, configurable height (default: h-screen)
  - Save as: Component exported as `HeroSection`
  - Test: Display in browser with sample image

- [ ] **src/components/SearchField.tsx**
  - Props: label, name, value, onChange, options?, type?, icon?
  - Features: Dropdown/select/date/text input with label
  - Styling: 44px height (touch target), full-width
  - Validation: Has min-height 44px
  - Test: All input types work

- [ ] **src/components/SearchPanel.tsx**
  - Props: fields, onSearch, defaultValues?
  - Features: 2×2 grid form layout
  - Styling: White bg, rounded corners, shadow-2, full-width submit button
  - Validation: Negative margin (-mt-12) pulls it over hero
  - Test: Form submits with console log or callback

- [ ] **src/components/FeaturedSiteCarousel.tsx**
  - Props: sites, onSelect?, onAddFavorite?
  - Features: Horizontal scroll (overflow-x-auto snap-x)
  - Styling: Cards ~280px wide, hide scrollbar
  - Uses: DiveSiteCard component (existing)
  - Test: Smooth horizontal scrolling on mobile

### Page Updates

- [ ] **src/app/[locale]/page.tsx**
  - Remove: Old gradient placeholder
  - Add: `<HeroSection />`
  - Add: `<SearchPanel />`
  - Keep: Featured carousel below
  - Add: BottomNavigation with active="home"
  - Test: Hero + search visible, bottom nav appears

### Validation

- [ ] Hero image displays with gradient overlay
- [ ] Search panel 2×2 grid visible below hero
- [ ] Featured carousel scrolls horizontally
- [ ] Bottom nav shows with home icon active
- [ ] No console errors
- [ ] Mobile responsive (stacks on small screens)

**Phase 1 Complete When:** Home page matches mockup hero section ✓

---

## ⏱️ Phase 2: Filtering (10 minutes)

### Components to Create

- [ ] **src/components/FilterGroup.tsx**
  - Props: title, type, children
  - Features: Section container with title + bottom border
  - Styling: Padding 16px 0, text flex-col gap-2
  - Test: Container displays correctly

- [ ] **src/components/DepthRangeSlider.tsx**
  - Props: min, max, value, onChange, step?, unit?
  - Features: Dual-handle range slider (0-100m)
  - Styling: Blue track, round handles
  - Accessibility: Keyboard navigation (arrow keys)
  - Test: Handles move, onChange fires, labels update

- [ ] **src/components/DifficultyFilter.tsx**
  - Props: selected, onChange, options?
  - Features: Checkbox group (Beginner/Intermediate/Advanced)
  - Styling: Colors - Beginner=#4CAF50, Intermediate=#FF9800, Advanced=#F44336
  - Labels: Row layout, hover background
  - Test: Checkboxes toggle, onChange fires

- [ ] **src/components/FilterSidebar.tsx**
  - Props: filters, onChange, rtl?, isOpen?, onClose?
  - Features: Right-aligned panel (280px) or overlay on mobile
  - RTL: dir="rtl" attribute when rtl={true}
  - Mobile: Close button, overlay backdrop
  - Styling: Border-left divider, padding 20px
  - Test: Opens/closes, shows filters, RTL layout works

### Page Updates

- [ ] **src/app/[locale]/explore/page.tsx**
  - Add: `<PageHeader />` (will create in Phase 3)
  - Add: Filter state (showFilters boolean)
  - Add: `{showFilters && <FilterSidebar />}`
  - Add: DiveSiteGrid in left column
  - Add: BottomNavigation with active="explore"
  - Test: Filter button toggles sidebar (mobile)

### Validation

- [ ] Filter sidebar appears on explore page
- [ ] Mobile: Filters in overlay modal (toggle with button)
- [ ] Desktop: Sidebar on right side
- [ ] RTL layout flips on he locale
- [ ] Depth slider works (values update)
- [ ] Difficulty checkboxes toggle
- [ ] Filters update displayed cards
- [ ] No console errors

**Phase 2 Complete When:** Explore page shows filters and cards ✓

---

## ⏱️ Phase 3: Layout & Navigation (5 minutes)

### Components to Create

- [ ] **src/components/MobileLayout.tsx**
  - Props: children, className?
  - Features: Wrapper with safe area padding + bottom nav space
  - Styling: 
    - flex flex-col min-h-screen
    - pb-[calc(60px+env(safe-area-inset-bottom))]
    - padding from CSS env() variables
  - Safe Area: paddingTop/Left/Right/Bottom from env()
  - Test: Content doesn't overlap bottom nav, safe areas visible

- [ ] **src/components/PageHeader.tsx**
  - Props: title, onBack?, onFilterToggle?
  - Features: 56px height header with back button + title
  - Styling: Sticky positioning (z-40), border-bottom
  - Back Button: Icon button (44px), calls onBack()
  - Filter Button: Right-aligned, calls onFilterToggle()
  - Test: Buttons clickable, header sticky, height correct

### Layout Updates

- [ ] **src/app/[locale]/layout.tsx**
  - Wrap page content: `<MobileLayout>{children}</MobileLayout>`
  - Ensure BottomNavigation is inside MobileLayout
  - Safe area padding applied
  - Test: All pages have header + nav

### Page Updates

- [ ] **src/app/[locale]/page.tsx**
  - Add: `<MobileLayout>` wrapper (remove if already there)
  - Add: BottomNavigation with active="home"

- [ ] **src/app/[locale]/explore/page.tsx**
  - Add: `<PageHeader title="Explore" onFilterToggle={...} />`
  - Add: BottomNavigation with active="explore"

- [ ] **src/app/[locale]/dashboard/page.tsx**
  - Add: `<PageHeader title="Dashboard" onBack={goBack} />`
  - Add: BottomNavigation with active="dashboard"
  - (Components for content: create in Phase 4)

- [ ] **src/app/[locale]/my-dives/page.tsx**
  - Add: `<PageHeader title="My Dives" onBack={goBack} />`
  - Add: BottomNavigation with active="my-dives"
  - (Components for content: create in Phase 4)

- [ ] **src/app/[locale]/settings/page.tsx**
  - Add: `<PageHeader title="Settings" onBack={goBack} />`
  - Add: BottomNavigation with active="settings"
  - (Components for content: create in Phase 4)

### Validation

- [ ] All pages have PageHeader visible
- [ ] Back button works (except home)
- [ ] Bottom nav visible on all pages
- [ ] Bottom nav active state changes per page
- [ ] Content doesn't overlap bottom nav
- [ ] Safe areas work on iPhone (test on device or simulator)
- [ ] No horizontal scrollbar on mobile
- [ ] No console errors

**Phase 3 Complete When:** All pages have header + nav, safe areas work ✓

---

## ⏱️ Phase 4: Polish (5 minutes)

### Components to Create

- [ ] **src/components/StatsCard.tsx**
  - Props: stats (label, value, unit?, icon?), layout?
  - Features: Grid layout for stat items
  - Styling: 3 columns (mobile: 1, tablet: 2, desktop: 3)
  - Values: Large text (h3), labels small (12px)
  - Test: Layout responsive, values display correctly

- [ ] **src/components/DiveHistoryCard.tsx**
  - Props: dive, onViewDetails?, expanded?, onToggleExpand?
  - Features: Collapsible/expandable card
  - Collapsed: Date + Site Name + Depth + arrow
  - Expanded: Image + duration + notes + details
  - Styling: Card component with smooth expand animation
  - Test: Toggle expand/collapse, animation smooth

- [ ] **src/components/FormSection.tsx**
  - Props: title, description?, children
  - Features: Section container for form
  - Styling: Padding 24px, border-bottom divider
  - Title: h4 (20px, font-600)
  - Description: Small (12px, text-secondary)
  - Test: Title + children display correctly

- [ ] **src/components/FormField.tsx**
  - Props: label, error?, helpText?, icon?, ...inputProps
  - Features: Text input with label + optional help/error text
  - Styling: flex-col, label 14px font-600
  - Error State: border-error color, help-text red
  - Test: All states display (normal, error, help text)

- [ ] **src/components/SelectField.tsx**
  - Props: label, options, error?, ...selectProps
  - Features: Dropdown select with label
  - Styling: Full-width, 44px height, rounded-md
  - Options: Map to <option> elements
  - Test: Dropdown opens, options selectable

- [ ] **src/components/ToggleField.tsx**
  - Props: label, checked, onChange, description?
  - Features: On/off toggle switch
  - Styling: 48px × 28px switch, flex row space-between
  - Animation: 200ms ease-out
  - Test: Toggle works, animation smooth

### Page Updates

- [ ] **src/app/[locale]/dashboard/page.tsx**
  - Add: `<StatsCard stats={[ {label, value}, ... ]} />`
  - Add: Recent dives section with `<DiveHistoryCard />`
  - Add: Recommended sites section with DiveSiteGrid
  - Test: Stats display, dives list scrolls, cards expandable

- [ ] **src/app/[locale]/my-dives/page.tsx**
  - Add: Loop of `<DiveHistoryCard expanded={expandedId === id} />`
  - State: expandedId to track which card is expanded
  - Test: Cards expand/collapse smoothly, only one open at a time

- [ ] **src/app/[locale]/settings/page.tsx**
  - Add: `<form>` wrapper
  - Add: Multiple `<FormSection>` containers:
    - Account: FormField (email disabled, name editable)
    - Diving: SelectField (cert level, experience)
    - Notifications: ToggleField (email, push)
    - Accessibility: SelectField (language), ToggleField (dark mode)
  - Add: Save + Logout buttons
  - State: Form state with useState
  - Test: All form fields work, locale change works, dark mode toggles

### Validation

- [ ] StatsCard displays correctly (3-col grid)
- [ ] DiveHistoryCard expands/collapses smoothly
- [ ] All form fields are functional (no TypeScript errors)
- [ ] Settings page shows language + dark mode options
- [ ] RTL layout correct on he locale
- [ ] Dark mode toggle actually changes colors
- [ ] Form submit doesn't error
- [ ] No console errors

**Phase 4 Complete When:** All pages functional, forms work, no errors ✓

---

## ✅ Quality Gates (Final Validation)

### Visual Quality

- [ ] Colors match design-system.css variables
  - Primary: #0066CC
  - Accent: #00B4D8
  - Beginner: #4CAF50
  - Intermediate: #FF9800
  - Advanced: #F44336

- [ ] Typography correct
  - Headings: Poppins, 700 weight
  - Body: Inter, 400-600 weight
  - H1: 48px (mobile: 36px)
  - Card title: 20px
  - Small text: 12px

- [ ] Spacing uses --space-* variables
  - Padding: 16px or 24px
  - Gaps: 16px or 24px
  - No hardcoded values

- [ ] Shadows correct
  - Cards: --shadow-2
  - Hover: --shadow-3
  - Modals: --shadow-4

### Responsive Behavior

- [ ] Mobile (< 640px)
  - 1-column cards
  - Bottom nav visible
  - Filters in modal overlay
  - Full-width inputs
  - Hero full height

- [ ] Tablet (640-1024px)
  - 2-column cards
  - Filters in side panel
  - Bottom nav still visible
  - Hero 60vh

- [ ] Desktop (> 1024px)
  - 3-column cards
  - Filters permanent sidebar
  - Top navigation (hide bottom nav if you want)
  - Hero 50vh

### Functionality

- [ ] All buttons clickable (no disabled state on load)
- [ ] Forms submit successfully
- [ ] Navigation between pages works
- [ ] Bottom nav active state changes per page
- [ ] Filters update results in real-time
- [ ] Expandable cards smooth animation
- [ ] Carousel scrolls smoothly (hardware accelerated)

### Accessibility (WCAG 2.1 AA)

- [ ] All interactive elements ≥ 44px × 44px
  - [ ] Buttons: 44px min-height
  - [ ] Inputs: 44px min-height
  - [ ] Icon buttons: 44px × 44px
  - [ ] Links: 44px min touch target

- [ ] Color contrast ≥ 4.5:1
  - [ ] Black text on white: ✓ (21:1)
  - [ ] White text on blue #0066CC: ✓ (4.7:1)
  - [ ] Text on accent #00B4D8: ✓ (5.8:1)

- [ ] Keyboard navigation
  - [ ] Tab moves through all controls
  - [ ] Enter activates buttons/links
  - [ ] Space toggles checkboxes/switches
  - [ ] Arrow keys work in range sliders

- [ ] Focus indicators visible
  - [ ] All buttons show focus ring (ring-2 focus-visible)
  - [ ] Outline visible on dark background
  - [ ] Outline visible on light background

- [ ] Screen reader compatible
  - [ ] Semantic HTML (button, nav, article, section)
  - [ ] ARIA labels on icons (aria-label="...")
  - [ ] Dynamic content announced (aria-live regions for toasts)
  - [ ] Form labels associated with inputs

- [ ] Dark mode
  - [ ] Colors automatically switch
  - [ ] Text contrast maintained in dark mode
  - [ ] No hardcoded colors break dark mode

- [ ] Reduced motion respected
  - [ ] Animations disabled if prefers-reduced-motion
  - [ ] Transitions still work (just faster/no animation)

### iOS Safe Area

- [ ] No content hidden behind notch
- [ ] Bottom nav padding adjusts for home indicator
- [ ] Hero section has top padding on notched phones
- [ ] All corners have appropriate padding

### Dark Mode

- [ ] Toggle in settings switches theme
- [ ] All text still readable
- [ ] All colors have dark mode variants
- [ ] No white on dark blue contrast issues
- [ ] Dark shadows visible on dark background

### Code Quality

- [ ] No hardcoded colors (all use CSS variables)
  - [ ] No `backgroundColor="blue"`
  - [ ] No `color="#0066CC"`
  - [ ] All: `className="bg-[var(--color-primary)]"`

- [ ] All buttons use Button component
  - [ ] No `<button>` tags except in Button
  - [ ] Variants: primary, secondary, ghost, danger, success

- [ ] All cards use Card component or semantic structure
  - [ ] Card layout: Card > CardHeader > CardBody > CardFooter
  - [ ] Or article > div structure

- [ ] No console errors
  - [ ] No TypeScript errors
  - [ ] No 404s on images
  - [ ] No undefined variables

- [ ] No unused imports
- [ ] Consistent naming (camelCase for variables, PascalCase for components)

### Performance

- [ ] Images use `loading="lazy"` for below-fold items
- [ ] No unnecessary re-renders (check with React DevTools)
- [ ] Bundle size reasonable (no huge vendor packages)
- [ ] Animations GPU-accelerated (transform, opacity only)

---

## 🎯 Success Criteria Checklist

**Mark complete when:** All items checked ✓

### Functionality
- [ ] Home page displays hero + search + featured carousel
- [ ] Explore page shows cards + filters
- [ ] Dashboard shows stats + recent dives
- [ ] My Dives shows expandable dive history
- [ ] Settings shows all form options
- [ ] Bottom nav works on all pages
- [ ] Page headers show correct titles
- [ ] All buttons are clickable

### Visual
- [ ] Layout matches mockup (hero, search, cards)
- [ ] Colors match CSS variables
- [ ] Typography looks correct
- [ ] Spacing consistent (8px scale)
- [ ] Dark mode works
- [ ] No broken images

### Responsive
- [ ] 1 column on phone
- [ ] 2 columns on tablet
- [ ] 3 columns on desktop
- [ ] All breakpoints work smoothly
- [ ] No horizontal scrollbar on mobile
- [ ] Safe areas work on notched phones

### Accessibility
- [ ] All touch targets ≥ 44px
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigation complete
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader works

### Technical
- [ ] No hardcoded colors
- [ ] All buttons use Button component
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Safe area padding applied
- [ ] RTL layout correct on he locale

---

## 🐛 If Something Breaks

### Components not showing
1. Check: Is it imported in the page?
2. Check: Does it have `export const ComponentName`?
3. Check: Are all required props passed?
4. Check: Do child components exist?

### Colors wrong
1. Check: Are you using CSS variables?
2. Check: Is design-system.css imported?
3. Check: Dark mode activated? (Try light mode)
4. Check: Browser cache clear? (Hard refresh Ctrl+Shift+R)

### Layout broken
1. Check: Are Tailwind classes applied?
2. Check: Are flex/grid classes present?
3. Check: Is overflow hidden somewhere?
4. Check: Media query breakpoints correct?

### Safe areas not working
1. Check: Is MobileLayout wrapper applied?
2. Check: Is CSS using env(safe-area-inset-*)?
3. Check: Are you testing on actual device? (Simulator might not show)
4. Check: Is app full-screen? (Not in browser, not zoomed)

### RTL not flipping
1. Check: Is dir="rtl" attribute set?
2. Check: Are you using logical properties (margin-inline)?
3. Check: Is flex-row-reverse applied on RTL?
4. Check: Is locale actually 'he'?

### Touch targets too small
1. Check: min-height: 44px applied?
2. Check: min-width: 44px applied?
3. Check: Padding sufficient inside?
4. Check: No overlapping elements?

---

## 📊 Progress Tracking

```
Phase 1: ▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (10 min)
Phase 2: ░░░░░░░░░░▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (10 min)
Phase 3: ░░░░░░░░░░░░░░░░░▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░ (5 min)
Phase 4: ░░░░░░░░░░░░░░░░░░░░▓▓░░░░░░░░░░░░░░░░░░░░░░ (5 min)
Quality: ░░░░░░░░░░░░░░░░░░░░░░░▓▓░░░░░░░░░░░░░░░░░░░ (5 min)

Total: 35 minutes estimated
```

---

## 📋 Before You Start

Required files to reference:
- [ ] DESIGN_STRATEGY.md - Full specification
- [ ] DESIGN_COMPONENT_INDEX.md - Component props reference
- [ ] DESIGN_QUICK_START.md - Copy-paste starter code
- [ ] COMPONENT_HIERARCHY.txt - Visual diagrams
- [ ] design-system.css - CSS variables (already exists)

Required codebase files already exist:
- [ ] src/components/Button.tsx ✓
- [ ] src/components/Card.tsx ✓
- [ ] src/components/Input.tsx ✓
- [ ] src/components/templates/BottomNavigation.tsx ✓
- [ ] src/components/templates/DiveSiteCard.tsx ✓
- [ ] src/styles/design-system.css ✓

---

## 🏁 Final Sign-Off

When complete, verify:

```
PHASE 1: Hero & Search         [  ] 10 min
PHASE 2: Filtering             [  ] 10 min
PHASE 3: Layout & Nav          [  ] 5 min
PHASE 4: Polish                [  ] 5 min
QUALITY GATES                  [  ] All passed

Estimated Total Time: 30 minutes ✓
```

**You're done when** all checkboxes in Quality Gates section are checked!

---

**Questions?** Reference the corresponding document:
- Component props? → DESIGN_COMPONENT_INDEX.md
- How to build X? → DESIGN_QUICK_START.md
- Full spec? → DESIGN_STRATEGY.md
- Visual diagram? → COMPONENT_HIERARCHY.txt

**Ready?** Open DESIGN_QUICK_START.md and start Phase 1! 🚀

