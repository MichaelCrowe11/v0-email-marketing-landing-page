#!/usr/bin/env python3
"""
Generate audio files for Crowe Logic Big Bang Intro
Uses NumPy and SciPy for synthesis and WAV generation
"""

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, filtfilt, hilbert
import os

# Audio settings
SAMPLE_RATE = 44100
OUTPUT_DIR = "assets/sounds"

def apply_fade(audio, fade_in_samples=0, fade_out_samples=0):
    """Apply fade in/out to audio"""
    result = audio.copy()

    if fade_in_samples > 0:
        fade_in = np.linspace(0, 1, fade_in_samples)
        result[:fade_in_samples] *= fade_in

    if fade_out_samples > 0:
        fade_out = np.linspace(1, 0, fade_out_samples)
        result[-fade_out_samples:] *= fade_out

    return result

def apply_reverb(audio, decay=0.5, delay_samples=2205):
    """Simple reverb effect using feedback delay"""
    output = audio.copy()

    for i in range(delay_samples, len(audio)):
        output[i] += audio[i - delay_samples] * decay

    # Normalize
    output = output / np.max(np.abs(output))
    return output

def butter_lowpass_filter(data, cutoff, fs, order=5):
    """Apply lowpass filter"""
    nyq = 0.5 * fs
    normal_cutoff = cutoff / nyq
    b, a = butter(order, normal_cutoff, btype='low', analog=False)
    return filtfilt(b, a, data)

def butter_highpass_filter(data, cutoff, fs, order=5):
    """Apply highpass filter"""
    nyq = 0.5 * fs
    normal_cutoff = cutoff / nyq
    b, a = butter(order, normal_cutoff, btype='high', analog=False)
    return filtfilt(b, a, data)

def normalize_audio(audio, target_level=0.8):
    """Normalize audio to target level"""
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        return audio * (target_level / max_val)
    return audio

def to_stereo(audio):
    """Convert mono to stereo"""
    return np.column_stack((audio, audio))

def save_wav(filename, audio, sample_rate=SAMPLE_RATE):
    """Save audio as WAV file"""
    # Ensure audio is in correct format
    if len(audio.shape) == 1:
        audio = to_stereo(audio)

    # Convert to 16-bit PCM
    audio_int16 = np.int16(audio * 32767)

    filepath = os.path.join(OUTPUT_DIR, filename)
    wavfile.write(filepath, sample_rate, audio_int16)
    print(f"✓ Created: {filename}")

def generate_space_ambient():
    """
    Generate deep cosmic ambient drone with shimmer
    Approach: Layered noise with low-pass filtering + sine wave harmonics
    """
    duration = 9.0  # seconds
    samples = int(SAMPLE_RATE * duration)

    # Layer 1: Deep sub-bass drone (40-80 Hz)
    t = np.linspace(0, duration, samples)
    bass_freq = 50
    bass = np.sin(2 * np.pi * bass_freq * t) * 0.4
    bass += np.sin(2 * np.pi * (bass_freq * 1.5) * t) * 0.2

    # Layer 2: Filtered brown noise for texture
    brown_noise = np.cumsum(np.random.randn(samples))
    brown_noise = brown_noise / np.max(np.abs(brown_noise))
    brown_noise = butter_lowpass_filter(brown_noise, 200, SAMPLE_RATE, order=6)
    brown_noise *= 0.3

    # Layer 3: High shimmer (2-8 kHz modulated noise)
    white_noise = np.random.randn(samples) * 0.15
    shimmer = butter_highpass_filter(white_noise, 2000, SAMPLE_RATE, order=4)
    shimmer = butter_lowpass_filter(shimmer, 8000, SAMPLE_RATE, order=4)

    # Modulate shimmer with slow LFO
    lfo = np.sin(2 * np.pi * 0.3 * t) * 0.5 + 0.5
    shimmer *= lfo

    # Combine layers
    ambient = bass + brown_noise + shimmer

    # Apply long fade in/out for seamless looping
    fade_samples = int(SAMPLE_RATE * 2)
    ambient = apply_fade(ambient, fade_in_samples=fade_samples, fade_out_samples=fade_samples)

    # Normalize
    ambient = normalize_audio(ambient, 0.7)

    save_wav("space-ambient.wav", ambient)

def generate_big_bang_impact():
    """
    Generate sub-bass impact boom
    Approach: Sine sweep from low to very low + noise burst
    """
    duration = 0.8  # seconds
    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # Exponential frequency sweep from 80Hz down to 30Hz
    start_freq = 80
    end_freq = 30
    freq_sweep = start_freq * np.exp(np.log(end_freq/start_freq) * t / duration)
    phase = 2 * np.pi * np.cumsum(freq_sweep) / SAMPLE_RATE

    # Main impact sine wave
    impact = np.sin(phase)

    # Add noise burst for attack
    noise_burst = np.random.randn(samples) * 0.3
    noise_burst = butter_lowpass_filter(noise_burst, 150, SAMPLE_RATE, order=6)

    # Envelope: quick attack, exponential decay
    envelope = np.exp(-5 * t)

    # Combine
    boom = (impact * 0.7 + noise_burst * 0.3) * envelope

    # Add slight reverb tail
    boom = apply_reverb(boom, decay=0.3, delay_samples=1102)

    # Normalize
    boom = normalize_audio(boom, 0.85)

    save_wav("big-bang-impact.wav", boom)

def generate_particle_expansion():
    """
    Generate rising whoosh/riser
    Approach: Filtered pink noise with pitch and intensity rising
    """
    duration = 4.0  # seconds
    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # Generate pink noise (1/f noise)
    white = np.random.randn(samples)
    pink = butter_lowpass_filter(white, 8000, SAMPLE_RATE, order=2)

    # Apply rising high-pass filter (200Hz -> 2000Hz)
    # Simulate by mixing multiple filtered versions
    expansion = np.zeros(samples)

    # Create sweeping filter effect
    chunk_size = samples // 20
    for i in range(20):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, samples)

        # Progressively increase cutoff frequency
        cutoff = 200 + (1800 * i / 20)
        chunk = pink[start_idx:end_idx]
        filtered_chunk = butter_highpass_filter(chunk, cutoff, SAMPLE_RATE, order=3)
        expansion[start_idx:end_idx] = filtered_chunk

    # Rising amplitude envelope
    envelope = np.linspace(0, 1, samples) ** 2
    expansion *= envelope

    # Add slight pitch modulation
    lfo = np.sin(2 * np.pi * 2 * t) * 0.1 + 1
    expansion *= lfo

    # Fade in
    fade_in = int(SAMPLE_RATE * 0.3)
    expansion = apply_fade(expansion, fade_in_samples=fade_in)

    # Normalize
    expansion = normalize_audio(expansion, 0.75)

    save_wav("particle-expansion.wav", expansion)

def generate_stellar_twinkle():
    """
    Generate crystalline chime/bell
    Approach: Multiple sine harmonics with exponential decay (bell-like)
    """
    duration = 0.3  # seconds
    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # Bell-like harmonic series around 2000Hz
    fundamental = 2000
    harmonics = [1.0, 2.0, 3.0, 4.2, 5.8]
    amplitudes = [1.0, 0.5, 0.3, 0.15, 0.08]

    bell = np.zeros(samples)

    for harm, amp in zip(harmonics, amplitudes):
        freq = fundamental * harm
        sine = np.sin(2 * np.pi * freq * t)

        # Each harmonic decays at slightly different rate
        decay = np.exp(-8 * t * harm)
        bell += sine * amp * decay

    # Fast attack, natural decay
    attack_samples = int(SAMPLE_RATE * 0.005)
    bell = apply_fade(bell, fade_in_samples=attack_samples)

    # Add subtle reverb
    bell = apply_reverb(bell, decay=0.2, delay_samples=882)

    # Normalize
    bell = normalize_audio(bell, 0.6)

    save_wav("stellar-twinkle.wav", bell)

def generate_avatar_reveal():
    """
    Generate warm C major chord reveal
    Approach: C-E-G chord with rich harmonics and pad-like quality
    """
    duration = 1.8  # seconds
    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # C major chord frequencies (middle C)
    c4 = 261.63  # C
    e4 = 329.63  # E
    g4 = 392.00  # G
    c5 = 523.25  # C (octave up)

    # Generate each note with harmonics
    def generate_note(freq, amplitude):
        note = np.zeros(samples)
        # Fundamental + harmonics
        harmonics = [1.0, 2.0, 3.0, 4.0]
        amps = [1.0, 0.4, 0.2, 0.1]

        for harm, amp in zip(harmonics, amps):
            note += np.sin(2 * np.pi * freq * harm * t) * amp * amplitude

        return note

    # Build chord
    chord = generate_note(c4, 0.35)
    chord += generate_note(e4, 0.30)
    chord += generate_note(g4, 0.25)
    chord += generate_note(c5, 0.15)

    # Pad-like envelope (slow attack, sustained, gentle release)
    attack_time = 0.3
    release_time = 0.5
    attack_samples = int(SAMPLE_RATE * attack_time)
    release_samples = int(SAMPLE_RATE * release_time)

    envelope = np.ones(samples)
    envelope[:attack_samples] = np.linspace(0, 1, attack_samples) ** 2
    envelope[-release_samples:] = np.linspace(1, 0, release_samples) ** 2

    chord *= envelope

    # Add lush reverb
    chord = apply_reverb(chord, decay=0.4, delay_samples=2205)

    # Normalize
    chord = normalize_audio(chord, 0.75)

    save_wav("avatar-reveal.wav", chord)

def main():
    """Generate all audio files"""
    print("\n🎵 Generating audio files for Crowe Logic Big Bang Intro...\n")

    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Generating space-ambient.wav...")
    generate_space_ambient()

    print("Generating big-bang-impact.wav...")
    generate_big_bang_impact()

    print("Generating particle-expansion.wav...")
    generate_particle_expansion()

    print("Generating stellar-twinkle.wav...")
    generate_stellar_twinkle()

    print("Generating avatar-reveal.wav...")
    generate_avatar_reveal()

    print("\n✅ All WAV files generated successfully!")
    print("\n📋 Next steps:")
    print("1. Convert WAV files to MP3 using ffmpeg or online converter")
    print("2. Compress to 128kbps MP3 format")
    print("3. Place MP3 files in assets/sounds/ directory")
    print("\nTo convert with ffmpeg (if available):")
    print("  cd assets/sounds")
    print("  for f in *.wav; do ffmpeg -i \"$f\" -b:a 128k \"${f%.wav}.mp3\"; done")

if __name__ == "__main__":
    main()
