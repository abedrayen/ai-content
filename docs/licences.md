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
