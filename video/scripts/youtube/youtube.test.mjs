// Mocked tests: no network, no DPAPI, no browser, nothing reaches YouTube.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { run } from "./cli.mjs";
import { withRetry } from "./http.mjs";
import { makeTokenSource } from "./oauth.mjs";
import { secretsDir, secretFiles } from "./paths.mjs";
import { insertBody, tagsLength, validateMetadata } from "./release.mjs";
import { resumableUpload } from "./upload.mjs";
import { makeVault } from "./vault.mjs";

const plain = { encrypt: (s) => Buffer.from(s), decrypt: (b) => b.toString() };
const vault = makeVault(plain);
const noWait = async () => {};
const json = (status, body, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
const empty = (status, headers = {}) => new Response(null, { status, headers });

const META = {
  title: "Test title", description: "Test description", tags: ["a", "b c"], categoryId: "27", defaultLanguage: "en",
  defaultAudioLanguage: "en", license: "youtube", embeddable: true, publicStatsViewable: true,
  selfDeclaredMadeForKids: false, containsSyntheticMedia: false, thumbnail: null,
};
const passing = (target) => ({ target, blocking: 0, gates: [3, 5, 6, 7].map((g) => ({ gate: g, name: `g${g}`, human: false, required: true, ok: true, problems: [] })).concat([1, 2, 4, 9, 10].map((g) => ({ gate: g, name: `g${g}`, human: true, required: true, ok: true, problems: [] }))) });
const failingGate = (target, gate) => { const r = passing(target); r.gates.find((g) => g.gate === gate).ok = false; r.gates.find((g) => g.gate === gate).problems = ["broken"]; return r; };
const APPROVAL_OK = `Platforms: YouTube
Final render file (short): renders/short.mp4
Licensing risk accepted (A7–A8): accepted by editor
AI disclosure decision (containsSyntheticMedia true/false): false
YouTube publication approved (short): yes — editor, 2026-11-18
`;

/** A throwaway production + secrets dir + fake YouTube. */
function setup({ approval = "", channelId = "UC_A", accountChannel = "UC_A", lockPrivate = false, renderBytes = 300_000, meta = {} } = {}) {
  const base = mkdtempSync(join(tmpdir(), "thw-yt-"));
  const root = join(base, "productions");
  const dir = join(root, "test-prod");
  mkdirSync(join(dir, "renders"), { recursive: true });
  const render = Buffer.alloc(renderBytes, 7);
  writeFileSync(join(dir, "renders", "short.mp4"), render);
  const sha = createHash("sha256").update(render).digest("hex");
  writeFileSync(join(dir, "youtube.json"), JSON.stringify({ formats: { short: { ...META, render: "renders/short.mp4", acceptedSha256: sha, ...meta } } }));
  writeFileSync(join(dir, "approval.md"), approval);
  const env = { THW_SECRETS_DIR: join(base, "secrets") };
  const files = secretFiles(secretsDir(env));
  mkdirSync(join(base, "secrets"), { recursive: true });
  writeFileSync(files.client, JSON.stringify({ installed: { client_id: "cid", client_secret: "csecret" } }));
  vault.write(files.token, { access_token: "AT", refresh_token: "RT", expires_at: Date.now() + 3600_000, scope: "x" });
  writeFileSync(files.account, JSON.stringify({ channelId: accountChannel, channelTitle: "Mine", scopes: [] }));

  const calls = [];
  let received = Buffer.alloc(0);
  let uploadedPrivacy;
  const fetchFn = async (url, init = {}) => {
    calls.push({ url, method: init.method ?? "GET", headers: init.headers, body: init.body });
    if (url.includes("/channels")) return json(200, { items: [{ id: channelId, snippet: { title: "Chan" } }] });
    if (url.includes("uploadType=resumable")) {
      uploadedPrivacy = JSON.parse(init.body).status.privacyStatus;
      return empty(200, { location: "https://upload.example/session/1" });
    }
    if (url.startsWith("https://upload.example/session/1")) {
      received = Buffer.concat([received, Buffer.from(init.body ?? [])]);
      return json(201, { id: "VID1", status: { privacyStatus: uploadedPrivacy, uploadStatus: "uploaded" } });
    }
    if (url.includes("/videos?part=status,processingDetails")) {
      return json(200, { items: [{ id: "VID1", snippet: { title: "t" }, status: { privacyStatus: lockPrivate ? "private" : uploadedPrivacy ?? "private", uploadStatus: "uploaded" }, processingDetails: { processingStatus: "processing" } }] });
    }
    throw new Error(`unexpected fetch ${url}`);
  };
  const deps = { fetchFn, codec: plain, env, productionsRoot: root, log: () => {}, wait: noWait, probe: () => ({ dims: "1080x1920", seconds: 59 }) };
  return { base, dir, env, files, calls, deps, sha, received: () => received };
}

test("secrets directory is refused inside the repo or OneDrive", () => {
  assert.throws(() => secretsDir({ THW_SECRETS_DIR: "C:\\Users\\x\\OneDrive\\secrets" }), /OneDrive/);
  assert.throws(() => secretsDir({ THW_SECRETS_DIR: "C:\\Users\\x\\OneDrive - Contoso\\s" }), /OneDrive/);
  assert.throws(() => secretsDir({ THW_SECRETS_DIR: "C:\\repo\\secrets" }, "C:\\repo"), /inside the repository/);
  assert.match(secretsDir({ LOCALAPPDATA: "C:\\Users\\x\\AppData\\Local" }), /TheHiddenWorld\\secrets$/);
});

test("missing OAuth client file gives a clear error", async () => {
  const t = setup();
  writeFileSync(t.files.client, "{}");
  await assert.rejects(run(["connect"], t.deps), /not a Desktop app client/);
  const t2 = setup();
  const { rmSync } = await import("node:fs");
  rmSync(t2.files.client);
  await assert.rejects(run(["connect"], t2.deps), /No OAuth client found/);
});

test("metadata limits follow the documented YouTube rules", () => {
  assert.equal(tagsLength(["Foo Baz"]), 9); // spaces count as quoted
  assert.equal(tagsLength(["Foo-Baz"]), 7);
  const dir = tmpdir();
  assert.deepEqual(validateMetadata(META, { dir, forPublic: true }), []);
  assert.ok(validateMetadata({ ...META, title: "x".repeat(101) }, { dir }).some((p) => /max 100/.test(p)));
  assert.ok(validateMetadata({ ...META, title: "a <b>" }, { dir }).some((p) => /< or >/.test(p)));
  assert.ok(validateMetadata({ ...META, description: "é".repeat(2501) }, { dir }).some((p) => /max 5000/.test(p)));
  assert.ok(validateMetadata({ ...META, tags: Array(60).fill("abcdefghi") }, { dir }).some((p) => /max 500/.test(p)));
  assert.ok(validateMetadata({ ...META, containsSyntheticMedia: null }, { dir, forPublic: true }).some((p) => /undecided/.test(p)));
  assert.deepEqual(validateMetadata({ ...META, containsSyntheticMedia: null }, { dir, forPublic: false }), []);
});

test("privacy is always explicit (YouTube defaults to public if omitted)", () => {
  assert.equal(insertBody(META, "private").status.privacyStatus, "private");
  assert.throws(() => insertBody(META, undefined), /invalid privacy/);
  assert.equal("containsSyntheticMedia" in insertBody({ ...META, containsSyntheticMedia: null }, "private").status, false);
});

test("expired access token is refreshed and persisted; revoked refresh token forces reconnect", async () => {
  const dir = mkdtempSync(join(tmpdir(), "thw-tok-"));
  const tokenPath = join(dir, "t.dpapi");
  vault.write(tokenPath, { access_token: "OLD", refresh_token: "RT", expires_at: 0 });
  const ok = async () => json(200, { access_token: "NEW", expires_in: 3600 });
  const src = makeTokenSource({ client: { clientId: "c" }, vault, tokenPath, fetchFn: ok });
  assert.equal(await src(), "NEW");
  assert.equal(vault.read(tokenPath).refresh_token, "RT");
  vault.write(tokenPath, { access_token: "OLD", refresh_token: "RT", expires_at: 0 });
  const revoked = async () => json(400, { error: "invalid_grant", error_description: "Token has been expired or revoked." });
  const src2 = makeTokenSource({ client: { clientId: "c" }, vault, tokenPath, fetchFn: revoked });
  await assert.rejects(src2(), (e) => e.code === "REAUTH" && /youtube:connect/.test(e.message));
  assert.equal(existsSync(tokenPath), false);
});

test("status reports not connected without credentials", async () => {
  const t = setup();
  vault.remove(t.files.token);
  assert.deepEqual(await run(["status"], t.deps), { ok: false, connected: false });
});

test("wrong channel is detected before any upload", async () => {
  const t = setup({ channelId: "UC_OTHER", accountChannel: "UC_A" });
  await assert.rejects(run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) }), (e) => e.result.error === "WRONG_CHANNEL");
  assert.equal(t.calls.some((c) => c.url.includes("uploadType=resumable")), false);
});

test("missing render blocks the upload", async () => {
  const t = setup();
  const { rmSync } = await import("node:fs");
  rmSync(join(t.dir, "renders", "short.mp4"));
  await assert.rejects(run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) }), (e) => e.result.problems.some((p) => /render not found/.test(p)));
});

test("a render that differs from the accepted file is refused", async () => {
  const t = setup({ meta: { acceptedSha256: "0".repeat(64) } });
  await assert.rejects(run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) }), (e) => e.result.problems.some((p) => /differs from the accepted file/.test(p)));
});

test("invalid metadata blocks the upload", async () => {
  const t = setup({ meta: { title: "" } });
  await assert.rejects(run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) }), (e) => e.result.problems.includes("title is empty"));
});

test("a failing technical production gate blocks even a private upload", async () => {
  const t = setup();
  await assert.rejects(run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: () => failingGate("render", 6) }), (e) => e.result.error === "GATES");
  assert.equal(t.calls.length, 0);
});

test("private upload: explicit PRIVATE, ledger recorded, session cleaned, then duplicates prevented", async () => {
  const t = setup();
  const r = await run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) });
  assert.equal(r.privacy, "private");
  assert.equal(r.videoId, "VID1");
  assert.equal(JSON.parse(t.calls.find((c) => c.url.includes("uploadType=resumable")).body).status.privacyStatus, "private");
  assert.equal(t.received().length, 300_000);
  const ledger = JSON.parse(readFileSync(join(t.dir, "youtube-uploads.json"), "utf8"));
  assert.equal(ledger.uploads.length, 1);
  assert.equal(ledger.uploads[0].renderSha256, t.sha);
  assert.equal(ledger.uploads[0].lastKnown.processingStatus, "processing");
  const r2 = await run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) });
  assert.equal(r2.duplicatePrevented, true);
  assert.equal(t.calls.filter((c) => c.url.includes("uploadType=resumable")).length, 1);
});

test("public publish requires --confirm-publication and every approval line", async () => {
  const t = setup({ approval: APPROVAL_OK });
  await assert.rejects(run(["publish", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) }), (e) => e.result.problems.includes("missing --confirm-publication"));
  const t2 = setup({ approval: APPROVAL_OK.replace("yes — editor", "no") });
  await assert.rejects(run(["publish", "test-prod", "--format", "short", "--confirm-publication"], { ...t2.deps, runChecker: (_s, t) => passing(t) }), (e) => e.result.problems.some((p) => /must start with "yes"/.test(p)));
  const t3 = setup({ approval: APPROVAL_OK });
  await assert.rejects(run(["publish", "test-prod", "--format", "short", "--confirm-publication"], { ...t3.deps, runChecker: () => failingGate("publish", 2) }), (e) => e.result.problems.some((p) => /gate 2/.test(p)));
  for (const x of [t, t2, t3]) assert.equal(x.calls.some((c) => c.url.includes("uploadType=resumable")), false);
});

test("approved publish uploads PUBLIC and reports success only after YouTube confirms", async () => {
  const t = setup({ approval: APPROVAL_OK });
  const r = await run(["publish", "test-prod", "--format", "short", "--confirm-publication"], { ...t.deps, runChecker: (_s, t) => passing(t) });
  assert.equal(r.privacy, "public");
  assert.equal(r.status.privacyStatus, "public");
  const again = await run(["publish", "test-prod", "--format", "short", "--confirm-publication"], { ...t.deps, runChecker: (_s, t) => passing(t) });
  assert.equal(again.duplicatePrevented, true);
});

test("publish is not reported as success when YouTube keeps the video private", async () => {
  const t = setup({ approval: APPROVAL_OK, lockPrivate: true });
  await assert.rejects(run(["publish", "test-prod", "--format", "short", "--confirm-publication"], { ...t.deps, runChecker: (_s, t) => passing(t) }), (e) => e.exitCode === 4 && e.result.error === "NOT_PUBLIC");
});

test("publish refuses to duplicate an existing private review upload", async () => {
  const t = setup({ approval: APPROVAL_OK });
  await run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) });
  await assert.rejects(run(["publish", "test-prod", "--format", "short", "--confirm-publication"], { ...t.deps, runChecker: (_s, t) => passing(t) }), (e) => e.result.error === "PRIVATE_COPY_EXISTS");
  assert.equal(t.calls.filter((c) => c.url.includes("uploadType=resumable")).length, 1);
});

test("video status distinguishes processing, private and scheduled", async () => {
  const t = setup();
  await run(["upload", "test-prod", "--format", "short"], { ...t.deps, runChecker: (_s, t) => passing(t) });
  const lines = [];
  const r = await run(["video", "test-prod"], { ...t.deps, log: (m) => lines.push(m) });
  assert.equal(r.uploads[0].status.processingStatus, "processing");
  assert.match(lines.join("\n"), /private; upload uploaded; processing processing/);
});

// ---------- resumable protocol ----------
function fakeSession({ size, failAt = new Set(), networkAt = new Set(), completeOnQuery = false, expired = false }) {
  let have = 0;
  let put = 0;
  const log = [];
  const fetchFn = async (url, init) => {
    if (url.includes("uploadType=resumable")) return empty(200, { location: "S" });
    const cr = init.headers["Content-Range"];
    log.push(cr);
    if (expired) return empty(404);
    if (cr.startsWith("bytes */")) {
      if (completeOnQuery) return json(201, { id: "DONE" });
      return have ? empty(308, { range: `bytes=0-${have - 1}` }) : empty(308);
    }
    put++;
    if (networkAt.has(put)) throw new Error("ECONNRESET");
    if (failAt.has(put)) return empty(503);
    const [, start, end] = cr.match(/bytes (\d+)-(\d+)\//).map(Number);
    assert.equal(start, have, "chunks must continue exactly where the server stopped");
    have = end + 1;
    return have >= size ? json(201, { id: "VID" }) : empty(308, { range: `bytes=0-${have - 1}` });
  };
  return { fetchFn, log, received: () => have };
}

function tempFile(size) {
  const p = join(mkdtempSync(join(tmpdir(), "thw-up-")), "f.mp4");
  writeFileSync(p, Buffer.alloc(size, 1));
  return p;
}

test("resumable upload retries transient 503 and network errors, resuming at the server's offset", async () => {
  const size = 256 * 1024 * 5 + 1000;
  const s = fakeSession({ size, failAt: new Set([2]), networkAt: new Set([4]) });
  let saved;
  const r = await resumableUpload({ fetchFn: s.fetchFn, getToken: async () => "AT", filePath: tempFile(size), size, metadata: {}, session: null, saveSession: (x) => (saved = x), wait: noWait, chunkSize: 256 * 1024 });
  assert.equal(r.video.id, "VID");
  assert.equal(s.received(), size);
  assert.equal(saved.uri, "S");
  assert.ok(s.log.some((l) => l.startsWith("bytes */")), "status was checked after failures");
});

test("an interrupted upload resumes the saved session instead of starting a new video", async () => {
  const size = 256 * 1024 * 4;
  const file = tempFile(size);
  // Run 1: the network drops after the first chunk, until retries are exhausted.
  const s = fakeSession({ size, networkAt: new Set([2, 3, 4, 5, 6, 7, 8, 9, 10]) });
  let saved;
  await assert.rejects(
    resumableUpload({ fetchFn: s.fetchFn, getToken: async () => "AT", filePath: file, size, metadata: {}, session: null, saveSession: (x) => (saved = x), wait: noWait, chunkSize: 256 * 1024, maxRetries: 2 }),
    (e) => e.code === "INTERRUPTED",
  );
  const partial = s.received();
  assert.ok(partial > 0 && partial < size);
  assert.equal(saved.uri, "S");
  // Run 2: same server state, saved session. Must resume at the server offset and never start a new session.
  let inits = 0;
  const resume = async (url, init) => {
    if (url.includes("uploadType=resumable")) inits++;
    return fakeContinue(url, init);
  };
  let have = partial;
  const fakeContinue = async (url, init) => {
    const cr = init.headers["Content-Range"];
    if (cr.startsWith("bytes */")) return empty(308, { range: `bytes=0-${have - 1}` });
    const [, start, end] = cr.match(/bytes (\d+)-(\d+)\//).map(Number);
    assert.equal(start, have, "resumed exactly at the server offset");
    have = end + 1;
    return have >= size ? json(201, { id: "VID" }) : empty(308, { range: `bytes=0-${have - 1}` });
  };
  const r = await resumableUpload({ fetchFn: resume, getToken: async () => "AT", filePath: file, size, metadata: {}, session: saved, saveSession: () => assert.fail("must not create a new session"), wait: noWait, chunkSize: 256 * 1024 });
  assert.equal(inits, 0);
  assert.equal(r.resumed, true);
  assert.equal(have, size);
});

test("a session that already completed returns the existing video (no second upload)", async () => {
  const size = 1000;
  const s = fakeSession({ size, completeOnQuery: true });
  const r = await resumableUpload({ fetchFn: s.fetchFn, getToken: async () => "AT", filePath: tempFile(size), size, metadata: {}, session: { uri: "S" }, saveSession: () => assert.fail("no new session"), wait: noWait });
  assert.equal(r.video.id, "DONE");
  assert.deepEqual(s.log, [`bytes */${size}`]);
});

test("an expired session is reported and never silently restarted", async () => {
  const s = fakeSession({ size: 1000, expired: true });
  await assert.rejects(
    resumableUpload({ fetchFn: s.fetchFn, getToken: async () => "AT", filePath: tempFile(1000), size: 1000, metadata: {}, session: { uri: "S" }, saveSession: () => {}, wait: noWait }),
    (e) => e.code === "SESSION_EXPIRED",
  );
});

test("withRetry backs off on 503 then gives up with the last response", async () => {
  let n = 0;
  const delays = [];
  const res = await withRetry(async () => (n++, empty(503)), { retries: 3, baseMs: 1000, wait: async (d) => delays.push(d) });
  assert.equal(res.status, 503);
  assert.equal(n, 4);
  assert.ok(delays[1] > delays[0] && delays[2] > delays[1]);
});
