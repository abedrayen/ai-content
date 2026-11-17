import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { scaleFor } from "../brand/tokens";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** One consistent reveal curve for every animated element (0 → 1). */
export const useReveal = (atSeconds: number, durSeconds = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [atSeconds * fps, (atSeconds + durSeconds) * fps], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
};

/** Pure version of useReveal for use inside loops. */
export const reveal = (frame: number, fps: number, atSeconds: number, durSeconds = 0.8) =>
  interpolate(frame, [atSeconds * fps, (atSeconds + durSeconds) * fps], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

/** Scene-wide progress 0 → 1 with gentle in/out easing (for camera moves). */
export const useSceneProgress = (startFrac = 0, endFrac = 0.85) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [startFrac * durationInFrames, endFrac * durationInFrames], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
};

/** Frame geometry shared by all scenes. */
export const useFrame = () => {
  const { width, height } = useVideoConfig();
  return { width, height, s: scaleFor(width, height), portrait: height > width };
};
