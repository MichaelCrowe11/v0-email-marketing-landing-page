# Quick Start Guide

Get your Crowe Logic Big Bang Intro running in under 5 minutes!

## 🚀 Instant Setup

### Step 1: Navigate to the Project

```bash
cd /workspaces/v0-email-marketing-landing-page/crowe-logic-intro
```

### Step 2: Start a Local Server

Choose one option:

**Option A: Python** (Recommended)
```bash
python3 -m http.server 8000
```

**Option B: Node.js**
```bash
npx http-server -p 8000
```

**Option C: PHP**
```bash
php -S localhost:8000
```

### Step 3: Open in Browser

```
http://localhost:8000
```

That's it! You should see the Big Bang intro animation.

---

## 📁 Project Structure

```
crowe-logic-intro/
├── index.html                    # Main HTML file
├── assets/
│   ├── images/
│   │   └── crowe-logic-avatar.png   # Your avatar (already included)
│   └── sounds/                      # Add audio files here (optional)
├── src/
│   ├── main.js                      # Entry point
│   ├── components/
│   │   ├── BigBangParticles.js      # 3D particle system
│   │   ├── BrandAvatar.js           # Avatar component
│   │   └── AudioManager.js          # Sound system (optional)
│   ├── styles/
│   │   └── intro.css                # All styling
│   └── utils/
│       ├── deviceDetect.js          # Device detection
│       └── particleSystem.js        # Particle utilities
├── README.md                     # Full documentation
├── AUDIO_GUIDE.md               # Sound design guide
└── DEPLOYMENT_CHECKLIST.md      # Pre-launch checklist
```

---

## 🎨 Customization

### Change Company Name/Tagline

Edit [index.html](index.html) lines 28-29:

```html
<h1 class="company-name">Michael Crowe</h1>
<p class="company-tagline">AI Systems Architect</p>
```

### Change Brand Colors

Edit [src/styles/intro.css](src/styles/intro.css) lines 11-16:

```css
:root {
  --gold-primary: #C9A961;
  --gold-secondary: #8B7355;
  --gold-accent: #D4AF37;
}
```

### Change Particle Count (Performance)

Edit [src/components/BigBangParticles.js](src/components/BigBangParticles.js) lines 3-7:

```javascript
particleCount: {
  desktop: 5000,  // Lower for slower computers
  tablet: 2500,
  mobile: 1000
}
```

### Change Redirect Target

Edit [src/main.js](src/main.js) line 92:

```javascript
window.location.href = '/home'  // Change to your page
```

### Change Auto-Advance Time

Edit [src/main.js](src/main.js) line 45:

```javascript
setTimeout(() => {
  if (!this.introCompleted) {
    this.advance()
  }
}, 8000)  // 8000 = 8 seconds, change as needed
```

---

## 🔊 Adding Sound (Optional)

### Quick Method: Single Ambient Track

1. **Find a sound:**
   - Go to [Freesound.org](https://freesound.org)
   - Search: "space ambient"
   - Download free MP3

2. **Add to project:**
   ```bash
   mkdir -p assets/sounds
   # Copy your file and rename to:
   # assets/sounds/space-ambient.mp3
   ```

3. **Enable in code:**

   Edit [src/main.js](src/main.js), add after line 35:

   ```javascript
   // Initialize audio
   this.audioManager = new AudioManager()
   ```

   Add import at top:

   ```javascript
   import AudioManager from './components/AudioManager.js'
   ```

4. **Test:** Refresh browser and click anywhere

See [AUDIO_GUIDE.md](AUDIO_GUIDE.md) for detailed sound options.

---

## 🧪 Testing

### Browser Support Check

Test in these browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Mobile Chrome

### Performance Check

Open browser DevTools (F12):
- **Console tab**: Should show no errors
- **Performance tab**: Record → Reload page → Should maintain 60fps
- **Network tab**: Total load should be < 2 MB

### Quick Tests

- [ ] Page loads without errors
- [ ] Particles appear and expand
- [ ] Avatar fades in after 0.5 seconds
- [ ] "Skip Intro" button works
- [ ] Auto-advances after 8 seconds
- [ ] Mobile responsive (test on phone)
- [ ] No console errors

---

## 🐛 Troubleshooting

### Particles Don't Appear

**Problem:** WebGL not supported or Three.js didn't load

**Solutions:**
1. Check console for errors
2. Verify Three.js CDN is accessible:
   ```
   https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js
   ```
3. Try a different browser
4. Fallback should activate automatically (static avatar)

### Avatar Image Not Showing

**Problem:** Wrong path or missing file

**Solution:**
```bash
# Verify file exists:
ls -la assets/images/crowe-logic-avatar.png

# If missing, copy your avatar:
cp /path/to/your/avatar.png assets/images/crowe-logic-avatar.png
```

### Module Import Errors

**Problem:** ES6 modules require a server

**Solution:**
- ❌ Don't open `file:///index.html` directly
- ✅ Use local server (see Step 2 above)

### Low Frame Rate

**Problem:** Too many particles for device

**Solution:** Reduce particle count in `BigBangParticles.js`:
```javascript
particleCount: {
  desktop: 3000,  // Reduced from 5000
  tablet: 1500,   // Reduced from 2500
  mobile: 500     // Reduced from 1000
}
```

### Skip Button Not Working

**Problem:** JavaScript error blocking initialization

**Solution:**
1. Open browser console (F12)
2. Look for red error messages
3. Verify all files are in correct locations
4. Clear browser cache (Ctrl+Shift+R)

---

## 📤 Deployment

### Option 1: Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd crowe-logic-intro
vercel deploy --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd crowe-logic-intro
netlify deploy --prod --dir=.
```

### Option 3: Traditional Hosting

1. Upload entire `crowe-logic-intro` folder to your server
2. Ensure server supports ES6 modules (MIME type: `application/javascript`)
3. Access via: `https://yourdomain.com/crowe-logic-intro/`

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for pre-launch checklist.

---

## 🎯 Next Steps

1. **Customize branding** (colors, text, avatar)
2. **Test on target devices** (especially mobile)
3. **Add sound** (optional, see AUDIO_GUIDE.md)
4. **Optimize images** (convert to WebP for better performance)
5. **Set redirect target** (where intro should go after completion)
6. **Deploy to production** (when ready)

---

## 📚 Documentation

- **[README.md](README.md)** - Full documentation
- **[AUDIO_GUIDE.md](AUDIO_GUIDE.md)** - Sound design and implementation
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-launch checklist

---

## 💡 Tips

### Performance
- Disable antialias (already done) for better FPS
- Use smaller images (WebP format)
- Reduce particle count on mobile

### Accessibility
- Skip button is keyboard accessible (Tab + Enter)
- Respects "prefers-reduced-motion" setting
- Auto-advance ensures users aren't stuck

### SEO
- Update meta description in index.html
- Add Open Graph tags for social sharing
- Set proper page title

---

## ✅ Success Checklist

After setup, you should have:

- [x] Intro page loads at `http://localhost:8000`
- [x] 3D particles expanding from center
- [x] Avatar appears in center with gold ring
- [x] Skip button in top-right corner
- [x] Auto-advances after 8 seconds
- [x] No console errors
- [x] Smooth 60fps animation (desktop)

---

## 🆘 Need Help?

1. **Check console errors** (F12 → Console tab)
2. **Review troubleshooting section** above
3. **Verify file structure** matches expected layout
4. **Test in different browser** (Chrome recommended)
5. **Check all file paths** are correct

---

**Ready to launch?** See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Want sound?** See [AUDIO_GUIDE.md](AUDIO_GUIDE.md)

**Need details?** See [README.md](README.md)

---

**Version:** 1.0.0
**Last Updated:** 2025-11-05
**Estimated Setup Time:** 5 minutes
