# The Hidden World — project brief for Claude

English-language cinematic documentary brand. Tagline: *There is more to reality than meets the eye.*
Editorial philosophy: **Mystery without misinformation.**

## Editorial rules (non-negotiable)
- Every factual claim is labelled as one of: `fact` (verified), `interpretation` (contested reading by named scholars, always attributed on screen and in narration), `open-question` (unresolved, evidence-backed), `hypothesis` (specific proposed explanation), `speculation` (must be flagged as such on screen/in narration).
- Never present speculation as fact. Never invent sources, citations, quotes, statistics or evidence.
- Every factual claim keeps a source reference. Prefer primary sources and peer-reviewed or institutional publications.
- AI-generated reconstructions are labelled as reconstructions and never passed off as archival footage.
- Every external asset (footage, image, music, SFX, font, AI asset, dependency) has its licence and commercial-use status recorded.
- **Nothing is ever published automatically.** Publishing requires explicit human approval.

## Audience & formats
- International English-speaking audience, initial hypothesis 18–40, interested in history, archaeology, science, oceans, mysteries.
- Short-form: 35–60 s, vertical 9:16, one hook → one central question/discovery → meaningful reveal. YouTube Shorts / TikTok / Reels.
- Long-form: 8–12 min, 16:9, real narrative arc, multiple credible sources, no padding.
- Shorts complement long-form; they are not cut-downs of the same script.

## Content pillars (target mix)
Ancient civilizations & archaeology 30% · Oceans & exploration 25% · Science & discoveries 20% · Unsolved phenomena 15% · Forgotten history 10%.
Favour distinctive, underrepresented stories, incl. North African and Mediterranean history.

## Visual identity
Midnight navy, deep ocean blue, dark teal, restrained discovery gold, warm off-white. Elegant serif headings, clean sans-serif support. Atmospheric lighting, composed scenes, subtle purposeful motion, cinematic sound.
Avoid: generic AI imagery, flashy/excessive transitions, meaningless animation, repetitive stock footage.

## Production pipeline (every video passes all 10 gates)
1 Topic validation · 2 Research & source verification · 3 Script · 4 Editorial review · 5 Storyboard & scene plan · 6 Asset sourcing/generation · 7 Narration & audio · 8 Edit & render · 9 QA · 10 Human approval before publishing.

## Technical principles
- Claude Code orchestrates; Remotion (TypeScript + React) composes video; FFmpeg handles media processing.
- Modular, reusable scene components; configuration-driven templates; reproducible renders.
- MVP: no unnecessary infrastructure or paid services.

## Repository layout
- `video/`: Remotion project.
  - `src/brand/tokens.ts`: colours, fonts.
  - `src/scenes/`: Title, Statement, Image, Map, Timeline, Compare, Stat, Source, Diagram and Ledger scenes, plus `anim.ts` (shared reveal timing).
  - `src/templates/Documentary.tsx`: one template for both formats, driven by a storyboard, with optional narration and music.
  - `src/templates/Thumbnail.tsx`: the thumbnail still.
  - `src/schema/production.ts`: zod schemas shared by the templates and the checker.
  - `scripts/`: new-production, check-production.
- Maps use Natural Earth (public domain) via `world-atlas`, `d3-geo` and `topojson-client`. Site coordinates come from Pleiades.
- A production may have several storyboards (`storyboard.json`, `storyboard-long.json`), each with its own `script*.md`.
- Never set a claim's `verified: true`. Record source review in the claim's `review` field instead.
- Share-alike images: `"fit": "contain"` (shown whole), as the checker enforces.
- `productions/<slug>/`: one folder per video, one file per gate. `_template/` is the starting point. This folder is Remotion's public dir.
- `docs/production-pipeline.md` explains how to use it all. `docs/licences.md` is the toolchain licence register.
- Commands (run in `video/`): `npm run dev`, `npm run new -- <slug>`, `npm run check -- <slug> [--for publish]`, `npx remotion render Short --props=../productions/<slug>/storyboard.json`.
- Scenes are generated from storyboard data, so edit `storyboard.json`, not the Studio timeline.
- `src/schema/production.ts` is also loaded directly by Node (type stripping): it can only import `zod` and must use erasable TS (no enums).

## YouTube publishing (docs/youtube-publishing.md)
- Commands (in `video/`): `npm run youtube:connect | youtube:status | youtube:disconnect`, `npm run youtube:upload -- <slug> --format short|long` (always PRIVATE), `npm run youtube:publish -- <slug> --format short|long --confirm-publication` (PUBLIC), `npm run youtube:video -- <slug>`. Each prints a final `RESULT {json}` line. Read it, and report only what it says.
- When asked to publish, run `youtube:publish` only for the exact production and format named. **Never** add `--confirm-publication` unless the user asked to publish that specific video in the current conversation. Never use `--promote`, `--new-upload` or `--restart-upload` without being asked.
- A public release requires every checker gate (`--for publish`) and the approval lines in `approval.md`, including `YouTube publication approved (<format>): yes…`, which **only the user writes**. Never fill in approval lines, `verified` flags, or `containsSyntheticMedia` yourself.
- The editor's acceptance of a render is not publication approval.
- Never report a video as published unless the RESULT says `"privacy":"public"`. Report private, processing, scheduled and failed states as they are.
- Secrets live only in `%LOCALAPPDATA%\TheHiddenWorld\secrets` (DPAPI-encrypted). Never read, print, copy or move them into the repo or OneDrive. `youtube:connect` is interactive: ask the user to run it in their own terminal.
- Test with `npm run test:youtube` (mocked). Never upload a test video publicly. Any real test upload is PRIVATE and needs the user's prior approval.

## Working rules for Claude
- Inspect existing code, docs and skills before implementing; avoid duplicate implementations.
- Explain significant architectural decisions before making them.
- Ask before installing dependencies or running destructive commands.
- Don't claim capabilities for external tools that you haven't verified (use the Remotion docs skill for Remotion APIs).
- Prefer small, testable, maintainable changes.
- Remotion skills live in `.claude/skills/` (installed from `remotion-dev/skills`, see `skills-lock.json`).
