// Encrypted JSON files for tokens and upload sessions.
// Windows DPAPI (CurrentUser scope): only this Windows account on this machine can decrypt.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ps = (op) =>
  "Add-Type -AssemblyName System.Security; " +
  "$b=[Convert]::FromBase64String([Console]::In.ReadToEnd().Trim()); " +
  `$o=[Security.Cryptography.ProtectedData]::${op}($b,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser); ` +
  "[Console]::Out.Write([Convert]::ToBase64String($o))";

function dpapiRun(op, inputB64) {
  const r = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", ps(op)], {
    input: inputB64,
    encoding: "utf8",
    windowsHide: true,
  });
  // Never echo stdout/stderr: they may contain secret material.
  if (r.status !== 0 || r.error) throw new Error(`Windows DPAPI ${op} failed (exit ${r.status ?? "?"})`);
  return r.stdout.trim();
}

export const dpapi = {
  encrypt: (text) => Buffer.from(dpapiRun("Protect", Buffer.from(text, "utf8").toString("base64")), "base64"),
  decrypt: (buf) => Buffer.from(dpapiRun("Unprotect", buf.toString("base64")), "base64").toString("utf8"),
};

/** codec is injectable so tests never touch DPAPI. */
export function makeVault(codec = dpapi) {
  return {
    read(path) {
      if (!existsSync(path)) return null;
      try {
        return JSON.parse(codec.decrypt(readFileSync(path)));
      } catch {
        throw new Error(`Could not decrypt ${path}. It may belong to another Windows user; reconnect to replace it.`);
      }
    },
    write(path, obj) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, codec.encrypt(JSON.stringify(obj)));
    },
    remove(path) {
      rmSync(path, { force: true });
    },
  };
}
