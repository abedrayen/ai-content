// Resumable upload (YouTube resumable upload protocol).
// The session URI is persisted (encrypted) before any bytes are sent, so an
// interrupted run resumes the same session: it can never create a second video.
import { openSync, readSync, closeSync } from "node:fs";
import { ApiError, apiError, RETRYABLE, sleep } from "./http.mjs";

const INIT = "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";
export const CHUNK = 256 * 1024 * 32; // 8 MiB, a multiple of 256 KiB as required

const rangeEnd = (res) => {
  const r = res.headers.get("range"); // "bytes=0-999999" (0-indexed, inclusive)
  return r ? Number(r.split("-")[1]) + 1 : 0;
};

/**
 * Ask the server how much of the session it has. Returns { offset } or
 * { video } if the upload already completed, or throws SESSION_EXPIRED.
 */
async function sessionStatus({ fetchFn, uri, size, token }) {
  const res = await fetchFn(uri, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Length": "0", "Content-Range": `bytes */${size}` },
  });
  if (res.status === 200 || res.status === 201) return { video: await res.json() };
  if (res.status === 308) return { offset: rangeEnd(res) };
  if (res.status === 404 || res.status === 410) {
    throw new ApiError("The saved upload session has expired. Re-run with --restart-upload to start a new session.", { code: "SESSION_EXPIRED" });
  }
  if (RETRYABLE.has(res.status)) return { retry: true };
  throw await apiError(res, "Upload status check failed");
}

export async function resumableUpload({
  fetchFn = fetch,
  getToken,
  filePath,
  size,
  metadata,
  session, // { uri } from a previous interrupted run, or null
  saveSession,
  onProgress = () => {},
  log = () => {},
  wait = sleep,
  maxRetries = 8,
  chunkSize = CHUNK,
}) {
  let token = await getToken();
  let uri = session?.uri;
  let offset = 0;

  if (uri) {
    log("Resuming the saved upload session…");
    const st = await sessionStatus({ fetchFn, uri, size, token });
    if (st.video) return { video: st.video, resumed: true };
    offset = st.offset ?? 0;
  } else {
    const res = await fetchFn(INIT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": String(size),
        "X-Upload-Content-Type": "video/mp4",
      },
      body: JSON.stringify(metadata),
    });
    if (!res.ok) throw await apiError(res, "Could not start the upload");
    uri = res.headers.get("location");
    if (!uri) throw new ApiError("YouTube did not return an upload session URI.");
    saveSession({ uri, startedAt: new Date().toISOString() });
  }

  const fd = openSync(filePath, "r");
  try {
    let failures = 0;
    while (true) {
      const end = Math.min(offset + chunkSize, size);
      const buf = Buffer.alloc(end - offset);
      readSync(fd, buf, 0, buf.length, offset);
      let res;
      try {
        res = await fetchFn(uri, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Length": String(buf.length), "Content-Range": `bytes ${offset}-${end - 1}/${size}` },
          body: buf,
        });
      } catch (e) {
        res = { status: 0, error: e };
      }
      if (res.status === 200 || res.status === 201) {
        onProgress(size, size);
        return { video: await res.json(), resumed: Boolean(session) };
      }
      if (res.status === 308) {
        offset = rangeEnd(res);
        failures = 0;
        onProgress(offset, size);
        continue;
      }
      if (res.status === 401) {
        token = await getToken(); // access token expired mid-upload
        continue;
      }
      if (res.status !== 0 && !RETRYABLE.has(res.status)) throw await apiError(res, "Upload failed");
      // Transient: back off, then ask the server where to resume.
      if (++failures > maxRetries) throw new ApiError("Upload interrupted too many times. Re-run the same command to resume.", { code: "INTERRUPTED" });
      const delay = 1000 * 2 ** (failures - 1) + Math.floor(Math.random() * 250);
      log(`Transient upload error (${res.status || res.error?.message}); retrying in ${Math.round(delay / 1000)}s…`);
      await wait(delay);
      const st = await sessionStatus({ fetchFn, uri, size, token });
      if (st.video) return { video: st.video, resumed: true };
      if (!st.retry) offset = st.offset;
    }
  } finally {
    closeSync(fd);
  }
}
