# Mobile Testing Guide for DiveDrop

## Overview
This guide provides a comprehensive manual testing checklist for ensuring DiveDrop meets mobile compliance standards across different devices, orientations, and accessibility features.

**Total Manual Tests: 30+**
**Estimated Time: 2-3 hours per device**

---

## Pre-Testing Setup

### Required Devices
- [ ] iPhone SE (small screen, 375px)
- [ ] iPhone 12/13 (medium screen, 390px)
- [ ] iPhone 14/15 Pro (notch/Dynamic Island, 390px)
- [ ] iPad Mini (tablet, 768px)
- [ ] Android device with notch (e.g., Samsung S21)
- [ ] Android tablet (e.g., Samsung Tab)
- [ ] Foldable device (if available)

### Browser Requirements
- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Firefox (optional, secondary testing)

### Tools Needed
- [ ] Ruler app or calipers (for touch target sizing)
- [ ] Screenshot tool
- [ ] Screen recording software
- [ ] Accessibility testing app (Accessibility Inspector, TalkBack, VoiceOver)

---

## Test Suite 1: Safe Area Implementation (10 Tests)

### 1.1 Header Safe Area - Landscape (iPhone)
**Device:** iPhone 12+
**Orientation:** Landscape
**Steps:**
1. Rotate device to landscape
2. Observe header/navigation bar
3. Verify no content overlaps with notch
4. Check status bar text is visible

**Expected:** Header has top padding; content doesn't overlap Dynamic Island

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.2 Header Safe Area - Portrait (iPhone)
**Device:** iPhone 12+
**Orientation:** Portrait
**Steps:**
1. Return to portrait orientation
2. Check header positioning
3. Verify adequate top padding
4. Confirm status bar still visible

**Expected:** Consistent padding in both orientations

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.3 Bottom Navigation Safe Area
**Device:** Any iOS device
**Orientation:** Portrait
**Steps:**
1. Navigate to app with bottom navigation
2. Rotate to landscape
3. Check if safe area padding applies
4. Verify navigation buttons remain accessible
5. No overlap with home indicator (bottom)

**Expected:** Bottom nav has adequate padding; home indicator not covered

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.4 Notch Handling - Content Alignment
**Device:** iPhone 12/13 (notch), iPhone 14 (Dynamic Island)
**Steps:**
1. Open main content area
2. Check left and right padding around notch
3. Verify text is not obscured
4. Test in landscape orientation

**Expected:** Content safely inset from notch edges

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.5 Dynamic Island Interaction
**Device:** iPhone 14/15 Pro
**Orientation:** Landscape
**Steps:**
1. Rotate to landscape
2. Observe Dynamic Island positioning
3. Check that interactive elements don't overlap it
4. Verify status information visible if app shows it

**Expected:** No interactive elements under Dynamic Island

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.6 Android Notch Handling
**Device:** Android with notch (Samsung S21+)
**Orientation:** Portrait
**Steps:**
1. Open app
2. Observe notch positioning at top
3. Check header/title positioning
4. Verify content doesn't overlap

**Expected:** Content properly inset; no overlap with system UI

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.7 Android Notch Landscape
**Device:** Android with notch
**Orientation:** Landscape
**Steps:**
1. Rotate to landscape
2. Check left/right padding
3. Verify buttons/links accessible around notch
4. Test navigation

**Expected:** Responsive padding in landscape

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.8 Foldable Device - Fold Area
**Device:** Samsung Galaxy Z Fold
**Steps:**
1. Open app in folded state
2. Check if content adapts to fold line
3. Verify no content obscured at fold
4. Test interaction across fold

**Expected:** Content readable; fold area handled gracefully

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.9 Status Bar Contrast
**Device:** Any device
**Orientation:** Portrait
**Steps:**
1. Test on device with dark status bar
2. Test on device with light status bar
3. Check text legibility in both cases
4. Verify background color doesn't clash

**Expected:** Status bar content always visible

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 1.10 Safe Area CSS Variables
**Device:** Any
**Steps:**
1. Open DevTools (if available)
2. Inspect CSS for safe-area-inset usage
3. Verify custom properties applied
4. Check computed padding values

**Expected:** CSS variables properly set and applied

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

## Test Suite 2: Responsive Breakpoints (8 Tests)

### 2.1 Small Phone (320-479px) Layout
**Device:** iPhone SE
**Orientation:** Portrait
**Steps:**
1. Open home page
2. Verify layout fits without horizontal scroll
3. Check button/link sizing
4. Test form inputs
5. Verify text readability

**Expected:** Content properly stacked; no horizontal overflow

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 2.2 Medium Phone (480-639px) Layout
**Device:** iPhone 12/13
**Orientation:** Portrait
**Steps:**
1. Open all main pages
2. Check spacing and padding
3. Verify images scale properly
4. Test navigation functionality
5. Confirm card layouts

**Expected:** Optimal layout for standard smartphone

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 2.3 Large Phone (640px+) Layout
**Device:** iPhone 12/13 in landscape or iPhone 14+ in portrait
**Orientation:** Portrait/Landscape
**Steps:**
1. Verify layout transitions smoothly
2. Check if content optimizes for wider screen
3. Test multi-column layouts if present
4. Verify spacing increases appropriately

**Expected:** Layout adapts to larger available space

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 2.4 Tablet Layout - Small (iPad Mini)
**Device:** iPad Mini (768px)
**Orientation:** Portrait
**Steps:**
1. Verify tablet-optimized layout loads
2. Check sidebar or multi-column layouts
3. Test content width (not stretched too wide)
4. Verify navigation adapts

**Expected:** Tablet-specific layout applied

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 2.5 Tablet Layout - Large (iPad)
**Device:** iPad (1024px)
**Orientation:** Portrait
**Steps:**
1. Verify optimal spacing for larger device
2. Check max-width constraints
3. Test sidebar/navigation positioning
4. Verify content doesn't stretch excessively

**Expected:** Content constrained to readable width

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 2.6 Tablet Landscape Orientation
**Device:** iPad
**Orientation:** Landscape
**Steps:**
1. Rotate tablet to landscape
2. Verify layout adapts to full width
3. Check navigation transforms (if applicable)
4. Test if multi-pane layout activates

**Expected:** Layout optimized for landscape orientation

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 2.7 Responsive Image Scaling
**Device:** Multiple (SE, 12, iPad)
**Steps:**
1. Load pages with images
2. Compare image sizes across devices
3. Verify proper scaling (not too small on SE, not pixelated on iPad)
4. Check responsive image classes (w-full, max-w-*)

**Expected:** Images scale appropriately for each device

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 2.8 Responsive Typography
**Device:** Multiple (SE, 12, iPad)
**Steps:**
1. Check heading sizes across devices
2. Compare body text sizing
3. Verify readable font sizes (minimum 16px on mobile)
4. Check line height/spacing adjustment

**Expected:** Typography scales with viewport; remains readable

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

## Test Suite 3: Touch Target Validation (6 Tests)

### 3.1 Button Size Compliance
**Device:** Any device
**Tools:** Ruler app or measure tool
**Steps:**
1. Identify all buttons on page
2. Measure each button (width x height)
3. Record minimum dimensions
4. Test tappability with thumb

**Expected:** All buttons ≥ 44x44px; easily tappable with thumb

**Result:** [ ] Pass [ ] Fail

**Button Measurements:**
- Button 1: ____ x ____ px
- Button 2: ____ x ____ px
- Button 3: ____ x ____ px

**Notes:** _________________

---

### 3.2 Link/Text Touch Targets
**Device:** Any device
**Tools:** Ruler
**Steps:**
1. Identify all clickable text/links
2. Measure target area (including padding)
3. Verify touch area is 44x44px minimum
4. Test tap accuracy with index finger

**Expected:** All touch targets ≥ 44x44px

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 3.3 Spacing Between Touch Targets
**Device:** Any device
**Tools:** Ruler
**Steps:**
1. Identify groups of buttons/links close together
2. Measure spacing between targets
3. Record minimum spacing found
4. Test if accidental taps are possible

**Expected:** Minimum 8px spacing between targets

**Result:** [ ] Pass [ ] Fail

**Spacing Measurements:**
- Group 1: ____ px spacing
- Group 2: ____ px spacing

**Notes:** _________________

---

### 3.4 Icon Button Sizing
**Device:** Any device
**Tools:** Ruler
**Steps:**
1. Find all icon-only buttons (menu, close, etc.)
2. Measure button dimensions
3. Check padding around icon
4. Test tap target alignment with icon

**Expected:** Icon buttons ≥ 44x44px total size

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 3.5 Form Control Touch Targets
**Device:** Any device
**Tools:** Ruler
**Steps:**
1. Locate all checkboxes, radio buttons, toggles
2. Measure clickable area
3. Test tap accuracy
4. Verify visual feedback on tap

**Expected:** All form controls tappable at 44x44px; visual feedback present

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 3.6 Touch Feedback Visibility
**Device:** Any device
**Orientation:** Portrait
**Steps:**
1. Tap each button/link
2. Observe visual feedback (highlight, change color, etc.)
3. Check feedback is visible on touch (not just hover)
4. Verify active state persists appropriately

**Expected:** Clear, immediate visual feedback on all interactive elements

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

## Test Suite 4: Form Input Accessibility (5 Tests)

### 4.1 Email Input Configuration
**Device:** Any device with keyboard
**Steps:**
1. Locate email input field
2. Tap to focus
3. Observe keyboard type (should show @ and .)
4. Check inputMode attribute
5. Verify autocomplete works

**Expected:** Email-optimized keyboard; inputMode set; autocomplete functional

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 4.2 Phone Number Input Configuration
**Device:** Any device
**Steps:**
1. Locate phone number field
2. Tap to focus
3. Observe numeric keyboard
4. Check if +, -, () appear in keyboard
5. Test autocomplete for phone

**Expected:** Numeric keyboard with phone symbols; inputMode="tel"

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 4.3 Number Input Configuration
**Device:** Any device
**Steps:**
1. Find numeric input field
2. Tap to focus
3. Observe keyboard type
4. Check if decimal/negative supported based on input type
5. Verify inputMode appropriateness

**Expected:** Appropriate numeric keyboard; inputMode correctly set

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 4.4 Text Input Autocomplete
**Device:** iPhone or Android with password manager
**Steps:**
1. Navigate to login form
2. Tap email/username field
3. Check if password manager offers autofill
4. Tap password field
5. Verify suggestions appear

**Expected:** Password manager integration works; autocomplete values appear

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 4.5 Keyboard Responsiveness
**Device:** Any device
**Steps:**
1. Tap input field
2. Observe keyboard animation
3. Check if form content moves up (no overlap with keyboard)
4. Verify focusing/scrolling smooth
5. Test dismiss keyboard action

**Expected:** Keyboard appears smoothly; doesn't hide input; dismiss works

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

## Test Suite 5: Dark Mode & Accessibility (Advanced - 6 Tests)

### 5.1 Dark Mode Detection
**Device:** Any device
**Steps:**
1. Enable dark mode in device settings
2. Open app
3. Observe if dark mode activates
4. Check all pages switch to dark mode
5. Return to light mode and verify switch

**Expected:** App respects device dark mode preference

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 5.2 Color Contrast in Dark Mode
**Device:** Any device with dark mode
**Steps:**
1. Enable dark mode
2. Check text on various backgrounds
3. Verify WCAG AA contrast ratio (4.5:1 for text)
4. Test edge cases (disabled states, secondary text)
5. Use contrast checker tool if available

**Expected:** All text meets WCAG AA contrast in dark mode

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 5.3 VoiceOver Testing (iOS)
**Device:** iPhone/iPad
**Steps:**
1. Enable Settings > Accessibility > VoiceOver
2. Navigate entire app with VoiceOver
3. Verify all text read correctly
4. Check interactive elements are announced
5. Test rotor navigation

**Expected:** App fully navigable with VoiceOver; content announced clearly

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 5.4 TalkBack Testing (Android)
**Device:** Android device
**Steps:**
1. Enable Settings > Accessibility > TalkBack
2. Navigate app using TalkBack gestures
3. Verify all elements announced
4. Check button purposes clear
5. Test rotor/reading controls

**Expected:** App fully navigable with TalkBack; content announced

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 5.5 Reduced Motion Preference
**Device:** Any device with reduced motion setting
**Steps:**
1. Enable Settings > Accessibility > Reduce Motion
2. Open app
3. Observe animations (should be minimal/removed)
4. Check transitions are instant or subtle
5. Verify UX still clear without animations

**Expected:** App respects reduced motion; remains usable

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 5.6 Font Size Scaling
**Device:** Any device
**Steps:**
1. Increase device font size to maximum
2. Open app and navigate
3. Check layout doesn't break with larger text
4. Verify text doesn't overflow containers
5. Test all pages readable with large font

**Expected:** Layout adapts to larger font sizes; all content readable

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

## Test Suite 6: Orientation & Rotation (4 Tests)

### 6.1 Portrait to Landscape Transition
**Device:** iPhone/Android
**Steps:**
1. Open app in portrait
2. Rotate to landscape
3. Observe layout transition
4. Verify content repositioned correctly
5. Check no content lost in transition
6. Rotate back to portrait

**Expected:** Smooth, flawless transition; all content preserved

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 6.2 Landscape to Portrait Transition
**Device:** iPhone/Android
**Steps:**
1. Start in landscape
2. Rotate to portrait
3. Check layout contracts appropriately
4. Verify single-column layout activates
5. Ensure content still accessible

**Expected:** Smooth transition; content reorganizes logically

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 6.3 Multiple Rotation Cycles
**Device:** Any device
**Steps:**
1. Rotate between portrait/landscape 5+ times quickly
2. Observe if layout remains consistent
3. Check for memory leaks or lag
4. Verify state preserved during rotation
5. Test user data not lost

**Expected:** App handles rapid rotations; state preserved; no lag

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

### 6.4 Landscape on Small Device
**Device:** iPhone SE or small phone
**Orientation:** Landscape
**Steps:**
1. Rotate small phone to landscape
2. Check content still readable
3. Verify buttons/links still accessible
4. Test form inputs usable
5. Check navigation works

**Expected:** Content usable in landscape despite small height

**Result:** [ ] Pass [ ] Fail

**Notes:** _________________

---

## Performance Baseline Tests

### P1: App Load Time
**Device:** Multiple (iPhone SE, iPad)
**Procedure:**
1. Clear cache / force refresh
2. Measure time from tap to app interactive
3. Repeat 3 times, record average
4. Note network speed if testing on real device

**iPhone SE Load Time (cold): ____s**
**iPad Load Time (cold): ____s**
**Target:** < 2.5s (LCP metric)

**Result:** [ ] Pass [ ] Fail

---

### P2: Scroll Performance
**Device:** Any device
**Procedure:**
1. Open content-heavy page
2. Scroll smoothly (should maintain 60fps)
3. Observe jank or stuttering
4. Check if list scrolling is smooth
5. Note any lag spikes

**Scroll Smoothness:** [ ] Smooth [ ] Occasional Jank [ ] Frequent Jank

---

### P3: Interaction Response Time
**Device:** Any device
**Procedure:**
1. Tap button/link
2. Measure time to response (navigation, animation, etc.)
3. Should be < 100ms
4. Test on multiple interactive elements
5. Note any delayed responses

**Interaction Response:** ____ms

**Result:** [ ] Pass [ ] Fail

---

## Summary Checklist

**Date Tested:** ________________
**Tester Name:** ________________
**Devices Tested:**
- [ ] iPhone SE
- [ ] iPhone 12/13
- [ ] iPhone 14 Pro
- [ ] iPad Mini
- [ ] Android Phone
- [ ] Android Tablet
- [ ] Other: ______________

**Overall Test Result:**
- [ ] All Tests Passed ✓
- [ ] Minor Issues (non-blocking)
- [ ] Major Issues (blocking)

**Critical Issues Found (if any):**
1. _________________________________
2. _________________________________
3. _________________________________

**Recommendations:**
_________________________________________________

**Sign-off:** __________________ Date: __________

---

## Notes for Testers

1. **Measure Carefully:** Use ruler app for precise measurements
2. **Test on Real Devices:** Simulators don't capture all behaviors
3. **Multiple Orientations:** Always test both portrait and landscape
4. **Document Everything:** Take screenshots of issues
5. **Test with Real Data:** Use realistic content lengths
6. **Accessibility First:** VoiceOver/TalkBack testing is critical
7. **Performance Matters:** Slower devices are your canary in the coal mine

---

## Resources

- **WCAG 2.2 Guidelines:** https://www.w3.org/WAI/WCAG22/quickref/
- **Apple HIG:** https://developer.apple.com/design/human-interface-guidelines/
- **Material Design:** https://m3.material.io/
- **Touch Target Sizing:** 44x44px minimum (Apple/Google standard)
- **Safe Areas:** https://developer.apple.com/design/human-interface-guidelines/layout/#Notches-and-Dynamic-Island

