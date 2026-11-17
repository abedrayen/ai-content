// HTTP with exponential backoff for transient failures only.
export const RETRYABLE = new Set([500, 502, 503, 504]);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class ApiError extends Error {
  constructor(message, { status, reason, code } = {}) {
    super(message);
    this.status = status;
    this.reason = reason;
    this.code = code;
  }
}

/** Google error bodies: { error: { code, message, errors: [{ reason }] } } */
export async function apiError(res, context) {
  let body = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON body */
  }
  const e = body.error ?? {};
  const reason = e.errors?.[0]?.reason ?? (typeof e === "string" ? e : undefined);
  const msg = typeof e === "object" ? e.message : body.error_description;
  return new ApiError(`${context}: HTTP ${res.status}${reason ? ` (${reason})` : ""}${msg ? ` — ${msg}` : ""}`, {
    status: res.status,
    reason,
  });
}

/**
 * Calls fn() until it returns a non-retryable response. Retries 5xx, 429 with
 * Retry-After, and network errors, with exponential backoff + jitter.
 * fn must be safe to repeat (no request that can create a second video).
 */
export async function withRetry(fn, { retries = 5, baseMs = 1000, wait = sleep, onRetry = () => {} } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res;
    let err;
    try {
      res = await fn();
    } catch (e) {
      err = e;
    }
    const transient = err || RETRYABLE.has(res.status) || (res.status === 429 && res.headers.get("retry-after"));
    if (!transient) return res;
    if (attempt >= retries) {
      if (err) throw new ApiError(`Network error after ${retries} retries: ${err.message}`, { code: "NETWORK" });
      return res;
    }
    const retryAfter = res?.headers?.get?.("retry-after");
    const delay = retryAfter ? Number(retryAfter) * 1000 : baseMs * 2 ** attempt + Math.floor(Math.random() * 250);
    onRetry({ attempt: attempt + 1, delay, status: res?.status, error: err?.message });
    await wait(delay);
  }
}
