#!/usr/bin/env bash
# Original in-house music bed for the long-form (about 9:58), synthesised with FFmpeg.
# Eight 80 s sections with slowly changing roots, crossfaded over 6 s. No samples or third-party material.
# Usage (from this folder):  bash make-drone-long.sh
set -euo pipefail
tmp="$(mktemp -d)"
roots=(55 49 43.65 55 41.2 49 46.25 55)   # A G F A E G F# A (Hz)
i=0
for r in "${roots[@]}"; do
  f5=$(awk "BEGIN{print $r*1.5}"); f8=$(awk "BEGIN{print $r*2}")
  ffmpeg -y -loglevel error \
    -f lavfi -i "sine=frequency=$r:duration=80" \
    -f lavfi -i "sine=frequency=$f5:duration=80" \
    -f lavfi -i "sine=frequency=$f8:duration=80" \
    -f lavfi -i "anoisesrc=color=pink:duration=80:amplitude=0.5:seed=$((i+7))" \
    -filter_complex "[0]volume='0.5*(0.8+0.2*sin(2*PI*0.07*t+$i))':eval=frame[a];[1]volume='0.26*(0.7+0.3*sin(2*PI*0.05*t+1+$i))':eval=frame[b];[2]volume='0.11*(0.6+0.4*sin(2*PI*0.11*t+2))':eval=frame[c];[3]lowpass=f=450,highpass=f=80,volume='0.06*(0.6+0.4*sin(2*PI*0.04*t))':eval=frame[n];[a][b][c][n]amix=inputs=4:normalize=0,aecho=0.8:0.7:120|370:0.25|0.18,lowpass=f=1800,aformat=sample_rates=48000:channel_layouts=stereo" \
    "$tmp/part$i.wav"
  i=$((i+1))
done
# Chain crossfades: ((p0 x p1) x p2) ...
cp "$tmp/part0.wav" "$tmp/acc.wav"
for j in 1 2 3 4 5 6 7; do
  ffmpeg -y -loglevel error -i "$tmp/acc.wav" -i "$tmp/part$j.wav" -filter_complex "acrossfade=d=6:c1=tri:c2=tri" "$tmp/acc2.wav"
  mv "$tmp/acc2.wav" "$tmp/acc.wav"
done
ffmpeg -y -loglevel error -i "$tmp/acc.wav" -af "afade=t=in:d=4,afade=t=out:st=592:d=6,loudnorm=I=-28:TP=-3:LRA=7" -c:a libmp3lame -b:a 192k drone-bed-long.mp3
rm -rf "$tmp"
echo "drone-bed-long.mp3 written"
