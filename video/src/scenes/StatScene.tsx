import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../brand/tokens";
import { Backdrop } from "./Backdrop";
import { useFrame, useReveal } from "./anim";

type Props = { value: string; countTo?: number; label: string; sourceNote?: string };

/** A single figure with a restrained count-up and a gold rule. */
export const StatScene: React.FC<Props> = ({ value, countTo, label, sourceNote }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useFrame();
  const valueIn = useReveal(0.2, 0.6);
  const labelIn = useReveal(0.9);
  const noteIn = useReveal(1.5);

  let shown = value;
  if (countTo !== undefined) {
    const n = interpolate(frame, [0.2 * fps, 1.6 * fps], [0, countTo], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const [prefix, suffix] = value.split(/[\d,.]+/);
    shown = `${prefix ?? ""}${Math.round(n).toLocaleString("en-US")}${suffix ?? ""}`;
  }

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: 100 * s }}>
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 200 * s,
            lineHeight: 1,
            color: colors.offWhite,
            opacity: valueIn,
            scale: `${0.96 + 0.04 * valueIn}`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {shown}
        </div>
        <div style={{ width: 200 * s, height: 2 * s, background: colors.gold, margin: `${36 * s}px 0`, scale: `${labelIn} 1` }} />
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 500,
            fontSize: 60 * s,
            lineHeight: 1.2,
            color: colors.offWhite,
            opacity: labelIn,
            maxWidth: 1300 * s,
            textWrap: "balance",
          }}
        >
          {label}
        </div>
        {sourceNote ? (
          <div style={{ marginTop: 28 * s, fontFamily: fonts.sans, fontSize: 32 * s, color: colors.mist, opacity: noteIn }}>
            {sourceNote}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
