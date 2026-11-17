# Licence register: tools, fonts, dependencies

Per-video assets are recorded in each production's `assets.json`. This file covers the toolchain.

| Item | Licence | Commercial use | Notes |
|---|---|---|---|
| Remotion 4.0.544 (`remotion`, `@remotion/*`) | Remotion License | Free for individuals and companies of up to 3 people (per the installer notice); larger companies need a company licence | **Action: confirm against https://www.remotion.dev/docs/license before monetising.** |
| Cormorant Garamond (Google Fonts) | SIL OFL 1.1 | Yes | Loaded via `@remotion/google-fonts` |
| Inter (Google Fonts) | SIL OFL 1.1 | Yes | Loaded via `@remotion/google-fonts` |
| React, zod, TypeScript, ESLint, Prettier | MIT / Apache-2.0 | Yes | Standard open-source licences |
| FFmpeg 9.0.2 (gyan.dev "full" build, system install) | GPL build | Using it as a tool to process media is fine; don't redistribute it bundled with our software | Not bundled in this repo |
| `productions/_template/assets/placeholder.svg` | Original, in-house | Yes | Abstract placeholder |
| `@remotion/media` 4.0.544 | Remotion License | as Remotion above | Audio playback in the template |
| Natural Earth vector data 4.1.0 (1:50m land) | **Public domain** (naturalearthdata.com) | Yes; no attribution required (we credit it on screen anyway) | Redistributed by `world-atlas` |
| `world-atlas` 2.0.2 | ISC (© Mike Bostock) | Yes | TopoJSON packaging of Natural Earth |
| `d3-geo` 3.1.1 | ISC | Yes | Map projection and paths |
| `topojson-client` 3.1.0 | ISC | Yes | TopoJSON to GeoJSON |
| Kokoro-82M TTS model and voices (hexgrad, Hugging Face `hexgrad/Kokoro-82M`), `kokoro` 0.9.4 | Apache-2.0 | Yes. The licence claims no rights over generated audio. | Voice-over generation (`video/scripts/tts/generate_vo.py`). Runs locally in an isolated venv (`%LOCALAPPDATA%\TheHiddenWorld\tts-venv`). |
| `misaki` 0.9.4 (grapheme-to-phoneme) | Apache-2.0 | Yes | Kokoro dependency |
| PyTorch 2.15 (CPU) | BSD-3-Clause | Yes | Kokoro dependency |
| spaCy model `en_core_web_sm` 3.8.0 | MIT | Yes | Auto-installed by misaki on first run |
| espeak-ng (via `espeakng-loader` 0.2.4) | GPL-3.0 | Used as a local tool only; not distributed. GPL does not extend to generated audio. | Fallback phonemiser for words outside misaki's lexicon |
| Pleiades gazetteer coordinates | CC BY 3.0 US (confirmed from page metadata, 2026-11-17) | Yes, with attribution | Five site coordinates used for the map markers (places 314921, 462373, 472032, 678437, 344571). Coordinates are facts, but we credit "Pleiades (pleiades.stoa.org), CC BY 3.0" in the description. |
