// Release logic: metadata, render identity, gates, and the upload ledger.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CHECKER, PRODUCTIONS } from "./paths.mjs";

export const FORMATS = { short: { dims: "1080x1920", shortsMaxSeconds: 180 }, long: { dims: "1920x1080" } };

export function loadProduction(slug, root = PRODUCTIONS) {
  const dir = join(root, slug);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !existsSync(dir)) throw new Error(`Unknown production "${slug}".`);
  const ytPath = join(dir, "youtube.json");
  if (!existsSync(ytPath)) throw new Error(`${slug} has no youtube.json (publishing metadata).`);
  const youtube = JSON.parse(readFileSync(ytPath, "utf8"));
  const approval = existsSync(join(dir, "approval.md")) ? readFileSync(join(dir, "approval.md"), "utf8") : "";
  return { slug, dir, youtube, approval };
}

export const approvalField = (text, key) =>
  (text.match(new RegExp(`^${key.replace(/[()]/g, "\\$&")}:[ \\t]*(.+)$`, "mi"))?.[1] ?? "").trim();

/** YouTube counts a tag containing a space as if quoted; commas between tags count too. */
export const tagsLength = (tags) => tags.reduce((n, t) => n + t.length + (/\s/.test(t) ? 2 : 0), 0) + Math.max(0, tags.length - 1);

/** Validates metadata against YouTube's documented limits. Returns a list of problems. */
export function validateMetadata(meta, { dir, forPublic }) {
  const p = [];
  if (!meta) return ["no metadata for this format in youtube.json"];
  if (!meta.title?.trim()) p.push("title is empty");
  else if ([...meta.title].length > 100) p.push(`title is ${[...meta.title].length} characters (max 100)`);
  if (/[<>]/.test(meta.title ?? "")) p.push("title contains < or >");
  if (!meta.description?.trim()) p.push("description is empty");
  else if (Buffer.byteLength(meta.description) > 5000) p.push(`description is ${Buffer.byteLength(meta.description)} bytes (max 5000)`);
  if (/[<>]/.test(meta.description ?? "")) p.push("description contains < or >");
  if (!Array.isArray(meta.tags)) p.push("tags must be a list");
  else {
    if (tagsLength(meta.tags) > 500) p.push(`tags total ${tagsLength(meta.tags)} characters (max 500)`);
    if (meta.tags.some((t) => /[<>]/.test(t))) p.push("a tag contains < or >");
  }
  if (!/^\d+$/.test(meta.categoryId ?? "")) p.push("categoryId must be a numeric string (27 = Education)");
  if (!meta.defaultLanguage) p.push("defaultLanguage is missing");
  if (!["youtube", "creativeCommon"].includes(meta.license)) p.push('license must be "youtube" or "creativeCommon"');
  if (typeof meta.selfDeclaredMadeForKids !== "boolean") p.push("selfDeclaredMadeForKids must be true or false");
  if (meta.containsSyntheticMedia !== null && typeof meta.containsSyntheticMedia !== "boolean")
    p.push("containsSyntheticMedia must be true, false or null");
  if (forPublic && typeof meta.containsSyntheticMedia !== "boolean")
    p.push("containsSyntheticMedia is undecided (null): the editor must decide the AI-disclosure setting before public release");
  if (meta.thumbnail) {
    const t = join(dir, meta.thumbnail);
    if (!existsSync(t)) p.push(`thumbnail not found: ${meta.thumbnail}`);
    else {
      if (!/\.(png|jpe?g)$/i.test(t)) p.push("thumbnail must be PNG or JPEG");
      if (statSync(t).size > 2 * 1024 * 1024) p.push("thumbnail is larger than 2 MB");
    }
  }
  return p;
}

export const sha256File = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
export const sha256Text = (text) => createHash("sha256").update(text).digest("hex");

/** The render must exist, be the exact file the editor accepted, and have the format's dimensions. */
export function checkRender(prod, format, { probe = ffprobe } = {}) {
  const meta = prod.youtube.formats?.[format];
  const p = [];
  if (!meta?.render) return { problems: ["no render path for this format in youtube.json"] };
  const path = join(prod.dir, meta.render);
  if (!existsSync(path)) return { problems: [`render not found: ${meta.render}`] };
  const sha = sha256File(path);
  if (!meta.acceptedSha256) p.push("youtube.json has no acceptedSha256 for this render");
  else if (sha !== meta.acceptedSha256) p.push(`render differs from the accepted file (sha256 ${sha.slice(0, 12)}… ≠ ${meta.acceptedSha256.slice(0, 12)}…)`);
  const info = probe(path);
  if (info.dims !== FORMATS[format].dims) p.push(`render is ${info.dims}, expected ${FORMATS[format].dims}`);
  if (format === "short" && info.seconds > FORMATS.short.shortsMaxSeconds) p.push(`Short is ${info.seconds}s (> 180 s, would not be a Short)`);
  return { problems: p, path, sha, size: statSync(path).size, ...info };
}

export function ffprobe(path) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", path], { encoding: "utf8" });
  if (r.error) throw new Error("ffprobe is required to verify renders");
  const j = JSON.parse(r.stdout || "{}");
  const s = j.streams?.[0] ?? {};
  return { dims: `${s.width}x${s.height}`, seconds: Math.round(Number(j.format?.duration ?? 0) * 10) / 10 };
}

export function runChecker(slug, target, { spawn = spawnSync } = {}) {
  const r = spawn(process.execPath, [CHECKER, slug, "--for", target, "--json"], { encoding: "utf8" });
  try {
    return JSON.parse(r.stdout);
  } catch {
    throw new Error(`The production checker did not return a report (exit ${r.status}).`);
  }
}

/** Private review uploads: technical gates and metadata only (no publication). */
export function privateUploadProblems(prod, format, { checker, render }) {
  const p = [];
  for (const g of checker.gates.filter((x) => !x.human && [3, 5, 6, 7].includes(x.gate) && !x.ok))
    p.push(`checker gate ${g.gate} (${g.name}) fails: ${g.problems.join("; ")}`);
  p.push(...render.problems);
  p.push(...validateMetadata(prod.youtube.formats?.[format], { dir: prod.dir, forPublic: false }));
  return p;
}

/** Public release: every checker gate for publish, plus explicit per-format approval lines. */
export function publicReleaseProblems(prod, format, { checker, render, confirmed }) {
  const p = [];
  if (!confirmed) p.push("missing --confirm-publication");
  if (checker.target !== "publish") p.push("checker was not run for publish");
  for (const g of checker.gates.filter((x) => x.required && !x.ok))
    p.push(`checker gate ${g.gate} (${g.name})${g.human ? " [human sign-off]" : ""} fails`);
  p.push(...render.problems);
  const meta = prod.youtube.formats?.[format];
  p.push(...validateMetadata(meta, { dir: prod.dir, forPublic: true }));
  const a = (k) => approvalField(prod.approval, k);
  if (!/^yes\b/i.test(a(`YouTube publication approved (${format})`)))
    p.push(`approval.md "YouTube publication approved (${format}):" must start with "yes" (editor's explicit approval for this format)`);
  if (!a("Licensing risk accepted (A7–A8)")) p.push('approval.md "Licensing risk accepted (A7–A8):" is empty');
  if (!/youtube/i.test(a("Platforms"))) p.push('approval.md "Platforms:" does not include YouTube');
  if (a(`Final render file (${format})`) !== meta?.render) p.push(`approval.md "Final render file (${format}):" must equal ${meta?.render}`);
  const ai = a("AI disclosure decision (containsSyntheticMedia true/false)").toLowerCase();
  if (!["true", "false"].includes(ai)) p.push('approval.md "AI disclosure decision" must be true or false');
  else if (String(meta?.containsSyntheticMedia) !== ai) p.push("youtube.json containsSyntheticMedia does not match the approved AI disclosure decision");
  return p;
}

/** videos.insert body. Privacy is always explicit: YouTube defaults to public when it is omitted. */
export function insertBody(meta, privacyStatus) {
  if (!["private", "public"].includes(privacyStatus)) throw new Error(`invalid privacy ${privacyStatus}`);
  const status = {
    privacyStatus,
    license: meta.license,
    embeddable: meta.embeddable ?? true,
    publicStatsViewable: meta.publicStatsViewable ?? true,
    selfDeclaredMadeForKids: meta.selfDeclaredMadeForKids,
  };
  if (typeof meta.containsSyntheticMedia === "boolean") status.containsSyntheticMedia = meta.containsSyntheticMedia;
  return {
    snippet: {
      title: meta.title,
      description: meta.description,
      tags: meta.tags,
      categoryId: meta.categoryId,
      defaultLanguage: meta.defaultLanguage,
      defaultAudioLanguage: meta.defaultAudioLanguage ?? meta.defaultLanguage,
    },
    status,
  };
}

// ---------- upload ledger (productions/<slug>/youtube-uploads.json, no secrets) ----------
export const ledgerPath = (prod) => join(prod.dir, "youtube-uploads.json");
export const readLedger = (prod) => (existsSync(ledgerPath(prod)) ? JSON.parse(readFileSync(ledgerPath(prod), "utf8")) : { uploads: [] });
export function writeLedger(prod, ledger) {
  writeFileSync(ledgerPath(prod), JSON.stringify(ledger, null, 2) + "\n");
}
export const uploadKey = (slug, format, sha) => `${slug}:${format}:${sha}`;
export const findUploads = (ledger, key) => ledger.uploads.filter((u) => u.key === key);
