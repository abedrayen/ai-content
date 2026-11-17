# Narration recording guide: "Same Bones, Two Verdicts" (YouTube Short)

> **Status, 2026-11-17:** the editor chose a **synthetic voice-over** (Kokoro TTS, British male voice), which is already in the renders. This guide is kept for a possible future **human** re-voice. If a person records, regenerate scene timings from the take rather than the TTS.


**For:** the human narrator. No synthetic voice or voice cloning is to be used.
**Script status:** approved by the editor on 2026-11-17. Read it **word for word**. Any change to wording is an editorial change and goes back to the editor.

## 1. Target
| | |
|---|---|
| Rendered length of the Short | **56.0 s** |
| Narration target | **52–55 s** of speech, with 0.5 s of room tone before and after |
| Words | about 150 |
| Pace | calm and measured, about **2.7–2.9 words per second** |

**Rehearse with a stopwatch first.** If two rehearsals run over 55 s, use only these approved cuts, in this order:
1. Segment 2: delete "for some six centuries,".
2. Segment 7: change to "The dispute is method: how fire shrinks bone, and whether it erases a tooth line that forms after birth."

Tell the editor which cuts you used.

## 2. Final narration text (with pauses and emphasis)
`/` = short breath (about 0.3 s) · `//` = full pause (about 0.7 s) · **bold** = light emphasis, never dramatic.

| # | Segment window | Text to read |
|---|---|---|
| 1 | 0:00–0:06 | Two teams studied the **same** burnt bones from ancient Carthage, / and reached **conflicting** conclusions. // |
| 2 | 0:06–0:13 | They come from Carthage's **tophet**: / a sacred precinct where, for some six centuries, / people buried urns of cremated infants, / and young lambs. // |
| 3 | 0:13–0:19 | Stones above many urns record **vows** / to the gods Ba'al Hammon and Tanit. // |
| 4 | 0:19–0:24 | Greek writers accused Carthage of sacrificing children. / None of them was **Carthaginian**. // |
| 5 | 0:24–0:33 | Patricia Smith's team concluded / most of the infants died at one to one and a half months: / a pattern they **read** as sacrifice. // |
| 6 | 0:33–0:42 | Jeffrey Schwartz's team concluded / many died before or around birth: / consistent, they **argue**, with natural deaths, / though occasional sacrifice may have happened. // |
| 7 | 0:42–0:49 | The dispute is **method**: / how much fire shrinks bone, / and whether it erases a tooth line / that forms only after a baby's first week or two. // |
| 8 | 0:49–0:56 | One 2024 expert review still called the evidence **uncertain**. // Offered to the gods, / or mourned and buried with care? // We still don't know. |

## 3. Pronunciation
| Word | Say | Notes |
|---|---|---|
| Carthage | KAR-thij | |
| Carthaginian | kar-thuh-JIN-ee-un | |
| tophet | TOH-fet | Not "toe-FAY". |
| Ba'al Hammon | BAH-al hah-MOHN | A slight break at the apostrophe. |
| Tanit | TAH-neet | |
| Patricia Smith | as written | |
| Jeffrey Schwartz | JEF-ree SHWORTS | |

## 4. Delivery
- **Neutral and even-handed.** Segments 5 and 6 must sound like a matched pair: the same pace, pitch and energy. Neither team should sound more credible, sceptical or "right".
- The emphasis on "read" (segment 5) and "argue" (segment 6) signals *interpretation*, not doubt. Keep it light and equal.
- **Do not dramatise** "infants", "children", "sacrifice" or "burnt". Say them plainly, as a museum guide would.
- Last line: a quiet, honest close, not a cliffhanger tone.
- Keep the same distance from the mic and the same energy from the first word to the last.

## 5. Recording setup
**Room**
- Choose the quietest, most soft-furnished room available: a closet of clothes, or a room with curtains, a rug and a sofa. Avoid bare walls and kitchens.
- Switch off fans, heating vents, the fridge if nearby, and phone notifications.
- Record **10 seconds of silence (room tone)** at the start of the session.

**Microphone**
- A USB or XLR microphone is better than a laptop or phone mic. A dynamic mic is the most forgiving in untreated rooms.
- Use a **pop filter**, or angle the mic slightly off-axis to your mouth.
- Distance: **15–20 cm**, kept constant.

**Levels and format**
- Format: **WAV, 48 kHz, 24-bit, mono.** No MP3 for the master.
- Set the gain so normal speech peaks around **−12 dBFS** and the loudest words reach no higher than **−6 dBFS**. It must **never clip**.
- The noise floor (room tone) should be quieter than −60 dBFS if possible.
- **No processing while recording:** no noise reduction, compression or EQ. Processing happens in post.

## 6. Takes and delivery
1. Do 2 rehearsal reads with a stopwatch.
2. Record **3 complete takes** of the full script.
3. Record a **pickup** of any segment you weren't happy with, starting each pickup at the beginning of a segment.
4. Save them as:
   - `audio/narration-take1.wav`, `narration-take2.wav`, `narration-take3.wav`
   - `audio/narration-pickups.wav` (if any)
   - `audio/room-tone.wav`
5. Tell the editor or Claude which take you prefer.

## 7. After recording (handled in production, not by the narrator)
- The chosen take is edited (breaths softened, no words changed) and lightly cleaned. It is exported as `audio/narration.wav`, registered in `assets.json` (origin: recorded by the host; licence: original work), and added to `storyboard.json` as `audio.narration`.
- Scene durations are adjusted to the real read. The script segments stay unchanged.
- Mix targets for the final Short: narration-led, about **−14 LUFS integrated, true peak ≤ −1 dBTP**. The music bed sits about 12–14 dB under the voice.
- A QA listen confirms the narration matches the approved script word for word (`qa.md`).

## 8. Git note
`.gitignore` excludes `*.wav` under `assets/` only. WAV files in this `audio/` folder **will be committed** unless you add a rule such as `productions/*/audio/*.wav`. Decide before recording, since raw takes are large.
