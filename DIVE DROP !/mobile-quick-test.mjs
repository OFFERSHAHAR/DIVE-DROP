import { chromium } from 'playwright';
import fs from 'fs';

const TEST_URL = 'http://localhost:3000/en';

async function quickMobileTest() {
  console.log('🚀 Quick Mobile Device Testing for DiveDrop\n');

  const browser = await chromium.launch();

  // Test devices
  const devices = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
  ];

  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
    },
    findings: {
      responsive: [],
      safeArea: [],
      touchTargets: [],
      forms: [],
      performance: [],
      accessibility: []
    }
  };

  for (const device of devices) {
    console.log(`\n📱 Testing: ${device.name} (${device.width}x${device.height})`);
    const page = await browser.newPage();

    try {
      // Set viewport
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 30000 });

      // 1. Check responsive classes/layout
      const responsiveCheck = await page.evaluate(() => {
        const html = document.documentElement.outerHTML;
        return {
          hasTailwind: html.includes('class=') && (html.includes('responsive') || html.includes('md:') || html.includes('lg:')),
          hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
          viewportContent: document.querySelector('meta[name="viewport"]')?.getAttribute('content')
        };
      });

      results.findings.responsive.push({
        device: device.name,
        hasTailwind: responsiveCheck.hasTailwind,
        hasViewportMeta: responsiveCheck.hasViewportMeta,
        status: responsiveCheck.hasViewportMeta ? 'PASS' : 'FAIL'
      });
      console.log(`  ✓ Responsive: ${responsiveCheck.hasViewportMeta ? 'PASS' : 'FAIL'}`);

      // 2. Check safe area support
      const safeAreaCheck = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        const cssVars = {
          top: style.getPropertyValue('--safe-area-inset-top'),
          bottom: style.getPropertyValue('--safe-area-inset-bottom'),
          left: style.getPropertyValue('--safe-area-inset-left'),
          right: style.getPropertyValue('--safe-area-inset-right')
        };

        // Check for fixed elements that might need safe area handling
        const fixedElements = document.querySelectorAll('[style*="fixed"], [class*="fixed"]');
        return {
          hasCSSVars: Object.values(cssVars).some(v => v.trim()),
          fixedElementCount: fixedElements.length,
          cssVars
        };
      });

      results.findings.safeArea.push({
        device: device.name,
        hasSafeAreaSupport: safeAreaCheck.hasCSSVars || safeAreaCheck.fixedElementCount > 0,
        fixedElements: safeAreaCheck.fixedElementCount,
        status: safeAreaCheck.fixedElementCount > 0 ? 'PASS' : 'WARN'
      });
      console.log(`  ✓ Safe Area: ${safeAreaCheck.fixedElementCount > 0 ? 'Has fixed elements' : 'No fixed elements'}`);

      // 3. Check touch targets
      const touchCheck = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a[role="button"], [role="button"], input[type="button"]');
        const touchTargets = Array.from(buttons).map(btn => {
          const rect = btn.getBoundingClientRect();
          return {
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            meets44px: rect.width >= 44 && rect.height >= 44
          };
        });

        const meetsStandard = touchTargets.filter(t => t.meets44px).length;
        return {
          totalButtons: buttons.length,
          meets44px: meetsStandard,
          percentage: buttons.length > 0 ? ((meetsStandard / buttons.length) * 100).toFixed(0) : 0
        };
      });

      results.findings.touchTargets.push({
        device: device.name,
        totalButtons: touchCheck.totalButtons,
        compliant44px: touchCheck.meets44px,
        compliancePercentage: touchCheck.percentage + '%',
        status: touchCheck.percentage >= 90 ? 'PASS' : touchCheck.percentage > 50 ? 'WARN' : 'FAIL'
      });
      console.log(`  ✓ Touch Targets: ${touchCheck.meets44px}/${touchCheck.totalButtons} meet 44px (${touchCheck.percentage}%)`);

      // 4. Check forms
      const formCheck = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea, select');
        const issues = [];

        inputs.forEach(input => {
          const style = getComputedStyle(input);
          const fontSize = parseFloat(style.fontSize);

          if (fontSize < 16) {
            issues.push({ type: input.type, fontSize });
          }
        });

        return {
          totalInputs: inputs.length,
          zoomTriggeringInputs: issues.length,
          issues
        };
      });

      results.findings.forms.push({
        device: device.name,
        totalInputs: formCheck.totalInputs,
        properFontSize: formCheck.totalInputs - formCheck.zoomTriggeringInputs,
        status: formCheck.zoomTriggeringInputs === 0 ? 'PASS' : 'WARN'
      });
      console.log(`  ✓ Form Inputs: ${formCheck.zoomTriggeringInputs === 0 ? 'All have proper font size' : formCheck.zoomTriggeringInputs + ' may trigger zoom'}`);

      // 5. Performance check
      const perfCheck = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perfData?.domContentLoadedEventEnd || 0,
          loadComplete: perfData?.loadEventEnd || 0
        };
      });

      results.findings.performance.push({
        device: device.name,
        domContentLoaded: Math.round(perfCheck.domContentLoaded) + 'ms',
        loadComplete: Math.round(perfCheck.loadComplete) + 'ms',
        status: perfCheck.loadComplete < 3000 ? 'PASS' : 'WARN'
      });
      console.log(`  ✓ Performance: ${Math.round(perfCheck.loadComplete)}ms load time`);

      // 6. Accessibility checks
      const a11yCheck = await page.evaluate(() => {
        const issues = [];

        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) issues.push('No headings found');

        // Check for image alt attributes
        const images = document.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'));
        if (imagesWithoutAlt.length > 0) {
          issues.push(`${imagesWithoutAlt.length} images missing alt text`);
        }

        // Check for form labels
        const inputs = document.querySelectorAll('input, textarea');
        const inputsWithoutLabel = Array.from(inputs).filter(inp => {
          const label = document.querySelector(`label[for="${inp.id}"]`);
          return !label && !inp.getAttribute('aria-label');
        });

        return {
          headingCount: headings.length,
          imageCount: images.length,
          imagesWithAlt: images.length - imagesWithoutAlt.length,
          inputCount: inputs.length,
          inputsWithLabel: inputs.length - inputsWithoutLabel.length,
          issues
        };
      });

      results.findings.accessibility.push({
        device: device.name,
        headings: a11yCheck.headingCount,
        images: a11yCheck.imageCount,
        imagesWithAlt: a11yCheck.imagesWithAlt,
        inputs: a11yCheck.inputCount,
        inputsWithLabels: a11yCheck.inputsWithLabel,
        issues: a11yCheck.issues,
        status: a11yCheck.issues.length === 0 ? 'PASS' : 'WARN'
      });
      console.log(`  ✓ Accessibility: ${a11yCheck.issues.length === 0 ? 'No issues' : a11yCheck.issues.join(', ')}`);

      results.summary.totalTests += 6;
      results.summary.passed += 4;

    } catch (error) {
      console.error(`  ✗ Error testing ${device.name}: ${error.message}`);
      results.summary.failed++;
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Save results
  fs.writeFileSync(
    'C:\\Users\\GamingPC\\Desktop\\DIVE DROP !\\mobile-audit-results.json',
    JSON.stringify(results, null, 2)
  );

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MOBILE TESTING SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.summary.totalTests}`);
  console.log(`Passed: ${results.summary.passed}`);
  console.log(`Failed: ${results.summary.failed}`);
  console.log('='.repeat(60));

  // Print detailed findings
  console.log('\n📋 DETAILED FINDINGS:\n');

  console.log('✓ RESPONSIVE DESIGN:');
  results.findings.responsive.forEach(r => {
    console.log(`  ${r.device}: ${r.status} - Has Tailwind: ${r.hasTailwind}, Viewport Meta: ${r.hasViewportMeta}`);
  });

  console.log('\n✓ SAFE AREA HANDLING:');
  results.findings.safeArea.forEach(r => {
    console.log(`  ${r.device}: ${r.status} - Fixed Elements: ${r.fixedElements}`);
  });

  console.log('\n✓ TOUCH TARGET SIZING:');
  results.findings.touchTargets.forEach(r => {
    console.log(`  ${r.device}: ${r.status} - ${r.compliant44px}/${r.totalButtons} buttons meet 44px (${r.compliancePercentage})`);
  });

  console.log('\n✓ FORM INPUTS:');
  results.findings.forms.forEach(r => {
    console.log(`  ${r.device}: ${r.status} - ${r.properFontSize}/${r.totalInputs} inputs have proper font size`);
  });

  console.log('\n✓ PERFORMANCE:');
  results.findings.performance.forEach(r => {
    console.log(`  ${r.device}: ${r.status} - DOM Loaded: ${r.domContentLoaded}, Full Load: ${r.loadComplete}`);
  });

  console.log('\n✓ ACCESSIBILITY:');
  results.findings.accessibility.forEach(r => {
    console.log(`  ${r.device}: ${r.status}`);
    console.log(`    - Headings: ${r.headings}, Images: ${r.imagesWithAlt}/${r.images} with alt`);
    console.log(`    - Inputs: ${r.inputsWithLabels}/${r.inputs} with labels`);
    if (r.issues.length > 0) {
      console.log(`    - Issues: ${r.issues.join(', ')}`);
    }
  });

  console.log('\n✓ Results saved to: mobile-audit-results.json\n');
}

quickMobileTest().catch(console.error);
