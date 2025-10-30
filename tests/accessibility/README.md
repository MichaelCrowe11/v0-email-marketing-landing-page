# Accessibility Testing Guide

## Overview

This directory contains comprehensive accessibility testing for the Crowe Logic AI platform. Tests ensure WCAG 2.1 AA compliance and verify keyboard navigation, screen reader support, and color contrast.

## Setup

### Prerequisites

1. Install axe-core for Playwright:
```bash
npm install -D @axe-core/playwright
```

2. Install screen reader testing tools (optional):
```bash
# macOS - VoiceOver (built-in)
# Windows - NVDA (free)
# Windows - JAWS (commercial)
```

## Running Tests

### Automated Accessibility Tests

Run axe-core automated tests:
```bash
npm run test:a11y
```

### Manual Testing Checklist

#### Keyboard Navigation Testing

1. **Tab Navigation**
   - [ ] Press Tab to move forward through interactive elements
   - [ ] Press Shift+Tab to move backward
   - [ ] Verify visible focus indicators on all elements
   - [ ] Ensure logical tab order (left-to-right, top-to-bottom)

2. **Skip Links**
   - [ ] Press Tab on page load
   - [ ] Verify "Skip to main content" link appears
   - [ ] Press Enter to skip to main content
   - [ ] Verify focus moves to main content area

3. **Modal Dialogs**
   - [ ] Open a modal dialog
   - [ ] Verify focus moves to modal
   - [ ] Tab through modal elements
   - [ ] Verify focus stays trapped in modal
   - [ ] Press Escape to close modal
   - [ ] Verify focus returns to trigger element

4. **Dropdown Menus**
   - [ ] Tab to menu trigger
   - [ ] Press Enter or Space to open menu
   - [ ] Use Arrow keys to navigate menu items
   - [ ] Press Enter to select item
   - [ ] Press Escape to close menu

5. **Form Controls**
   - [ ] Tab through all form fields
   - [ ] Verify labels are announced
   - [ ] Submit form with errors
   - [ ] Verify error messages are announced
   - [ ] Verify focus moves to first error

#### Screen Reader Testing

**VoiceOver (macOS)**
```bash
# Enable VoiceOver: Cmd+F5
# Navigate: VO+Arrow keys
# Interact: VO+Shift+Down
# Stop interacting: VO+Shift+Up
```

1. **Landmarks**
   - [ ] Navigate by landmarks (VO+U, then use arrow keys)
   - [ ] Verify main, navigation, banner, contentinfo present
   - [ ] Verify landmark labels are descriptive

2. **Headings**
   - [ ] Navigate by headings (VO+Cmd+H)
   - [ ] Verify heading hierarchy (H1 → H2 → H3)
   - [ ] Verify headings are descriptive

3. **Links**
   - [ ] Navigate by links (VO+Cmd+L)
   - [ ] Verify link text is descriptive
   - [ ] Verify no "click here" or "read more" without context

4. **Forms**
   - [ ] Navigate to form
   - [ ] Verify labels are announced
   - [ ] Verify required fields are announced
   - [ ] Verify error messages are announced
   - [ ] Verify success messages are announced

5. **Images**
   - [ ] Navigate to images
   - [ ] Verify alt text is descriptive
   - [ ] Verify decorative images are hidden (alt="")

6. **Dynamic Content**
   - [ ] Trigger dynamic content update
   - [ ] Verify ARIA live region announces change
   - [ ] Verify announcement is not disruptive

**NVDA (Windows)**
```bash
# Enable NVDA: Ctrl+Alt+N
# Navigate: Arrow keys
# Elements list: NVDA+F7
# Stop speech: Ctrl
```

Follow same checklist as VoiceOver above.

#### Color Contrast Testing

1. **Text Contrast**
   - [ ] Use browser DevTools or contrast checker
   - [ ] Verify normal text: 4.5:1 minimum
   - [ ] Verify large text (18pt+): 3:1 minimum
   - [ ] Test in both light and dark modes

2. **Interactive Elements**
   - [ ] Verify button text contrast
   - [ ] Verify link text contrast
   - [ ] Verify form label contrast
   - [ ] Verify placeholder text contrast (if used)

3. **Focus Indicators**
   - [ ] Verify focus outline contrast: 3:1 minimum
   - [ ] Test against all background colors

#### Zoom and Reflow Testing

1. **Browser Zoom**
   - [ ] Zoom to 200% (Cmd/Ctrl + +)
   - [ ] Verify all content is readable
   - [ ] Verify no horizontal scrolling
   - [ ] Verify no content overlap
   - [ ] Verify interactive elements still work

2. **Text Resize**
   - [ ] Increase browser text size to 200%
   - [ ] Verify layout doesn't break
   - [ ] Verify no content is cut off

#### Motion and Animation Testing

1. **Reduced Motion**
   - [ ] Enable reduced motion in OS settings
   - [ ] Reload page
   - [ ] Verify animations are disabled or reduced
   - [ ] Verify functionality still works

2. **Animation Safety**
   - [ ] Verify no flashing content (3+ times per second)
   - [ ] Verify no parallax effects that cause motion sickness
   - [ ] Verify autoplay videos can be paused

## Test Coverage

### WCAG 2.1 AA Requirements

#### Perceivable
- [x] 1.1.1 Non-text Content (Level A)
- [x] 1.3.1 Info and Relationships (Level A)
- [x] 1.3.2 Meaningful Sequence (Level A)
- [x] 1.4.3 Contrast (Minimum) (Level AA)
- [x] 1.4.4 Resize Text (Level AA)
- [x] 1.4.5 Images of Text (Level AA)

#### Operable
- [x] 2.1.1 Keyboard (Level A)
- [x] 2.1.2 No Keyboard Trap (Level A)
- [x] 2.4.1 Bypass Blocks (Level A)
- [x] 2.4.2 Page Titled (Level A)
- [x] 2.4.3 Focus Order (Level A)
- [x] 2.4.4 Link Purpose (In Context) (Level A)
- [x] 2.4.5 Multiple Ways (Level AA)
- [x] 2.4.6 Headings and Labels (Level AA)
- [x] 2.4.7 Focus Visible (Level AA)

#### Understandable
- [x] 3.1.1 Language of Page (Level A)
- [x] 3.2.1 On Focus (Level A)
- [x] 3.2.2 On Input (Level A)
- [x] 3.3.1 Error Identification (Level A)
- [x] 3.3.2 Labels or Instructions (Level A)
- [x] 3.3.3 Error Suggestion (Level AA)
- [x] 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)

#### Robust
- [x] 4.1.1 Parsing (Level A)
- [x] 4.1.2 Name, Role, Value (Level A)
- [x] 4.1.3 Status Messages (Level AA)

## Common Issues and Fixes

### Missing Alt Text
```tsx
// ❌ Bad
<img src="mushroom.jpg" />

// ✅ Good
<img src="mushroom.jpg" alt="Oyster mushroom growing on substrate" />

// ✅ Decorative
<img src="decoration.jpg" alt="" aria-hidden="true" />
```

### Poor Color Contrast
```css
/* ❌ Bad - 2.5:1 contrast */
.text {
  color: #999;
  background: #fff;
}

/* ✅ Good - 4.6:1 contrast */
.text {
  color: #666;
  background: #fff;
}
```

### Missing Form Labels
```tsx
// ❌ Bad
<input type="text" placeholder="Email" />

// ✅ Good
<label htmlFor="email">Email</label>
<input type="text" id="email" />

// ✅ Also good
<input type="text" aria-label="Email" />
```

### No Focus Indicators
```css
/* ❌ Bad */
button:focus {
  outline: none;
}

/* ✅ Good */
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Keyboard Trap
```tsx
// ❌ Bad - focus trapped
<div onKeyDown={(e) => e.preventDefault()}>
  <button>Trapped</button>
</div>

// ✅ Good - allow escape
<div onKeyDown={(e) => {
  if (e.key === 'Escape') close();
}}>
  <button>Can escape</button>
</div>
```

## Tools and Resources

### Browser Extensions
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Visual accessibility evaluation
- **Lighthouse**: Performance and accessibility audits
- **Color Contrast Analyzer**: Check contrast ratios

### Screen Readers
- **VoiceOver** (macOS): Built-in, Cmd+F5
- **NVDA** (Windows): Free, https://www.nvaccess.org/
- **JAWS** (Windows): Commercial, https://www.freedomscientific.com/
- **TalkBack** (Android): Built-in
- **VoiceOver** (iOS): Built-in

### Testing Tools
- **Playwright**: Automated testing framework
- **axe-core**: Accessibility testing engine
- **Pa11y**: Automated accessibility testing
- **Lighthouse CI**: Continuous accessibility monitoring

### Documentation
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

## Requirements Coverage

This testing setup addresses:
- **Requirement 4.1**: Keyboard navigation
- **Requirement 4.2**: Screen reader support
- **Requirement 4.3**: Color contrast compliance
- **Requirement 4.4**: Reduced motion support
- **Requirement 4.5**: Image alt text
