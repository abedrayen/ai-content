// Where things live. Secrets are always outside the repository and outside OneDrive.
import { homedir } from "node:os";
import { join, resolve } from "node:path";

export const REPO_ROOT = resolve(import.meta.dirname, "../../..");
export const PRODUCTIONS = join(REPO_ROOT, "productions");
export const CHECKER = join(REPO_ROOT, "video", "scripts", "check-production.mjs");

/**
 * %LOCALAPPDATA%\TheHiddenWorld\secrets by default; THW_SECRETS_DIR overrides it.
 * Refuses any location inside the repo or a OneDrive-synchronised folder.
 */
export function secretsDir(env = process.env, repoRoot = REPO_ROOT) {
  const base = env.THW_SECRETS_DIR || join(env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "TheHiddenWorld", "secrets");
  const dir = resolve(base);
  const lower = dir.toLowerCase().replace(/\//g, "\\");
  if (lower.startsWith(resolve(repoRoot).toLowerCase().replace(/\//g, "\\"))) {
    throw new Error(`Refusing to use a secrets directory inside the repository: ${dir}`);
  }
  if (/\\onedrive( - [^\\]+)?(\\|$)/i.test(lower)) {
    throw new Error(`Refusing to use a secrets directory inside OneDrive: ${dir}`);
  }
  return dir;
}

export const secretFiles = (dir) => ({
  client: join(dir, "client_secret.json"), // Desktop OAuth client, downloaded from Google Cloud
  token: join(dir, "youtube-token.dpapi"), // encrypted (Windows DPAPI, current user)
  account: join(dir, "youtube-account.json"), // channel id/title + granted scopes (no secrets)
  sessions: join(dir, "upload-sessions"), // encrypted resumable-upload session URIs
});
