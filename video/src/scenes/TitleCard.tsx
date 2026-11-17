import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, scaleFor } from "../brand/tokens";
import { Backdrop } from "./Backdrop";

type Props = { kicker?: string; heading: string };

export const TitleCard: React.FC<Props> = ({ kicker, heading }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = scaleFor(width, height);
  const ease = { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const rise = interpolate(frame, [0, 1.2 * fps], [24, 0], ease);
  const fade = interpolate(frame, [0, 1.2 * fps], [0, 1], ease);
  const rule = interpolate(frame, [0.4 * fps, 1.6 * fps], [0, 1], ease);

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: `${100 * s}px ${90 * s}px`,
          textAlign: "center",
          opacity: fade,
          translate: `0 ${rise * s}px`,
        }}
      >
        {kicker ? (
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: 34 * s,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: colors.gold,
              marginBottom: 36 * s,
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 104 * s,
            lineHeight: 1.08,
            color: colors.offWhite,
            maxWidth: 1600 * s,
          }}
        >
          {heading}
        </div>
        <div
          style={{
            marginTop: 44 * s,
            height: 2 * s,
            width: 220 * s,
            backgroundColor: colors.gold,
            scale: `${rule} 1`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
