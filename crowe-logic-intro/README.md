# Crowe Logic 3D Big Bang Intro Page

An immersive landing page intro featuring a real-time 3D particle system simulating a Big Bang/stellar explosion with the Crowe Logic corporate avatar at the epicenter, symbolizing the birth of AI systems architecture.

## Features

- **3D Particle System**: Real-time WebGL-powered particle simulation with 1,000-5,000 particles
- **Big Bang Effect**: Radial expansion with spiral galaxy rotation
- **Brand-Centric Design**: Crowe Logic avatar at the center with golden ring glow
- **Responsive**: Adaptive quality based on device (desktop/tablet/mobile)
- **Performance Optimized**: 60fps on desktop, 30fps on mobile
- **Fallback Support**: Graceful degradation for non-WebGL browsers
- **Interactive Effects**: Mouse parallax and hover glow on avatar
- **Skip Functionality**: Skip button with auto-advance after 8 seconds

## Technology Stack

- **Three.js** (r158+) - 3D rendering engine
- **WebGL** - GPU-accelerated graphics
- **Vanilla JavaScript** - ES6 modules
- **CSS3** - Modern animations and effects
- **Google Fonts** - Playfair Display & Inter

## Project Structure

```
/crowe-logic-intro
├── /assets
│   ├── /images
│   │   └── crowe-logic-avatar.png
│   ├── /fonts
│   └── /sounds
├── /src
│   ├── /components
│   │   ├── BigBangParticles.js    # 3D particle system
│   │   └── BrandAvatar.js         # Avatar component with effects
│   ├── /utils
│   │   ├── particleSystem.js      # Particle calculation utilities
│   │   └── deviceDetect.js        # Device detection & performance
│   ├── /styles
│   │   └── intro.css              # All styling
│   └── main.js                    # Entry point & initialization
├── index.html
└── README.md
```

## Installation

### 1. Prerequisites

- Modern web browser with WebGL support
- Local web server (for ES6 modules)

### 2. Setup

```bash
# Navigate to the project directory
cd crowe-logic-intro

# Serve with any local server, for example:
# Using Python 3
python3 -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

### 3. Access

Open your browser and navigate to:
```
http://localhost:8000
```

## Configuration

### Particle System Settings

Edit `src/components/BigBangParticles.js`:

```javascript
const CONFIG = {
  particleCount: {
    desktop: 5000,  // Adjust for performance
    tablet: 2500,
    mobile: 1000
  },
  explosion: {
    particleSpeed: 0.005,      // Speed of expansion
    rotationSpeed: 0.0002      // Galaxy rotation speed
  }
}
```

### Brand Colors

Edit `src/styles/intro.css`:

```css
:root {
  --gold-primary: #C9A961;
  --gold-secondary: #8B7355;
  --gold-accent: #D4AF37;
}
```

### Auto-Advance Timing

Edit `src/main.js`:

```javascript
// Change from 8000ms (8 seconds) to desired duration
setTimeout(() => {
  if (!this.introCompleted) {
    this.advance()
  }
}, 8000)  // Change this value
```

## Customization

### 1. Replace Avatar Image

Replace `assets/images/crowe-logic-avatar.png` with your own image:
- **Format**: PNG with transparency
- **Dimensions**: 512x512px (minimum), 1024x1024px (recommended)
- **Aspect Ratio**: 1:1 (square)

### 2. Change Company Name/Tagline

Edit `index.html`:

```html
<h1 class="company-name">Your Company Name</h1>
<p class="company-tagline">Your Tagline</p>
```

### 3. Adjust Particle Colors

Edit `src/components/BigBangParticles.js`:

```javascript
colors: {
  hot: [0xff6b35, 0xff8c42, 0xffa600],     // Orange/red
  cool: [0x4ecdc4, 0x45b7d1, 0x96ceb4],    // Blue/teal
  nebula: [0xc44569, 0x9b59b6, 0x8e44ad],  // Purple/pink
  gold: [0xC9A961, 0xD4AF37, 0xFFD700]     // Gold accents
}
```

### 4. Redirect Target

Edit `src/main.js` to change where the intro redirects:

```javascript
advance() {
  // ...
  setTimeout(() => {
    window.location.href = '/home'  // Change to your target page
  }, 1000)
}
```

## Browser Support

- **Chrome/Edge**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Mobile Safari**: 14+ ✅
- **Mobile Chrome**: 90+ ✅

## Performance Optimization

### Automatic Optimizations

1. **Device-based particle count**: Fewer particles on mobile
2. **Pixel ratio limiting**: Max 2x for performance
3. **Reduced motion support**: Respects OS accessibility settings
4. **Antialias disabled**: Better performance on low-end devices

### Manual Optimizations

To improve performance on slower devices:

1. Reduce particle count in `CONFIG.particleCount`
2. Decrease particle size in material settings
3. Disable parallax effect in `BrandAvatar.js`
4. Lower `devicePixelRatio` cap in renderer setup

## Troubleshooting

### Particles not appearing

**Issue**: WebGL not supported
**Solution**: Browser fallback will activate automatically. Update browser or use desktop.

### Low frame rate

**Issue**: Too many particles for device
**Solution**: Reduce `particleCount` values in config

### Avatar image not loading

**Issue**: Wrong image path or missing file
**Solution**: Verify `assets/images/crowe-logic-avatar.png` exists and path is correct

### Module import errors

**Issue**: Not using a local server
**Solution**: ES6 modules require a server. Use Python, Node, or PHP server as shown above.

### Skip button not working

**Issue**: JavaScript error blocking initialization
**Solution**: Check browser console for errors. Verify Three.js CDN is loading.

## Deployment

### Option 1: Static Hosting (Vercel, Netlify)

```bash
# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod
```

### Option 2: Traditional Web Hosting

1. Upload entire `crowe-logic-intro` folder to server
2. Ensure server supports serving ES6 modules with correct MIME types
3. Configure `.htaccess` if needed:

```apache
AddType application/javascript .js
AddType text/css .css
```

### Option 3: CDN Integration

For production, consider:
- Using WebP/AVIF for avatar image
- Minifying JavaScript/CSS
- Adding cache headers
- Using Three.js from CDN (already configured)

## Advanced Enhancements

### Add Sound Effects

```javascript
// In main.js init()
const ambientSound = new Audio('assets/sounds/space-ambient.mp3')
ambientSound.loop = true
ambientSound.volume = 0.3

document.addEventListener('click', () => {
  ambientSound.play()
}, { once: true })
```

### Add Analytics

```javascript
// In main.js advance()
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  'event': 'intro_complete',
  'intro_duration': Date.now() - startTime
})
```

### Add Constellation Patterns

Modify `BigBangParticles.js` to create specific star patterns or constellation shapes instead of random distribution.

## License

Copyright © 2025 Crowe Logic, Inc. All rights reserved.

## Support

For issues or questions:
- Email: support@crowelogic.com
- Documentation: https://docs.crowelogic.com

## Credits

- **Design**: Crowe Logic, Inc
- **3D Engine**: Three.js
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Avatar**: Crowe Logic Corporate Brand Assets
