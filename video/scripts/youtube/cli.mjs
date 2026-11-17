// The Hidden World Studio — YouTube publishing CLI.
//   npm run youtube:connect [-- --with-manage-scope] [-- --switch-channel]
//   npm run youtube:status
//   npm run youtube:disconnect
//   npm run youtube:upload  -- <slug> --format short|long [--new-upload] [--restart-upload]   (always PRIVATE)
//   npm run youtube:publish -- <slug> --format short|long --confirm-publication [--promote]   (PUBLIC, all gates)
//   npm run youtube:video   -- <slug> [--format short|long]                                  (refresh status)
// Every command ends with one line "RESULT {json}" for machine reading. Tokens are never printed.
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { makeApi, studioUrl, watchUrl } from "./api.mjs";
import { authorize, loadClient, makeTokenSource, revoke, SCOPES } from "./oauth.mjs";
import { PRODUCTIONS, secretFiles, secretsDir } from "./paths.mjs";
import {
  checkRender, ffprobe, findUploads, insertBody, loadProduction, privateUploadProblems, publicReleaseProblems,
  readLedger, runChecker, sha256Text, uploadKey, writeLedger,
} from "./release.mjs";
import { resumableUpload } from "./upload.mjs";
import { makeVault } from "./vault.mjs";

const defaultOpen = (url) => {
  const child = spawn("powershell.exe", ["-NoProfile", "-Command", `Start-Process '${url.replace(/'/g, "''")}'`], { detached: true, stdio: "ignore", windowsHide: true });
  child.unref();
};

class Exit extends Error {
  constructor(code, result) {
    super(result.message ?? "exit");
    this.exitCode = code;
    this.result = result;
  }
}

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--") && a !== "--format"));
  const fi = argv.indexOf("--format");
  const format = fi >= 0 ? argv[fi + 1] : undefined;
  const positional = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--format");
  return { command: positional[0], slug: positional[1], format, flags };
}

export async function run(argv, deps = {}) {
  const log = deps.log ?? ((m) => console.log(m));
  const fetchFn = deps.fetchFn ?? fetch;
  const vault = makeVault(deps.codec);
  const files = secretFiles(secretsDir(deps.env ?? process.env));
  const root = deps.productionsRoot ?? PRODUCTIONS;
  const { command, slug, format, flags } = parseArgs(argv);

  const readAccount = () => (existsSync(files.account) ? JSON.parse(readFileSync(files.account, "utf8")) : null);
  const apiFor = (client) =>
    makeApi({ fetchFn, wait: deps.wait, getToken: makeTokenSource({ client, vault, tokenPath: files.token, fetchFn, now: deps.now }) });

  /** Abort unless the authorised account is the channel recorded at connect time. */
  async function verifiedApi() {
    const account = readAccount();
    if (!account) throw new Exit(2, { ok: false, error: "NOT_CONNECTED", message: "YouTube is not connected. Run: npm run youtube:connect" });
    const api = apiFor(loadClient(files.client));
    const ch = await api.myChannel();
    if (ch.id !== account.channelId) {
      throw new Exit(2, { ok: false, error: "WRONG_CHANNEL", message: `Authorised channel "${ch.title}" (${ch.id}) is not the connected channel "${account.channelTitle}" (${account.channelId}). Nothing was uploaded.` });
    }
    return { api, account, channel: ch };
  }

  const requireTarget = () => {
    if (!slug || !["short", "long"].includes(format)) throw new Exit(64, { ok: false, error: "USAGE", message: "Usage: <command> <slug> --format short|long" });
    return loadProduction(slug, root);
  };

  async function uploadFlow(prod, privacyStatus, render) {
    const meta = prod.youtube.formats[format];
    const key = uploadKey(slug, format, render.sha);
    const sessionPath = join(files.sessions, `${key.replace(/[^a-z0-9]+/gi, "_")}.dpapi`);
    if (flags.has("--restart-upload")) vault.remove(sessionPath);
    const body = insertBody(meta, privacyStatus);
    const { api } = await verifiedApi();
    log(`Uploading ${meta.render} (${(render.size / 1048576).toFixed(1)} MB) as ${privacyStatus.toUpperCase()}…`);
    let lastPct = -1;
    const { video, resumed } = await resumableUpload({
      fetchFn,
      getToken: makeTokenSource({ client: loadClient(files.client), vault, tokenPath: files.token, fetchFn, now: deps.now }),
      filePath: render.path,
      size: render.size,
      metadata: body,
      session: vault.read(sessionPath),
      saveSession: (s) => vault.write(sessionPath, s),
      onProgress: (done, total) => {
        const pct = Math.floor((done / total) * 100);
        if (pct >= lastPct + 10 || pct === 100) log(`  ${pct}%`), (lastPct = pct);
      },
      log,
      wait: deps.wait,
    });
    // Record first, then clean up: the ledger is what prevents duplicates.
    const ledger = readLedger(prod);
    const entry = {
      key, slug, format, renderFile: meta.render, renderSha256: render.sha, metadataSha256: sha256Text(JSON.stringify(body)),
      privacyRequested: privacyStatus, videoId: video.id, url: watchUrl(video.id), studioUrl: studioUrl(video.id),
      uploadedAt: new Date().toISOString(), resumedSession: resumed, status: video.status ?? null,
    };
    ledger.uploads.push(entry);
    writeLedger(prod, ledger);
    vault.remove(sessionPath);
    if (meta.thumbnail) {
      try {
        const t = join(prod.dir, meta.thumbnail);
        await api.setThumbnail(video.id, readFileSync(t), t.endsWith(".png") ? "image/png" : "image/jpeg");
        entry.thumbnail = "set";
      } catch (e) {
        entry.thumbnail = `not set: ${e.message}`; // e.g. channel not verified for custom thumbnails
        log(`Warning: thumbnail ${entry.thumbnail}`);
      }
    }
    entry.lastKnown = { ...(await api.video(video.id)), checkedAt: new Date().toISOString() };
    writeLedger(prod, ledger);
    return entry;
  }

  const describe = (s) =>
    !s ? "not found (deleted or not visible to this account)"
    : s.uploadStatus === "rejected" || s.uploadStatus === "failed" ? `${s.uploadStatus} (${s.rejectionReason ?? s.failureReason})`
    : s.publishAt && s.privacyStatus === "private" ? `scheduled for ${s.publishAt}`
    : `${s.privacyStatus}; upload ${s.uploadStatus}; processing ${s.processingStatus ?? "unknown"}`;

  const commands = {
    async connect() {
      const client = loadClient(files.client);
      const scopes = [SCOPES.upload, SCOPES.readonly, ...(flags.has("--with-manage-scope") ? [SCOPES.manage] : [])];
      const token = await authorize({ client, scopes, openBrowser: deps.openBrowser ?? defaultOpen, log, fetchFn });
      const api = makeApi({ fetchFn, wait: deps.wait, getToken: async () => token.access_token });
      const ch = await api.myChannel();
      const prior = readAccount();
      if (prior && prior.channelId !== ch.id && !flags.has("--switch-channel")) {
        await revoke({ token, fetchFn });
        throw new Exit(2, { ok: false, error: "CHANNEL_CHANGED", message: `You signed in as "${ch.title}" (${ch.id}) but "${prior.channelTitle}" (${prior.channelId}) is connected. Re-run with --switch-channel to replace it.` });
      }
      vault.write(files.token, token);
      const account = { channelId: ch.id, channelTitle: ch.title, customUrl: ch.customUrl, scopes: (token.scope ?? scopes.join(" ")).split(" "), connectedAt: new Date().toISOString() };
      mkdirSync(files.sessions, { recursive: true });
      writeFileSync(files.account, JSON.stringify(account, null, 2));
      log(`Connected to "${ch.title}" (${ch.id}). Scopes: ${account.scopes.map((s) => s.split("/").pop()).join(", ")}`);
      return { ok: true, channel: ch, scopes: account.scopes };
    },

    async status() {
      const account = readAccount();
      const token = vault.read(files.token);
      if (!account || !token) {
        log("Not connected. Run: npm run youtube:connect");
        return { ok: false, connected: false };
      }
      const { channel } = await verifiedApi();
      log(`Connected: "${channel.title}" (${channel.id}) — matches the recorded channel.`);
      log(`Scopes: ${account.scopes.map((s) => s.split("/").pop()).join(", ")} · refresh token stored: ${Boolean(token.refresh_token)}`);
      return { ok: true, connected: true, channel, scopes: account.scopes, canPromote: account.scopes.includes(SCOPES.manage) };
    },

    async disconnect() {
      const token = vault.read(files.token);
      const revoked = token ? await revoke({ token, fetchFn }) : false;
      vault.remove(files.token);
      rmSync(files.account, { force: true });
      log(revoked ? "Access revoked at Google and local credentials deleted." : "Local credentials deleted (nothing to revoke).");
      return { ok: true, revoked };
    },

    async upload() {
      const prod = requireTarget();
      const checker = (deps.runChecker ?? runChecker)(slug, "render");
      const render = checkRender(prod, format, { probe: deps.probe ?? ffprobe });
      const problems = privateUploadProblems(prod, format, { checker, render });
      if (problems.length) throw new Exit(2, { ok: false, error: "GATES", problems, message: "Private upload blocked." });
      const existing = findUploads(readLedger(prod), uploadKey(slug, format, render.sha));
      if (existing.length && !flags.has("--new-upload")) {
        const e = existing.at(-1);
        log(`Already uploaded: ${e.url} (${e.privacyRequested}). Not uploading again. Use --new-upload for a second private copy.`);
        return { ok: true, duplicatePrevented: true, videoId: e.videoId, url: e.url, studioUrl: e.studioUrl };
      }
      const entry = await uploadFlow(prod, "private", render);
      log(`Uploaded PRIVATE for review: ${entry.studioUrl}\nStatus: ${describe(entry.lastKnown)}\nIt will not be made public automatically.`);
      return { ok: true, privacy: "private", videoId: entry.videoId, url: entry.url, studioUrl: entry.studioUrl, status: entry.lastKnown };
    },

    async publish() {
      const prod = requireTarget();
      const checker = (deps.runChecker ?? runChecker)(slug, "publish");
      const render = checkRender(prod, format, { probe: deps.probe ?? ffprobe });
      const problems = publicReleaseProblems(prod, format, { checker, render, confirmed: flags.has("--confirm-publication") });
      if (problems.length) throw new Exit(2, { ok: false, error: "GATES", problems, message: "Public release blocked. Nothing was uploaded." });
      const ledger = readLedger(prod);
      const existing = findUploads(ledger, uploadKey(slug, format, render.sha));
      const published = existing.find((u) => u.lastKnown?.privacyStatus === "public" || u.privacyRequested === "public");
      if (published) {
        log(`Already published: ${published.url}. Not uploading again.`);
        return { ok: true, duplicatePrevented: true, videoId: published.videoId, url: published.url };
      }
      const review = existing.find((u) => u.privacyRequested === "private");
      if (review) {
        if (!flags.has("--promote")) {
          throw new Exit(3, { ok: false, error: "PRIVATE_COPY_EXISTS", videoId: review.videoId, studioUrl: review.studioUrl, message: `A private review upload of this exact render exists (${review.videoId}). To avoid a duplicate, make it public in YouTube Studio (${review.studioUrl}) or re-run with --promote (needs: npm run youtube:connect -- --with-manage-scope).` });
        }
        const { api, account } = await verifiedApi();
        if (!account.scopes.includes(SCOPES.manage)) throw new Exit(2, { ok: false, error: "SCOPE", message: "--promote needs the youtube.force-ssl scope. Run: npm run youtube:connect -- --with-manage-scope" });
        const meta = prod.youtube.formats[format];
        await api.updateStatus(review.videoId, insertBody(meta, "public").status);
        review.lastKnown = { ...(await api.video(review.videoId)), checkedAt: new Date().toISOString() };
        review.promotedAt = new Date().toISOString();
        writeLedger(prod, ledger);
        return confirmPublic(review);
      }
      const entry = await uploadFlow(prod, "public", render);
      return confirmPublic(entry);
    },

    async video() {
      if (!slug) throw new Exit(64, { ok: false, error: "USAGE", message: "Usage: youtube:video <slug> [--format short|long]" });
      const prod = loadProduction(slug, root);
      const ledger = readLedger(prod);
      const list = ledger.uploads.filter((u) => !format || u.format === format);
      if (!list.length) {
        log("No uploads recorded for this production.");
        return { ok: true, uploads: [] };
      }
      const { api } = await verifiedApi();
      for (const u of list) {
        u.lastKnown = { ...(await api.video(u.videoId)), checkedAt: new Date().toISOString() };
        log(`${u.format}: ${u.url} — ${describe(u.lastKnown)}`);
      }
      writeLedger(prod, ledger);
      return { ok: true, uploads: list.map((u) => ({ format: u.format, videoId: u.videoId, url: u.url, status: u.lastKnown })) };
    },
  };

  function confirmPublic(entry) {
    const s = entry.lastKnown;
    if (s?.privacyStatus !== "public") {
      throw new Exit(4, { ok: false, error: "NOT_PUBLIC", videoId: entry.videoId, studioUrl: entry.studioUrl, status: s, message: `Uploaded, but YouTube reports: ${describe(s)}. Not reporting it as published.` });
    }
    log(`PUBLISHED (confirmed by YouTube): ${entry.url}\nStatus: ${describe(s)}`);
    return { ok: true, privacy: "public", videoId: entry.videoId, url: entry.url, status: s };
  }

  if (!commands[command]) throw new Exit(64, { ok: false, error: "USAGE", message: `Unknown command "${command}". Use connect, status, disconnect, upload, publish or video.` });
  return commands[command]();
}

// CLI entry
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop())) {
  run(process.argv.slice(2))
    .then((result) => {
      console.log(`RESULT ${JSON.stringify(result)}`);
    })
    .catch((e) => {
      const result = e.result ?? { ok: false, error: e.code ?? "ERROR", message: e.message };
      console.error(`Error: ${result.message}`);
      for (const p of result.problems ?? []) console.error(`  - ${p}`);
      console.log(`RESULT ${JSON.stringify(result)}`);
      process.exitCode = e.exitCode ?? 1;
    });
}
