# Audio Files for Crowe Logic Big Bang Intro

This directory contains the audio files for the Big Bang intro sequence.

## Required Audio Files

Place the following 5 audio files in this directory:

### 1. `space-ambient.mp3`
- **Description:** Deep, evolving cosmic drone with subtle shimmer
- **Duration:** 8-10 seconds (loops)
- **Volume:** Background ambient (30%)
- **Find at:**
  - Freesound.org: Search "space ambient" or "deep drone"
  - YouTube Audio Library: Filter by "Ambient" genre
  - NASA Sound Library: "Deep Space" recordings (public domain)

### 2. `big-bang-impact.mp3`
- **Description:** Deep sub-bass boom, like thunder or distant explosion
- **Duration:** 0.5-1 second
- **Volume:** 60% (prominent but not overwhelming)
- **Find at:**
  - Freesound.org: "sub bass boom", "thunder", "explosion"
  - Zapsplat: "cinematic impact", "bass hit"

### 3. `particle-expansion.mp3`
- **Description:** Rising whoosh, like wind accelerating upward
- **Duration:** 4 seconds
- **Volume:** 40%
- **Find at:**
  - Freesound.org: "whoosh", "riser", "wind sweep"
  - AudioJungle: "cinematic riser" (paid, $5-10)

### 4. `stellar-twinkle.mp3`
- **Description:** Crystalline chime or bell, light and sparkly
- **Duration:** 0.2-0.3 seconds
- **Volume:** 25% (subtle, plays multiple times)
- **Find at:**
  - Freesound.org: "chime", "bell", "sparkle"
  - Common instruments: Wind chimes recording, glass tapping

### 5. `avatar-reveal.mp3`
- **Description:** Rich harmonic chord, warm and premium (brand reveal sound)
- **Duration:** 1.5-2 seconds
- **Volume:** 50%
- **Find at:**
  - Freesound.org: "logo reveal", "corporate sting"
  - YouTube Audio Library: "brand logo" sound effects

---

## Quick Start (Recommended Sources)

### Best Free Resources

1. **[Freesound.org](https://freesound.org)** - Largest community library
   - License: Varies (check each file, often CC0)
   - Sign up for free account to download

2. **[Zapsplat](https://www.zapsplat.com)** - Professional quality
   - License: Free with attribution
   - High quality curated sounds

3. **[BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)** - Archive
   - License: RemArc (free for research/education)
   - Professional broadcast quality

4. **[YouTube Audio Library](https://youtube.com/audiolibrary)** - By Google
   - License: Royalty-free
   - Good quality, easy to use

---

## File Specifications

### Format Requirements
- **File Type:** MP3
- **Bitrate:** 128 kbps (good quality, small size)
- **Sample Rate:** 44.1 kHz
- **Channels:** Stereo

### Size Budget
- **Total:** < 2 MB for all files
- **Individual:** < 500 KB each
- **Tip:** Use Audacity or online compressor if files are too large

---

## Alternative: Single File Setup

If you want a simpler setup, you only need one file:

### `space-ambient.mp3` (Single File Mode)
- One 8-second ambient space track
- 30% volume, looped
- Search: "space ambient meditation" or "cosmic atmosphere"
- Popular choice: NASA's "Deep Space Ambient" (public domain)

To use single file mode, modify `src/components/AudioManager.js` to only load and play the ambient track.

---

## Testing Your Audio

After placing the files:

1. Open the intro in a browser
2. Click anywhere to trigger audio (autoplay policy compliance)
3. Check that all sounds play at appropriate times:
   - **0ms:** Ambient starts + Impact boom
   - **500ms:** Avatar reveal chord
   - **500ms:** Expansion whoosh begins
   - **2000ms:** Twinkles start (random intervals)

4. Test the mute button in top-left corner

---

## Troubleshooting

### Audio doesn't play
- Check browser console for errors
- Verify file paths are correct
- Ensure you clicked/interacted with page first (autoplay policy)
- Check file formats are MP3

### Audio too loud/quiet
- Adjust volumes in `src/components/AudioManager.js`
- Modify `masterVolume` (line 11) or individual sound volumes

### Files too large
- Use Audacity: File > Export > MP3 > 128 kbps
- Online compressor: [Online Audio Converter](https://online-audio-converter.com)

---

## No Audio Option

The intro works perfectly without audio! If you prefer to skip audio:

1. Don't place any files in this directory
2. The AudioManager will handle missing files gracefully
3. Check browser console for warnings (they're harmless)

---

## License Compliance

When downloading audio:

- **CC0 / Public Domain:** No attribution required, use freely
- **CC-BY:** Requires attribution (add to your site footer or credits)
- **Royalty-Free:** Usually requires one-time purchase or account
- **Always check license** before using in production

---

## Need Help?

For detailed instructions on finding and creating audio files, see:
- `AUDIO_GUIDE.md` in the root directory

**Current Status:** 🔴 No audio files present (system will work with visual-only experience)

**Last Updated:** 2025-11-05
