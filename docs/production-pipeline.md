# Production pipeline

Each video lives in `<repo>/productions/<slug>/`, one file per gate. Run commands from `video/` (or `npm --prefix video run …` from the repo root). Both scripts find `productions/` from their own location, so the folder you run them from doesn't matter. Create a production with `npm run new` before you check it.

```bash
npm run new -- <slug>                    # copy productions/_template
npm run check -- <slug>                  # gate report; gates 1–7 must pass before the final render
npm run check -- <slug> --for publish    # requires all 10 gates
npm run dev                              # Remotion Studio (brand demo props)
npx remotion render Short --props=../productions/<slug>/storyboard.json ../productions/<slug>/renders/<file>.mp4
npx remotion render LongForm --props=../productions/<slug>/storyboard.json ../productions/<slug>/renders/<file>.mp4
```

Gates marked **[human sign-off]** in the report pass only through a person's decision. The checker never completes them on its own. The others are technical checks.

| Gate | File | Automated check |
|---|---|---|
| 1 Topic validation · human | `brief.md` | no `TODO` left |
| 2 Research & sources · human | `claims.json` | schema valid; every non-speculation claim has ≥1 source; every claim `verified: true`; also lists each on-screen scene that relies on an unverified claim |
| 3 Script | `script.md` | no `TODO` left |
| 4 Editorial review · human | `review.md` | `Decision: approved` |
| 5 Storyboard | `storyboard.json` | schema valid; claim ids exist; labels and attributions match claims; each scene ≥ 1.5 s; image scenes have a caption; total within the format target |
| 6 Assets & licences | `assets.json` + files | every image and audio file registered and on disk; commercial use allowed; when attribution is required, `attributionText`, `title`, `author`, `sourceUrl` and `licenceUrl` are present and valid, and the on-screen credit names the author; Creative Commons assets link to creativecommons.org; AI assets carry the reconstruction badge; share-alike images use `"fit": "contain"` |
| 7 Narration & audio | `storyboard.json` | a narration track is present (registration is checked by gate 6) |
| 8 Edit & render | `approval.md` | `Final render file:` exists and has the correct dimensions (1080×1920 short / 1920×1080 long; needs `ffprobe`) |
| 9 QA · human | `qa.md` | every checkbox ticked |
| 10 Human approval · human | `approval.md` | `Approved by:` and `Date:` filled |

**What the checker can't do:**
- It can't tell whether a source exists or supports a claim. `verified: true` means a person has read it, so never set it automatically.
- It can't judge whether a licence actually covers our use. That's in each production's `licensing-audit.md`.
- It can't judge visual quality. That's in `qa-report.md` and `qa.md`.

## Claim labels
- `fact`: verified, no on-screen badge
- `interpretation`: a contested reading held by named scholars. It needs an `attribution` (e.g. "Smith et al. 2011, 2013") on the claim and on the scene, and the two must match. It shows "Interpretation" plus the attribution, and narration must name who holds the view.
- `open-question`: badge "Unresolved question"
- `hypothesis`: badge "Hypothesis"
- `speculation`: badge "Speculation"; must also be phrased as speculation in narration

## Storyboards per format
- `storyboard.json` is the production's first storyboard (e.g. the Short).
- Additional storyboards are named `storyboard-<name>.json` (e.g. `storyboard-long.json`). Each needs a matching `script-<name>.md`.
- The checker validates gates 5–8 for every storyboard. Files whose name contains `draft` are ignored.
- `approval.md` then needs one `Final render file (<format>):` line per format.

## Thumbnail
`npx remotion still Thumbnail ../productions/<slug>/renders/THUMBNAIL-1280x720.png --props=../productions/<slug>/thumbnail.json`. The props are `image` (shown whole), `kicker`, `headline` and `subline`.

## Claim review vs human verification
- `review` holds the researcher's source review: `status`, `reviewedOn`, and `evidence` (the passage relied on).
- `verified` is only ever set by an authorised person. The checker's gate 2 requires `verified: true`.

## Scene types (storyboard.json)
- `title`: kicker + serif heading + gold rule
- `statement`: one line of text, optional `claimId` / `label` / `attribution` / `sourceNote`
- `map`: an animated Natural Earth map. Camera move `view.from → view.to` (`center` [lon, lat], d3 Mercator `scale` for a 1920 px frame), `markers` (`primary` / `site` / `uncertain`, each with `appearAt` seconds), optional great-circle `arcs`, an on-screen data credit, and `claimIds`.
- `timeline`: 2–7 dated events that draw in sequence. Horizontal in 16:9, vertical in 9:16. Each event may carry a `claimId`.
- `compare`: two attributed interpretations with identical layout and timing. Each side's `claimId` must be an `interpretation` claim with a matching `attribution`.
- `stat`: one figure with an optional count-up (`countTo`) and a `claimId`.
- `source`: an ancient written source shown as a document (author, work, date, paraphrase, optional "gap" chip), with a `claimId`.
- `diagram`: a simplified schematic, always labelled "not to scale". Variants are `neonatal-line` and `shrinkage`.
- `ledger`: two columns built line by line (e.g. "the evidence shows / cannot yet show").
- `image`: required `caption` (checked by the checker), required `credit`, an `isReconstruction` badge, and `fit`:
  - `"cover"` (default): full-bleed, cropped, slow push-in, text over a gradient
  - `"contain"`: the whole image, uncropped and unaltered, shown like a mounted print, with the text outside the image (below it in 9:16, beside it in 16:9). **Required for share-alike (CC BY-SA) images.**

## Asset register (assets.json)
Each asset records its `path`, `description`, `origin`, `licence`, `commercialUseAllowed`, `attributionRequired` and `aiGenerated`. When attribution is required, it also records `attributionText` (the full credit for the description box), `title`, `author`, `sourceUrl` and `licenceUrl`. See `productions/carthage-tophet/licensing-audit.md` for the licensing standard.

## Voice-over (synthetic, Kokoro TTS)
Each storyboard has a `narration-<name>.json` alongside it. It gives the voice, language, speed, optional `lead`/`tail` seconds, and per-scene `text`, with pronunciation overrides written as `[word](/phonemes/)`.

```bash
# from video/, using the isolated venv
"%LOCALAPPDATA%\TheHiddenWorld\tts-venv\Scripts\python.exe" scripts/tts/generate_vo.py ../productions/<slug> narration-short.json
```

The script:
- synthesises each scene;
- sets each scene's duration to fit its narration, never shorter than that scene type's animation minimum;
- reorders storyboard scenes to the narration order;
- writes `audio/narration-<name>.mp3` (−15 LUFS, −1.5 dBTP), `captions-<name>.srt` and `audio.narration` in the storyboard.

Register the MP3 in `assets.json` with `aiGenerated: true`. **After any wording change, regenerate and re-render.** Someone must listen to the result before approval.

## Audio (storyboard.json, optional)
```json
"audio": {
  "narration": { "src": "<slug>/audio/narration.wav", "volume": 1 },
  "music":     { "src": "<slug>/audio/music.mp3",     "volume": 1 }
}
```
Both tracks start at frame 0. Music fades in over 1 s and out over the last 2 s. Every audio file must be registered in `assets.json`. Narration is required for the final render (gate 7). Each production keeps a recording spec at `audio/recording-guide.md`.

Image and audio `src` paths are relative to `productions/` (the Remotion public dir), e.g. `my-slug/assets/photo.jpg`.
**Known issue:** the whole `productions/` folder, including each production's `renders/`, is copied into every render bundle. Keep large raw media out of it, and delete old previews from `renders/`.
