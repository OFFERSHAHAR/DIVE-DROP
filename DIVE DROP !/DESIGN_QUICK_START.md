# DiveDrop Design Implementation - Quick Start Guide
**Start Here** | **Estimated Build Time: 30 minutes**

---

## What Was Analyzed

Mobile mockup showing:
- **Screen 1:** Hero section + search panel + featured carousel + bottom nav
- **Screen 2:** Dive sites grid + RTL filter sidebar + navigation

**Deliverables Created:**
1. `DESIGN_STRATEGY.md` - Comprehensive design specification (11 sections)
2. `DESIGN_COMPONENT_INDEX.md` - Component inventory & props reference
3. `DESIGN_QUICK_START.md` - This file (execution roadmap)

---

## Quick File Reference

| Document | Purpose | Read Time |
|----------|---------|-----------|
| `DESIGN_STRATEGY.md` | Full spec, color palette, responsive strategy | 15 min |
| `DESIGN_COMPONENT_INDEX.md` | Component catalog, props, styling patterns | 10 min |
| `DESIGN_QUICK_START.md` | This file - what to build first | 5 min |

---

## Start Building (Next 30 Minutes)

### Phase 1: Hero & Search (10 minutes) ⏱️

**Create 4 components:**

1. **HeroSection.tsx** (3 min)
   - Accept `bgImage`, `headline`, `subtitle`, `height`
   - Overlay gradient from transparent to dark
   - Absolute positioned badge logo (top-left)
   - Optional CTA button
   - Use CSS variables: `--color-primary`, `--shadow-2`

2. **SearchPanel.tsx** (4 min)
   - 2-column grid layout (`grid-cols-2`)
   - 4 inputs: location, date, certification, dive type
   - White background, rounded corners, `--shadow-2`
   - Full-width submit button at bottom
   - Props: `fields`, `onSearch`, `defaultValues`

3. **SearchField.tsx** (2 min)
   - Single dropdown/select input
   - Label + icon support
   - Props: `label`, `options`, `type`, `onChange`

4. **Update home page** (1 min)
   - Replace placeholder gradient with `<HeroSection />`
   - Add `<SearchPanel />` below it
   - Keep existing featured carousel

**Test:** Home page shows hero with search panel, bottom nav visible

---

### Phase 2: Filtering (10 minutes) ⏱️

**Create 4 components:**

5. **FilterSidebar.tsx** (3 min)
   - Position: right side, width 280px (or overlay on mobile)
   - RTL support: `dir="rtl"` attribute
   - Props: `filters`, `onChange`, `rtl`, `isOpen`, `onClose`
   - Close button for mobile
   - Use `--border-primary` divider line

6. **FilterGroup.tsx** (2 min)
   - Container for filter sections
   - Title + children
   - Border-bottom divider

7. **DepthRangeSlider.tsx** (3 min)
   - Dual-handle range slider (0-100m)
   - Labels above slider ("0m - 100m")
   - Blue handles with `--color-primary`
   - Props: `min`, `max`, `value`, `onChange`

8. **DifficultyFilter.tsx** (2 min)
   - Checkbox group for difficulty
   - Colors: Beginner=#4CAF50, Intermediate=#FF9800, Advanced=#F44336
   - Props: `selected`, `onChange`

**Test:** Explore page shows filters on right side (desktop) or overlay modal (mobile)

---

### Phase 3: Layout & Navigation (5 minutes) ⏱️

**Create 2 components:**

9. **MobileLayout.tsx** (2 min)
   - Wrapper with safe area handling
   - Padding-bottom for bottom nav (60px + safe area)
   - Props: `children`, `showBottomNav`

10. **PageHeader.tsx** (3 min)
    - Header bar: 56px height (touch target)
    - Back button (left), title (center), optional actions (right)
    - Sticky positioning, border-bottom
    - Props: `title`, `onBack`, `onFilterToggle`, `actions`

**Update pages:**
- Wrap all pages with `<MobileLayout>`
- Add `<PageHeader />` to each page
- Ensure bottom nav is active on correct item

**Test:** All pages have header + bottom nav, safe areas work on iOS

---

### Phase 4: Polish (5 minutes) ⏱️

**Create 6 components (minimal):**

11. **DiveHistoryCard.tsx** - Expandable dive entry
12. **StatsCard.tsx** - Stats grid display
13. **FormSection.tsx** - Form grouping container
14. **FormField.tsx** - Text input with label
15. **SelectField.tsx** - Dropdown select
16. **ToggleField.tsx** - On/off switch

**Update pages:**
- Dashboard: Add `<StatsCard />` + recent dives
- My Dives: Use `<DiveHistoryCard />`
- Settings: Use form components

**Test:** All forms work, expandable cards animate smoothly

---

## Implementation Checklist

### Must Complete (30 min)
- [ ] Phase 1: Hero & Search (4 components)
- [ ] Phase 2: Filtering (4 components)  
- [ ] Phase 3: Layout & Nav (2 components + 5 page updates)
- [ ] Phase 4: Polish (6 components)

### Quality Gates (5 min)
- [ ] Home page matches mockup hero visually
- [ ] Search panel is 2x2 grid with proper spacing
- [ ] Filters appear on explore page (sidebar or modal)
- [ ] All pages have header + bottom nav
- [ ] Bottom nav active state changes per page
- [ ] Colors match design-system.css variables
- [ ] All buttons use Button component variants
- [ ] Safe area padding on iOS notch/status bar
- [ ] Dark mode works (prefers-color-scheme)
- [ ] Touch targets all ≥44px

### Testing (Optional)
- [ ] Mobile: iPhone 12/13/14
- [ ] Tablet: iPad Pro
- [ ] Desktop: 1920px+
- [ ] RTL: Settings page in Hebrew (he locale)
- [ ] Dark mode toggle in settings

---

## Copy-Paste Starter Code

### HeroSection.tsx (template)
```tsx
import React from 'react';
import clsx from 'clsx';

interface HeroSectionProps {
  bgImage: string;
  headline: string;
  subtitle?: string;
  height?: 'full' | 'half';
  children?: React.ReactNode;
}

export const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ bgImage, headline, subtitle, height = 'full', children }, ref) => {
    const heightClass = height === 'full' ? 'h-screen' : 'h-[60vh]';
    
    return (
      <div
        ref={ref}
        className={clsx('relative w-full overflow-hidden', heightClass)}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"
          aria-hidden
        />
        
        {/* Branding */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              🤿
            </div>
            <span className="text-white font-bold text-xl">{headline}</span>
          </div>
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <div className="absolute bottom-32 left-0 right-0 text-center px-4 z-10">
            <p className="text-white text-lg font-semibold">{subtitle}</p>
          </div>
        )}
        
        {/* Children */}
        {children}
      </div>
    );
  }
);

HeroSection.displayName = 'HeroSection';
```

### SearchPanel.tsx (template)
```tsx
import React, { useState } from 'react';
import clsx from 'clsx';
import { Button } from './Button';

interface SearchField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select';
  options?: { value: string; label: string }[];
}

interface SearchPanelProps {
  fields: SearchField[];
  onSearch: (data: Record<string, string>) => void;
}

export const SearchPanel = React.forwardRef<HTMLDivElement, SearchPanelProps>(
  ({ fields, onSearch }, ref) => {
    const [formData, setFormData] = useState<Record<string, string>>(
      Object.fromEntries(fields.map(f => [f.name, '']))
    );

    const handleChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(formData);
    };

    return (
      <div
        ref={ref}
        className="bg-white rounded-t-lg shadow-lg p-6 -mt-12 mx-4 relative z-20"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-primary">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="rounded-md border border-border-primary px-3 py-2 min-h-[44px]"
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="rounded-md border border-border-primary px-3 py-2 min-h-[44px]"
                    placeholder={field.label}
                  />
                )}
              </div>
            ))}
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            type="submit"
          >
            Search Sites
          </Button>
        </form>
      </div>
    );
  }
);

SearchPanel.displayName = 'SearchPanel';
```

### MobileLayout.tsx (template)
```tsx
import React from 'react';
import clsx from 'clsx';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileLayout = React.forwardRef<HTMLDivElement, MobileLayoutProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex flex-col min-h-screen bg-bg-primary',
        'pb-[calc(60px+env(safe-area-inset-bottom))]', // Bottom nav height + safe area
        className
      )}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {children}
    </div>
  )
);

MobileLayout.displayName = 'MobileLayout';
```

### PageHeader.tsx (template)
```tsx
import React from 'react';
import clsx from 'clsx';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  onFilterToggle?: () => void;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, onBack, onFilterToggle }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'sticky top-0 z-40 h-14 bg-bg-secondary border-b border-border-primary',
        'flex items-center justify-between px-4'
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary hover:bg-bg-tertiary rounded-md"
          aria-label="Go back"
        >
          ←
        </button>
      )}
      <h1 className="text-lg font-semibold text-text-primary flex-1 text-center">
        {title}
      </h1>
      {onFilterToggle && (
        <button
          onClick={onFilterToggle}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-primary hover:bg-bg-tertiary rounded-md"
          aria-label="Toggle filters"
        >
          ⚙️
        </button>
      )}
    </div>
  )
);

PageHeader.displayName = 'PageHeader';
```

---

## File Creation Order

1. `src/components/HeroSection.tsx`
2. `src/components/SearchField.tsx`
3. `src/components/SearchPanel.tsx`
4. `src/components/FilterGroup.tsx`
5. `src/components/DepthRangeSlider.tsx`
6. `src/components/DifficultyFilter.tsx`
7. `src/components/FilterSidebar.tsx`
8. `src/components/MobileLayout.tsx`
9. `src/components/PageHeader.tsx`
10. `src/components/DiveHistoryCard.tsx`
11. `src/components/StatsCard.tsx`
12. `src/components/FormSection.tsx`
13. `src/components/FormField.tsx`
14. `src/components/SelectField.tsx`
15. `src/components/ToggleField.tsx`

**Then update pages:**
- `src/app/[locale]/page.tsx` (home)
- `src/app/[locale]/explore/page.tsx` (explore)
- `src/app/[locale]/dashboard/page.tsx` (dashboard)
- `src/app/[locale]/my-dives/page.tsx` (my-dives)
- `src/app/[locale]/settings/page.tsx` (settings)
- `src/app/[locale]/layout.tsx` (wrap with MobileLayout)

---

## Design System Reference (Memorize These)

### Colors (CSS Variables)
```
--color-primary: #0066CC        (Button, nav, links)
--color-accent: #00B4D8         (Secondary actions)
--color-error: #FF3D00          (Advanced dive difficulty)
--bg-secondary: #F8FAFC         (Card background)
--text-secondary: #5A6370       (Secondary text)
```

### Spacing (8px scale)
```
16px = --space-sm               (Padding, gaps)
24px = --space-md               (Sections)
32px = --space-lg               (Large gaps)
```

### Touch Targets
```
MIN: 44px height × 44px width   (iOS/Android accessibility)
```

### Buttons
```
<Button variant="primary" size="lg" fullWidth>
<Button variant="secondary" size="md">
<Button variant="ghost" size="sm">
```

---

## Success Criteria

When you're done, verify:

✅ **Home page**
- Hero image visible with gradient overlay
- Search panel 2x2 grid below hero
- Featured carousel scrolls horizontally
- Bottom nav shows "Home" active

✅ **Explore page**
- Filter button toggles sidebar on mobile
- Sidebar appears on desktop (right side)
- Filters RTL when locale is Hebrew
- Cards grid responsive (1→2→3 columns)

✅ **All pages**
- Header visible with back button (except home)
- Bottom nav visible and functional
- Safe area padding on notched devices
- No horizontal scroll on mobile

✅ **Quality**
- All colors use CSS variables (no hardcoded colors)
- All buttons use Button component
- All inputs ≥44px height
- All text has sufficient contrast
- Dark mode works (toggle in settings)

---

## Next Steps After Build

1. **Add real hero images** - Replace placeholder with dive/boat photos
2. **Connect to Supabase** - Fetch actual dive sites data
3. **Add map integration** - Show location on explore page
4. **Implement bookings** - Allow users to book dives
5. **Add reviews/ratings** - User-generated content
6. **Email verification** - Extend auth system

---

**Ready to build?** Start with Phase 1 and take 30 minutes. Reference `DESIGN_STRATEGY.md` if you need detailed specs.

Good luck! 🤿
