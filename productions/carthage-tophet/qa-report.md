# QA report: carthage-tophet (production pass 2, pre-narration)

Prepared 2026-11-17. This is the **technical QA report**. `qa.md` (gate 9) is ticked by a person on the final renders with narration.

## 1. Result
**TECHNICALLY READY FOR HUMAN REVIEW.** Both formats render at full resolution, and every technical gate the checker can validate passes (gates 3, 5 and 6). The remaining blockers are human:
- claim verification (gate 2);
- editorial decision (gate 4);
- narration recording (gate 7);
- final renders, QA and approval (gates 8–10);
- the licensing-risk acceptance.

## 2. What this pass changed
| Area | Change |
|---|---|
| Editorial | `brief.md` completed. GO, decided under delegated authority, with your countersignature pending. New long-form script (`script-long.md`, about 1,300 words, 10 sections). The Short's approved narration is unchanged. |
| Research | All 41 claims source-reviewed, with a new `review` field (status, date and the passage relied on). c01, c02, c13, c15 and c19 resolved through UNESCO, Xella 2023 (open access) and Schwartz 2017. c03 reworded, c14 and c27 corrected, c35–c41 added. **`verified` is still false on all claims.** |
| Visual system | Seven new reusable animated scene types: map (Natural Earth, with camera moves, markers and great-circle arcs), timeline, compare (matched, attributed), stat (count-up), source (ancient text card), diagram (neonatal-line and shrinkage schematics, labelled "not to scale"), and ledger. Shared reveal timing in `anim.ts`. Thumbnail still composition. |
| Storyboards | `storyboard-long.json`: 38 scenes, 8:48.5. Short scenes 2 and 7 upgraded to an animated map and the tooth diagram. Narration is unchanged. |
| Audio | New original long-form bed (`drone-bed-long.mp3`, 10:01, eight harmonic sections, reproducible script). Long-form recording guide. |
| Assets | Three photos verified and approved, but **blocked by Wikimedia rate-limiting**. A drop-in procedure is in `asset-intake.md`. Map data, Pleiades and the new packages are added to the licence registers. |
| Checker | Validates every `storyboard*.json` (gates 5–8 per format, with per-format render lines in `approval.md`), claim references on all scene types, attribution on both sides of comparisons, and a script per extra storyboard. Duplicate messages are removed. No rule was weakened. |
| Packaging | `youtube-package.md`: titles, thumbnail, description with chapters and full credits, tags, settings, pinned comment, and a four-way policy distinction (copyright, advertiser suitability, video monetisation, channel YPP). |

## 3. Renders (in `renders/`, git-ignored)
| File | Video | Audio | Duration |
|---|---|---|---|
| `PREVIEW-short-1080x1920.mp4` | H.264 1080×1920 30 fps | AAC 48 kHz, music only, −28.2 LUFS | 56.0 s |
| `PREVIEW-long-1920x1080.mp4` | H.264 1920×1080 30 fps | AAC 48 kHz, music only, about −28 LUFS | 528.5 s (8:48.5) |
| `THUMBNAIL-1280x720.png` | 1280×720 PNG | | |

## 4. Render inspection and fixes (frames from every scene, both formats)
Inspection was iterative. Each round found defects, which were fixed and re-rendered:
1. **Map contrast:** land and sea were almost the same navy, so the graticule read as a rectangle artifact. Fixed with a darker sea, lighter land, a teal coastline glow and a fainter grid.
2. **Diagram label** "neonatal line" truncated at the frame edge. Moved inside the safe area.
3. **Timelines (16:9):** the last event ran off the right edge, labels were too narrow and the block sat too high. Fixed with equal columns anchored at the dots and a vertically centred layout.
4. **Map 8a:** "Tharros" collided with the title (fixed). Then "Zita" collided with the credit line (fixed by reframing; verified on a single frame before the final re-render).
5. **Long-form stela caption** split "3rd century / BC". Non-breaking spaces copied from the Short.

**Current state (final renders):**
- no text overflow found;
- safe areas respected;
- the attribution is legible for the whole time the stela is on screen;
- crossfades are clean;
- the interpretation panels are matched in layout and timing;
- the music fades in and out to silence.

**Art-direction notes:**
- The long-form is now map-, graphic- and text-led, with one photograph. It is more animated than before, but it is still image-light until the three blocked photos are added. They are designed for the cold open, the harbour scene and the close.
- The 1:50m coastline is coarse at the Gulf of Tunis zoom, and is labelled "Modern coastline".
- The ledger columns wrap fairly narrowly in 16:9. They are legible, but a wider layout could be considered.

## 5. Technical checks
| Check | Result |
|---|---|
| Type check + lint | pass |
| Checker gates 3, 5, 6 | pass, for both storyboards |
| Missing assets / invalid paths | none. 4 registered assets, all on disk. |
| Missing citations | none. Every on-screen factual element maps to a claim (57 scene-and-claim pairs listed for human verification). |
| Unverified claims | 41 of 41 are not human-verified (expected: human task) |
| Render dimensions | 1080×1920 and 1920×1080 confirmed with ffprobe. The checker verifies the final files once they are named in `approval.md`. |
| Audio | beds at −28.1 / −28.3 LUFS, no clipping, fades verified. The composition trims the bed to the edit length. |
| Studio | loads with no console errors, including the Thumbnail still |
| Licensing conditions | the share-alike image is shown whole in both formats and in the thumbnail (checker-enforced for scenes) |

## 6. Voice-over pass (2026-11-17, editor: "video must contain a voice over")
| Item | Result |
|---|---|
| Voice | Kokoro-82M, British male "bm_george", generated locally. Pronunciation overrides for Gielly, tophet, Ba'al Hammon, Tanit, Elissa, Diodorus Siculus, molk, Eissfeldt, Xella, Moloch and Zita. |
| Timing | Scenes refitted to the narration. **Short 59.0 s** (speed 1.2, cut 1 applied). **Long-form 8:21** (speed 1.0). |
| Sync | Voice onsets vs scene timings: Short within 10 ms on all 8 scenes; long-form within 9 ms on all 35 voiced scenes |
| Levels (final mixes) | Short −14.1 LUFS, peak −2.5 dBFS. Long-form −14.0 LUFS, peak −2.0 dBFS. No clipping. The first mix was −12.5 LUFS with a −0.5 dBFS peak (mono voice summed to both channels); it was corrected with voice and music gain of 0.84. |
| Captions | `captions-short.srt` (15 cues) and `captions-long.srt` (92 cues), generated from the same timings |
| Checker | Gate 7 passes for both formats. **Defect fixed:** the duration rule now measures rendered length, net of crossfades. |
| Render incident | Windows refused the long-form's final rename onto the existing file (EPERM, most likely OneDrive holding the old file). The completed temporary file was verified by a full decode and duration check, then renamed. This is the OneDrive risk flagged at project start. **Moving the project out of OneDrive is still recommended.** |
| Not verifiable by tooling | Pronunciation quality and naturalness. **A person must listen to both renders in full.** |

**Renders now in `renders/`:** `PREVIEW-short-1080x1920-vo.mp4`, `PREVIEW-long-1920x1080-vo.mp4`, `THUMBNAIL-1280x720.png`.

## 7. Remaining blockers
See `approval.md` for the decisions list and the final report for the full list.
