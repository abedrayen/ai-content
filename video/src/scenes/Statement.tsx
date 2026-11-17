import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, scaleFor } from "../brand/tokens";
import type { ClaimLabel } from "../schema/production";
import { Backdrop } from "./Backdrop";
import { LabelBadge } from "./LabelBadge";

type Props = { text: string; label: ClaimLabel | null; sourceNote?: string };

export const Statement: React.FC<Props> = ({ text, label, sourceNote }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = scaleFor(width, height);
  const ease = { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const fade = interpolate(frame, [0, 0.9 * fps], [0, 1], ease);
  const rise = interpolate(frame, [0, 0.9 * fps], [18, 0], ease);
  const noteFade = interpolate(frame, [0.8 * fps, 1.6 * fps], [0, 1], ease);

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: `${110 * s}px ${90 * s}px`,
          gap: 40 * s,
        }}
      >
        <div style={{ opacity: fade }}>
          <LabelBadge label={label} s={s} />
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 500,
            fontSize: 72 * s,
            lineHeight: 1.22,
            color: colors.offWhite,
            maxWidth: 1500 * s,
            opacity: fade,
            translate: `0 ${rise * s}px`,
          }}
        >
          {text}
        </div>
        {sourceNote ? (
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28 * s,
              color: colors.mist,
              opacity: noteFade,
            }}
          >
            {sourceNote}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
