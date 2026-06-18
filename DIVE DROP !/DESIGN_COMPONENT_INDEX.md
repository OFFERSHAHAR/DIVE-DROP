# DiveDrop Component Index & Implementation Map
**Reference Document** | **Auto-generated from mockup analysis**

---

## Quick Navigation

| Component | File Path | Status | Props | Priority |
|-----------|-----------|--------|-------|----------|
| **HeroSection** | `src/components/HeroSection.tsx` | 🔴 NEW | `bgImage`, `headline`, `subtitle`, `children` | P1 |
| **SearchPanel** | `src/components/SearchPanel.tsx` | 🔴 NEW | `onSearch`, `fields`, `defaultValues` | P1 |
| **SearchField** | `src/components/SearchField.tsx` | 🔴 NEW | `label`, `options`, `icon`, `type` | P1 |
| **FilterSidebar** | `src/components/FilterSidebar.tsx` | 🔴 NEW | `filters`, `onChange`, `rtl`, `children` | P2 |
| **FilterGroup** | `src/components/FilterGroup.tsx` | 🔴 NEW | `title`, `type`, `children` | P2 |
| **DepthRangeSlider** | `src/components/DepthRangeSlider.tsx` | 🔴 NEW | `min`, `max`, `value`, `onChange`, `unit` | P2 |
| **DifficultyFilter** | `src/components/DifficultyFilter.tsx` | 🔴 NEW | `selected`, `onChange`, `options` | P2 |
| **MobileLayout** | `src/components/MobileLayout.tsx` | 🔴 NEW | `children`, `safeArea` | P3 |
| **PageHeader** | `src/components/PageHeader.tsx` | 🔴 NEW | `title`, `onBack`, `onFilterToggle`, `actions` | P3 |
| **FeaturedSiteCarousel** | `src/components/FeaturedSiteCarousel.tsx` | 🔴 NEW | `sites`, `onSelect`, `onAddFavorite` | P1 |
| **DiveHistoryCard** | `src/components/DiveHistoryCard.tsx` | 🔴 NEW | `dive`, `onViewDetails`, `expanded` | P4 |
| **StatsCard** | `src/components/StatsCard.tsx` | 🔴 NEW | `stats`, `layout` | P4 |
| **FormSection** | `src/components/FormSection.tsx` | 🔴 NEW | `title`, `children` | P4 |
| **FormField** | `src/components/FormField.tsx` | 🔴 NEW | `label`, `value`, `onChange`, `type` | P4 |
| **SelectField** | `src/components/SelectField.tsx` | 🔴 NEW | `label`, `options`, `value`, `onChange` | P4 |
| **ToggleField** | `src/components/ToggleField.tsx` | 🔴 NEW | `label`, `checked`, `onChange` | P4 |
| **Button** | `src/components/Button.tsx` | ✅ EXISTS | `variant`, `size`, `fullWidth`, `loading` | - |
| **Card** | `src/components/Card.tsx` | ✅ EXISTS | `variant`, `children` | - |
| **Input** | `src/components/Input.tsx` | ✅ EXISTS | `type`, `placeholder`, `value`, `onChange` | - |
| **BottomNavigation** | `src/components/templates/BottomNavigation.tsx` | ✅ EXISTS | `items`, `activeId`, `onNavigate` | - |
| **DiveSiteCard** | `src/components/templates/DiveSiteCard.tsx` | ✅ EXISTS | `site`, `onViewDetails`, `onAddToFavorites` | - |

---

## Component Specifications

### PRIORITY 1: Hero & Search (Build First - 10 minutes)

#### 1. HeroSection
**Purpose:** Full-height hero with background image, overlay, and branding
**Location:** `src/components/HeroSection.tsx`

**Props:**
```typescript
interface HeroSectionProps {
  bgImage: string;           // Image URL or path
  headline: string;          // "DiveDrop"
  subtitle?: string;         // "יצאו לשחיקה הטובה ביותר"
  cta?: {
    text: string;
    onClick: () => void;
  };
  children?: React.ReactNode; // For overlay content
  height?: 'full' | 'half';
  overlayOpacity?: number;    // 0-1
}
```

**Styling:**
- Full-width, configurable height (default: full screen)
- Background image with `object-cover`
- Linear gradient overlay (top: transparent, bottom: rgba(0,0,0,0.4))
- Absolute positioned branding badge (top-left, 48px)
- Bottom CTA button (full-width, blue primary)
- Safe area padding at top

**Example:**
```tsx
<HeroSection
  bgImage="/images/hero-diver.jpg"
  headline="DiveDrop"
  subtitle="יצאו לשחיקה הטובה ביותר"
  height="full"
  overlayOpacity={0.4}
>
  {/* Optional overlay content */}
</HeroSection>
```

---

#### 2. SearchPanel
**Purpose:** 2x2 grid of search/filter inputs (location, date, cert, type)
**Location:** `src/components/SearchPanel.tsx`

**Props:**
```typescript
interface SearchPanelProps {
  onSearch: (formData: SearchFormData) => void;
  fields: SearchField[];
  defaultValues?: Partial<SearchFormData>;
  compact?: boolean;
}

interface SearchField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'dropdown';
  options?: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
}

interface SearchFormData {
  location: string;
  date: string;
  certification: string;
  diveType: string;
}
```

**Styling:**
- White background with rounded top corners (16px)
- Shadows: `--shadow-2`
- 2-column grid layout (`grid-cols-2`)
- Gap: 16px
- Padding: 24px
- Full-width button at bottom ("Search Sites")
- Mobile: Stack to full-width on small screens
- Appears above fold on homepage (negative margin pulls it up onto hero)

**Example:**
```tsx
<SearchPanel
  onSearch={handleSearch}
  fields={[
    { name: 'location', label: 'Location', type: 'dropdown', icon: '📍' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'certification', label: 'Cert Level', type: 'select', options: [...] },
    { name: 'diveType', label: 'Dive Type', type: 'dropdown', icon: '🐠' }
  ]}
  defaultValues={{ location: 'All Locations' }}
/>
```

---

#### 3. SearchField
**Purpose:** Individual dropdown/select input for SearchPanel
**Location:** `src/components/SearchField.tsx`

**Props:**
```typescript
interface SearchFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  icon?: React.ReactNode | string;
  type?: 'select' | 'dropdown' | 'date' | 'text';
  placeholder?: string;
  className?: string;
}
```

**Styling:**
- Flex column layout
- Label: 12px, font-600, text-secondary
- Input: Full-width, rounded-md, border-primary on focus
- Icon position: Inside left (12px)
- Dropdown arrow: Right side (standard select)
- Min height: 44px (touch target)

---

#### 4. FeaturedSiteCarousel
**Purpose:** Horizontal scroll of featured dive sites below search panel
**Location:** `src/components/FeaturedSiteCarousel.tsx`

**Props:**
```typescript
interface FeaturedSiteCarouselProps {
  sites: Array<{
    id: string;
    name: string;
    image: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    rating: number;
  }>;
  onSelect?: (siteId: string) => void;
  onAddFavorite?: (siteId: string) => void;
  showLabels?: boolean;
}
```

**Styling:**
- Horizontal scroll container (`overflow-x-auto snap-x snap-mandatory`)
- Cards: ~280px wide, aspect-ratio 4/5
- Gap: 12px
- Padding: 16px
- Smooth snap-scrolling on mobile
- Hide scrollbar (`.no-scrollbar` utility class)

---

### PRIORITY 2: Filtering & Sidebar (10 minutes)

#### 5. FilterSidebar
**Purpose:** Right-aligned RTL filter panel for explore page
**Location:** `src/components/FilterSidebar.tsx`

**Props:**
```typescript
interface FilterSidebarProps {
  filters: FilterState;
  onChange: (key: string, value: any) => void;
  rtl?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

interface FilterState {
  depthRange: [number, number];
  difficulty: string[];
  rating?: [number, number];
  distance?: [number, number];
}
```

**Styling:**
- Fixed or absolute positioning on mobile (overlay)
- Side panel on tablet/desktop (right side, width: 280px)
- `dir="rtl"` attribute for Hebrew text
- Border-left: 1px (divides from main content)
- Padding: 20px
- Background: bg-secondary (var)
- Close button (X) for mobile overlay mode
- Smooth transitions

**Example:**
```tsx
<FilterSidebar
  filters={filters}
  onChange={handleFilterChange}
  rtl={locale === 'he'}
  isOpen={showFilters}
  onClose={closeFilters}
>
  <FilterGroup title="Depth Range" type="range">
    <DepthRangeSlider
      min={0}
      max={100}
      value={filters.depthRange}
      onChange={(range) => onChange('depthRange', range)}
    />
  </FilterGroup>
  <FilterGroup title="Difficulty" type="checkbox">
    <DifficultyFilter
      selected={filters.difficulty}
      onChange={(selected) => onChange('difficulty', selected)}
    />
  </FilterGroup>
</FilterSidebar>
```

---

#### 6. FilterGroup
**Purpose:** Container for a filter group (title + options)
**Location:** `src/components/FilterGroup.tsx`

**Props:**
```typescript
interface FilterGroupProps {
  title: string;
  type: 'checkbox' | 'range' | 'rating';
  children: React.ReactNode;
  className?: string;
}
```

**Styling:**
- Padding: 16px 0
- Border-bottom: 1px border-secondary
- Title: 14px, font-600, margin-bottom: 12px
- Children spacing: flex-col, gap: 8px

---

#### 7. DepthRangeSlider
**Purpose:** Dual-handle range slider for depth filtering (0-100m)
**Location:** `src/components/DepthRangeSlider.tsx`

**Props:**
```typescript
interface DepthRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  step?: number;
  unit?: 'meters' | 'feet';
  labels?: boolean;
}
```

**Styling:**
- Track: bg-secondary, height: 4px
- Handles: 20px circles, primary blue color
- Label display: "0m - 100m" above slider
- Accessibility: Keyboard navigation (arrow keys)
- Touch-friendly handle size

---

#### 8. DifficultyFilter
**Purpose:** Checkbox group for filtering by difficulty level
**Location:** `src/components/DifficultyFilter.tsx`

**Props:**
```typescript
interface DifficultyFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  options?: Array<{ value: string; label: string; color: string }>;
}
```

**Styling:**
- Checkbox rows (flex-col)
- Colors: Beginner=#4CAF50, Intermediate=#FF9800, Advanced=#F44336
- Label padding: 8px, rounded-md
- Hover background: rgba(0,102,204,0.08)

---

### PRIORITY 3: Layout & Navigation (5 minutes)

#### 9. MobileLayout
**Purpose:** Wrapper component with safe area handling + bottom nav spacing
**Location:** `src/components/MobileLayout.tsx`

**Props:**
```typescript
interface MobileLayoutProps {
  children: React.ReactNode;
  safeArea?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  showBottomNav?: boolean;
  className?: string;
}
```

**Styling:**
- Display: flex, flex-direction: column, min-h-screen
- Padding: safe-area-inset (CSS env vars)
- Padding-bottom: adjusted for bottom nav (60px + safe area)
- Main content: flex-1

**Example:**
```tsx
<MobileLayout showBottomNav>
  <PageHeader title="Explore" onBack={goBack} />
  {/* Page content */}
  <BottomNavigation items={navItems} activeId="explore" />
</MobileLayout>
```

---

#### 10. PageHeader
**Purpose:** Reusable page header with back button, title, and optional filter toggle
**Location:** `src/components/PageHeader.tsx`

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  onFilterToggle?: () => void;
  actions?: Array<{ icon: React.ReactNode; onClick: () => void; label: string }>;
  showBackButton?: boolean;
  className?: string;
}
```

**Styling:**
- Height: 56px (touch-target compatible)
- Padding: 16px, flex row
- Border-bottom: 1px border-secondary
- Title: h4 (20px, font-600)
- Back button: Icon button (44px touch target)
- Icons: 24px, primary color
- Sticky positioning (position: sticky, top: 0, z-10)

---

### PRIORITY 4: Cards & Forms (5 minutes)

#### 11. DiveHistoryCard
**Purpose:** Expandable card showing dive history entry
**Location:** `src/components/DiveHistoryCard.tsx`

**Props:**
```typescript
interface DiveHistoryCardProps {
  dive: {
    id: string;
    date: string;
    siteName: string;
    duration: number;
    depth: number;
    image?: string;
    notes?: string;
  };
  onViewDetails?: (diveId: string) => void;
  expanded?: boolean;
  onToggleExpand?: (diveId: string) => void;
}
```

**Styling:**
- Card: bg-secondary, rounded-lg, border, shadow-1
- Padding: 16px (collapsed), auto-height (expanded)
- Header: flex between (date left, depth right)
- Body (expanded): section for notes, metadata
- Arrow indicator (rotates 180° when expanded)
- Transition: max-height 200ms ease-out

---

#### 12. StatsCard
**Purpose:** Display user stats (total dives, hours, favorites)
**Location:** `src/components/StatsCard.tsx`

**Props:**
```typescript
interface StatsCardProps {
  stats: Array<{
    label: string;
    value: string | number;
    unit?: string;
    icon?: React.ReactNode;
    color?: string;
  }>;
  layout?: 'grid' | 'row';
}
```

**Styling:**
- Grid layout: 3 columns (mobile: 1, tablet: 2, desktop: 3)
- Individual stat items: center-aligned, gap-2
- Value: h3 (28px, font-700)
- Label: body-sm (12px, text-secondary)
- Background: bg-gradient (light blue gradient)
- Padding: 24px

---

#### 13. FormSection
**Purpose:** Container for a form section with title
**Location:** `src/components/FormSection.tsx`

**Props:**
```typescript
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}
```

**Styling:**
- Padding: 24px
- Border-bottom: 1px border-secondary
- Title: h4 (20px, font-600)
- Description: body-sm (12px, text-secondary)
- Children: flex-col, gap: 16px

---

#### 14. FormField
**Purpose:** Text input field with label and help text
**Location:** `src/components/FormField.tsx`

**Props:**
```typescript
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}
```

**Styling:**
- Flex-col layout
- Label: 14px, font-600, margin-bottom: 8px
- Input: full-width, 44px height, border-md
- Help text: 12px, text-secondary, margin-top: 4px
- Error state: border-error, help-text color-error

---

#### 15. SelectField
**Purpose:** Dropdown select with label
**Location:** `src/components/SelectField.tsx`

**Props:**
```typescript
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  icon?: React.ReactNode;
}
```

---

#### 16. ToggleField
**Purpose:** On/off toggle switch with label
**Location:** `src/components/ToggleField.tsx`

**Props:**
```typescript
interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}
```

**Styling:**
- Flex row, space-between
- Toggle: 48px x 28px switch
- Animation: 200ms ease-out
- Label: 14px, font-500

---

## Page-Component Mapping

### `/[locale]` (Home)
```
<MobileLayout>
  <HeroSection />
  <SearchPanel />
  <section>
    <h2>Featured Sites</h2>
    <FeaturedSiteCarousel />
  </section>
  <BottomNavigation />
</MobileLayout>
```

### `/[locale]/explore`
```
<MobileLayout>
  <PageHeader title="Explore" onFilterToggle={toggleFilters} />
  
  <div className="flex">
    <div className="flex-1">
      <DiveSiteGrid />
    </div>
    {isOpen && <FilterSidebar />}
  </div>
  
  <BottomNavigation />
</MobileLayout>
```

### `/[locale]/dashboard`
```
<MobileLayout>
  <PageHeader title="Dashboard" />
  
  <StatsCard stats={...} />
  <section>
    <h2>Recent Dives</h2>
    {dives.map(dive => <DiveHistoryCard />)}
  </section>
  <section>
    <h2>Recommended</h2>
    <DiveSiteGrid />
  </section>
  
  <BottomNavigation />
</MobileLayout>
```

### `/[locale]/my-dives`
```
<MobileLayout>
  <PageHeader title="My Dives" />
  
  {dives.map(dive => (
    <DiveHistoryCard
      key={dive.id}
      expanded={expandedId === dive.id}
      onToggleExpand={setExpandedId}
    />
  ))}
  
  <BottomNavigation />
</MobileLayout>
```

### `/[locale]/settings`
```
<MobileLayout>
  <PageHeader title="Settings" />
  
  <form>
    <FormSection title="Account">
      <FormField label="Email" disabled value={email} />
      <FormField label="Full Name" value={name} onChange={...} />
    </FormSection>
    
    <FormSection title="Preferences">
      <SelectField label="Language" value={locale} onChange={...} />
      <ToggleField label="Dark Mode" checked={darkMode} onChange={...} />
    </FormSection>
    
    <div className="flex gap-2">
      <Button variant="primary" fullWidth>Save</Button>
      <Button variant="secondary" fullWidth>Logout</Button>
    </div>
  </form>
  
  <BottomNavigation />
</MobileLayout>
```

---

## Styling Implementation Notes

### CSS Variables Used
```css
/* Colors */
--color-primary: #0066CC;           /* Blue */
--color-accent: #00B4D8;            /* Cyan */
--color-error: #FF3D00;             /* Red */
--color-success: #00C853;           /* Green */
--color-warning: #FFC400;           /* Orange */

--bg-primary: #FFFFFF;
--bg-secondary: #F8FAFC;
--bg-tertiary: #E8EEF5;

--text-primary: #0A1428;
--text-secondary: #5A6370;

--border-primary: #D0D5DB;

/* Spacing (8px baseline) */
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;

/* Radius */
--radius-md: 12px;
--radius-lg: 16px;

/* Shadows */
--shadow-1: 0 2px 4px rgba(0,0,0,0.08);
--shadow-2: 0 4px 12px rgba(0,0,0,0.12);
--shadow-3: 0 8px 24px rgba(0,0,0,0.16);

/* Motion */
--duration-base: 200ms;
--easing-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Tailwind + CVA Pattern
```typescript
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const componentVariants = cva(
  'w-full rounded-lg transition-all duration-base',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-white',
        secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
      },
    },
  }
);

export const Component = ({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => (
  <div
    className={clsx(componentVariants({ variant, size }), className)}
    {...props}
  />
);
```

---

## Implementation Checklist

- [ ] HeroSection (bgImage, headline, subtitle, overlay)
- [ ] SearchPanel (2x2 grid, form submit)
- [ ] SearchField (dropdown input)
- [ ] FeaturedSiteCarousel (horizontal scroll)
- [ ] FilterSidebar (RTL-aware, collapsible)
- [ ] FilterGroup (section container)
- [ ] DepthRangeSlider (range input)
- [ ] DifficultyFilter (checkbox group)
- [ ] MobileLayout (wrapper + safe area)
- [ ] PageHeader (back + title + actions)
- [ ] DiveHistoryCard (expandable)
- [ ] StatsCard (stat grid)
- [ ] FormSection (form grouping)
- [ ] FormField (text input)
- [ ] SelectField (dropdown select)
- [ ] ToggleField (on/off switch)
- [ ] Update home page to use new components
- [ ] Update explore page with filters
- [ ] Update dashboard with stats
- [ ] Update settings page with form
- [ ] Test mobile responsiveness
- [ ] Test RTL (Hebrew) layout
- [ ] Test dark mode
- [ ] Verify accessibility (touch targets, contrast, ARIA)

---

**Total Implementation Time: 30 minutes**
