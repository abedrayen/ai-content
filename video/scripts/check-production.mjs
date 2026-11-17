// Gate checker for a production folder.
// Usage: npm run check -- <slug> [--for render|publish]
//   --for render  (default) requires gates 1–6 to pass
//   --for publish requires every automated gate, incl. QA and human approval
// It checks structure and consistency only. It cannot tell whether a source is
// real or supports a claim — that is what the human "verified" flag is for.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { assetsFile, claimsFile, storyboard } from "../src/schema/production.ts";

const USAGE = "Usage: npm run check -- <slug> [--for render|publish]";
const args = process.argv.slice(2);
let slug;
let target = "render";
for (let i = 0; i < args.length; i++) {
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
    if (!c.verified) p2.push(`claim "${c.id}" not marked verified by a human`);
  }
}
gate(2, "Research & sources", p2);

// 3 Script
mdGate(3, "Script", "script.md");

// 4 Editorial review
mdGate(4, "Editorial review", "review.md", (t) =>
  /Decision:\s*approved/i.test(t) ? [] : ["review.md decision is not 'approved'"],
);

// 5 Storyboard — cross-checked against claims
const p5 = [];
const sb = parseJson("storyboard.json", storyboard, p5);
if (sb) {
  if (sb.slug !== slug) p5.push(`storyboard slug "${sb.slug}" ≠ folder "${slug}"`);
  for (const s of sb.scenes) {
    if (JSON.stringify(s).includes("TODO")) p5.push(`scene "${s.name}" still has TODOs`);
    if (s.type !== "statement") continue;
    if (s.claimId === null) {
      if (s.label !== null) p5.push(`scene "${s.name}" has a label but no claimId`);
      continue;
    }
    const c = claimById.get(s.claimId);
    if (!c) p5.push(`scene "${s.name}" references unknown claim "${s.claimId}"`);
    else if (c.label !== s.label) p5.push(`scene "${s.name}" label "${s.label}" ≠ claim label "${c.label}"`);
  }
  const secs = sb.scenes.reduce((t, s) => t + s.durationInSeconds, 0);
  const [min, max] = sb.format === "short" ? [35, 60] : [480, 720];
  if (secs < min || secs > max) p5.push(`total ≈ ${secs.toFixed(1)} s, outside ${min}–${max} s target for ${sb.format}`);
}
gate(5, "Storyboard", p5);

// 6 Assets & licensing
const p6 = [];
const assets = parseJson("assets.json", assetsFile, p6);
if (assets && sb) {
  const byPath = new Map(assets.assets.map((a) => [a.path, a]));
  for (const a of assets.assets) {
    if (!existsSync(resolve(dir, "..", a.path))) p6.push(`asset file missing on disk: ${a.path}`);
    if (!a.commercialUseAllowed) p6.push(`asset not cleared for commercial use: ${a.path}`);
    if (a.attributionRequired && !a.attributionText) p6.push(`attribution required but no text: ${a.path}`);
  }
  for (const s of sb.scenes) {
    if (s.type !== "image") continue;
    const a = byPath.get(s.src);
    if (!a) p6.push(`scene "${s.name}" uses unregistered asset ${s.src}`);
    else if (a.aiGenerated && !s.isReconstruction) p6.push(`scene "${s.name}" shows AI asset without reconstruction badge`);
  }
}
gate(6, "Assets & licences", p6);

// 7–8 not automated yet
gate(7, "Narration & audio", ["not automated yet — check manually"], true);
gate(8, "Edit & render", ["not automated yet — check manually"], true);

// 9 QA
mdGate(9, "Quality assurance", "qa.md", (t) => (/- \[ \]/.test(t) ? ["qa.md has unticked items"] : []));

// 10 Human approval
const appr = read("approval.md") ?? "";
const field = (k) => (appr.match(new RegExp(`^${k}:[ \\t]*(.+)$`, "mi"))?.[1] ?? "").trim();
gate(10, "Human approval", field("Approved by") && field("Date") ? [] : ["approval.md not signed (Approved by / Date)"]);

// ---------- report ----------
const required = target === "publish" ? [1, 2, 3, 4, 5, 6, 9, 10] : [1, 2, 3, 4, 5, 6];
let blocking = 0;
console.log(`\nThe Hidden World — gate check: ${slug}  (for ${target})\n`);
for (const g of gates) {
  const ok = g.problems.length === 0;
  const req = required.includes(g.gate);
  if (!ok && req) blocking++;
  const mark = g.manual ? "·" : ok ? "✔" : req ? "✘" : "○";
  console.log(`${mark} ${String(g.gate).padStart(2)}  ${g.name}`);
  for (const p of g.problems) console.log(`       - ${p}`);
}
console.log(
  blocking
    ? `\n${blocking} required gate(s) failing — not ready to ${target}.\n`
    : `\nAll required gates pass for ${target}.${target === "publish" ? " Publishing remains a manual step." : ""}\n`,
);
process.exit(blocking ? 1 : 0);
