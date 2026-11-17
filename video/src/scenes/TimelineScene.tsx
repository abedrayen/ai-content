import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../brand/tokens";
import { Backdrop } from "./Backdrop";
import { reveal, useFrame, useReveal } from "./anim";

type Props = { title?: string; events: { date: string; label: string }[] };

/**
 * A line that draws itself while events appear in order, evenly spread over the
 * scene. Horizontal in 16:9, vertical in 9:16.
 */
export const TimelineScene: React.FC<Props> = ({ title, events }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { width, height, s, portrait } = useFrame();
  const titleIn = useReveal(0.2);
  const secs = durationInFrames / fps;
  const first = 0.8;
  const step = Math.max(0.6, (secs - first - 1.5) / events.length);
  const lineP = reveal(frame, fps, first - 0.3, step * events.length);

  const pad = (portrait ? 110 : 160) * s;
  const top = (portrait ? 420 : 470) * s;
  // Landscape: equal columns; each event's dot sits at its column's left edge,
  // so the last label always stays inside the frame.
  const col = (width - 2 * pad) / events.length;
  const lineSpan = col * (events.length - 1) + 30 * s;

  return (
    <AbsoluteFill>
      <Backdrop />
      {title ? (
        <div
          style={{
            position: "absolute",
            top: (portrait ? 150 : 110) * s,
            left: pad,
            right: pad,
            textAlign: portrait ? "center" : "left",
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 66 * s,
            color: colors.offWhite,
            opacity: titleIn,
          }}
        >
          {title}
        </div>
      ) : null}
      {portrait ? (
        <div style={{ position: "absolute", top, bottom: 220 * s, left: 200 * s, width: 3 * s }}>
          <div style={{ width: "100%", height: `${lineP * 100}%`, background: colors.gold, opacity: 0.6 }} />
        </div>
      ) : (
        <div style={{ position: "absolute", top: top + 18 * s, left: pad, width: lineSpan, height: 3 * s }}>
          <div style={{ height: "100%", width: `${lineP * 100}%`, background: colors.gold, opacity: 0.6 }} />
        </div>
      )}
      {events.map((e, i) => {
        const p = reveal(frame, fps, first + i * step, 0.7);
        const frac = events.length === 1 ? 0 : i / (events.length - 1);
        const pos: React.CSSProperties = portrait
          ? { top: top + frac * (height - top - 220 * s) - 20 * s, left: 186 * s, right: 90 * s }
          : { top, left: pad + i * col, width: col - 30 * s };
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              opacity: p,
              translate: portrait ? `${(1 - p) * 20 * s}px 0` : `0 ${(1 - p) * 20 * s}px`,
              display: "flex",
              flexDirection: portrait ? "row" : "column",
              gap: (portrait ? 34 : 26) * s,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 30 * s,
                height: 30 * s,
                minWidth: 30 * s,
                marginTop: portrait ? 8 * s : 4 * s,
                borderRadius: "50%",
                background: colors.midnight,
                border: `${3 * s}px solid ${colors.gold}`,
                boxShadow: `0 0 ${18 * s * p}px ${colors.gold}66`,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: 32 * s,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: colors.gold,
                  marginBottom: 10 * s,
                }}
              >
                {e.date}
              </div>
              <div
                style={{
                  fontFamily: fonts.serif,
                  fontWeight: 500,
                  fontSize: (portrait ? 46 : 40) * s,
                  lineHeight: 1.18,
                  color: colors.offWhite,
                  maxWidth: portrait ? 760 * s : col - 50 * s,
                  textWrap: "balance",
                }}
              >
                {e.label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
