// Single source of truth for production data. Used by the Remotion templates
// AND by scripts/check-production.mjs (run directly by Node), so this file
// must only import "zod" and use erasable TypeScript syntax (no enums).
import { z } from "zod";

/**
 * Mystery without misinformation: every claim carries one of these labels.
 * - fact: verified; no on-screen badge
 * - interpretation: a contested reading held by named scholars; always shown
 *   with its attribution, never as fact
 * - hypothesis / open-question / speculation: badged on screen
 */
export const claimLabel = z.enum([
  "fact",
  "interpretation",
  "open-question",
  "hypothesis",
  "speculation",
]);
export type ClaimLabel = z.infer<typeof claimLabel>;

const needsAttribution = (label: ClaimLabel | null, attribution: string | undefined) =>
  label === "interpretation" && !attribution?.trim();

// ---------- claims.json (gate 2: research & source verification) ----------

export const source = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  publisher: z.string().optional(),
  year: z.string().optional(),
  url: z.string().optional(),
  /** e.g. page, chapter, timestamp */
  locator: z.string().optional(),
  kind: z.enum(["primary", "peer-reviewed", "institutional", "book", "journalism", "other"]),
  accessed: z.string().optional(),
});

export const claim = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "use lowercase-kebab ids"),
    text: z.string().min(1),
    label: claimLabel,
    /** Who holds this view, e.g. "Smith et al. 2011, 2013". Required for interpretations. */
    attribution: z.string().optional(),
    sources: z.array(source),
    /** Set to true only by a human who has checked the sources support the claim. */
    verified: z.boolean(),
    notes: z.string().optional(),
    /**
     * Researcher's source review (may be done by Claude). Never implies human
     * sign-off: only `verified` does.
     */
    review: z
      .object({
        status: z.enum([
          "verified-by-source-review",
          "partially-supported",
          "disputed",
          "unsupported",
          "requires-human-verification",
        ]),
        reviewedOn: z.string(),
        evidence: z.string(),
      })
      .optional(),
  })
  .refine((c) => !needsAttribution(c.label, c.attribution), {
    message: "interpretation claims need an attribution",
    path: ["attribution"],
  });

export const claimsFile = z.object({ claims: z.array(claim) });

// ---------- assets.json (gate 6: assets & licensing) ----------

export const asset = z.object({
  /** Path relative to productions/, exactly as used in storyboard.json */
  path: z.string().min(1),
  description: z.string().min(1),
  origin: z.string().min(1),
  licence: z.string().min(1),
  commercialUseAllowed: z.boolean(),
  attributionRequired: z.boolean(),
  attributionText: z.string().optional(),
  aiGenerated: z.boolean(),
  // Attribution metadata (TASL). The checker requires all four when attributionRequired.
  title: z.string().optional(),
  author: z.string().optional(),
  sourceUrl: z.string().optional(),
  licenceUrl: z.string().optional(),
});

export const assetsFile = z.object({ assets: z.array(asset) });

// ---------- storyboard.json (gate 5: drives the video templates) ----------

const base = {
  /** Readable name shown in the Studio timeline */
  name: z.string().min(1),
  durationInSeconds: z.number().positive(),
};

export const titleScene = z.object({
  ...base,
  type: z.literal("title"),
  kicker: z.string().optional(),
  heading: z.string().min(1),
});

export const statementScene = z.object({
  ...base,
  type: z.literal("statement"),
  text: z.string().min(1),
  /** id in claims.json; null = no factual claim (e.g. a hook question) */
  claimId: z.string().nullable(),
  /** Must match the claim's label; non-fact labels are shown on screen. */
  label: claimLabel.nullable(),
  /** Shown on screen for interpretations; must match the claim's attribution. */
  attribution: z.string().optional(),
  sourceNote: z.string().optional(),
});

export const imageScene = z.object({
  ...base,
  type: z.literal("image"),
  src: z.string().min(1),
  caption: z.string().optional(),
  credit: z.string().min(1),
  /** AI or artistic reconstruction: always badged, never passed off as archival. */
  isReconstruction: z.boolean(),
  /**
   * "cover" (default): full-bleed, cropped, slow push-in, text over the image.
   * "contain": the whole image, unmodified, text placed outside it. Required
   * for share-alike assets (see licensing-audit.md).
   */
  fit: z.enum(["cover", "contain"]).optional(),
});

// ---------- animated explanatory scenes ----------
// `claimIds` link a scene's on-screen facts to claims.json (checked by the checker).
const claimIds = z.array(z.string()).optional();
const lonLat = z.tuple([z.number(), z.number()]);

/** Animated Natural Earth map: camera move, sequential markers, optional great-circle arcs. */
export const mapScene = z.object({
  ...base,
  type: z.literal("map"),
  title: z.string().optional(),
  view: z.object({
    from: z.object({ center: lonLat, scale: z.number().positive() }),
    to: z.object({ center: lonLat, scale: z.number().positive() }),
  }),
  markers: z.array(
    z.object({
      label: z.string(),
      at: lonLat,
      appearAt: z.number().min(0),
      kind: z.enum(["primary", "site", "uncertain"]),
    }),
  ),
  arcs: z.array(z.object({ from: lonLat, to: lonLat, label: z.string().optional(), appearAt: z.number().min(0) })).optional(),
  note: z.string().optional(),
  claimIds,
});

/** Timeline that draws itself and reveals events in order. */
export const timelineScene = z.object({
  ...base,
  type: z.literal("timeline"),
  title: z.string().optional(),
  events: z.array(z.object({ date: z.string(), label: z.string(), claimId: z.string().optional() })).min(2).max(7),
  claimIds,
});

const compareSide = z.object({
  heading: z.string(),
  claimId: z.string(),
  attribution: z.string(),
  points: z.array(z.string()).min(1).max(4),
});

/** Two attributed interpretations side by side, with identical layout and timing. */
export const compareScene = z.object({
  ...base,
  type: z.literal("compare"),
  title: z.string().optional(),
  left: compareSide,
  right: compareSide,
  footer: z.string().optional(),
  /** Extra claims behind individual points (beyond each side's main claimId). */
  claimIds,
});

/** One number or short fact, with motion emphasis. */
export const statScene = z.object({
  ...base,
  type: z.literal("stat"),
  value: z.string(),
  /** Numeric part to count up to (optional); `value` is shown when the count completes. */
  countTo: z.number().optional(),
  label: z.string(),
  sourceNote: z.string().optional(),
  claimId: z.string(),
});

/** An ancient written source, presented as a text, never as an event. */
export const sourceScene = z.object({
  ...base,
  type: z.literal("source"),
  author: z.string(),
  work: z.string(),
  written: z.string(),
  text: z.string(),
  gap: z.string().optional(),
  claimId: z.string(),
});

/** Simplified explanatory diagrams. Always labelled as schematic. */
export const diagramScene = z.object({
  ...base,
  type: z.literal("diagram"),
  variant: z.enum(["neonatal-line", "shrinkage"]),
  caption: z.string(),
  claimIds,
});

/** Two columns built line by line (e.g. "shows" vs "cannot show"). */
export const ledgerScene = z.object({
  ...base,
  type: z.literal("ledger"),
  leftHeading: z.string(),
  rightHeading: z.string(),
  left: z.array(z.string()).min(1).max(4),
  right: z.array(z.string()).min(1).max(4),
  claimIds,
});

export const scene = z.discriminatedUnion("type", [
  titleScene,
  statementScene,
  imageScene,
  mapScene,
  timelineScene,
  compareScene,
  statScene,
  sourceScene,
  diagramScene,
  ledgerScene,
]);
export type Scene = z.infer<typeof scene>;

/** An audio file relative to productions/, registered in assets.json like any asset. */
export const audioTrack = z.object({
  src: z.string().min(1),
  /** 0–1. Music under narration is typically 0.15–0.3. */
  volume: z.number().min(0).max(1),
});

export const storyboard = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    format: z.enum(["short", "long"]),
    scenes: z.array(scene).min(1),
    /** Optional. Both tracks start at frame 0; the music fades out over the last 2 s. */
    audio: z
      .object({
        narration: audioTrack.optional(),
        music: audioTrack.optional(),
      })
      .optional(),
  })
  .superRefine((sb, ctx) => {
    sb.scenes.forEach((s, i) => {
      if (s.type === "statement" && needsAttribution(s.label, s.attribution)) {
        ctx.addIssue({
          code: "custom",
          message: "interpretation scenes need an attribution",
          path: ["scenes", i, "attribution"],
        });
      }
    });
  });
export type Storyboard = z.infer<typeof storyboard>;
