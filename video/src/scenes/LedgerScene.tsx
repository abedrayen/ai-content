import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../brand/tokens";
import { Backdrop } from "./Backdrop";
import { reveal, useFrame } from "./anim";

type Props = { leftHeading: string; rightHeading: string; left: string[]; right: string[] };

/** Two columns built line by line: the left list first, then the right. */
export const LedgerScene: React.FC<Props> = ({ leftHeading, rightHeading, left, right }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { s, portrait } = useFrame();
  const total = left.length + right.length;
  const step = Math.max(0.7, (durationInFrames / fps - 2.5) / (total + 1));

  const column = (heading: string, items: string[], offset: number, accent: string) => (
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 28 * s,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
          paddingBottom: 18 * s,
          borderBottom: `${2 * s}px solid ${accent}88`,
          opacity: reveal(frame, fps, 0.3 + offset * step),
        }}
      >
        {heading}
      </div>
      {items.map((it, i) => {
        const p = reveal(frame, fps, 0.8 + (offset + i) * step, 0.7);
        return (
          <div
            key={i}
            style={{
              fontFamily: fonts.serif,
              fontWeight: 500,
              fontSize: (portrait ? 46 : 44) * s,
              lineHeight: 1.22,
              color: colors.offWhite,
              marginTop: 26 * s,
              opacity: p,
              translate: `0 ${(1 - p) * 14 * s}px`,
              textWrap: "balance",
            }}
          >
            {it}
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
          padding: portrait ? `${170 * s}px ${80 * s}px` : `${120 * s}px ${140 * s}px`,
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          gap: (portrait ? 70 : 110) * s,
          justifyContent: "center",
        }}
      >
        {column(leftHeading, left, 0, colors.gold)}
        {column(rightHeading, right, left.length, colors.mist)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
