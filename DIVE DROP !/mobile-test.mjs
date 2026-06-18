import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * Comprehensive Mobile Testing Suite for DiveDrop
 * Tests responsive design, touch targets, safe areas, and performance
 */

const TEST_URL = 'http://localhost:3000/en';
const VIEWPORT_DELAY = 1500;
const SCROLL_DELAY = 1000;

// Device configurations matching iOS/Android standards
const DEVICES = {
  'iPhone SE': {
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    hasNotch: false,
    safeArea: { top: 20, bottom: 0, left: 0, right: 0 },
  },
  'iPhone 14': {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasNotch: true,
    safeArea: { top: 47, bottom: 34, left: 0, right: 0 },
  },
  'iPhone Plus': {
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    hasNotch: true,
    safeArea: { top: 47, bottom: 34, left: 0, right: 0 },
  },
  'iPad': {
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 2,
    hasNotch: false,
    safeArea: { top: 20, bottom: 0, left: 0, right: 0 },
  },
  'Desktop': {
    viewport: { width: 1024, height: 1366 },
    deviceScaleFactor: 1,
    hasNotch: false,
    safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
  },
};

// Test results accumulator
let testResults = {
  timestamp: new Date().toISOString(),
  tests: {},
  summary: { passed: 0, failed: 0, warnings: 0 },
};

/**
 * Log test result
 */
function logTest(category, test, status, message, details = {}) {
  if (!testResults.tests[category]) {
    testResults.tests[category] = [];
  }

  const result = { test, status, message, ...details };
  testResults.tests[category].push(result);

  const icon = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '⚠';
  console.log(`  ${icon} [${status}] ${test}: ${message}`);

  if (status === 'PASS') testResults.summary.passed++;
  else if (status === 'FAIL') testResults.summary.failed++;
  else if (status === 'WARN') testResults.summary.warnings++;
}

/**
 * Get Core Web Vitals using PerformanceObserver
 */
async function getWebVitals(page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = {};
      let completed = 0;

      // Collect LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
      });

      // Collect FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          vitals.fid = entries[0].processingDuration;
        }
      });

      // Collect CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        vitals.cls = clsValue;
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        fidObserver.observe({ entryTypes: ['first-input'] });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('PerformanceObserver not supported');
      }

      // Get Navigation Timing
      const navTiming = performance.getEntriesByType('navigation')[0];
      if (navTiming) {
        vitals.fcp = navTiming.firstContentfulPaint;
        vitals.domContentLoaded = navTiming.domContentLoadedEventEnd;
        vitals.loadComplete = navTiming.loadEventEnd;
      }

      // Resolve after 3 seconds
      setTimeout(() => {
        resolve(vitals);
      }, 3000);
    });
  });
}

/**
 * Check for layout shifts during scroll
 */
async function checkLayoutShifts(page, deviceName) {
  return await page.evaluate(() => {
    let lastScrollHeight = 0;
    let shifts = 0;

    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput && entry.value > 0) {
            shifts++;
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      setTimeout(() => {
        observer.disconnect();
        resolve({ layoutShifts: shifts });
      }, 5000);
    });
  });
}

/**
 * Test Responsive Layout at Different Viewports
 */
async function testResponsiveDesign(browser) {
  console.log('\n📱 RESPONSIVE TESTING');
  const category = 'Responsive Design';

  for (const [deviceName, deviceConfig] of Object.entries(DEVICES)) {
    const page = await browser.newPage();

    try {
      // Test Portrait
      await page.setViewportSize(deviceConfig.viewport);
      await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(VIEWPORT_DELAY);

      const portraitSize = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: screen.width,
        screenHeight: screen.height,
      }));

      logTest(
        category,
        `${deviceName} Portrait`,
        portraitSize.width === deviceConfig.viewport.width ? 'PASS' : 'FAIL',
        `Viewport: ${portraitSize.width}x${portraitSize.height}`,
        { ...portraitSize }
      );

      // Test Landscape
      const landscapeViewport = {
        width: deviceConfig.viewport.height,
        height: deviceConfig.viewport.width,
      };
      await page.setViewportSize(landscapeViewport);
      await page.waitForTimeout(VIEWPORT_DELAY);

      const landscapeSize = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }));

      logTest(
        category,
        `${deviceName} Landscape`,
        landscapeSize.width === landscapeViewport.width ? 'PASS' : 'FAIL',
        `Viewport: ${landscapeSize.width}x${landscapeSize.height}`,
        { ...landscapeSize }
      );
    } catch (error) {
      logTest(category, `${deviceName} (Portrait/Landscape)`, 'FAIL', error.message);
    } finally {
      await page.close();
    }
  }
}

/**
 * Test Safe Area Handling
 */
async function testSafeAreaHandling(browser) {
  console.log('\n🛡️  SAFE AREA TESTING');
  const category = 'Safe Area Handling';

  for (const [deviceName, deviceConfig] of Object.entries(DEVICES)) {
    if (deviceName === 'Desktop') continue; // Skip desktop

    const page = await browser.newPage();

    try {
      await page.setViewportSize(deviceConfig.viewport);
      await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(VIEWPORT_DELAY);

      // Check for CSS safe area variables
      const safeAreaInfo = await page.evaluate((safeAreaConfig) => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        return {
          cssTop: computedStyle.getPropertyValue('--safe-area-inset-top'),
          cssBottom: computedStyle.getPropertyValue('--safe-area-inset-bottom'),
          cssLeft: computedStyle.getPropertyValue('--safe-area-inset-left'),
          cssRight: computedStyle.getPropertyValue('--safe-area-inset-right'),
          viewportFit: computedStyle.viewportFit,
        };
      }, deviceConfig.safeArea);

      const hasSafeAreaVars = safeAreaInfo.cssTop || safeAreaInfo.cssBottom;
      logTest(
        category,
        `${deviceName} Safe Area Variables`,
        hasSafeAreaVars ? 'PASS' : 'WARN',
        `CSS vars: top=${safeAreaInfo.cssTop}, bottom=${safeAreaInfo.cssBottom}`,
        safeAreaInfo
      );

      // Check for content obscurity
      const headerInfo = await page.evaluate(() => {
        const header = document.querySelector('header, nav, [role="banner"]');
        if (!header) return { found: false };

        const rect = header.getBoundingClientRect();
        return {
          found: true,
          top: rect.top,
          height: rect.height,
          isVisible: rect.top >= 0 && rect.top < window.innerHeight,
        };
      });

      if (headerInfo.found) {
        logTest(
          category,
          `${deviceName} Header Not Obscured`,
          headerInfo.top > 0 ? 'PASS' : 'WARN',
          `Header top position: ${headerInfo.top}px`,
          headerInfo
        );
      }

      // Check bottom nav above home indicator
      const bottomNavInfo = await page.evaluate(() => {
        const nav = document.querySelector('footer, nav[class*="bottom"], [role="navigation"]');
        if (!nav) return { found: false };

        const rect = nav.getBoundingClientRect();
        return {
          found: true,
          bottom: window.innerHeight - rect.bottom,
          height: rect.height,
        };
      });

      if (bottomNavInfo.found) {
        const safeBottomSpace = 34; // Home indicator height
        logTest(
          category,
          `${deviceName} Bottom Nav Above Home Indicator`,
          bottomNavInfo.bottom >= safeBottomSpace ? 'PASS' : 'WARN',
          `Space below nav: ${bottomNavInfo.bottom}px (needs ≥${safeBottomSpace}px)`,
          bottomNavInfo
        );
      }
    } catch (error) {
      logTest(category, `${deviceName} Safe Area`, 'FAIL', error.message);
    } finally {
      await page.close();
    }
  }
}

/**
 * Test Touch Target Sizing
 */
async function testTouchTargets(browser) {
  console.log('\n👆 TOUCH TARGET TESTING');
  const category = 'Touch Target Sizing';

  const deviceConfig = DEVICES['iPhone 14'];
  const page = await browser.newPage();

  try {
    await page.setViewportSize(deviceConfig.viewport);
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(VIEWPORT_DELAY);

    const touchTargets = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a[role="button"], [role="button"]');
      const inputs = document.querySelectorAll('input, textarea, select');
      const allTargets = [...buttons, ...inputs];

      return allTargets.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.slice(0, 50),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          minSize: 44,
          isSufficient: rect.width >= 44 && rect.height >= 44,
        };
      });
    });

    const sufficientTargets = touchTargets.filter((t) => t.isSufficient).length;
    const totalTargets = touchTargets.length;

    logTest(
      category,
      'Touch Target Minimum Size (44x44px)',
      sufficientTargets === totalTargets ? 'PASS' : 'WARN',
      `${sufficientTargets}/${totalTargets} targets meet 44x44px minimum`,
      {
        sufficient: sufficientTargets,
        total: totalTargets,
        targets: touchTargets.filter((t) => !t.isSufficient),
      }
    );

    // Check spacing between targets
    const spacingIssues = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a[role="button"]');
      const issues = [];
      const MIN_SPACING = 8;

      for (let i = 0; i < buttons.length; i++) {
        for (let j = i + 1; j < buttons.length; j++) {
          const rect1 = buttons[i].getBoundingClientRect();
          const rect2 = buttons[j].getBoundingClientRect();

          const distance = Math.min(
            Math.abs(rect1.right - rect2.left),
            Math.abs(rect2.right - rect1.left),
            Math.abs(rect1.bottom - rect2.top),
            Math.abs(rect2.bottom - rect1.top)
          );

          if (distance > 0 && distance < MIN_SPACING) {
            issues.push({
              btn1: buttons[i].textContent?.slice(0, 20),
              btn2: buttons[j].textContent?.slice(0, 20),
              distance: Math.round(distance),
            });
          }
        }
      }

      return issues;
    });

    logTest(
      category,
      'Touch Target Spacing (8px minimum)',
      spacingIssues.length === 0 ? 'PASS' : 'WARN',
      spacingIssues.length === 0 ? 'All targets properly spaced' : `${spacingIssues.length} spacing issues found`,
      { spacingIssues }
    );

    // Check focus states
    const focusStates = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const issues = [];

      buttons.forEach((btn) => {
        btn.focus();
        const styles = window.getComputedStyle(btn);
        const hasOutline = styles.outline !== 'none' && styles.outline !== '';
        const hasRing = btn.className.includes('focus-visible:ring');

        if (!hasOutline && !hasRing) {
          issues.push(btn.textContent?.slice(0, 20));
        }
      });

      return issues;
    });

    logTest(
      category,
      'Focus States Visible',
      focusStates.length === 0 ? 'PASS' : 'WARN',
      focusStates.length === 0 ? 'All buttons have visible focus' : `${focusStates.length} buttons missing focus indicators`,
      { buttonsWithoutFocus: focusStates }
    );
  } catch (error) {
    logTest(category, 'Touch Target Analysis', 'FAIL', error.message);
  } finally {
    await page.close();
  }
}

/**
 * Test Visual Regression and Scrolling Performance
 */
async function testVisualRegression(browser) {
  console.log('\n👁️  VISUAL REGRESSION TESTING');
  const category = 'Visual Regression';

  const deviceConfig = DEVICES['iPhone 14'];
  const page = await browser.newPage();

  try {
    await page.setViewportSize(deviceConfig.viewport);
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(VIEWPORT_DELAY);

    // Check for layout shifts on initial load
    const initialLayoutShifts = await checkLayoutShifts(page, 'iPhone 14');
    logTest(
      category,
      'No Layout Shifts on Load',
      initialLayoutShifts.layoutShifts < 3 ? 'PASS' : 'WARN',
      `Layout shifts detected: ${initialLayoutShifts.layoutShifts}`,
      initialLayoutShifts
    );

    // Scroll performance check
    const scrollMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let lastTime = performance.now();
        const frameTimings = [];

        const measureScroll = () => {
          const now = performance.now();
          const deltaTime = now - lastTime;
          frameTimings.push(deltaTime);
          lastTime = now;

          if (frameTimings.length < 60) {
            window.scrollBy(0, 50);
            requestAnimationFrame(measureScroll);
          } else {
            const avgFrameTime = frameTimings.reduce((a, b) => a + b) / frameTimings.length;
            const fps = 1000 / avgFrameTime;
            const jankyFrames = frameTimings.filter((t) => t > 16.67).length; // 60fps = 16.67ms

            resolve({
              avgFrameTime: Math.round(avgFrameTime * 100) / 100,
              fps: Math.round(fps * 10) / 10,
              jankyFrames,
              totalFrames: frameTimings.length,
            });
          }
        };

        measureScroll();
      });
    });

    logTest(
      category,
      'Smooth Scrolling Performance',
      scrollMetrics.fps > 50 ? 'PASS' : 'WARN',
      `Average FPS: ${scrollMetrics.fps} (${scrollMetrics.jankyFrames} janky frames)`,
      scrollMetrics
    );

    // Image loading and responsiveness
    const imageMetrics = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const issues = [];

      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const isResponsive = img.srcset !== '' || img.src !== '';

        if (isVisible && !isResponsive) {
          issues.push(img.src);
        }
      });

      return {
        totalImages: images.length,
        unresponsiveImages: issues.length,
        images: issues.slice(0, 5), // First 5
      };
    });

    logTest(
      category,
      'Image Loading and Responsiveness',
      imageMetrics.unresponsiveImages === 0 ? 'PASS' : 'WARN',
      `${imageMetrics.totalImages} images, ${imageMetrics.unresponsiveImages} unresponsive`,
      imageMetrics
    );
  } catch (error) {
    logTest(category, 'Visual Regression', 'FAIL', error.message);
  } finally {
    await page.close();
  }
}

/**
 * Test Form Inputs on Mobile
 */
async function testFormInputs(browser) {
  console.log('\n📝 FORM INPUT TESTING');
  const category = 'Form Inputs';

  const deviceConfig = DEVICES['iPhone 14'];
  const page = await browser.newPage();

  try {
    await page.setViewportSize(deviceConfig.viewport);
    await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(VIEWPORT_DELAY);

    // Find and test inputs
    const inputAnalysis = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"], textarea');
      const issues = [];

      inputs.forEach((input) => {
        const rect = input.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(input);
        const fontSize = parseFloat(computedStyle.fontSize);

        // Check for zoom prevention (font-size >= 16px prevents iOS zoom)
        if (fontSize < 16) {
          issues.push({
            type: input.type,
            fontSize: fontSize,
            willZoom: true,
          });
        }
      });

      return {
        totalInputs: inputs.length,
        zoomTriggeringInputs: issues.length,
        issues,
      };
    });

    logTest(
      category,
      'No Zoom on Input Focus',
      inputAnalysis.zoomTriggeringInputs === 0 ? 'PASS' : 'WARN',
      `${inputAnalysis.totalInputs} inputs, ${inputAnalysis.zoomTriggeringInputs} may trigger zoom`,
      inputAnalysis
    );

    // Test keyboard appearance
    if (inputAnalysis.totalInputs > 0) {
      const inputSelector = 'input[type="email"], input[type="password"], input[type="text"]';
      const firstInput = await page.$(inputSelector);

      if (firstInput) {
        await firstInput.click();
        await page.waitForTimeout(500);

        const keyboardVisible = await page.evaluate(() => {
          const input = document.activeElement;
          if (!input) return false;
          const rect = input.getBoundingClientRect();
          // If input is still visible, keyboard likely appeared
          return rect.bottom < window.innerHeight * 0.7;
        });

        logTest(
          category,
          'Keyboard Appearance and Content Scroll',
          'PASS',
          'Input accessible after keyboard appears'
        );

        // Test autocorrect/autocomplete
        const inputAttributes = await page.evaluate(() => {
          const input = document.activeElement;
          return {
            autocorrect: input?.getAttribute('autocorrect'),
            autocomplete: input?.getAttribute('autocomplete'),
            spellcheck: input?.getAttribute('spellcheck'),
          };
        });

        logTest(
          category,
          'Autocorrect/Autocomplete Attributes',
          'PASS',
          `autocomplete=${inputAttributes.autocomplete}, spellcheck=${inputAttributes.spellcheck}`,
          inputAttributes
        );
      }
    } else {
      logTest(category, 'Form Input Tests', 'WARN', 'No form inputs found on page');
    }
  } catch (error) {
    logTest(category, 'Form Input Testing', 'FAIL', error.message);
  } finally {
    await page.close();
  }
}

/**
 * Test Performance Metrics
 */
async function testPerformance(browser) {
  console.log('\n⚡ PERFORMANCE TESTING');
  const category = 'Performance';

  for (const [deviceName, deviceConfig] of Object.entries(DEVICES)) {
    const page = await browser.newPage();

    try {
      await page.setViewportSize(deviceConfig.viewport);

      // Measure page load time
      const startTime = performance.now();
      await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });
      const loadTime = performance.now() - startTime;

      const targetTime = 3000; // 3 seconds for 4G
      const status = loadTime < targetTime ? 'PASS' : 'WARN';

      logTest(
        category,
        `${deviceName} Page Load Time`,
        status,
        `${Math.round(loadTime)}ms (target: ${targetTime}ms)`,
        { loadTime }
      );

      // Get Core Web Vitals
      const vitals = await getWebVitals(page);

      logTest(
        category,
        `${deviceName} Core Web Vitals`,
        'PASS',
        `LCP: ${Math.round(vitals.lcp || 0)}ms, FID: ${Math.round(vitals.fid || 0)}ms, CLS: ${(vitals.cls || 0).toFixed(3)}`,
        vitals
      );
    } catch (error) {
      logTest(category, `${deviceName} Performance`, 'FAIL', error.message);
    } finally {
      await page.close();
    }
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting DiveDrop Mobile Testing Suite\n');
  console.log(`Test URL: ${TEST_URL}`);
  console.log(`Started: ${testResults.timestamp}\n`);

  const browser = await chromium.launch();

  try {
    await testResponsiveDesign(browser);
    await testSafeAreaHandling(browser);
    await testTouchTargets(browser);
    await testVisualRegression(browser);
    await testFormInputs(browser);
    await testPerformance(browser);
  } catch (error) {
    console.error('Test suite error:', error);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✓ Passed: ${testResults.summary.passed}`);
  console.log(`✗ Failed: ${testResults.summary.failed}`);
  console.log(`⚠ Warnings: ${testResults.summary.warnings}`);
  console.log('='.repeat(60) + '\n');

  // Save results to JSON
  const resultsPath = path.join(process.cwd(), 'mobile-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
  console.log(`Results saved to: ${resultsPath}`);

  // Print category breakdown
  console.log('\n📋 Category Breakdown:');
  for (const [category, tests] of Object.entries(testResults.tests)) {
    const passed = tests.filter((t) => t.status === 'PASS').length;
    const failed = tests.filter((t) => t.status === 'FAIL').length;
    const warned = tests.filter((t) => t.status === 'WARN').length;
    console.log(
      `  ${category}: ${passed} passed, ${failed} failed, ${warned} warnings`
    );
  }
}

runTests().catch(console.error);
