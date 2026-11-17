import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../brand/tokens";
import { Backdrop } from "./Backdrop";
import { reveal, useFrame, useReveal } from "./anim";

type Props = { variant: "neonatal-line" | "shrinkage"; caption: string };
type P = [number, number];

const bez = (a: P, b: P, c: P, d: P, t: number): P => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
};

// Schematic tooth crown (viewBox 800×800): outer enamel surface and the
// enamel–dentine junction, each as two cubic halves joined at the cusp.
const OUTER_L: [P, P, P, P] = [[250, 640], [228, 430], [300, 200], [400, 168]];
const OUTER_R: [P, P, P, P] = [[400, 168], [500, 200], [572, 430], [550, 640]];
const INNER_L: [P, P, P, P] = [[292, 640], [276, 450], [330, 262], [400, 236]];
const INNER_R: [P, P, P, P] = [[400, 236], [470, 262], [524, 450], [508, 640]];
const d = (h: [P, P, P, P]) => `C ${h[1].join(" ")} ${h[2].join(" ")} ${h[3].join(" ")}`;
const OUTER = `M ${OUTER_L[0].join(" ")} ${d(OUTER_L)} ${d(OUTER_R)} Z`;
const INNER = `M ${INNER_L[0].join(" ")} ${d(INNER_L)} ${d(INNER_R)} Z`;

const LINES = 11;
const NEONATAL = 5; // index of the accentuated line

/** Incremental line k (0 = cusp) on one side, from the junction obliquely out to the surface. */
const incremental = (k: number, side: "L" | "R"): [P, P] => {
  const t = 0.12 + (k / (LINES - 1)) * 0.8; // distance from cusp, 0..1
  const tIn = side === "L" ? 1 - t : t;
  const tOut = side === "L" ? 1 - Math.min(1, t + 0.07) : Math.min(1, t + 0.07);
  return side === "L"
    ? [bez(...INNER_L, tIn), bez(...OUTER_L, tOut)]
    : [bez(...INNER_R, tIn), bez(...OUTER_R, tOut)];
};

export const DiagramScene: React.FC<Props> = ({ variant, caption }) => {
  const { s, portrait } = useFrame();
  const captionIn = useReveal(0.4);
  const size = (portrait ? 900 : 760) * s;

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          flexDirection: portrait ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 60 * s,
          padding: 90 * s,
        }}
      >
        <svg viewBox="0 0 800 800" width={size} height={size}>
          {variant === "neonatal-line" ? <NeonatalLine /> : <Shrinkage />}
        </svg>
        <div style={{ maxWidth: (portrait ? 900 : 640) * s, opacity: captionIn, textAlign: portrait ? "center" : "left" }}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: 24 * s,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: colors.gold,
              marginBottom: 18 * s,
            }}
          >
            Simplified diagram · not to scale
          </div>
          <div style={{ fontFamily: fonts.serif, fontWeight: 500, fontSize: 52 * s, lineHeight: 1.22, color: colors.offWhite, textWrap: "balance" }}>
            {caption}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const NeonatalLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shapeIn = reveal(frame, fps, 0.2, 1);
  const labelsIn = reveal(frame, fps, 1.2 + LINES * 0.28, 0.8);
  return (
    <g fontFamily={fonts.sans}>
      <path d={OUTER} fill="#E9DFC7" fillOpacity={0.16 * shapeIn} stroke={colors.offWhite} strokeOpacity={0.8 * shapeIn} strokeWidth={3} />
      <path d={INNER} fill={colors.ocean} fillOpacity={0.9 * shapeIn} stroke={colors.mist} strokeOpacity={0.6 * shapeIn} strokeWidth={2} />
      {Array.from({ length: LINES }, (_, k) => {
        const p = reveal(frame, fps, 1.0 + k * 0.28, 0.4);
        const nl = k === NEONATAL;
        return (["L", "R"] as const).map((side) => {
          const [a, b] = incremental(k, side);
          return (
            <line
              key={`${k}${side}`}
              x1={a[0]}
              y1={a[1]}
              x2={a[0] + (b[0] - a[0]) * p}
              y2={a[1] + (b[1] - a[1]) * p}
              stroke={nl ? colors.gold : colors.offWhite}
              strokeOpacity={nl ? 1 : 0.45}
              strokeWidth={nl ? 6 : 2}
            />
          );
        });
      })}
      <g opacity={labelsIn}>
        <text x={400} y={120} textAnchor="middle" fontSize={30} fill={colors.offWhite}>
          enamel formed before birth
        </text>
        <text x={400} y={720} textAnchor="middle" fontSize={30} fill={colors.offWhite}>
          enamel formed after birth
        </text>
        {(() => {
          const [, outer] = incremental(NEONATAL, "R");
          return (
            <>
              <line x1={outer[0] + 8} y1={outer[1]} x2={outer[0] + 60} y2={outer[1] + 70} stroke={colors.gold} strokeWidth={2} />
              <text x={outer[0] + 30} y={outer[1] + 106} fontSize={30} fontWeight={600} fill={colors.gold}>
                neonatal line
              </text>
            </>
          );
        })()}
        <text x={400} y={470} textAnchor="middle" fontSize={26} fill={colors.mist}>
          dentine
        </text>
      </g>
    </g>
  );
};

// Generic bone-fragment outline (schematic, not a specific bone).
const FRAGMENT =
  "M 230 360 C 250 300, 330 270, 400 290 C 470 250, 560 270, 580 330 C 600 400, 560 470, 500 480 C 440 520, 330 520, 280 470 C 220 450, 205 410, 230 360 Z";

const Shrinkage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame, [1.0 * fps, 3.5 * fps], [1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inP = reveal(frame, fps, 0.2, 0.8);
  return (
    <g fontFamily={fonts.sans} opacity={inP}>
      <path d={FRAGMENT} fill="none" stroke={colors.mist} strokeOpacity={0.6} strokeWidth={2.5} strokeDasharray="10 9" />
      <g style={{ transformOrigin: "400px 390px", scale: `${k}` }}>
        <path d={FRAGMENT} fill="#E9DFC7" fillOpacity={0.22} stroke={colors.offWhite} strokeWidth={3} />
      </g>
      <text x={400} y={640} textAnchor="middle" fontSize={64} fontWeight={600} fill={colors.gold}>
        −{Math.round((1 - k) * 100)}%
      </text>
      <text x={400} y={690} textAnchor="middle" fontSize={26} fill={colors.mist}>
        dashed: original size · solid: after shrinkage
      </text>
    </g>
  );
};
