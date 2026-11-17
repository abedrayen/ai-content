# YouTube publishing

Uploads finished productions to your channel with the official **YouTube Data API v3**. The code is in `video/scripts/youtube/` and uses Node's built-in `fetch`, with no extra dependencies.

**Nothing is ever published automatically.** Private uploads are for review. A public release needs every production gate to pass, an explicit per-format approval line in `approval.md`, and the `--confirm-publication` flag on a command naming the production and format.

## 1. How it fits the pipeline
```
productions/<slug>/
  youtube.json          metadata per format: title, description, tags, render path, accepted SHA-256 (copied from youtube-package.md)
  approval.md           human gates, including "YouTube publication approved (short|long): yes …"
  youtube-uploads.json  ledger of uploads: video ID, URL, render hash, metadata hash, last known status (no secrets)
video/scripts/check-production.mjs --json   the single source of truth for production gates
%LOCALAPPDATA%\TheHiddenWorld\secrets\      OAuth client, encrypted token, encrypted upload sessions (never in the repo or OneDrive)
```

| Command (run in `video/`) | What it does | Gates |
|---|---|---|
| `npm run youtube:connect` | Browser sign-in with Google; records the channel | none |
| `npm run youtube:status` | Verifies the token and that the authorised channel is the recorded one | none |
| `npm run youtube:disconnect` | Revokes access at Google and deletes local credentials | none |
| `npm run youtube:upload -- <slug> --format short\|long` | **PRIVATE** upload for review | technical checker gates 3/5/6/7, render = accepted file (SHA-256), right dimensions, valid metadata, correct channel |
| `npm run youtube:publish -- <slug> --format short\|long --confirm-publication` | **PUBLIC** upload | **all 10 checker gates** (`--for publish`), plus the approval lines: publication approved for this format, licensing risk accepted, AI-disclosure decision, platforms, final render file |
| `npm run youtube:video -- <slug> [--format …]` | Refreshes status: private, public, scheduled, processing, failed or rejected | none |
| `npm run test:youtube` | Mocked test suite (no network) | |

Every command ends with a line `RESULT {json}` for Claude Code to read. Tokens are never printed.

## 2. Google Cloud setup (one time, done by you)
1. Go to <https://console.cloud.google.com/> and create a project, e.g. "The Hidden World Studio".
2. **APIs & Services → Library →** enable **YouTube Data API v3**.
3. **Google Auth Platform → Branding / Audience** (the OAuth consent screen): user type **External**, app name, your support email. Under **Audience → Test users**, add the Google account that owns the channel.
4. **Data Access → Add scopes:**
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube.readonly`
   - only if you want `--promote`: `https://www.googleapis.com/auth/youtube.force-ssl`

   The Console shows whether each scope is classed as sensitive. Check it there, because Google's docs don't list the classification for these scopes.
5. **Clients → Create client → Application type: Desktop app.** Download the JSON.
6. Save the file as:
   ```powershell
   New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\TheHiddenWorld\secrets" | Out-Null
   Move-Item "$env:USERPROFILE\Downloads\client_secret_*.json" "$env:LOCALAPPDATA\TheHiddenWorld\secrets\client_secret.json"
   ```

### Why these scopes
| Scope | Needed for |
|---|---|
| `youtube.upload` | `videos.insert` (upload) and `thumbnails.set` |
| `youtube.readonly` | `channels.list mine=true` (channel identity, wrong-channel protection) and `videos.list` (upload and processing status). `youtube.upload` is not documented as covering these reads. |
| `youtube.force-ssl` (opt-in) | `videos.update`, used only by `publish --promote` to turn an existing private review upload public. `youtube.upload` is **not** sufficient for `videos.update`. Without it, change visibility in YouTube Studio. |

Installed apps can't add scopes incrementally. To add `force-ssl` later, run `npm run youtube:connect -- --with-manage-scope`.

## 3. Testing vs Production publishing status: important
- **Testing (default):** only listed test users can authorise. Per Google's OAuth docs, a project with an **External** user type in **Testing** status "is issued a refresh token expiring in 7 days", unless it only requests basic profile scopes. YouTube scopes are not exempt. **You'll have to run `npm run youtube:connect` again at least weekly** while in Testing. The tool detects the expired token (`invalid_grant`), deletes it, and tells you to reconnect.
- **In production (unverified):** apps requesting sensitive or restricted scopes show an "unverified app" screen. There is a cap of 100 new users, and Google's verification policy applies. Google exempts **personal use** (all users known personally to you) from verification. **Check the current requirements in the Console before switching.** This tool doesn't decide that for you.
- **Other ways a refresh token stops working:** you revoke it; it goes unused for 6 months; or you exceed 100 refresh tokens per account per client, in which case the oldest is dropped.

## 4. Connect (interactive, done by you)
```powershell
cd "$env:USERPROFILE\OneDrive\Desktop\ai-content\video"
npm run youtube:connect
npm run youtube:status
```
A browser tab opens on Google's sign-in page. **You sign in there; the tool never sees your password.** Pick the channel's account and approve. Then `youtube:status` should show your channel name and ID.
The token is stored **encrypted with Windows DPAPI** (only your Windows account on this PC can decrypt it) in `%LOCALAPPDATA%\TheHiddenWorld\secrets\youtube-token.dpapi`.

## 5. Publish a Short (example: carthage-tophet)
1. Make sure every human gate is complete:
   - claims verified (`verification-worksheet.md`);
   - `review.md` approved;
   - `qa.md` ticked;
   - `approval.md` filled in, including:
     ```
     Platforms: YouTube
     Final render file (short): renders/PREVIEW-short-1080x1920-vo.mp4
     Licensing risk accepted (A7–A8): <your decision>
     AI disclosure decision (containsSyntheticMedia true/false): false
     YouTube publication approved (short): yes — <name>, <date>
     ```
   - In `youtube.json`, set `containsSyntheticMedia` to the same value.
2. Optional private review first:
   ```powershell
   npm run youtube:upload -- carthage-tophet --format short
   ```
   This reports a YouTube Studio link. It stays private; **nothing turns it public automatically.** If you then want it public, either change visibility in Studio, or run `publish … --promote` (needs `--with-manage-scope`).
3. Public release:
   ```powershell
   npm run youtube:publish -- carthage-tophet --format short --confirm-publication
   ```
   Success is reported **only** when `videos.list` confirms `privacyStatus: public`. Otherwise you get the actual status and a non-zero exit.

**Shorts eligibility:** YouTube classifies vertical or square videos up to **3 minutes** as Shorts (standard channels, uploads from 15 Oct 2024). The tool checks 1080×1920 and ≤ 180 s, but YouTube makes the final classification.

## 6. Publish the long-form
The same steps with `--format long`. The thumbnail (`renders/THUMBNAIL-1280x720.png`, under 2 MB) is set with `thumbnails.set` after upload. If your channel isn't verified for custom thumbnails, the upload still succeeds and the ledger records "thumbnail not set". Verify the channel at youtube.com/verify, then set it in Studio.

## 7. Safety and duplicate prevention
- **Upload key:** `<slug>:<format>:<SHA-256 of the render>`. A second `upload` of the same render is refused, and returns the existing link. `--new-upload` deliberately makes another private copy. `publish` never duplicates: it refuses if a public upload exists, and refuses if a private review copy exists (unless `--promote`).
- **Resumable uploads:** the session address is saved (encrypted) **before** any bytes are sent. If a run is interrupted (network, crash, Ctrl+C), **run the same command again**. It asks YouTube how much it has and continues the same session. If YouTube already finished, it returns the existing video. No second video is created.
- **Expired session:** you get an explicit `SESSION_EXPIRED`. Re-run with `--restart-upload` to start a new session. Only do this when you're sure the old session didn't finish; `youtube:video` and Studio will tell you.
- **Retries:** 5xx and 429 responses, and network errors, are retried with exponential backoff and jitter. The request that *creates* an upload session is never blindly retried.
- **Privacy is always explicit:** YouTube makes a video **public** if `privacyStatus` is omitted, so the tool always sends it.
- **Wrong channel:** before every upload, the authorised channel must match the channel recorded at connect time. `--switch-channel` at connect replaces it.
- **The ledger** (`youtube-uploads.json`) records the exact render file, its hash, the metadata hash and the last known status. It contains no secrets and is fine to commit.

## 8. Security
- **Storage:**
  - Secrets live only in `%LOCALAPPDATA%\TheHiddenWorld\secrets` (override with `THW_SECRETS_DIR`).
  - The tool **refuses** any location inside the repo or OneDrive.
  - The token and session files are DPAPI-encrypted.
  - The client JSON is a Desktop "public client" per Google, but it is still kept out of the repo.
- **Defence in depth:** `.gitignore` also excludes typical secret filenames, but it isn't the only protection.
- **Revoke access:** `npm run youtube:disconnect`, or remove the app at <https://myaccount.google.com/permissions>.
- **Lost or stolen PC:** revoke at the link above, and delete the OAuth client in Google Cloud.

**Note for Claude Code sessions:** the Claude desktop app may redirect `%LOCALAPPDATA%` writes into its own package cache. Run `youtube:connect` from **your own** PowerShell window, so the token lands in the real `%LOCALAPPDATA%`. Claude's commands can read it.

## 9. Limitations
- **Quota:** `videos.insert` is documented at 100 calls per day (1 unit in the Video Uploads bucket). `thumbnails.set` is about 50 units; `channels.list` and `videos.list` are 1 unit each.
- **Not implemented, on purpose (no automatic scheduling):** scheduled publishing (`publishAt`, which requires private status) and captions upload (`captions.insert` would need `force-ssl`). Upload `captions-*.srt` in Studio.
- **Studio only:** the "altered or synthetic content" disclosure is sent as `status.containsSyntheticMedia` from `youtube.json`, after the editor decides. The pinned comment and end screens are set by hand in Studio.
