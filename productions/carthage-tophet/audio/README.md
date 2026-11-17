# Audio: carthage-tophet

## drone-bed.mp3 (in-house, original)
This bed was synthesised on 2026-11-17 with FFmpeg 9.0.2. It uses no samples or third-party material.
- Sine tones at 55 Hz, 82.41 Hz and 110 Hz, plus pink noise (band-passed 80–450 Hz), each with a slow volume swell.
- Mixed, then a light echo, a 1.8 kHz low-pass, a 3 s fade-in and a 4 s fade-out, normalised to about −28 LUFS. Output is 48 kHz stereo MP3 at 192 kbps.
- Re-running the command below reproduces the bed, apart from the random noise component:

```bash
ffmpeg -f lavfi -i "sine=frequency=55:duration=57" -f lavfi -i "sine=frequency=82.41:duration=57" -f lavfi -i "sine=frequency=110:duration=57" -f lavfi -i "anoisesrc=color=pink:duration=57:amplitude=0.5" -filter_complex "[0]volume='0.5*(0.8+0.2*sin(2*PI*0.07*t))':eval=frame[a];[1]volume='0.28*(0.7+0.3*sin(2*PI*0.05*t+1))':eval=frame[b];[2]volume='0.12*(0.6+0.4*sin(2*PI*0.11*t+2))':eval=frame[c];[3]lowpass=f=450,highpass=f=80,volume='0.06*(0.6+0.4*sin(2*PI*0.04*t))':eval=frame[n];[a][b][c][n]amix=inputs=4:normalize=0,aecho=0.8:0.7:120|370:0.25|0.18,lowpass=f=1800,afade=t=in:d=3,afade=t=out:st=53:d=4,loudnorm=I=-28:TP=-3:LRA=7,aformat=sample_rates=48000:channel_layouts=stereo" -c:a libmp3lame -b:a 192k drone-bed.mp3
```

**Validation (2026-11-17):**
| Check | Result |
|---|---|
| Duration | 57.37 s. The 56.0 s timeline trims it, and the template fades the music to silence over the last 2 s. |
| Format | MP3, 48 kHz, stereo, 192 kbps |
| Loudness | −28.3 LUFS integrated, loudness range 4.4 LU |
| Peaks | −19.4 dBFS sample peak, flat factor 0 (no clipping) |
| Fades | RMS −38 dB at 0 s, −26 dB at 2–3 s, −45 dB at 56 s |
| Registered | yes, in `assets.json` |

## narration: to be recorded by the host
See **[recording-guide.md](recording-guide.md)** for the full specification: final text with pauses, pronunciation, timing, format, room and mic setup, and delivery.
