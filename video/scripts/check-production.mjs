// Gate checker for a production folder.
// Usage: npm run check -- <slug> [--for render|publish]
//   --for render  (default) requires gates 1–6 to pass
//   --for publish requires every automated gate, incl. QA and human approval
// It checks structure and consistency only. It cannot tell whether a source is
// real or supports a claim — that is what the human "verified" flag is for.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const MIN_SCENE_SECONDS = 1.5;
import { assetsFile, claimsFile, storyboard } from "../src/schema/production.ts";

const USAGE = "Usage: npm run check -- <slug> [--for render|publish]";
const args = process.argv.slice(2);
let slug;
let target = "render";
// --json: machine-readable report (used by the YouTube publisher); same gates, same exit code.
const asJson = args.includes("--json");
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--json") continue;
  if (args[i] === "--for") target = args[++i];
  else if (!slug) slug = args[i];
  else target = "invalid";
}
if (!slug || slug.startsWith("--") || !["render", "publish"].includes(target)) {
  console.error(USAGE);
  process.exit(2);
}

// Canonical location: <repo>/productions, resolved from this file (not the cwd).
const root = resolve(import.meta.dirname, "../../productions");
const dir = join(root, slug);
if (!existsSync(dir)) {
  const existing = readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_template")
    .map((d) => d.name);
  console.error(`No production folder: ${dir}`);
  console.error(`Create it first:  npm run new -- ${slug}`);
  console.error(`Existing productions: ${existing.length ? existing.join(", ") : "(none)"}`);
  process.exit(2);
}

const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : null);
const hasTodo = (text) => /\bTODO\b/.test(text);

/** @type {{gate: number, name: string, problems: string[], manual?: boolean}[]} */
const gates = [];
const gate = (n, name, problems, manual = false) => gates.push({ gate: n, name, problems, manual });

const parseJson = (file, schema, problems) => {
  const raw = read(file);
  if (raw === null) return problems.push(`${file} missing`), null;
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    return problems.push(`${file} is not valid JSON: ${e.message}`), null;
  }
  const r = schema.safeParse(json);
  if (!r.success) {
    for (const i of r.error.issues) problems.push(`${file} › ${i.path.join(".") || "(root)"}: ${i.message}`);
    return null;
  }
  return r.data;
};

const mdGate = (n, name, file, extra = () => []) => {
  const text = read(file);
  const p = text === null ? [`${file} missing`] : [...(hasTodo(text) ? [`${file} still has TODOs`] : []), ...extra(text)];
  gate(n, name, p);
};

// 1 Topic validation
mdGate(1, "Topic validation", "brief.md");

// 2 Research & source verification
const p2 = [];
const claims = parseJson("claims.json", claimsFile, p2);
const claimById = new Map();
if (claims) {
  for (const c of claims.claims) {
    if (claimById.has(c.id)) p2.push(`duplicate claim id "${c.id}"`);
    claimById.set(c.id, c);
    if (hasTodo(c.text)) p2.push(`claim "${c.id}" text still TODO`);
    if (c.label !== "speculation" && c.sources.length === 0) p2.push(`claim "${c.id}" (${c.label}) has no sources`);
    // Attribution presence for interpretations is enforced by the schema (claim refine).
    if (!c.verified) p2.push(`claim "${c.id}" not marked verified by a human`);
  }
}
gate(2, "Research & sources", p2);

// 3 Script
const p3 = [];
{
  const text = read("script.md");
  if (text === null) p3.push("script.md missing");
  else if (hasTodo(text)) p3.push("script.md still has TODOs");
}
gate(3, "Script", p3);

// 4 Editorial review
mdGate(4, "Editorial review", "review.md", (t) =>
  /Decision:\s*approved/i.test(t) ? [] : ["review.md decision is not 'approved'"],
);

// 5–8 run once per storyboard: storyboard.json plus any storyboard-<name>.json
// (e.g. storyboard-long.json). Files with "draft" in the name are historical.
const storyboardFiles = readdirSync(dir)
  .filter((f) => /^storyboard(-[a-z0-9]+)?\.json$/.test(f) && !f.includes("draft"))
  .sort((a, b) => (a === "storyboard.json" ? -1 : b === "storyboard.json" ? 1 : a.localeCompare(b)));
const multi = storyboardFiles.length > 1;
const tag = (file) => (multi ? `[${file}] ` : "");

// Every claim a scene puts on screen, with the label/attribution the scene shows.
const sceneClaims = (s) => {
  const refs = [];
  if (s.type === "statement" && s.claimId) refs.push({ id: s.claimId, label: s.label, attribution: s.attribution });
  if ((s.type === "stat" || s.type === "source") && s.claimId) refs.push({ id: s.claimId });
  if (s.type === "compare")
    for (const side of [s.left, s.right]) refs.push({ id: side.claimId, label: "interpretation", attribution: side.attribution });
  if (s.type === "timeline") for (const e of s.events) if (e.claimId) refs.push({ id: e.claimId });
  for (const id of s.claimIds ?? []) refs.push({ id });
  return refs;
};

const p5 = [];
const p6 = [];
const p7 = [];
const p8 = [];
const assets = parseJson("assets.json", assetsFile, p6);
const byPath = new Map((assets?.assets ?? []).map((a) => [a.path, a]));
for (const a of assets?.assets ?? []) {
  if (!existsSync(resolve(dir, "..", a.path))) p6.push(`asset file missing on disk: ${a.path}`);
  if (!a.commercialUseAllowed) p6.push(`asset not cleared for commercial use: ${a.path}`);
  if (a.attributionRequired && !a.attributionText) p6.push(`attribution required but no text: ${a.path}`);
  if (a.attributionRequired)
    for (const k of ["title", "author", "sourceUrl", "licenceUrl"])
      if (!a[k]?.trim()) p6.push(`attribution required but "${k}" missing: ${a.path}`);
  for (const k of ["sourceUrl", "licenceUrl"])
    if (a[k] && !/^https?:\/\//.test(a[k])) p6.push(`invalid ${k} (not a URL): ${a.path}`);
  if (/\bCC\b|creative commons/i.test(a.licence) && a.licenceUrl && !a.licenceUrl.startsWith("https://creativecommons.org/"))
    p6.push(`Creative Commons licence but licenceUrl is not a creativecommons.org link: ${a.path}`);
}
const appr = read("approval.md") ?? "";
const esc = (k) => k.replace(/[()]/g, "\\$&");
const field = (k) => (appr.match(new RegExp(`^${esc(k)}:[ \\t]*(.+)$`, "mi"))?.[1] ?? "").trim();
if (storyboardFiles.length === 0) p5.push("no storyboard.json");

for (const file of storyboardFiles) {
  const t = tag(file);
  const sb = parseJson(file, storyboard, p5);
  if (!sb) continue;
  if (sb.slug !== slug) p5.push(`${t}storyboard slug "${sb.slug}" ≠ folder "${slug}"`);
  for (const s of sb.scenes) {
    if (JSON.stringify(s).includes("TODO")) p5.push(`${t}scene "${s.name}" still has TODOs`);
    // Each scene overlaps its neighbours by a 0.5 s crossfade on both sides.
    if (s.durationInSeconds < MIN_SCENE_SECONDS)
      p5.push(`${t}scene "${s.name}" is ${s.durationInSeconds} s; minimum is ${MIN_SCENE_SECONDS} s (crossfades overlap both ends)`);
    if (s.type === "image" && !s.caption?.trim()) p5.push(`${t}image scene "${s.name}" has no caption saying what the image shows`);
    if (s.type === "statement" && s.claimId === null && s.label !== null) p5.push(`${t}scene "${s.name}" has a label but no claimId`);
    for (const ref of sceneClaims(s)) {
      const c = claimById.get(ref.id);
      if (!c) {
        p5.push(`${t}scene "${s.name}" references unknown claim "${ref.id}"`);
        continue;
      }
      if (ref.label !== undefined && c.label !== ref.label)
        p5.push(`${t}scene "${s.name}" label "${ref.label}" ≠ claim "${c.id}" label "${c.label}"`);
      else if (c.label === "interpretation" && ref.attribution !== undefined && ref.attribution?.trim() !== c.attribution?.trim())
        p5.push(`${t}scene "${s.name}" attribution "${ref.attribution ?? ""}" ≠ claim "${c.id}" attribution "${c.attribution}"`);
      // Reported under gate 2 (human verification), keeping gate 5 purely technical.
      const msg = `${t}on screen in scene "${s.name}": claim "${c.id}" is not yet verified`;
      if (!c.verified && !p2.includes(msg)) p2.push(msg);
    }
  }
  // Rendered length = scene durations minus the 0.5 s crossfade overlaps (what viewers see).
  const secs = sb.scenes.reduce((sum, s) => sum + s.durationInSeconds, 0) - 0.5 * (sb.scenes.length - 1);
  const [min, max] = sb.format === "short" ? [35, 60] : [480, 720];
  if (secs < min || secs > max) p5.push(`${t}rendered length ≈ ${secs.toFixed(1)} s, outside ${min}–${max} s target for ${sb.format}`);

  for (const [kind, track] of Object.entries(sb.audio ?? {}))
    if (track && !byPath.has(track.src)) p6.push(`${t}${kind} audio uses unregistered asset ${track.src}`);
  for (const s of sb.scenes) {
    if (s.type !== "image") continue;
    const a = byPath.get(s.src);
    if (!a) {
      p6.push(`${t}scene "${s.name}" uses unregistered asset ${s.src}`);
      continue;
    }
    if (a.aiGenerated && !s.isReconstruction) p6.push(`${t}scene "${s.name}" shows AI asset without reconstruction badge`);
    if (a.attributionRequired && a.author && !s.credit.includes(a.author))
      p6.push(`${t}scene "${s.name}" on-screen credit does not name the author "${a.author}"`);
    // licensing-audit.md: share-alike images are shown in full and unmodified.
    if (/BY-SA/i.test(a.licence) && s.fit !== "contain")
      p6.push(`${t}scene "${s.name}" shows share-alike asset cropped; use "fit": "contain"`);
  }

  // 7 — a final render needs a narration track.
  if (!sb.audio?.narration) p7.push(`${t}no narration track (audio.narration)`);

  // 8 — the render named in approval.md for this format must exist with the right size.
  const key = multi ? `Final render file (${sb.format})` : "Final render file";
  const renderFile = field(key);
  const want = sb.format === "short" ? "1080x1920" : "1920x1080";
  if (!renderFile) p8.push(`${t}approval.md '${key}' not set`);
  else if (!existsSync(join(dir, renderFile))) p8.push(`${t}final render not found: ${renderFile}`);
  else {
    const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=s=x:p=0", join(dir, renderFile)], { encoding: "utf8" });
    const m = probe.stdout?.match(/(\d+)\D+(\d+)/);
    const got = m ? `${m[1]}x${m[2]}` : null;
    if (probe.error) p8.push(`${t}cannot verify render dimensions: ffprobe not available`);
    else if (got !== want) p8.push(`${t}final render is ${got ?? "unreadable"}, expected ${want}`);
  }

  // 3 — each extra storyboard needs its own script (storyboard-long.json → script-long.md).
  if (file !== "storyboard.json") {
    const scriptFile = file.replace("storyboard", "script").replace(".json", ".md");
    const text = read(scriptFile);
    if (text === null) p3.push(`${scriptFile} missing for ${file}`);
    else if (hasTodo(text)) p3.push(`${scriptFile} still has TODOs`);
  }
}
gate(5, "Storyboard", p5);
gate(6, "Assets & licences", p6);
gate(7, "Narration & audio", p7);
gate(8, "Edit & render", p8);

// 9 QA
mdGate(9, "Quality assurance", "qa.md", (t) => (/- \[ \]/.test(t) ? ["qa.md has unticked items"] : []));

// 10 Human approval
gate(10, "Human approval", field("Approved by") && field("Date") ? [] : ["approval.md not signed (Approved by / Date)"]);

// ---------- report ----------
const required = target === "publish" ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3, 4, 5, 6, 7];
// Gates whose pass condition is a person's sign-off, not a technical check.
const HUMAN = new Set([1, 2, 4, 9, 10]);
let blocking = 0;
if (asJson) {
  const report = gates.map((g) => ({
    gate: g.gate,
    name: g.name,
    human: HUMAN.has(g.gate),
    required: required.includes(g.gate),
    ok: g.problems.length === 0,
    problems: g.problems,
  }));
  blocking = report.filter((g) => g.required && !g.ok).length;
  console.log(JSON.stringify({ slug, target, blocking, gates: report }));
  process.exit(blocking ? 1 : 0);
}
console.log(`\nThe Hidden World — gate check: ${slug}  (for ${target})\n`);
for (const g of gates) {
  const ok = g.problems.length === 0;
  const req = required.includes(g.gate);
  if (!ok && req) blocking++;
  const mark = g.manual ? "·" : ok ? "✔" : req ? "✘" : "○";
  console.log(`${mark} ${String(g.gate).padStart(2)}  ${g.name}${HUMAN.has(g.gate) ? "  [human sign-off]" : ""}`);
  for (const p of g.problems) console.log(`       - ${p}`);
}
console.log(
  blocking
    ? `\n${blocking} required gate(s) failing — not ready to ${target}.\n`
    : `\nAll required gates pass for ${target}.${target === "publish" ? " Publishing remains a manual step." : ""}\n`,
);
process.exit(blocking ? 1 : 0);
