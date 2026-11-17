import { AbsoluteFill } from "remotion";
import { colors, fonts } from "../brand/tokens";
import { Backdrop } from "./Backdrop";
import { useFrame, useReveal } from "./anim";

type Props = { author: string; work: string; written: string; text: string; gap?: string };

/**
 * An ancient written source shown as a document: who wrote it, where and when.
 * The text is a paraphrase or short quotation, presented as a claim made by the
 * author, never illustrated as an event.
 */
export const SourceScene: React.FC<Props> = ({ author, work, written, text, gap }) => {
  const { s, portrait } = useFrame();
  const cardIn = useReveal(0.2, 0.9);
  const textIn = useReveal(0.9, 1.0);
  const gapIn = useReveal(2.0);

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? 80 * s : 140 * s }}>
        <div
          style={{
            maxWidth: 1400 * s,
            width: "100%",
            padding: `${60 * s}px ${70 * s}px`,
            background: `linear-gradient(160deg, #F2EDE40F 0%, #F2EDE405 100%)`,
            border: `${1.5 * s}px solid ${colors.gold}66`,
            borderRadius: 4 * s,
            opacity: cardIn,
            translate: `0 ${(1 - cardIn) * 20 * s}px`,
            boxShadow: `0 ${30 * s}px ${90 * s}px rgba(0,0,0,0.45)`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: 26 * s,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: colors.gold,
            }}
          >
            Ancient written source
          </div>
          <div style={{ fontFamily: fonts.serif, fontWeight: 600, fontSize: 64 * s, color: colors.offWhite, marginTop: 18 * s }}>
            {author}
          </div>
          <div style={{ fontFamily: fonts.sans, fontSize: 32 * s, color: colors.mist, marginTop: 6 * s }}>
            {work} · {written}
          </div>
          <div style={{ height: 1.5 * s, background: `${colors.gold}55`, margin: `${36 * s}px 0` }} />
          <div
            style={{
              fontFamily: fonts.serif,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: (portrait ? 52 : 50) * s,
              lineHeight: 1.3,
              color: colors.offWhite,
              opacity: textIn,
              textWrap: "pretty",
            }}
          >
            {text}
          </div>
        </div>
        {gap ? (
          <div
            style={{
              marginTop: 40 * s,
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: 28 * s,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.gold,
              border: `${1.5 * s}px solid ${colors.gold}`,
              padding: `${12 * s}px ${22 * s}px`,
              borderRadius: 4 * s,
              opacity: gapIn,
            }}
          >
            {gap}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
