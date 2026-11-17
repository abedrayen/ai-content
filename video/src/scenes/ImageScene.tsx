import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, scaleFor } from "../brand/tokens";

type Props = { src: string; caption?: string; credit: string; isReconstruction: boolean };

/**
 * Full-bleed still with a slow push-in. `src` is relative to productions/
 * (the Remotion public dir). Reconstructions are always badged.
 */
export const ImageScene: React.FC<Props> = ({ src, caption, credit, isReconstruction }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const s = scaleFor(width, height);

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.07]);
  const fade = interpolate(frame, [0.4 * fps, 1.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.midnight }}>
      <Img
        name="Scene image"
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: `${zoom}` }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, transparent 50%, ${colors.midnight}E6 100%)`,
        }}
      />
      {isReconstruction ? (
        <div
          style={{
            position: "absolute",
            top: 100 * s,
            left: 80 * s,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 24 * s,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.offWhite,
            backgroundColor: `${colors.midnight}CC`,
            padding: `${10 * s}px ${18 * s}px`,
            borderLeft: `${3 * s}px solid ${colors.gold}`,
          }}
        >
          Reconstruction · not archival
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 80 * s,
          right: 80 * s,
          bottom: 110 * s,
          opacity: fade,
        }}
      >
        {caption ? (
          <div
            style={{
              fontFamily: fonts.serif,
              fontWeight: 500,
              fontSize: 60 * s,
              lineHeight: 1.2,
              color: colors.offWhite,
              marginBottom: 20 * s,
            }}
          >
            {caption}
          </div>
        ) : null}
        <div style={{ fontFamily: fonts.sans, fontSize: 28 * s, color: colors.mist }}>{credit}</div>
      </div>
    </AbsoluteFill>
  );
};
