import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

// Both fonts are SIL Open Font License 1.1 (commercial use permitted).
// Recorded in docs/licences.md.
const serif = loadSerif("normal", { weights: ["500", "600"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const colors = {
  midnight: "#0B1426",
  ocean: "#0E2A47",
  teal: "#0F4C5C",
  gold: "#C9A45C",
  offWhite: "#F2EDE4",
  mist: "#9FB3C8",
} as const;

export const fonts = {
  serif: serif.fontFamily,
  sans: sans.fontFamily,
} as const;

/** Frames used for every scene-to-scene crossfade. Kept short and restrained. */
export const TRANSITION_FRAMES = 15;

/**
 * Sizes are authored for a 1080px short edge and scaled by this factor,
 * so the same scene works in 9:16 shorts and 16:9 long-form.
 */
export const scaleFor = (width: number, height: number) =>
  Math.min(width, height) / 1080;
