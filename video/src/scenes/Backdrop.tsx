import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../brand/tokens";

/**
 * Atmospheric deep-ocean backdrop: navy gradient, one slowly drifting teal
 * glow, a vignette and faint grain. Deliberately quiet.
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.midnight }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${30 + drift * 40}% ${35 + drift * 10}%, ${colors.teal}55 0%, transparent 55%), linear-gradient(180deg, ${colors.midnight} 0%, ${colors.ocean} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 8} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
