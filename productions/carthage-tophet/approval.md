# Gate 10: Human approval to publish

Nothing is published without this file completed by a person. Claude does not fill these fields.

## Video acceptance (editor, in chat, 2026-11-17)
The editor watched and reviewed both formats and accepted them visually and as videos. **This acceptance does not cover factual verification (gate 2) or the unresolved licensing decisions.** The editor stated this explicitly.

| Format | Accepted file | SHA-256 | Specs |
|---|---|---|---|
| Short | `renders/PREVIEW-short-1080x1920-vo.mp4` (rendered 04:47:54) | `893ff19f09ae483e0433a6b0f5af20366d83f06eadd29b05f0198829b320b6af` | 1080×1920, 30 fps, 59.0 s |
| Long-form | `renders/PREVIEW-long-1920x1080-vo.mp4` (rendered 04:56:55) | `4aa30da00ac46b62f2c226ec29ac081e2c67a0cf85466ad96bb46c7c01671654` | 1920×1080, 30 fps, 8:21 |
| Thumbnail | `renders/THUMBNAIL-1280x720.png` | `f626b0ccae52ab8faa7f877b2771f8ffd187154552aed54f7e9ab9a852948547` | 1280×720 |

Any re-render must be re-accepted. Compare its hash against this table.

## Publishing channel (confirmed by the editor in chat, 2026-11-17)
YouTube channel "Rayen Abed" (`@rayenabed-l3h`, ID `UCeRNU9fyCxv-zRJSYoan_YA`) is the channel The Hidden World publishes to. The uploader refuses any other authorised channel.

## Decisions the editor must make before signing
1. **Claims:** set `verified: true` in `claims.json` for every claim shown on screen, after reading its sources. The checker lists these under gate 2.
2. **Editorial review:** record the decision in `review.md`.
3. **Licensing risk:** accept in writing the residual share-alike and French-port uncertainty for the Lyon stela (`licensing-audit.md` §A7–A8), or attach legal advice. Fill in the "Licensing risk accepted" line below.
4. **Narration:** ✅ **The voice was approved by the editor in chat on 2026-11-17 ("Voice is good")**, after listening to both voiced renders. If the wording changes later, regenerate with `generate_vo.py` and listen again.
5. **QA:** tick `qa.md` on the final renders.
6. **Remotion licence:** confirm you are within Remotion's free tier, or hold a company licence (`docs/licences.md`).
7. **YouTube settings:** decide on the "altered or synthetic content" box. The narration is synthetic but imitates no real person, so the box is likely not required, though it's your call; disclose in the description either way. Choose the licence (Standard YouTube licence recommended, because third-party CC BY-SA material is included). See `youtube-package.md` §3 and §5.

Approved by:
Date:
Platforms:
Final render file (short):
Final render file (long):
Licensing risk accepted (A7–A8):
AI disclosure decision (containsSyntheticMedia true/false):
YouTube publication approved (short):
YouTube publication approved (long):
