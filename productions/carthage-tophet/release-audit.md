# Release-candidate audit: carthage-tophet

2026-11-17. Nothing was uploaded, published, scheduled or committed.

## Recommendation: **NOT READY_TO_PUBLISH**
The videos are accepted and technically sound. Required human gates are still open (claims, editorial decision, licensing acceptance, QA ticks, signature).

## 1. Video acceptance: ✅ ACCEPTED by the editor (2026-11-17)
| File | SHA-256 |
|---|---|
| `renders/PREVIEW-short-1080x1920-vo.mp4` | `893ff19f…20b6af` |
| `renders/PREVIEW-long-1920x1080-vo.mp4` | `4aa30da0…671654` |
| `renders/THUMBNAIL-1280x720.png` | `f626b0cc…948547` |

The full hashes are recorded in `approval.md`. Acceptance does not cover factual verification or licensing.

## 2. Technical validation: ✅ PASS
- **Integrity:** full decode with 0 errors and no black gaps (≥ 0.3 s). Frame counts exactly match the committed storyboards (Short 1,770; long-form 15,033). Re-rendered sample frames match the videos at 40–44 dB PSNR, so **the accepted files correspond to the committed inputs.** Every input predates the renders.
- **Audio:**
  - Long-form: −14.0 LUFS, loudness range 2.9 LU (−16.5 to −13.5), true peak −2.0 dBTP.
  - Short: −14.1 LUFS, 2.0 LU, −2.5 dBTP.
  - No clipping, DC offset about 0. The voice sits 12.6 dB above the music bed.
  - Audio and video lengths match within 20 ms.
- **Narration sync:** voice onsets within 10 ms of the scene timings (8/8 Short scenes, 35/35 long-form).
- **Captions:**
  - Text is identical to the narration (15 and 92 cues).
  - No overlaps, nothing runs past the end, and cues start within 9 ms of the voice.
  - Maximum 18 characters per second.
  - *Optional:* 27 long-form cues exceed 84 characters (they wrap to three lines), and the long-form captions spell numbers in words.
- **Transitions:** 0.5 s crossfades with no black frames. Visual review by the editor.
- **Credits on screen:** stela credit (author, licence, museum) and the map credit appear in both formats.
- **Checker:** gates 1, 3, 5, 6 and 7 pass. Gates 2 and 4 fail (human), and gates 8–10 are pending.

## 3. Editorial verification: ❌ OPEN (human gate 2)
- 40 of 41 claims are verified by source review, with the passage relied on recorded. **0 are human-verified.**
- **New:** c34 is now confirmed by the Musée des Beaux-Arts de Lyon record for inv. 1969-86: 3rd century BC (estimated), Carthage tophet, limestone. The record also shows the inscription **is a vow** to Tanit and Ba'al Hammon (CIS I 3241). The narration over this image is therefore accurate for this specific stela.
- **Worksheet:** `verification-worksheet.md` covers the 34 claims used by the videos, with sources, evidence and checkboxes.
- **Mandatory:** six claims are not used by either video (c02, c27, c28, c31, c33, c36), plus c11 (excluded). The checker requires every claim in `claims.json` to be verified. **Verify them, or (editor's decision) move them to a separate research file.**
- **Limits:** several sources were read only in abstract or extract (Smith et al. 2011/2013, Xella et al. 2013, the 2023 JAH papers other than Xella's). A reader with access should confirm the key figures.

## 4. Licensing: ⚠ CONDITIONAL
| Component | Status |
|---|---|
| Lyon stela photo (Rama, CC BY-SA 2.0 FR) | Approved with conditions (shown whole, credited). **Editor must accept the A7–A8 risk or get legal advice.** |
| Music beds | Original, in-house: OK |
| Narration (Kokoro-82M, Apache-2.0; voice bm_george) | OK per the registered licence. *Not re-checked online this pass.* Disclosed in the description. |
| Fonts (Cormorant Garamond, Inter) | SIL OFL 1.1: commercial use OK |
| Map data | Natural Earth (public domain) and Pleiades (CC BY 3.0 US, credited) |
| Dependencies | ISC/MIT/BSD/Apache. espeak-ng (GPL-3.0) used only as a local tool. |
| **Remotion** | **Editor must confirm eligibility for the free licence** (or buy a company licence) before monetising |
| Short quotations on screen | "…because he heard his voice and blessed him" (Stager 2014 translation), "supposed eye-witness reports" (Schwartz et al. 2010), "as uncertain as ever" (McCarty 2024): very short and attributed, which counts as quotation for commentary. Low risk. |
| Three pending photos | Not used (rate-limited). Optional. |

## 5. YouTube packaging: ✅ reviewed (`youtube-package.md`)
- Title: 55 characters, a question, matches the content.
- Chapters: start at 0:00, 10 chapters, each ≥ 10 s, computed from the final edit.
- Thumbnail: 1280×720, 855 KB (< 2 MB), non-graphic, readable at 320 px.
- Hashtags: 3. Tags avoid graphic terms. The pinned comment invites discussion of the evidence.
- *Small fix recommended:* add DOIs for Fulton/Degryse/Ben Jerbania 2023 to the sources list (10.1515/jah-2023-0014, -0016, -0021).

## 6. Remaining blockers
**Mandatory before publishing**
1. Human verification of the claims (`verification-worksheet.md`), and a decision on the unused claims.
2. Editorial decision in `review.md`, including approval of the long-form script text.
3. Licensing-risk acceptance (A7–A8) and Remotion licence confirmation.
4. Tick `qa.md`. Fill in `approval.md`: final render files, platforms, the AI-disclosure choice, signature. Countersign `brief.md`.

**Optional**
- Add the three blocked photos.
- Split long caption cues and use digits.
- Add a Fantar line.
- Move the project out of OneDrive.
- Resolve the vaults-photo authorship question.
