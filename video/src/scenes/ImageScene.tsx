import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, scaleFor } from "../brand/tokens";

type Props = {
  src: string;
  caption?: string;
  credit: string;
  isReconstruction: boolean;
  fit?: "cover" | "contain";
};

/** `src` is relative to productions/ (the Remotion public dir). Reconstructions are always badged. */
export const ImageScene: React.FC<Props> = ({ fit = "cover", ...props }) =>
  fit === "contain" ? <ContainedImage {...props} /> : <FullBleedImage {...props} />;

type InnerProps = Omit<Props, "fit">;

const useTextFade = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [0.4 * fps, 1.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Full-bleed, cropped, slow push-in; text over a bottom gradient. */
const FullBleedImage: React.FC<InnerProps> = ({ src, caption, credit, isReconstruction }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const s = scaleFor(width, height);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.07]);
  const fade = useTextFade();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.midnight }}>
      <Img
        name="Scene image"
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: `${zoom}` }}
      />
      <AbsoluteFill
        style={{ background: `linear-gradient(180deg, transparent 50%, ${colors.midnight}E6 100%)` }}
      />
      {isReconstruction ? <ReconstructionBadge s={s} /> : null}
      <div style={{ position: "absolute", left: 80 * s, right: 80 * s, bottom: 110 * s, opacity: fade }}>
        <CaptionBlock caption={caption} credit={credit} s={s} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * The whole image, uncropped and unaltered, shown like a mounted print: nothing
 * is drawn over its pixels and the text sits outside it. Portrait frames stack
 * image above text; landscape frames place text beside the image.
 * The gentle 2% scale-up happens inside a margin, so the image is never cut off.
 */
const ContainedImage: React.FC<InnerProps> = ({ src, caption, credit, isReconstruction }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const s = scaleFor(width, height);
  const portrait = height > width;
  const settle = interpolate(frame, [0, durationInFrames], [1, 1.02]);
  const fade = useTextFade();

  const plate: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    scale: `${settle}`,
    outline: `${1.5 * s}px solid ${colors.gold}40`,
    outlineOffset: 10 * s,
    boxShadow: `0 ${24 * s}px ${80 * s}px rgba(0,0,0,0.55)`,
  };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at ${portrait ? "50% 40%" : "30% 50%"}, ${colors.ocean} 0%, ${colors.midnight} 70%)`,
      }}
    >
      {isReconstruction ? <ReconstructionBadge s={s} /> : null}
      {portrait ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 150 * s,
              left: 110 * s,
              right: 110 * s,
              bottom: 520 * s,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img name="Scene image" src={staticFile(src)} style={plate} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 90 * s,
              right: 90 * s,
              bottom: 150 * s,
              height: 300 * s,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              textAlign: "center",
              opacity: fade,
            }}
          >
            <CaptionBlock caption={caption} credit={credit} s={s} centered />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: 90 * s,
              bottom: 90 * s,
              left: 0.08 * width,
              width: 0.42 * width,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img name="Scene image" src={staticFile(src)} style={plate} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0.56 * width,
              right: 0.08 * width,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: fade,
            }}
          >
            <CaptionBlock caption={caption} credit={credit} s={s} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const CaptionBlock: React.FC<{ caption?: string; credit: string; s: number; centered?: boolean }> = ({
  caption,
  credit,
  s,
  centered,
}) => (
  <>
    {caption ? (
      <div
        style={{
          fontFamily: fonts.serif,
          fontWeight: 500,
          fontSize: 56 * s,
          lineHeight: 1.18,
          color: colors.offWhite,
          marginBottom: 22 * s,
          textWrap: "balance",
        }}
      >
        {caption}
      </div>
    ) : null}
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 500,
        fontSize: 30 * s,
        lineHeight: 1.35,
        color: colors.mist,
        borderTop: `${1.5 * s}px solid ${colors.gold}66`,
        paddingTop: 16 * s,
        alignSelf: centered ? "center" : "flex-start",
        textWrap: "balance",
      }}
    >
      {credit}
    </div>
  </>
);

const ReconstructionBadge: React.FC<{ s: number }> = ({ s }) => (
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
      zIndex: 1,
    }}
  >
    Reconstruction · not archival
  </div>
);
