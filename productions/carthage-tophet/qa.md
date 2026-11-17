# Gate 9: Quality assurance (on the final render)

Tick these **on the final renders with narration**. They don't exist yet. The pre-narration technical results below are evidence for the reviewer, not ticks. Full details are in `qa-report.md`.

- [ ] Duration within target (short 35–60 s / long 8–12 min)
  - *Pre-check:* with voice-over, Short 59.0 s and long-form 8:21. The checker now measures rendered length (net of crossfades).
- [ ] Text inside safe areas on 9:16 / 16:9; legible on a phone
  - *Pre-check:* frames inspected from every scene in both formats. Overflow defects were found and fixed (timeline, map label, diagram label, caption wrap). See `qa-report.md` §5.
- [ ] Narration matches the approved script word for word
  - *Pre-check:* the synthetic voice-over is generated from `narration-short.json` (the approved text, with cut 1 applied) and `narration-long.json`. **The editor approved the voice on 2026-11-17 ("Voice is good").** Tick this box after the word-for-word check against the final scripts.
- [ ] Audio levels consistent; no clipping; music does not mask narration
  - *Pre-check:*
    - Short mix: −14.1 LUFS, peak −2.5 dBFS.
    - Long-form mix: see `qa-report.md`.
    - Voice stem: −15.5 LUFS. Music bed: about 13 dB under the voice. No clipping.
    - Voice onsets land within 10 ms of their scene timings (Short).
- [ ] Every reconstruction badged; every credit line present and correct
  - *Pre-check:* there are no reconstructions. The stela credit is on screen and is checker-enforced. The map credit is on screen. Full credits are in `youtube-package.md`.
- [ ] Spelling of names, places and dates checked
  - *Pre-check:* names checked against the sources (Gielly, Icard, Kelsey, Stager, Schwartz, Smith, Xella, Eissfeldt, Cerezo-Román, Ben Jerbania). Have a person re-read the final frames.
- [ ] Captions/subtitles present and accurate
  - *Pre-check:* `captions-short.srt` (15 cues) and `captions-long.srt` (92 cues) are generated from the narration timings at sentence level. They contain no markup. The long-form captions spell numbers as spoken ("nineteen twenty-one"), so you may prefer digits. Check them against the audio before upload.
- [ ] Description includes sources and required attributions
  - *Pre-check:* drafted in `youtube-package.md` §4, with all TASL credits. Check it against the final asset list.
