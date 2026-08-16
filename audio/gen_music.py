#!/usr/bin/env python3
"""
Generate the original 36 s music bed for the UI-demo recreation
(WAV, 44.1 kHz stereo, written to ../public/music-bed.wav).

v2 — matched to the measured style profile of the reference video's audio
(tempo ~78 bpm with eighth-note motion, steady RMS ~0.30, bass-heavy
spectrum, hard start at ~1.4 s, fade-out from ~32 s, soft accent every
two bars). The composition itself is fully original — synthesized from
scratch with numpy; nothing is sampled or transcribed from the reference,
whose own song is third-party licensed music.
"""
import numpy as np
import wave
import os

SR = 44100
DUR = 36.0
N = int(SR * DUR)
t_all = np.arange(N) / SR

rng = np.random.default_rng(11)

BPM = 78.0
BEAT = 60 / BPM            # 0.769 s
BAR = 4 * BEAT             # 3.077 s
START = 1.4                # music enters here (reference kicks in at ~1.4 s)
END_HOLD = 31.8            # full level until here, then fade to 35.3 s

# ---------------------------------------------------------------- helpers
def note_hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)

def env_ar(n, a, r, sustain=1.0):
    env = np.full(n, sustain)
    na, nr = min(int(a * SR), n), min(int(r * SR), n)
    if na > 0:
        env[:na] *= np.linspace(0, 1, na)
    if nr > 0:
        env[-nr:] *= np.linspace(1, 0, nr)
    return env

def place(buf_l, buf_r, x, start_s, pan=0.5):
    s = int(start_s * SR)
    if s >= N:
        return
    n = min(len(x), N - s)
    buf_l[s:s+n] += x[:n] * (1 - pan)
    buf_r[s:s+n] += x[:n] * pan

L = np.zeros(N)
Rc = np.zeros(N)

# ---------------------------------------------------------------- score
# Original progression, one chord per 2 bars (~6.15 s), warm and optimistic.
CHORDS = [
    [45, 52, 57, 60, 64],   # Am7-ish
    [41, 48, 53, 57, 60],   # F
    [48, 55, 60, 64, 67],   # C
    [43, 50, 55, 59, 62],   # G
    [45, 52, 57, 60, 64],   # Am
]
CHORD_SPAN = 2 * BAR

def chord_at(time_s):
    ci = int((time_s - START) / CHORD_SPAN) % len(CHORDS)
    return CHORDS[ci]

# ---- bass pulse (dominant layer, as in the measured spectrum) -------------
# Soft round thump on every beat; accented on bar starts; eighth-note
# bass-line pickups between beats.
beat_t = START
bi = 0
while beat_t < END_HOLD + 1:
    chord = chord_at(beat_t)
    root = note_hz(chord[0] - 12)          # low root (~55-65 Hz region)
    accent = 1.25 if bi % 8 == 0 else 1.0  # every 2 bars → the ~4 s bump
    n = int(0.62 * SR)
    t = np.arange(n) / SR
    fall = root * (1 + 0.9 * np.exp(-t * 22))          # pitch drop = thump
    tone = np.sin(2 * np.pi * np.cumsum(fall) / SR)
    tone += 0.35 * np.sin(2 * np.pi * root * t)        # body
    tone *= np.exp(-t * 5.2) * 0.20 * accent
    place(L, Rc, tone, beat_t, 0.5)
    # eighth-note pickup (fifth or octave) on the "and" of beats 2 and 4
    if bi % 2 == 1:
        f2 = note_hz(chord[0] - 12 + (7 if bi % 4 == 1 else 12))
        n2 = int(0.3 * SR)
        t2 = np.arange(n2) / SR
        pk = np.sin(2 * np.pi * f2 * t2) * np.exp(-t2 * 9) * 0.07
        place(L, Rc, pk, beat_t + BEAT / 2, 0.5)
    beat_t += BEAT
    bi += 1

# ---- warm pad chords -------------------------------------------------------
ct = START
while ct < END_HOLD:
    chord = chord_at(ct)
    n = int((CHORD_SPAN + 1.2) * SR)
    n = min(n, N - int(ct * SR))
    t = np.arange(n) / SR
    for j, midi in enumerate(chord[1:]):
        f = note_hz(midi)
        ph = rng.uniform(0, 2 * np.pi)
        x = (np.sin(2 * np.pi * f * 1.0015 * t + ph)
             + np.sin(2 * np.pi * f * 0.9985 * t)
             + 0.3 * np.sin(2 * np.pi * 2 * f * t + ph))
        x *= env_ar(n, 0.9, 1.4) * 0.021
        place(L, Rc, x, ct, 0.5 + 0.26 * np.sin(j * 2.3 + ct))
    ct += CHORD_SPAN

# ---- soft pluck motion (eighth notes, sparse) ------------------------------
step = BEAT / 2
k = 0
time = START + BAR                 # plucks join after the first bar
PATTERN = [4, 2, 3, 1, 4, 3, 2, 3]
while time < END_HOLD:
    if rng.random() > 0.3:
        chord = chord_at(time)
        midi = chord[PATTERN[k % len(PATTERN)]] + 12
        n = int(0.5 * SR)
        t = np.arange(n) / SR
        f = note_hz(midi)
        x = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t))
        x *= np.exp(-t * 7.5) * (0.030 + 0.012 * rng.random())
        place(L, Rc, x, time, 0.3 + 0.4 * ((k % 4) / 3))
    time += step
    k += 1

# ---- off-beat air ticks (very soft hat-like motion) ------------------------
time = START + BEAT / 2
while time < END_HOLD:
    n = int(0.09 * SR)
    tick = rng.standard_normal(n)
    X = np.fft.rfft(tick)
    fr = np.fft.rfftfreq(n, 1 / SR)
    X *= np.exp(-((fr - 6000) / 3500) ** 2)            # bandpass around 6 kHz
    tick = np.fft.irfft(X, n) * np.exp(-np.arange(n) / SR * 60)
    tick *= 0.012
    place(L, Rc, tick, time, 0.62)
    time += BEAT

# ---- intro pickup: quiet half-bar swell before the drop --------------------
n = int(START * SR)
t = np.arange(n) / SR
swell = np.sin(2 * np.pi * note_hz(45) * t) * (t / START) ** 2 * 0.03
L[:n] += swell
Rc[:n] += swell

# ---- master ----------------------------------------------------------------
mix = np.stack([L, Rc], axis=1)
# hard entrance at START (0.12 s ramp), fade-out from END_HOLD over 3.5 s
gate = np.clip((t_all - START) / 0.12, 0, 1) * 0.97 + 0.03
fade_out = np.clip((END_HOLD + 3.5 - t_all) / 3.5, 0, 1)
mix *= (gate * fade_out)[:, None]
# glue + level: aim for steady RMS ≈ 0.27 like the reference bed
mix = np.tanh(mix * 4.4)
body = mix[int(START * SR):int(END_HOLD * SR)]
rms = np.sqrt((body ** 2).mean())
mix *= min(0.27 / max(rms, 1e-9), 0.97 / max(np.abs(mix).max(), 1e-9))

out_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'music-bed.wav'
)
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open(out_path, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out_path)
