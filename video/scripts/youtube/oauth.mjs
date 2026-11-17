// OAuth 2.0 for installed (Desktop) apps: loopback redirect + PKCE, refresh, revoke.
// The user signs in on Google's own page; this code never sees a password.
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { ApiError, apiError, withRetry } from "./http.mjs";

export const SCOPES = {
  upload: "https://www.googleapis.com/auth/youtube.upload", // videos.insert, thumbnails.set
  readonly: "https://www.googleapis.com/auth/youtube.readonly", // channel identity, video status
  manage: "https://www.googleapis.com/auth/youtube.force-ssl", // only for --promote (videos.update)
};
const TOKEN_URI = "https://oauth2.googleapis.com/token";
const AUTH_URI = "https://accounts.google.com/o/oauth2/v2/auth";
const REVOKE_URI = "https://oauth2.googleapis.com/revoke";

export function loadClient(path) {
  if (!existsSync(path)) {
    throw new ApiError(
      `No OAuth client found at ${path}. Create a Desktop OAuth client in Google Cloud and save its JSON there (docs/youtube-publishing.md §2).`,
      { code: "NO_CLIENT" },
    );
  }
  const j = JSON.parse(readFileSync(path, "utf8"));
  if (!j.installed?.client_id) {
    throw new ApiError("The OAuth client JSON is not a Desktop app client (missing \"installed\"). Create a client of type Desktop app.", {
      code: "WRONG_CLIENT_TYPE",
    });
  }
  return { clientId: j.installed.client_id, clientSecret: j.installed.client_secret };
}

const b64url = (buf) => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export function pkcePair() {
  const verifier = b64url(randomBytes(48)); // 64 chars, within 43–128
  return { verifier, challenge: b64url(createHash("sha256").update(verifier).digest()) };
}

export function authUrl({ clientId, redirectUri, scopes, challenge, state }) {
  const p = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${AUTH_URI}?${p}`;
}

const tokenFromResponse = (j, previous = {}) => ({
  access_token: j.access_token,
  refresh_token: j.refresh_token ?? previous.refresh_token,
  scope: j.scope ?? previous.scope,
  expires_at: Date.now() + (j.expires_in ?? 3600) * 1000,
});

/** Interactive browser authorization. Resolves with a token object. */
export async function authorize({ client, scopes, openBrowser, log, fetchFn = fetch, timeoutMs = 5 * 60_000 }) {
  const { verifier, challenge } = pkcePair();
  const state = b64url(randomBytes(16));
  const server = createServer();
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const redirectUri = `http://127.0.0.1:${server.address().port}`;
  const url = authUrl({ clientId: client.clientId, redirectUri, scopes, challenge, state });
  log(`Opening Google sign-in in your browser. If it doesn't open, paste this URL:\n${url}`);
  openBrowser(url);

  const code = await new Promise((resolveCode, reject) => {
    const timer = setTimeout(() => reject(new ApiError("Timed out waiting for Google authorization.", { code: "TIMEOUT" })), timeoutMs);
    server.on("request", (req, res) => {
      const q = new URL(req.url, redirectUri).searchParams;
      if (!q.has("code") && !q.has("error")) {
        res.writeHead(404).end();
        return;
      }
      const ok = q.get("state") === state && q.has("code");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(ok ? "<p>The Hidden World Studio is connected. You can close this tab.</p>" : "<p>Authorization failed. Return to the terminal.</p>");
      clearTimeout(timer);
      if (ok) resolveCode(q.get("code"));
      else reject(new ApiError(`Authorization was not granted (${q.get("error") ?? "state mismatch"}).`, { code: "DENIED" }));
    });
  }).finally(() => server.close());

  const res = await fetchFn(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: client.clientId,
      client_secret: client.clientSecret ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });
  if (!res.ok) throw await apiError(res, "Token exchange failed");
  const token = tokenFromResponse(await res.json());
  if (!token.refresh_token) throw new ApiError("Google returned no refresh token. Remove the app's access at myaccount.google.com/permissions and reconnect.", { code: "NO_REFRESH" });
  return token;
}

export async function refresh({ client, token, fetchFn = fetch }) {
  const res = await withRetry(() =>
    fetchFn(TOKEN_URI, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: client.clientId,
        client_secret: client.clientSecret ?? "",
        refresh_token: token.refresh_token,
        grant_type: "refresh_token",
      }),
    }),
  );
  if (res.status === 400 || res.status === 401) {
    const e = await apiError(res, "Token refresh failed");
    // invalid_grant: revoked, expired (e.g. 7-day Testing limit), or unused for 6 months.
    throw new ApiError(`${e.message}. Reconnect with: npm run youtube:connect`, { status: res.status, code: "REAUTH" });
  }
  if (!res.ok) throw await apiError(res, "Token refresh failed");
  return tokenFromResponse(await res.json(), token);
}

export async function revoke({ token, fetchFn = fetch }) {
  const res = await fetchFn(REVOKE_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token: token.refresh_token ?? token.access_token }),
  });
  return res.ok || res.status === 400; // 400 = already invalid
}

/** Returns a function that yields a valid access token, refreshing and persisting as needed. */
export function makeTokenSource({ client, vault, tokenPath, fetchFn = fetch, now = Date.now }) {
  return async () => {
    let token = vault.read(tokenPath);
    if (!token) throw new ApiError("YouTube is not connected. Run: npm run youtube:connect", { code: "NOT_CONNECTED" });
    if (!token.access_token || token.expires_at - 60_000 < now()) {
      try {
        token = await refresh({ client, token, fetchFn });
      } catch (e) {
        if (e.code === "REAUTH") vault.remove(tokenPath);
        throw e;
      }
      vault.write(tokenPath, token);
    }
    return token.access_token;
  };
}
