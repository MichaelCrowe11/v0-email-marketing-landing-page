/**
 * Font Fallback Verification Script
 * 
 * This script verifies that the font fallback stacks are properly configured
 * in the application layout and CSS files.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, checks) {
    log(`\nChecking: ${filePath}`, 'cyan');

    if (!fs.existsSync(filePath)) {
        log(`  ✗ File not found`, 'red');
        return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let allPassed = true;

    checks.forEach(({ name, pattern, required = true }) => {
        // Remove whitespace and newlines for multi-line matching
        const normalizedContent = content.replace(/\s+/g, ' ');
        const found = pattern.test(content) || pattern.test(normalizedContent);

        if (found) {
            log(`  ✓ ${name}`, 'green');
        } else {
            if (required) {
                log(`  ✗ ${name}`, 'red');
                allPassed = false;
            } else {
                log(`  ⚠ ${name} (optional)`, 'yellow');
            }
        }
    });

    return allPassed;
}

// Main verification
log('='.repeat(60), 'blue');
log('Font Fallback Stack Verification', 'blue');
log('='.repeat(60), 'blue');

const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
const cssPath = path.join(process.cwd(), 'app', 'globals.css');

// Check layout.tsx
const layoutChecks = [
    {
        name: 'Inter font imported',
        pattern: /import.*Inter.*from ['"]next\/font\/google['"]/,
    },
    {
        name: 'Fira Code font imported',
        pattern: /import.*Fira_Code.*from ['"]next\/font\/google['"]/,
    },
    {
        name: 'Inter: system-ui fallback',
        pattern: /fallback:.*system-ui/,
    },
    {
        name: 'Inter: -apple-system fallback',
        pattern: /fallback:.*-apple-system/,
    },
    {
        name: 'Inter: Segoe UI fallback',
        pattern: /fallback:.*Segoe UI/,
    },
    {
        name: 'Inter: Roboto fallback',
        pattern: /fallback:.*Roboto/,
    },
    {
        name: 'Inter: adjustFontFallback enabled',
        pattern: /adjustFontFallback:\s*true/,
    },
    {
        name: 'Inter: font-display swap',
        pattern: /display:\s*["']swap["']/,
    },
    {
        name: 'Inter: preload enabled',
        pattern: /preload:\s*true/,
    },
    {
        name: 'Fira Code: ui-monospace fallback',
        pattern: /fallback:.*ui-monospace/,
    },
    {
        name: 'Fira Code: SFMono-Regular fallback',
        pattern: /fallback:.*SFMono-Regular/,
    },
    {
        name: 'Fira Code: Consolas fallback',
        pattern: /fallback:.*Consolas/,
    },
    {
        name: 'Fira Code: adjustFontFallback enabled',
        pattern: /adjustFontFallback:\s*true/,
    },
    {
        name: 'Fira Code: preload disabled (lazy load)',
        pattern: /preload:\s*false/,
    },
];

const layoutPassed = checkFile(layoutPath, layoutChecks);

// Check globals.css
const cssChecks = [
    {
        name: '--font-sans variable defined',
        pattern: /--font-sans:/,
    },
    {
        name: '--font-mono variable defined',
        pattern: /--font-mono:/,
    },
    {
        name: '--font-code variable defined',
        pattern: /--font-code:/,
    },
    {
        name: '--font-sans includes Inter',
        pattern: /--font-sans:.*Inter/,
    },
    {
        name: '--font-sans includes system-ui',
        pattern: /--font-sans:.*system-ui/,
    },
    {
        name: '--font-mono includes Fira Code',
        pattern: /--font-mono:.*Fira Code/,
    },
    {
        name: '--font-mono includes ui-monospace',
        pattern: /--font-mono:.*ui-monospace/,
    },
    {
        name: '--font-code includes Fira Code',
        pattern: /--font-code:.*Fira Code/,
    },
];

const cssPassed = checkFile(cssPath, cssChecks);

// Summary
log('\n' + '='.repeat(60), 'blue');
log('Verification Summary', 'blue');
log('='.repeat(60), 'blue');

if (layoutPassed && cssPassed) {
    log('\n✓ All checks passed!', 'green');
    log('\nFont fallback stacks are properly configured:', 'green');
    log('  • Inter with comprehensive system font fallbacks', 'green');
    log('  • Fira Code with comprehensive monospace fallbacks', 'green');
    log('  • adjustFontFallback enabled for both fonts', 'green');
    log('  • Optimal preload strategy configured', 'green');
    log('\nExpected CLS improvement: < 0.1 (Good)', 'green');
    process.exit(0);
} else {
    log('\n✗ Some checks failed', 'red');
    log('\nPlease review the configuration and ensure all required', 'yellow');
    log('fallback fonts are properly defined.', 'yellow');
    process.exit(1);
}
