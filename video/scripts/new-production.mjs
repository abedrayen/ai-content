// Create a new production folder from productions/_template.
// Usage: npm run new -- <slug>     (slug: lowercase-kebab, e.g. "carthage-tophet")
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: npm run new -- <lowercase-kebab-slug>");
  process.exit(2);
}
const root = resolve(import.meta.dirname, "../../productions");
const dest = join(root, slug);
if (existsSync(dest)) {
  console.error(`Already exists: ${dest}`);
  process.exit(1);
}
cpSync(join(root, "_template"), dest, { recursive: true });
for (const f of ["storyboard.json", "assets.json"]) {
  const p = join(dest, f);
  writeFileSync(p, readFileSync(p, "utf8").replaceAll("_template", slug));
}
console.log(`Created productions/${slug}. Start with brief.md (gate 1).`);
