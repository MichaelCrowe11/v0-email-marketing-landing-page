# Audio Guide - Crowe Logic Big Bang Intro

## Quick Start Sound Options

### Option 1: Single Ambient Track (Easiest)
Use one pre-mixed 8-second audio file.

**What you need:**
- 1 file: `assets/sounds/space-ambient.mp3`
- Search terms: "space ambient royalty free", "cosmic atmosphere", "sci-fi background"
- Duration: 8-10 seconds
- Format: MP3, 128kbps, < 500 KB

### Option 2: Layered Audio (Recommended)
Multiple sounds triggered at specific times for richer experience.

**What you need:**
5 files in `assets/sounds/`:
1. `space-ambient.mp3` - Background drone (8s, looping)
2. `big-bang-impact.mp3` - Initial explosion (0.5s)
3. `particle-expansion.mp3` - Whoosh/riser (4s)
4. `stellar-twinkle.mp3` - Single twinkle (0.2s, plays randomly)
5. `avatar-reveal.mp3` - Brand chord (1-2s)

---

## Sound Descriptions & Where to Find Them

### 1. Space Ambient (Background)
**What it sounds like:** Deep, evolving cosmic drone with subtle shimmer

**Free sources:**
- Freesound.org: Search "space ambient" or "deep drone"
- YouTube Audio Library: Filter by "Ambient" genre
- BBC Sound Effects: Search "space" or "atmosphere"

**DIY with Audacity:**
1. Generate → Noise → White Noise (10 seconds)
2. Effects → Low Pass Filter (100 Hz cutoff)
3. Effects → Reverb (Room Size: 100, Wetness: 50%)
4. Effects → Fade In (2s) + Fade Out (2s)

---

### 2. Big Bang Impact
**What it sounds like:** Deep sub-bass boom, like thunder or distant explosion

**Free sources:**
- Freesound.org: "sub bass boom", "thunder", "explosion"
- Zapsplat: "cinematic impact", "bass hit"

**DIY with Audacity:**
1. Generate → Tone (50 Hz, 1 second)
2. Effects → Bass Boost
3. Layer: Generate → Noise → Burst (0.5s)
4. Mix both layers

---

### 3. Particle Expansion
**What it sounds like:** Rising whoosh, like wind accelerating upward

**Free sources:**
- Freesound.org: "whoosh", "riser", "wind sweep"
- AudioJungle: "cinematic riser" ($5-10)

**DIY with Audacity:**
1. Generate → Noise → Pink Noise (4 seconds)
2. Effects → High Pass Filter (200 Hz)
3. Effects → Sliding Stretch (pitch shift up gradually)
4. Effects → Fade In

---

### 4. Stellar Twinkle
**What it sounds like:** Crystalline chime or bell, light and sparkly

**Free sources:**
- Freesound.org: "chime", "bell", "sparkle"
- Common instruments: Wind chimes, glass tapping

**DIY with Audacity:**
1. Generate → Tone (2000 Hz, 0.3 seconds, Sine wave)
2. Effects → Reverb (Small room, 30% wet)
3. Effects → Fade Out (quick)

---

### 5. Avatar Reveal
**What it sounds like:** Rich harmonic chord, warm and premium

**Free sources:**
- Freesound.org: "logo reveal", "corporate sting"
- YouTube Audio Library: "brand logo" sound effects

**DIY with Web Audio API or GarageBand:**
- Play C major chord (C-E-G) with piano + strings
- Duration: 1.5 seconds with reverb
- Export as MP3

---

## Free Sound Resources

### Best Free Libraries
1. **Freesound.org** - Largest community library
   - License: Varies (check each file, often CC0)
   - Quality: Mixed (preview before download)

2. **Zapsplat** - Professional quality
   - License: Free with attribution
   - Quality: High

3. **BBC Sound Effects** - Archive of BBC recordings
   - License: RemArc (free for research/education)
   - Quality: Professional

4. **YouTube Audio Library** - By Google
   - License: Royalty-free
   - Quality: Good

### AI Sound Generation (Free)
- **Mubert AI**: Generate ambient music from prompts
- **AudioCraft**: Meta's open-source sound generation

---

## Implementation in Code

Already implemented in `src/components/AudioManager.js`!

To enable audio in your intro, update `src/main.js`:

```javascript
import AudioManager from './components/AudioManager.js'

class CroweLogicIntro {
  constructor() {
    // ... existing code ...
    this.audioManager = null
  }

  async init() {
    // ... existing code ...

    // Initialize audio (after particle system)
    this.audioManager = new AudioManager()

    // ... rest of init ...
  }

  advance() {
    // Stop audio when transitioning
    if (this.audioManager) {
      this.audioManager.stop()
    }

    // ... existing transition code ...
  }
}
```

---

## Adding Mute Button (Optional)

Update `index.html`:

```html
<!-- Add after skip button -->
<button id="mute-toggle" class="mute-button" aria-label="Toggle sound">
  <span class="sound-icon">🔊</span>
</button>
```

Update `src/styles/intro.css`:

```css
.mute-button {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: var(--text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.mute-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.mute-button.muted .sound-icon::before {
  content: '🔇';
}
```

Add JavaScript in `src/main.js`:

```javascript
setupMuteButton() {
  const muteButton = document.getElementById('mute-toggle')
  if (muteButton && this.audioManager) {
    muteButton.addEventListener('click', () => {
      const isMuted = this.audioManager.toggle()
      muteButton.classList.toggle('muted', isMuted)
    })
  }
}
```

---

## File Specifications

### Audio Format
- **Primary**: MP3 (universal support)
- **Bitrate**: 128 kbps (good quality, small size)
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo

### File Size Budget
- Total: < 2 MB
- Individual files: < 500 KB each
- Compress if needed using Audacity or online tools

### Folder Structure
```
assets/sounds/
  ├── space-ambient.mp3          (400 KB)
  ├── big-bang-impact.mp3        (50 KB)
  ├── particle-expansion.mp3     (150 KB)
  ├── stellar-twinkle.mp3        (30 KB)
  └── avatar-reveal.mp3          (80 KB)
```

---

## Browser Autoplay Notes

**Important:** Most browsers block autoplay until user interaction.

**Solution:** AudioManager already handles this!
- Waits for click, keypress, or touch
- Then plays audio sequence

**No changes needed** - it's built into the component.

---

## Testing Checklist

- [ ] Place audio files in `assets/sounds/` folder
- [ ] Test on Chrome (autoplay policy)
- [ ] Test on Safari/iOS (autoplay restrictions)
- [ ] Test on Firefox
- [ ] Verify mute button works (if added)
- [ ] Check volume levels (not too loud)
- [ ] Verify sounds stop when intro ends
- [ ] Test with system volume at different levels

---

## Quick Setup (5 Minutes)

1. **Find one ambient track**
   - Go to Freesound.org
   - Search: "space ambient 8 seconds"
   - Download as MP3

2. **Create folder**
   ```bash
   mkdir -p assets/sounds
   ```

3. **Add file**
   - Rename to `space-ambient.mp3`
   - Place in `assets/sounds/`

4. **Update code** (optional if using full layered setup)
   - Simplify AudioManager to only use ambient track

5. **Test**
   - Open intro page
   - Click anywhere
   - Verify sound plays

---

## Recommended Preset

For best results with minimal effort:

**Single File Setup:**
- Use one 8-second ambient space track
- Volume: 30%
- Loop: Yes
- Search: "space ambient meditation" (often free/CC0)

**Popular choices:**
- "Deep Space Ambient" by NASA (public domain)
- "Cosmic Atmosphere" by various CC0 artists
- Any Brian Eno-style ambient track

---

## No Sound Option

Don't want to add sound? That's fine!

**To disable audio completely:**
1. Don't create `assets/sounds/` folder
2. Don't import AudioManager in `src/main.js`
3. The intro works perfectly without sound

Visual experience alone is impactful!

---

**Questions or issues?** Check the browser console for error messages from AudioManager.

**Last Updated**: 2025-11-05
