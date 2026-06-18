#!/usr/bin/env node

/**
 * Mobile Verification Script for DiveDrop
 * Validates mobile compliance before deployment
 *
 * Checks:
 * - Minimum button size (44px)
 * - Input accessibility (inputmode, autocomplete)
 * - Safe area implementation
 * - Responsive class usage
 * - Fixed width violations
 * - Performance metrics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

class MobileVerifier {
  constructor() {
    this.results = {
      buttonSizes: [],
      inputAccessibility: [],
      safeAreas: [],
      responsiveClasses: [],
      fixedWidths: [],
      performanceMetrics: [],
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0,
        errors: []
      }
    };
  }

  /**
   * Check all buttons are 44px minimum
   */
  checkButtonSizes() {
    console.log('\n[1/6] Checking button sizes...');
    const componentDir = path.join(projectRoot, 'src', 'components');

    if (!fs.existsSync(componentDir)) {
      this.results.summary.warnings++;
      this.results.buttonSizes.push({
        status: 'warning',
        message: 'Components directory not found',
        path: componentDir
      });
      return;
    }

    const files = this.findFiles(componentDir, /\.(tsx?|jsx?)$/);

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');

      // Check for hardcoded small sizes
      const smallSizeRegex = /(?:w-|h-)\d{1,2}(?:\s|[\[\]]|$)/g;
      const matches = content.match(smallSizeRegex) || [];

      matches.forEach(match => {
        const size = parseInt(match.match(/\d+/)[0]);
        if (size < 44) {
          this.results.summary.failed++;
          this.results.buttonSizes.push({
            status: 'fail',
            file: file.replace(projectRoot, ''),
            issue: `Found small size class: ${match.trim()}`,
            severity: 'critical'
          });
        }
      });

      // Check for button elements without proper sizing
      const buttonRegex = /<button[^>]*(?:w-|h-)?[^>]*>/g;
      const buttonMatches = content.match(buttonRegex) || [];

      buttonMatches.forEach(buttonTag => {
        const hasMinSize = /(?:min-w-|w-\d{2}|h-\d{2}|px-\d|py-\d)/.test(buttonTag);
        if (!hasMinSize && buttonTag.includes('className')) {
          this.results.summary.warnings++;
          this.results.buttonSizes.push({
            status: 'warning',
            file: file.replace(projectRoot, ''),
            issue: 'Button element might not meet 44px minimum',
            severity: 'high'
          });
        }
      });
    });

    this.results.summary.passed++;
    console.log(`  ✓ Checked ${files.length} files`);
  }

  /**
   * Check input accessibility attributes
   */
  checkInputAccessibility() {
    console.log('\n[2/6] Checking input accessibility...');
    const componentDir = path.join(projectRoot, 'src', 'components');
    const appDir = path.join(projectRoot, 'app');

    const allDirs = [componentDir, appDir].filter(d => fs.existsSync(d));
    const files = allDirs.flatMap(dir => this.findFiles(dir, /\.(tsx?|jsx?)$/));

    const inputRegex = /<input[^>]*>/g;
    const selectRegex = /<select[^>]*>/g;
    const textareaRegex = /<textarea[^>]*>/g;

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const inputs = content.match(inputRegex) || [];
      const selects = content.match(selectRegex) || [];
      const textareas = content.match(textareaRegex) || [];

      [...inputs, ...selects, ...textareas].forEach(tag => {
        // Check for inputMode (except selects which don't need it)
        const isSelect = tag.includes('select');
        if (!isSelect && !tag.includes('inputMode') && !tag.includes('input-mode')) {
          this.results.summary.failed++;
          this.results.inputAccessibility.push({
            status: 'fail',
            file: file.replace(projectRoot, ''),
            issue: 'Input missing inputMode attribute',
            tag: tag.substring(0, 50) + '...',
            severity: 'critical'
          });
        }

        // Check for autocomplete
        if (!tag.includes('autoComplete') && !tag.includes('autocomplete')) {
          this.results.summary.warnings++;
          this.results.inputAccessibility.push({
            status: 'warning',
            file: file.replace(projectRoot, ''),
            issue: 'Input missing autocomplete attribute',
            severity: 'high'
          });
        }

        // Check type attribute
        const typeMatch = tag.match(/type=["']([^"']+)["']/);
        if (typeMatch) {
          const type = typeMatch[1];
          if (type === 'email' && !tag.includes('inputMode')) {
            this.results.summary.warnings++;
            this.results.inputAccessibility.push({
              status: 'warning',
              file: file.replace(projectRoot, ''),
              issue: `Type "${type}" should have inputMode for better UX`,
              severity: 'medium'
            });
          }
        }
      });
    });

    this.results.summary.passed++;
    console.log(`  ✓ Checked ${files.length} files for input accessibility`);
  }

  /**
   * Check safe area implementation
   */
  checkSafeAreas() {
    console.log('\n[3/6] Checking safe area implementation...');

    // Check main layout files
    const layoutFile = path.join(projectRoot, 'app', 'layout.tsx');
    const globalsCss = path.join(projectRoot, 'src', 'globals.css');

    let foundSafeAreaInsets = false;
    let foundViewportFitCover = false;

    if (fs.existsSync(layoutFile)) {
      const content = fs.readFileSync(layoutFile, 'utf-8');
      foundViewportFitCover = content.includes('viewport-fit') ||
                             content.includes('viewport-fit=cover');

      if (!foundViewportFitCover) {
        this.results.summary.failed++;
        this.results.safeAreas.push({
          status: 'fail',
          file: layoutFile.replace(projectRoot, ''),
          issue: 'Missing viewport-fit=cover meta tag',
          severity: 'critical',
          fix: 'Add <meta name="viewport" content="viewport-fit=cover" /> to head'
        });
      } else {
        this.results.summary.passed++;
        this.results.safeAreas.push({
          status: 'pass',
          issue: 'viewport-fit=cover meta tag found'
        });
      }
    }

    if (fs.existsSync(globalsCss)) {
      const content = fs.readFileSync(globalsCss, 'utf-8');
      foundSafeAreaInsets = /safe-area-inset|env\(safe-area-inset/.test(content);

      if (!foundSafeAreaInsets) {
        this.results.summary.warnings++;
        this.results.safeAreas.push({
          status: 'warning',
          file: globalsCss.replace(projectRoot, ''),
          issue: 'No safe-area-inset CSS found',
          severity: 'high',
          suggestion: 'Add CSS custom properties for safe area padding'
        });
      } else {
        this.results.summary.passed++;
        this.results.safeAreas.push({
          status: 'pass',
          issue: 'Safe area inset CSS found'
        });
      }
    }

    console.log(`  ✓ Safe area checks complete`);
  }

  /**
   * Check responsive class usage
   */
  checkResponsiveClasses() {
    console.log('\n[4/6] Checking responsive class usage...');

    const componentDir = path.join(projectRoot, 'src', 'components');
    const appDir = path.join(projectRoot, 'app');
    const allDirs = [componentDir, appDir].filter(d => fs.existsSync(d));
    const files = allDirs.flatMap(dir => this.findFiles(dir, /\.(tsx?|jsx?)$/));

    const responsiveBreakpoints = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
    let foundResponsiveClasses = false;

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');

      responsiveBreakpoints.forEach(breakpoint => {
        if (content.includes(breakpoint)) {
          foundResponsiveClasses = true;
        }
      });
    });

    if (foundResponsiveClasses) {
      this.results.summary.passed++;
      this.results.responsiveClasses.push({
        status: 'pass',
        issue: 'Responsive Tailwind classes (sm:, md:, lg:) found in components'
      });
    } else {
      this.results.summary.warnings++;
      this.results.responsiveClasses.push({
        status: 'warning',
        issue: 'Limited responsive class usage found',
        suggestion: 'Consider adding more breakpoint-specific styles'
      });
    }

    console.log(`  ✓ Responsive class checks complete`);
  }

  /**
   * Check for fixed width violations
   */
  checkFixedWidths() {
    console.log('\n[5/6] Checking for fixed width violations...');

    const componentDir = path.join(projectRoot, 'src', 'components');
    const appDir = path.join(projectRoot, 'app');
    const allDirs = [componentDir, appDir].filter(d => fs.existsSync(d));
    const files = allDirs.flatMap(dir => this.findFiles(dir, /\.(tsx?|jsx?)$/));

    const fixedWidthRegex = /w-\d{3,}|width\s*:\s*\d{3,}px/g;
    let fixedWidthCount = 0;

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.match(fixedWidthRegex) || [];

      matches.forEach(match => {
        fixedWidthCount++;
        this.results.summary.warnings++;
        this.results.fixedWidths.push({
          status: 'warning',
          file: file.replace(projectRoot, ''),
          issue: `Fixed width found: ${match}`,
          suggestion: 'Consider using max-w-* instead for better responsiveness'
        });
      });
    });

    if (fixedWidthCount === 0) {
      this.results.summary.passed++;
      this.results.fixedWidths.push({
        status: 'pass',
        issue: 'No problematic fixed widths found'
      });
    }

    console.log(`  ✓ Found ${fixedWidthCount} fixed width issues`);
  }

  /**
   * Check performance metrics
   */
  checkPerformanceMetrics() {
    console.log('\n[6/6] Checking performance baseline...');

    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));

    // Check for performance-related dependencies
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    const performanceMetrics = {
      hasPlaywright: 'playwright' in allDeps,
      hasNextImage: 'next' in allDeps,
      hasTailwind: 'tailwindcss' in allDeps,
      hasTypeScript: 'typescript' in allDeps
    };

    Object.entries(performanceMetrics).forEach(([metric, present]) => {
      if (present) {
        this.results.summary.passed++;
        this.results.performanceMetrics.push({
          status: 'pass',
          metric,
          message: `${metric.replace('has', '')} is installed`
        });
      }
    });

    // Check for next.config
    const nextConfigPath = path.join(projectRoot, 'next.config.ts');
    if (fs.existsSync(nextConfigPath)) {
      this.results.summary.passed++;
      this.results.performanceMetrics.push({
        status: 'pass',
        metric: 'nextConfig',
        message: 'Next.js config found for optimization'
      });
    }

    console.log(`  ✓ Performance checks complete`);
  }

  /**
   * Find all files matching pattern in directory
   */
  findFiles(dir, pattern) {
    const files = [];

    const walk = (currentPath) => {
      try {
        const items = fs.readdirSync(currentPath);
        items.forEach(item => {
          if (item.startsWith('.')) return;

          const fullPath = path.join(currentPath, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            if (!['node_modules', '.next'].includes(item)) {
              walk(fullPath);
            }
          } else if (pattern.test(item)) {
            files.push(fullPath);
          }
        });
      } catch (err) {
        // Silently skip inaccessible directories
      }
    };

    walk(dir);
    return files;
  }

  /**
   * Generate report
   */
  generateReport() {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      projectRoot: projectRoot.replace(/\\/g, '/'),
      results: this.results,
      summary: {
        ...this.results.summary,
        totalChecks: this.results.summary.passed + this.results.summary.failed,
        passRate: this.results.summary.passed > 0
          ? ((this.results.summary.passed / (this.results.summary.passed + this.results.summary.failed)) * 100).toFixed(2) + '%'
          : 'N/A'
      }
    };

    return report;
  }

  /**
   * Run all checks
   */
  async run() {
    console.log('🔍 DiveDrop Mobile Verification Suite');
    console.log('=====================================\n');
    console.log(`Project: ${projectRoot}`);
    console.log(`Time: ${new Date().toISOString()}\n`);

    this.checkButtonSizes();
    this.checkInputAccessibility();
    this.checkSafeAreas();
    this.checkResponsiveClasses();
    this.checkFixedWidths();
    this.checkPerformanceMetrics();

    const report = this.generateReport();
    this.printSummary(report);

    return report;
  }

  /**
   * Print summary to console
   */
  printSummary(report) {
    console.log('\n\n📊 VERIFICATION SUMMARY');
    console.log('========================\n');

    const { summary } = report;
    console.log(`Total Checks: ${summary.totalChecks}`);
    console.log(`Passed: ${summary.passed} ✓`);
    console.log(`Failed: ${summary.failed} ✗`);
    console.log(`Warnings: ${summary.warnings} ⚠`);
    console.log(`Pass Rate: ${summary.passRate}\n`);

    if (summary.failed > 0) {
      console.log('❌ CRITICAL ISSUES FOUND:\n');
      const criticalIssues = [
        ...this.results.buttonSizes.filter(r => r.severity === 'critical'),
        ...this.results.inputAccessibility.filter(r => r.severity === 'critical'),
        ...this.results.safeAreas.filter(r => r.severity === 'critical')
      ];

      criticalIssues.forEach(issue => {
        console.log(`  • ${issue.issue || issue.message}`);
        if (issue.file) console.log(`    File: ${issue.file}`);
        if (issue.fix) console.log(`    Fix: ${issue.fix}`);
      });
    }

    if (summary.warnings > 0) {
      console.log('\n⚠️  WARNINGS:\n');
      console.log(`  • ${summary.warnings} non-critical issues found`);
      console.log('  • Review warning details in full report\n');
    }

    console.log('📄 Full report saved to: verification-report.json\n');

    // Save full report
    const reportPath = path.join(projectRoot, 'verification-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✓ Report written to: ${reportPath}`);

    // Exit with appropriate code
    process.exit(summary.failed > 0 ? 1 : 0);
  }
}

// Run verification
const verifier = new MobileVerifier();
await verifier.run();
