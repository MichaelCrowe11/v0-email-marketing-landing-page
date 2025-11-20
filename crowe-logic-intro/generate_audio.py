#!/usr/bin/env python3
"""
Crowe Logic Big Bang Intro - Audio Generator
Generates 5 production-quality audio files for the intro experience
"""

import numpy as np
from scipy import signal
from scipy.io import wavfile
import subprocess
import os

# Audio settings
SAMPLE_RATE = 44100  # 44.1 kHz
BIT_DEPTH = np.int16


def normalize_audio(audio, target_level=-3):
    """Normalize audio to target dB level"""
    audio = np.array(audio, dtype=np.float32)
    peak = np.max(np.abs(audio))
    if peak > 0:
        target_amplitude = 10 ** (target_level / 20)
        audio = audio * (target_amplitude / peak)
    return audio


def apply_fade(audio, fade_in_samples=0, fade_out_samples=0):
    """Apply fade in/out to audio"""
    audio = audio.copy()
    if fade_in_samples > 0:
        fade_in = np.linspace(0, 1, fade_in_samples)
        audio[:fade_in_samples] *= fade_in
    if fade_out_samples > 0:
        fade_out = np.linspace(1, 0, fade_out_samples)
        audio[-fade_out_samples:] *= fade_out
    return audio


def stereo_width(audio, width=0.5):
    """Add stereo width to mono signal"""
    if len(audio.shape) == 1:
        # Create stereo from mono
        left = audio.copy()
        right = audio.copy()
        # Add slight delay and phase difference for width
        delay_samples = int(SAMPLE_RATE * 0.001 * width)  # 1ms max delay
        right = np.pad(right, (delay_samples, 0), mode='constant')[:-delay_samples]
        return np.column_stack([left, right])
    return audio


def generate_space_ambient(duration=9.0):
    """Generate deep cosmic ambient drone with shimmer"""
    print("Generating space-ambient.mp3...")

    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # Layer 1: Deep sub-bass drone (40-80Hz)
    bass_freq = 50 + 15 * np.sin(2 * np.pi * 0.1 * t)  # Slowly modulating
    bass = np.sin(2 * np.pi * bass_freq * t)
    bass += 0.3 * np.sin(2 * np.pi * bass_freq * 2 * t)  # Harmonic

    # Layer 2: Mid drone (120Hz)
    mid = 0.4 * np.sin(2 * np.pi * 120 * t)
    mid += 0.2 * np.sin(2 * np.pi * 180 * t)

    # Layer 3: Shimmer (2-8kHz) - filtered noise
    noise = np.random.normal(0, 0.15, samples)
    sos = signal.butter(6, [2000, 8000], btype='bandpass', fs=SAMPLE_RATE, output='sos')
    shimmer = signal.sosfilt(sos, noise)

    # LFO modulation for shimmer
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t)
    shimmer = shimmer * lfo

    # Mix layers
    audio = bass * 0.6 + mid * 0.25 + shimmer * 0.15

    # Apply envelope for smooth looping
    fade_samples = int(SAMPLE_RATE * 0.5)
    audio = apply_fade(audio, fade_samples, fade_samples)

    # Normalize and create stereo
    audio = normalize_audio(audio, -6)
    audio = stereo_width(audio, 0.3)

    return audio


def generate_big_bang_impact(duration=0.8):
    """Generate deep sub-bass boom impact"""
    print("Generating big-bang-impact.mp3...")

    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # Exponential pitch sweep down (300Hz -> 30Hz)
    freq_start = 300
    freq_end = 30
    freq_curve = freq_start * np.exp(np.log(freq_end / freq_start) * (t / duration))
    phase = 2 * np.pi * np.cumsum(freq_curve) / SAMPLE_RATE

    # Main impact tone
    impact = np.sin(phase)
    impact += 0.5 * np.sin(2 * phase)  # Harmonic

    # Noise component for texture
    noise = np.random.normal(0, 0.3, samples)
    sos = signal.butter(4, 200, btype='lowpass', fs=SAMPLE_RATE, output='sos')
    noise_filtered = signal.sosfilt(sos, noise)

    # Exponential decay envelope
    envelope = np.exp(-4 * t / duration)

    # Mix and apply envelope
    audio = (impact * 0.7 + noise_filtered * 0.3) * envelope

    # Add punch with compression simulation
    audio = np.tanh(audio * 1.5)

    # Normalize and create stereo
    audio = normalize_audio(audio, -3)
    audio = stereo_width(audio, 0.2)

    return audio


def generate_particle_expansion(duration=4.0):
    """Generate rising whoosh/riser effect"""
    print("Generating particle-expansion.mp3...")

    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # White noise base
    noise = np.random.normal(0, 1, samples)

    # Highpass filter sweep (200Hz -> 8000Hz)
    freq_start = 200
    freq_end = 8000

    # Process in chunks for filter sweep
    chunk_size = int(SAMPLE_RATE * 0.1)  # 100ms chunks
    filtered = np.zeros(samples)

    for i in range(0, samples, chunk_size):
        end = min(i + chunk_size, samples)
        chunk_t = i / samples
        cutoff_freq = freq_start + (freq_end - freq_start) * chunk_t

        sos = signal.butter(4, cutoff_freq, btype='highpass', fs=SAMPLE_RATE, output='sos')
        filtered[i:end] = signal.sosfilt(sos, noise[i:end])

    # Rising amplitude envelope
    envelope = np.power(t / duration, 1.5)

    # Apply envelope
    audio = filtered * envelope

    # Add pitch shift effect (subtle)
    pitch_mod = 0.1 * np.sin(2 * np.pi * 2 * t)
    audio = audio * (1 + pitch_mod)

    # Normalize and create wide stereo
    audio = normalize_audio(audio, -6)
    audio = stereo_width(audio, 0.7)

    return audio


def generate_stellar_twinkle(duration=0.25):
    """Generate crystalline chime/bell sound"""
    print("Generating stellar-twinkle.mp3...")

    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # Bell-like tone (fundamental + harmonics)
    fundamental = 2000  # 2kHz

    # Multiple harmonics with inharmonic ratios (bell-like)
    audio = np.zeros(samples)
    harmonics = [
        (1.0, 1.0, 1.0),      # Fundamental
        (2.76, 0.5, 0.9),     # Inharmonic
        (5.40, 0.25, 0.8),    # Inharmonic
        (8.93, 0.15, 0.7),    # Inharmonic
    ]

    for ratio, amplitude, decay_rate in harmonics:
        freq = fundamental * ratio
        envelope = np.exp(-decay_rate * 12 * t / duration)
        audio += amplitude * np.sin(2 * np.pi * freq * t) * envelope

    # Overall envelope
    attack_time = 0.01
    attack_samples = int(SAMPLE_RATE * attack_time)
    attack = np.linspace(0, 1, attack_samples) ** 2
    audio[:attack_samples] *= attack

    # Normalize and create stereo
    audio = normalize_audio(audio, -9)
    audio = stereo_width(audio, 0.4)

    return audio


def generate_avatar_reveal(duration=1.8):
    """Generate warm C major chord for brand reveal"""
    print("Generating avatar-reveal.mp3...")

    samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, samples)

    # C Major chord: C4 (261.63 Hz), E4 (329.63 Hz), G4 (392.00 Hz)
    notes = [261.63, 329.63, 392.00]

    # Layer 1: Piano-like sound
    piano = np.zeros(samples)
    for freq in notes:
        # Fundamental + harmonics
        tone = np.sin(2 * np.pi * freq * t)
        tone += 0.5 * np.sin(2 * np.pi * freq * 2 * t)
        tone += 0.25 * np.sin(2 * np.pi * freq * 3 * t)
        tone += 0.125 * np.sin(2 * np.pi * freq * 4 * t)

        # Piano envelope (fast attack, slow decay)
        envelope = np.exp(-2.5 * t / duration)
        attack_samples = int(SAMPLE_RATE * 0.02)
        attack = np.linspace(0, 1, attack_samples) ** 2
        envelope[:attack_samples] *= attack

        piano += tone * envelope

    # Layer 2: Pad/sustain sound
    pad = np.zeros(samples)
    for freq in notes:
        tone = np.sin(2 * np.pi * freq * t)
        tone += 0.3 * np.sin(2 * np.pi * freq * 2 * t)
        pad += tone

    # Pad envelope (slow attack, sustained)
    pad_env = 1 - np.exp(-3 * t / duration)
    pad_env *= np.exp(-0.5 * t / duration)
    pad = pad * pad_env * 0.4

    # Mix layers
    audio = piano * 0.6 + pad * 0.4

    # Add warmth with gentle saturation
    audio = np.tanh(audio * 0.8)

    # Fade out
    fade_samples = int(SAMPLE_RATE * 0.3)
    audio = apply_fade(audio, 0, fade_samples)

    # Normalize and create rich stereo
    audio = normalize_audio(audio, -6)
    audio = stereo_width(audio, 0.5)

    return audio


def save_wav(filename, audio):
    """Save audio as WAV file"""
    audio_int = np.int16(audio * 32767)
    wavfile.write(filename, SAMPLE_RATE, audio_int)
    print(f"  Saved WAV: {filename}")


def wav_to_mp3(wav_file, mp3_file, bitrate='128k'):
    """Convert WAV to MP3 using ffmpeg"""
    try:
        cmd = [
            'ffmpeg', '-y', '-i', wav_file,
            '-acodec', 'libmp3lame',
            '-b:a', bitrate,
            '-ar', '44100',
            mp3_file
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  Converted to MP3: {mp3_file}")
            os.remove(wav_file)  # Clean up WAV file
            return True
        else:
            print(f"  Error converting to MP3: {result.stderr}")
            return False
    except FileNotFoundError:
        print("  ffmpeg not found. Keeping WAV file.")
        return False


def main():
    """Generate all audio files"""
    output_dir = "assets/sounds"
    os.makedirs(output_dir, exist_ok=True)

    print("\n" + "="*60)
    print("CROWE LOGIC BIG BANG INTRO - AUDIO GENERATOR")
    print("="*60 + "\n")

    audio_files = [
        ("space-ambient", generate_space_ambient, 9.0),
        ("big-bang-impact", generate_big_bang_impact, 0.8),
        ("particle-expansion", generate_particle_expansion, 4.0),
        ("stellar-twinkle", generate_stellar_twinkle, 0.25),
        ("avatar-reveal", generate_avatar_reveal, 1.8),
    ]

    for name, generator, duration in audio_files:
        print(f"\n{name}.mp3:")
        audio = generator(duration)

        wav_path = os.path.join(output_dir, f"{name}.wav")
        mp3_path = os.path.join(output_dir, f"{name}.mp3")

        save_wav(wav_path, audio)

        # Try to convert to MP3
        if not wav_to_mp3(wav_path, mp3_path):
            # If conversion fails, rename WAV to MP3 (browsers can play WAV)
            os.rename(wav_path, mp3_path)
            print(f"  Using WAV format as {name}.mp3")

        # Get file size
        size_kb = os.path.getsize(mp3_path) / 1024
        print(f"  Size: {size_kb:.1f} KB")

    print("\n" + "="*60)
    print("GENERATION COMPLETE!")
    print("="*60)
    print(f"\nAll files saved to: {output_dir}/")
    print("\nFiles created:")
    for name, _, _ in audio_files:
        print(f"  - {name}.mp3")

    print("\n✓ Ready for AudioManager integration")
    print("\n")


if __name__ == "__main__":
    main()
