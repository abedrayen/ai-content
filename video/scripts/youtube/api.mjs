// Thin wrappers around the YouTube Data API v3 calls this tool needs.
import { ApiError, apiError, withRetry } from "./http.mjs";

const API = "https://www.googleapis.com/youtube/v3";
const UPLOAD = "https://www.googleapis.com/upload/youtube/v3";

export function makeApi({ fetchFn = fetch, getToken, wait }) {
  const authed = async (url, init = {}) => {
    const token = await getToken();
    return withRetry(() => fetchFn(url, { ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` } }), { wait });
  };
  return {
    /** The channel owned by the authorised account (needs youtube.readonly). */
    async myChannel() {
      const res = await authed(`${API}/channels?part=snippet&mine=true`);
      if (!res.ok) throw await apiError(res, "channels.list failed");
      const ch = (await res.json()).items?.[0];
      if (!ch) throw new ApiError("This Google account has no YouTube channel.", { code: "NO_CHANNEL" });
      return { id: ch.id, title: ch.snippet.title, customUrl: ch.snippet.customUrl ?? null };
    },
    /** Status of one of our videos: privacy, upload and processing state. */
    async video(id) {
      const res = await authed(`${API}/videos?part=status,processingDetails,snippet&id=${encodeURIComponent(id)}`);
      if (!res.ok) throw await apiError(res, "videos.list failed");
      const v = (await res.json()).items?.[0];
      if (!v) return null;
      return {
        id: v.id,
        title: v.snippet?.title,
        privacyStatus: v.status?.privacyStatus,
        uploadStatus: v.status?.uploadStatus,
        failureReason: v.status?.failureReason ?? null,
        rejectionReason: v.status?.rejectionReason ?? null,
        publishAt: v.status?.publishAt ?? null,
        processingStatus: v.processingDetails?.processingStatus ?? null,
      };
    },
    async setThumbnail(id, buf, mime) {
      const res = await authed(`${UPLOAD}/thumbnails/set?videoId=${encodeURIComponent(id)}&uploadType=media`, {
        method: "POST",
        headers: { "Content-Type": mime, "Content-Length": String(buf.length) },
        body: buf,
      });
      if (!res.ok) throw await apiError(res, "thumbnails.set failed");
    },
    /** Change privacy (needs youtube.force-ssl). Sends the full status object: omitted fields are cleared. */
    async updateStatus(id, status) {
      const res = await authed(`${API}/videos?part=status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw await apiError(res, "videos.update failed");
      return (await res.json()).status;
    },
  };
}

export const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
export const studioUrl = (id) => `https://studio.youtube.com/video/${id}/edit`;
