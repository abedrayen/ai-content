# Production pipeline

Each video lives in `<repo>/productions/<slug>/`, one file per gate. Run commands from `video/` (or `npm --prefix video run …` from the repo root). Both scripts find `productions/` from their own location, so the folder you run them from doesn't matter. Create a production with `npm run new` before you check it.

```bash
npm run new -- <slug>                    # copy productions/_template
npm run check -- <slug>                  # gate report; gates 1–6 must pass before rendering
npm run check -- <slug> --for publish    # also requires QA (9) and signed approval (10)
npm run dev                              # Remotion Studio (brand demo props)
npx remotion render Short --props=../productions/<slug>/storyboard.json out/<slug>.mp4
npx remotion render LongForm --props=../productions/<slug>/storyboard.json out/<slug>.mp4
```

| Gate | File | Automated check |
|---|---|---|
| 1 Topic validation | `brief.md` | no `TODO` left |
| 2 Research & sources | `claims.json` | schema valid; every non-speculation claim has ≥1 source; every claim `verified: true` |
| 3 Script | `script.md` | no `TODO` left |
| 4 Editorial review | `review.md` | `Decision: approved` |
| 5 Storyboard | `storyboard.json` | schema valid; claim ids exist; scene labels match claim labels; duration within format target |
| 6 Assets & licences | `assets.json` + `assets/` | every image registered, file exists, commercial use allowed, attribution text present when required, AI assets badged as reconstructions |
| 7 Narration & audio | — | not automated yet |
| 8 Edit & render | — | not automated yet |
| 9 QA | `qa.md` | every checkbox ticked |
| 10 Human approval | `approval.md` | `Approved by:` and `Date:` filled |

**What the checker can't do:** it can't tell whether a source exists or supports a claim. `verified: true` means a person has read it. Never set it automatically.

## Claim labels
- `fact`: verified, no on-screen badge
- `open-question`: badge "Unresolved question"
- `hypothesis`: badge "Hypothesis"
- `speculation`: badge "Speculation"; must also be phrased as speculation in narration

## Scene types (storyboard.json)
- `title`: kicker + serif heading + gold rule
- `statement`: one line of text, optional `claimId` / `label` / `sourceNote`
- `image`: full-bleed still with slow push-in, caption, required `credit`, `isReconstruction` badge

Image `src` paths are relative to `productions/` (the Remotion public dir), e.g. `my-slug/assets/photo.jpg`.
The whole `productions/` folder is copied into each render bundle, so keep large raw media outside it.
