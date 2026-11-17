import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../brand/tokens";
import { Backdrop } from "./Backdrop";
import { reveal, useFrame, useReveal } from "./anim";

type Side = { heading: string; attribution: string; points: string[] };
type Props = { title?: string; left: Side; right: Side; footer?: string };

/**
 * Two attributed interpretations, given identical layout, colour and timing so
 * neither looks favoured. Points on both sides reveal at the same moments.
 */
export const CompareScene: React.FC<Props> = ({ title, left, right, footer }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { s, portrait } = useFrame();
  const titleIn = useReveal(0.2);
  const rows = Math.max(left.points.length, right.points.length);
  const secs = durationInFrames / fps;
  const step = Math.max(0.8, (secs - 3.5) / (rows + 1));
  const footerIn = reveal(frame, fps, 1.2 + (rows + 0.5) * step);

  const card = (side: Side) => (
    <div
      style={{
        flex: 1,
        border: `${1.5 * s}px solid ${colors.gold}55`,
        background: `${colors.midnight}B3`,
        borderRadius: 6 * s,
        padding: `${(portrait ? 40 : 46) * s}px ${(portrait ? 48 : 54) * s}px`,
        opacity: reveal(frame, fps, 0.6),
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 24 * s,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: colors.gold,
        }}
      >
        Interpretation
      </div>
      <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 30 * s, color: colors.mist, marginTop: 8 * s }}>
        {side.attribution}
      </div>
      <div
        style={{
          fontFamily: fonts.serif,
          fontWeight: 600,
          fontSize: (portrait ? 54 : 50) * s,
          lineHeight: 1.12,
          color: colors.offWhite,
          margin: `${22 * s}px 0 ${18 * s}px`,
          textWrap: "balance",
        }}
      >
        {side.heading}
      </div>
      {side.points.map((pt, i) => {
        const p = reveal(frame, fps, 1.2 + i * step, 0.7);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16 * s,
              opacity: p,
              translate: `0 ${(1 - p) * 12 * s}px`,
              fontFamily: fonts.sans,
              fontSize: (portrait ? 34 : 31) * s,
              lineHeight: 1.35,
              color: colors.offWhite,
              marginTop: 14 * s,
            }}
          >
            <span style={{ color: colors.gold }}>—</span>
            <span>{pt}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          padding: portrait ? `${150 * s}px ${70 * s}px ${170 * s}px` : `${90 * s}px ${110 * s}px`,
          display: "flex",
          flexDirection: "column",
          gap: 34 * s,
        }}
      >
        {title ? (
          <div
            style={{
              fontFamily: fonts.serif,
              fontWeight: 600,
              fontSize: 64 * s,
              color: colors.offWhite,
              textAlign: "center",
              opacity: titleIn,
            }}
          >
            {title}
          </div>
        ) : null}
        <div style={{ flex: 1, display: "flex", flexDirection: portrait ? "column" : "row", gap: 40 * s }}>
          {card(left)}
          {card(right)}
        </div>
        {footer ? (
          <div
            style={{
              textAlign: "center",
              fontFamily: fonts.serif,
              fontStyle: "italic",
              fontSize: 44 * s,
              color: colors.offWhite,
              opacity: footerIn,
            }}
          >
            {footer}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
