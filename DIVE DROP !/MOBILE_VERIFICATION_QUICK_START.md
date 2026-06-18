# Mobile Verification - Quick Start Guide

## 5-Minute Setup

### 1. Run Verification Script (Right Now)
```bash
cd "DIVE DROP !"
node scripts/mobile-verification.mjs
```

**What it does:**
- Checks button sizes (44px minimum)
- Validates input fields have inputMode & autocomplete
- Verifies safe area implementation
- Detects responsive class usage
- Identifies fixed width violations
- Generates detailed report

**Output files:**
- Console summary
- `verification-report.json` (detailed results)

---

### 2. Review Results
```bash
# View the generated report
cat verification-report.json
```

**Critical Issues Found (from initial run):**
- [ ] Missing `viewport-fit=cover` meta tag → Fix in `app/layout.tsx`
- [ ] Missing `inputMode` on inputs → Fix in component Input.tsx, MobileForm.tsx
- [ ] Icon sizes detected → Review context (probably fine for icons)

---

### 3. Manual Device Testing (Next)
1. Grab an iPhone and Android device
2. Open MOBILE_TESTING_GUIDE.md
3. Follow test procedures (about 1 hour per device type)
4. Document results in provided checklists

---

## Critical Fixes Required

### Fix 1: Add viewport-fit=cover
**File:** `app/layout.tsx`
**Action:** Add to head section
```html
<meta name="viewport" content="viewport-fit=cover" />
```
**Why:** Enables safe area support for notches and home indicators

---

### Fix 2: Add inputMode to Inputs
**Files to Update:**
- `src/components/Input.tsx`
- `src/components/MobileForm.tsx`
- `app/*/FormPage.tsx`

**Example:**
```jsx
// Before
<input type="email" />

// After
<input type="email" inputMode="email" autocomplete="email" />
```

**InputMode Values:**
- `text` - standard keyboard
- `email` - shows @ and .
- `tel` - numeric/phone keyboard
- `number` - numeric
- `decimal` - for decimals

---

## Test Before Deployment

### Automated Checks (CI/CD)
✓ Runs automatically on every PR
- TypeScript compilation
- Mobile verification script
- Responsive class validation
- Safe area verification

### Manual Checks Required
- [ ] Test on iPhone SE (small)
- [ ] Test on iPhone 12/13 (standard)
- [ ] Test on iPhone 14+ (notch/Dynamic Island)
- [ ] Test on Android phone (with notch)
- [ ] Test on tablet (landscape and portrait)
- [ ] VoiceOver/TalkBack accessible
- [ ] Dark mode working

**Time estimate:** 1-2 hours with multiple devices

---

## Key Standards

### Touch Targets
- **Minimum size:** 44×44 pixels
- **Spacing:** 8px between targets
- **Test:** Can tap easily with thumb

### Safe Areas
- **iPhone:** Top padding for notch, bottom for home indicator
- **Android:** Similar notch handling
- **Foldables:** Content around fold line
- **CSS:** Use safe-area-inset custom properties

### Responsive Breakpoints
- **sm:** 480px (iPhone)
- **md:** 640px (iPad Mini)
- **lg:** 1024px (iPad)

### Inputs
- **Email:** type="email" inputMode="email"
- **Phone:** type="tel" inputMode="tel"
- **Number:** type="number" inputMode="decimal"

---

## One-Liner Commands

```bash
# Run verification
node scripts/mobile-verification.mjs

# View report
cat verification-report.json

# View summary only
cat verification-report.json | head -20

# Check touch target sizing
grep -r "h-\[0-9\]\{1,2\}px\]" src/

# Find inputs without inputMode
grep -r "<input" src/ | grep -v "inputMode"

# Check for viewport-fit
grep -r "viewport-fit" app/
```

---

## Test Checklist

**Before Merging:**
- [ ] Run `node scripts/mobile-verification.mjs` - No critical errors
- [ ] Test on 2+ real mobile devices
- [ ] Follow MOBILE_TESTING_GUIDE.md procedures
- [ ] Document results in provided checklist

**Before Release:**
- [ ] All verification tests pass
- [ ] All manual tests pass
- [ ] Accessibility tested (VoiceOver/TalkBack)
- [ ] Dark mode functional
- [ ] Performance metrics acceptable

---

## Troubleshooting

### Script Returns Errors
Most likely issues:
1. Node.js not installed → `node --version`
2. Script path wrong → Ensure in project root
3. File permissions → Not needed on Windows

### Too Many "Small Size" Warnings
Icons (h-5, w-5, etc.) are fine! These are for:
- Icon sizes (not touch targets)
- Internal sizing (paddings, gaps)

**Only worry about:**
- Main buttons (touch targets should be ≥44px)
- Links (need proper touch target wrapping)
- Form controls

### Can't Find Inputs Without inputMode
Command to search:
```bash
grep -r "type=\"email\|type=\"tel\|type=\"number\"" src/ | grep -v "inputMode"
```

---

## Workflow Integration

### GitHub Actions (Automatic)
When you create a PR:
1. ✓ Verification script runs automatically
2. ✓ Report posted as PR comment
3. ✓ Fails if critical issues found
4. ✓ Links to full report

### Local Development
```bash
# Before committing
node scripts/mobile-verification.mjs

# Fix any critical issues
# Then commit and push
```

---

## Resources

**Test on Real Devices:**
- iPhone: Settings > Accessibility > Simulator features
- Android: Chrome DevTools > Device Toolbar

**Accessibility Testing:**
- iOS: VoiceOver (Settings > Accessibility > VoiceOver)
- Android: TalkBack (Settings > Accessibility > TalkBack)

**Responsive Testing:**
- Chrome DevTools: F12 → Device Toolbar
- Safari: Develop > Enter Responsive Design Mode

**Documentation:**
- MOBILE_TESTING_GUIDE.md - Full manual procedures
- VERIFICATION_SUITE_SUMMARY.md - Complete overview
- verification-checklist.json - Master checklist

---

## Team Workflow

### For Developers
1. Make changes to mobile components
2. Run verification: `node scripts/mobile-verification.mjs`
3. Fix any critical issues
4. Test on devices if major changes
5. Push PR (CI/CD runs automatically)

### For QA/Testers
1. Get device list from testing guide
2. Follow MOBILE_TESTING_GUIDE.md
3. Document results in checklist
4. Report any issues

### For Release Manager
1. Verify all checks pass
2. Ensure manual testing completed
3. Check github actions workflow passed
4. Approve for deployment

---

## Success = Compliance

When you see these results, you're good to ship:

✓ Verification script passes with no critical issues
✓ All tests in MOBILE_TESTING_GUIDE.md completed
✓ Touch targets are 44×44px minimum
✓ Safe areas implemented and tested
✓ Responsive design works on all breakpoints
✓ Inputs have proper keyboard types
✓ Works with VoiceOver/TalkBack
✓ Dark mode functional
✓ Performance metrics acceptable

---

## Questions?

1. **How do I add viewport-fit?** → See "Fix 1: Add viewport-fit=cover"
2. **Where do I add inputMode?** → See "Fix 2: Add inputMode to Inputs"
3. **What's a safe area?** → See MOBILE_TESTING_GUIDE.md section 1
4. **Why 44×44px?** → Apple & Google standard, accessibility requirement
5. **How do I test accessibility?** → See MOBILE_TESTING_GUIDE.md section 5

---

**Status:** Ready to use ✓
**Last Updated:** June 18, 2026
