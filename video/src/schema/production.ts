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
});

export const scene = z.discriminatedUnion("type", [titleScene, statementScene, imageScene]);
export type Scene = z.infer<typeof scene>;

export const storyboard = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    format: z.enum(["short", "long"]),
    scenes: z.array(scene).min(1),
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
