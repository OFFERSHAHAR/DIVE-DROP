# Critical Mobile Compliance Issues Found

**Date Identified:** June 18, 2026
**Severity:** CRITICAL - Must fix before mobile deployment
**Testing Tool:** scripts/mobile-verification.mjs
**Report:** verification-report.json

---

## Issue #1: Missing viewport-fit=cover Meta Tag

**Severity:** 🔴 CRITICAL
**File:** `app/layout.tsx`
**Status:** Not Fixed

### Description
The `viewport-fit=cover` meta tag is missing from the document head. This tag is essential for proper safe area support on notched devices (iPhones with notches, Dynamic Island) and Android devices with notches.

### Impact
Without this tag:
- Content may be hidden behind notches
- Dynamic Island not properly handled
- Safe areas won't be respected
- App will look broken on modern iPhones

### Devices Affected
- iPhone 12, 13 (notch)
- iPhone 14, 15 (Dynamic Island)
- iPhone 15 Pro/Pro Max
- Any Android device with notch
- Foldable devices

### How to Fix

**File:** `app/layout.tsx`

**Add to head section:**
```html
<meta name="viewport" content="viewport-fit=cover" />
```

**Complete example:**
```jsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* ... other meta tags ... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Verification
After fixing, run:
```bash
grep -r "viewport-fit" app/
# Should show the meta tag
```

**Priority:** Fix IMMEDIATELY before testing on devices

---

## Issue #2: Missing inputMode Attributes on Input Fields

**Severity:** 🔴 CRITICAL
**Files Affected:** 4+ component files
**Status:** Not Fixed

### Description
Multiple input elements are missing the `inputMode` attribute, which should match the type of input. This causes incorrect keyboards to appear on mobile devices.

### Affected Files

#### 1. `src/components/Input.tsx`
**Count:** 2+ inputs missing inputMode
**Types Affected:** All generic input fields

#### 2. `src/components/MobileForm.tsx`
**Count:** 3+ inputs missing inputMode
**Types Affected:** Form fields

#### 3. `app/*/FormPage.tsx`
**Count:** 2+ inputs missing inputMode
**Types Affected:** Form pages

### Impact
Without proper inputMode:
- Email fields show standard keyboard instead of email keyboard (no @, .)
- Phone fields show standard keyboard instead of numeric keyboard
- Number fields show standard keyboard instead of numeric
- User experience significantly degraded on mobile
- Form completion slower
- Higher error rates

### Example of Problem

**Before (Wrong):**
```jsx
<input type="email" placeholder="Enter email" />
// On iPhone: Shows standard QWERTY keyboard - user must scroll to find @ symbol
// Takes longer, more errors
```

**After (Correct):**
```jsx
<input 
  type="email"
  inputMode="email"
  autoComplete="email"
  placeholder="Enter email"
/>
// On iPhone: Shows email-optimized keyboard with @ and . visible
// Much faster and fewer errors
```

### How to Fix

**For Email Inputs:**
```jsx
<input 
  type="email"
  inputMode="email"
  autoComplete="email"
  placeholder="Email address"
  aria-label="Email address"
/>
```

**For Phone Inputs:**
```jsx
<input 
  type="tel"
  inputMode="tel"
  autoComplete="tel"
  placeholder="Phone number"
  aria-label="Phone number"
/>
```

**For Number Inputs:**
```jsx
<input 
  type="number"
  inputMode="decimal"
  autoComplete="off"
  placeholder="Amount"
  aria-label="Amount in dollars"
/>
```

**For Regular Text:**
```jsx
<input 
  type="text"
  inputMode="text"
  autoComplete="on"
  placeholder="Name"
  aria-label="Full name"
/>
```

### Quick Fix Script

Find all affected inputs:
```bash
# Find all input elements
grep -r "<input" src/ app/ --include="*.tsx" | grep -v "inputMode"

# Find specific types
grep -r 'type="email"' src/ app/ --include="*.tsx" | grep -v "inputMode"
grep -r 'type="tel"' src/ app/ --include="*.tsx" | grep -v "inputMode"
grep -r 'type="number"' src/ app/ --include="*.tsx" | grep -v "inputMode"
```

**Priority:** Fix all inputs - this significantly impacts user experience

---

## Issue #3: Safe Area CSS Implementation

**Severity:** 🟡 HIGH
**Status:** Partially Implemented / Not Verified

### Description
Safe area CSS using `env(safe-area-inset-*)` is not consistently applied or documented. This is needed for proper header/footer positioning on devices with notches.

### Affected Components
- Header/Navigation
- Bottom navigation
- Fixed buttons
- All full-screen components

### How to Fix

**Create global CSS variables** in `src/globals.css`:
```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
}
```

**Apply to header:**
```jsx
<header className="pt-[var(--safe-area-inset-top)] sm:pt-4">
  {/* Header content */}
</header>
```

**Apply to bottom nav:**
```jsx
<nav className="pb-[var(--safe-area-inset-bottom)] sm:pb-4">
  {/* Navigation content */}
</nav>
```

**Priority:** Implement before iOS/Android testing

---

## Summary of All Issues

### Critical (Must Fix Now)
- [ ] Add `viewport-fit=cover` meta tag
- [ ] Add `inputMode` to all relevant inputs
- [ ] Verify safe area CSS implementation

### High Priority (Should Fix Before Release)
- [ ] Review and contextualize icon sizing (h-5, w-5, h-6, w-6)
- [ ] Ensure touch targets around icons are 44×44px minimum
- [ ] Verify responsive class usage is comprehensive

### Medium Priority (Should Review)
- [ ] 6 instances of fixed width usage
- [ ] Limited responsive class usage in some components
- [ ] Autocomplete attributes on some inputs

---

## Testing After Fixes

### Step 1: Run Verification Again
```bash
node scripts/mobile-verification.mjs
```
Should show significant improvement in pass rate.

### Step 2: Test on Physical Devices
Follow MOBILE_TESTING_GUIDE.md:
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone 12/13 (standard)
- [ ] Test on iPhone 14+ (Dynamic Island)
- [ ] Test on Android phone (with notch)
- [ ] Test on tablet

### Step 3: Verify Specific Fixes
**For viewport-fit:**
- Rotate iPhone 14+ to landscape
- Content should shift up for Dynamic Island
- No overlap with status bar

**For inputMode:**
- Tap each input field
- Observe keyboard type matches field
- Email should show @ and .
- Phone should show numeric
- No "Standard Keyboard" for special input types

### Step 4: Accessibility Testing
- [ ] Test with VoiceOver (iOS)
- [ ] Test with TalkBack (Android)
- [ ] Verify all inputs announced correctly

---

## Prevention for Future Development

### Code Review Checklist
Before merging mobile-related PRs:
- [ ] Run `node scripts/mobile-verification.mjs`
- [ ] No critical issues reported
- [ ] New inputs include `inputMode` and `autoComplete`
- [ ] Header/footer include safe area padding

### Pre-Deployment Checklist
- [ ] All verification checks pass
- [ ] Manual testing on 2+ iOS + 2+ Android devices completed
- [ ] VoiceOver/TalkBack accessible
- [ ] Dark mode functional
- [ ] No critical issues in verification-report.json

---

## Questions & Answers

**Q: What's viewport-fit=cover?**
A: It tells the browser to expand content behind safe areas (notches), so you can use `env(safe-area-inset-*)` to properly position content.

**Q: Why is inputMode important?**
A: It tells the device which keyboard to show. Without it, users must manually switch keyboards, making forms harder to complete.

**Q: What's a safe area?**
A: The region of your screen not occupied by notches, home indicators, or other system UI. On modern devices, there's almost always safe area on all sides.

**Q: When should I fix this?**
A: BEFORE you test on real devices. It's much easier to fix in code than to discover these issues during QA.

**Q: How long will fixes take?**
A: Usually 15-30 minutes total for all three issues.

---

## References

- [Apple Safe Area](https://developer.apple.com/design/human-interface-guidelines/layout/#Notches-and-Dynamic-Island)
- [inputMode Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
- [env() CSS Function](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [WCAG Input Purpose](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html)

---

**Action Required:** FIX BEFORE NEXT DEPLOYMENT
**Estimated Time:** 30-45 minutes
**Tester:** Verification Suite (automated)
**Date Identified:** June 18, 2026
