# Mobile Testing Guide

## Overview

This directory contains comprehensive mobile testing for the Crowe Logic AI platform. Tests cover iOS and Android devices, touch interactions, responsive layouts, and mobile-specific features.

## Setup

### Prerequisites

1. Playwright is already configured for mobile testing
2. No additional setup required for emulated devices

### Physical Device Testing (Optional)

For testing on real devices:

**iOS (requires macOS)**
```bash
# Install ios-webkit-debug-proxy
brew install ios-webkit-debug-proxy

# Connect iPhone via USB
# Enable Web Inspector in Safari settings
```

**Android**
```bash
# Install Android SDK
# Enable USB debugging on device
# Connect via ADB
adb devices
```

## Running Tests

### All Mobile Tests

Run complete mobile test suite:
```bash
npm run test:mobile
```

### Specific Device

Test on specific device:
```bash
npx playwright test --project="iPhone 12"
npx playwright test --project="Pixel 5"
```

### iOS Only

Test iOS devices only:
```bash
npx playwright test tests/mobile --grep="iPhone"
```

### Android Only

Test Android devices only:
```bash
npx playwright test tests/mobile --grep="Pixel|Galaxy"
```

## Test Coverage

### Devices Tested

#### Phones
- **iPhone SE** (375x667) - Small iOS device
- **iPhone 12** (390x844) - Standard iOS device
- **iPhone 13** (390x844) - Current iOS device
- **iPhone 14 Pro** (393x852) - Latest iOS with notch
- **Pixel 5** (393x851) - Standard Android device
- **Galaxy S9+** (412x846) - Large Android device

#### Tablets
- **iPad** (810x1080) - Standard iPad
- **iPad Pro** (1024x1366) - Large iPad
- **Galaxy Tab S4** (712x1138) - Android tablet

### Test Categories

#### Responsive Layout
- [x] No horizontal scrolling
- [x] Content fits viewport
- [x] Proper spacing and margins
- [x] Readable text sizes
- [x] Appropriate image sizes

#### Touch Interactions
- [x] Touch targets ≥ 44x44px
- [x] Touch feedback (ripples, active states)
- [x] Tap accuracy
- [x] Long press support
- [x] Swipe gestures
- [x] Pinch zoom (where applicable)

#### Navigation
- [x] Mobile menu functionality
- [x] Hamburger menu
- [x] Bottom navigation (if applicable)
- [x] Back button support
- [x] Deep linking

#### Forms
- [x] Appropriate keyboard types
- [x] Input validation
- [x] Error messages
- [x] Auto-complete support
- [x] No zoom on input focus (iOS)

#### Performance
- [x] Fast load times
- [x] Smooth scrolling
- [x] No layout shifts
- [x] Optimized images
- [x] Efficient animations

#### iOS-Specific
- [x] Safe area insets
- [x] No unwanted zoom
- [x] Proper input focus
- [x] iOS gestures
- [x] Safari compatibility

#### Android-Specific
- [x] Back button handling
- [x] Android keyboard
- [x] Chrome compatibility
- [x] Material Design patterns

## Manual Testing Checklist

### Pre-Testing Setup

1. **Clear Cache**
   - Clear browser cache
   - Clear app data (if testing PWA)
   - Restart device

2. **Network Conditions**
   - Test on WiFi
   - Test on 4G/LTE
   - Test on 3G (if applicable)
   - Test offline (if PWA)

3. **Device Settings**
   - Test with different font sizes
   - Test with dark mode
   - Test with reduced motion
   - Test with high contrast

### Testing Workflow

#### 1. Visual Inspection

- [ ] Layout looks correct
- [ ] No overlapping elements
- [ ] Proper spacing
- [ ] Images load correctly
- [ ] Icons are visible
- [ ] Text is readable

#### 2. Navigation Testing

- [ ] Tap all navigation items
- [ ] Open and close mobile menu
- [ ] Navigate between pages
- [ ] Use back button
- [ ] Test deep links

#### 3. Touch Interaction Testing

- [ ] Tap all buttons
- [ ] Tap all links
- [ ] Fill out forms
- [ ] Scroll through content
- [ ] Swipe carousels
- [ ] Pinch zoom images

#### 4. Form Testing

- [ ] Enter text in inputs
- [ ] Select from dropdowns
- [ ] Check checkboxes
- [ ] Toggle switches
- [ ] Submit forms
- [ ] Validate errors

#### 5. Performance Testing

- [ ] Measure load time
- [ ] Check scroll smoothness
- [ ] Monitor battery usage
- [ ] Check memory usage
- [ ] Test with slow network

#### 6. Orientation Testing

- [ ] Rotate to landscape
- [ ] Rotate to portrait
- [ ] Check layout adapts
- [ ] Verify no content loss

### Device-Specific Testing

#### iOS Testing

**iPhone SE (Small Screen)**
- [ ] All content fits
- [ ] Touch targets are large enough
- [ ] Text is readable
- [ ] No horizontal scroll

**iPhone 12/13 (Standard)**
- [ ] Optimal layout
- [ ] Smooth animations
- [ ] Fast performance

**iPhone 14 Pro (Notch)**
- [ ] Safe area respected
- [ ] No content behind notch
- [ ] Status bar visible

**iPad (Tablet)**
- [ ] Uses tablet layout
- [ ] Multi-column where appropriate
- [ ] Landscape mode works

#### Android Testing

**Pixel 5 (Standard)**
- [ ] Material Design patterns
- [ ] Android keyboard works
- [ ] Back button works

**Galaxy S9+ (Large)**
- [ ] Uses extra space well
- [ ] No stretched content
- [ ] Proper scaling

**Galaxy Tab (Tablet)**
- [ ] Tablet-optimized layout
- [ ] Multi-pane views
- [ ] Landscape support

## Common Issues and Fixes

### Horizontal Scrolling

**Problem**: Content extends beyond viewport width

**Fixes**:
```css
/* Prevent overflow */
body {
  overflow-x: hidden;
}

/* Constrain content */
.container {
  max-width: 100vw;
  overflow-x: hidden;
}

/* Fix wide elements */
img, video {
  max-width: 100%;
  height: auto;
}
```

### Small Touch Targets

**Problem**: Buttons/links too small to tap accurately

**Fixes**:
```css
/* Minimum touch target size */
button, a {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* Add padding for small elements */
.icon-button {
  padding: 12px;
}
```

### iOS Zoom on Input Focus

**Problem**: iOS zooms in when focusing inputs

**Fixes**:
```css
/* Minimum 16px font size */
input, textarea, select {
  font-size: 16px;
}
```

```html
<!-- Disable zoom (not recommended) -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

### Safe Area Insets (iOS)

**Problem**: Content hidden by notch or home indicator

**Fixes**:
```css
/* Use safe area insets */
.header {
  padding-top: env(safe-area-inset-top);
}

.footer {
  padding-bottom: env(safe-area-inset-bottom);
}

.sidebar {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Slow Performance

**Problem**: Laggy scrolling or animations

**Fixes**:
```css
/* Use GPU acceleration */
.animated {
  transform: translateZ(0);
  will-change: transform;
}

/* Optimize scroll */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}
```

### Layout Shifts

**Problem**: Content jumps during load

**Fixes**:
```tsx
// Reserve space for images
<Image
  width={800}
  height={600}
  alt="..."
/>

// Reserve space for dynamic content
<div style={{ minHeight: '200px' }}>
  {loading ? <Skeleton /> : <Content />}
</div>
```

## Testing Tools

### Browser DevTools

**Chrome DevTools**
```
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select device from dropdown
4. Test responsive design
```

**Safari Web Inspector**
```
1. Enable Develop menu
2. Connect iOS device
3. Select device from Develop menu
4. Inspect and debug
```

### Emulators

**iOS Simulator (macOS)**
```bash
# Open Xcode
# Window > Devices and Simulators
# Select iOS device
# Run Safari
```

**Android Emulator**
```bash
# Open Android Studio
# AVD Manager
# Create/Start virtual device
# Run Chrome
```

### Remote Debugging

**iOS Remote Debugging**
```
1. Connect iPhone via USB
2. Enable Web Inspector on iPhone
3. Open Safari on Mac
4. Develop > [Device Name] > [Page]
```

**Android Remote Debugging**
```
1. Enable USB debugging on Android
2. Connect via USB
3. Open chrome://inspect in Chrome
4. Select device and page
```

## Performance Benchmarks

### Load Time Targets

| Network | Target | Description |
|---------|--------|-------------|
| **WiFi** | < 2s | Fast connection |
| **4G** | < 3s | Standard mobile |
| **3G** | < 5s | Slow mobile |

### Interaction Targets

| Interaction | Target | Description |
|-------------|--------|-------------|
| **Tap Response** | < 100ms | Immediate feedback |
| **Page Transition** | < 300ms | Smooth navigation |
| **Scroll FPS** | 60fps | Smooth scrolling |

### Resource Budgets

| Resource | Mobile Budget | Description |
|----------|---------------|-------------|
| **JavaScript** | < 300KB | Total JS size |
| **CSS** | < 50KB | Total CSS size |
| **Images** | < 1MB | Total images |
| **Total** | < 2MB | Total page weight |

## Accessibility on Mobile

### Screen Reader Testing

**VoiceOver (iOS)**
```
1. Settings > Accessibility > VoiceOver
2. Enable VoiceOver
3. Swipe to navigate
4. Double-tap to activate
```

**TalkBack (Android)**
```
1. Settings > Accessibility > TalkBack
2. Enable TalkBack
3. Swipe to navigate
4. Double-tap to activate
```

### Voice Control

**iOS Voice Control**
```
1. Settings > Accessibility > Voice Control
2. Enable Voice Control
3. Say "Show numbers"
4. Say number to interact
```

## Requirements Coverage

This testing setup addresses:
- **Requirement 2.1**: Mobile responsive layout
- **Requirement 2.2**: Touch target sizes
- **Requirement 2.3**: Mobile interactions
- **Requirement 2.4**: Mobile navigation
- **Requirement 2.5**: iOS-specific features
