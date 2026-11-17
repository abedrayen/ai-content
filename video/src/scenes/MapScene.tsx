import { geoInterpolate, geoMercator, geoPath, geoGraticule10 } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land50 from "world-atlas/land-50m.json";
import { colors, fonts } from "../brand/tokens";
import { reveal, useFrame, useReveal, useSceneProgress } from "./anim";

// Natural Earth 1:50m land (public domain), via world-atlas (ISC).
const topology = land50 as unknown as Topology<{ land: GeometryCollection }>;
const LAND = feature(topology, topology.objects.land) as FeatureCollection | Feature<Geometry>;
const GRATICULE = geoGraticule10();

type LonLat = [number, number];
type Marker = { label: string; at: LonLat; appearAt: number; kind: "primary" | "site" | "uncertain" };
type Arc = { from: LonLat; to: LonLat; label?: string; appearAt: number };
type Props = {
  title?: string;
  view: { from: { center: LonLat; scale: number }; to: { center: LonLat; scale: number } };
  markers: Marker[];
  arcs?: Arc[];
  note?: string;
};

/**
 * Animated locator map. `scale` values are d3 Mercator scales for a 1920px-wide
 * frame; they are adapted to the composition width. The camera eases from
 * `view.from` to `view.to` over the first 85% of the scene.
 */
export const MapScene: React.FC<Props> = ({ title, view, markers, arcs = [], note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height, s, portrait } = useFrame();
  const t = useSceneProgress(0.05, 0.85);
  const titleIn = useReveal(0.2);
  const noteIn = useReveal(1.2);

  const center: LonLat = [
    view.from.center[0] + (view.to.center[0] - view.from.center[0]) * t,
    view.from.center[1] + (view.to.center[1] - view.from.center[1]) * t,
  ];
  // Interpolate zoom geometrically so it feels like a steady camera move.
  const k = (width / 1920) * view.from.scale * Math.pow(view.to.scale / view.from.scale, t);

  const projection = geoMercator()
    .center(center)
    .scale(k)
    .translate([width / 2, height / 2])
    .clipExtent([
      [-20, -20],
      [width + 20, height + 20],
    ]);
  const path = geoPath(projection);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, #0B1A31 0%, #050B17 80%)`,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={path(GRATICULE) ?? ""} fill="none" stroke={colors.gold} strokeOpacity={0.04} strokeWidth={1} />
        {/* soft coastal glow under the land */}
        <path d={path(LAND) ?? ""} fill="none" stroke={colors.teal} strokeWidth={10 * s} strokeOpacity={0.18} />
        <path d={path(LAND) ?? ""} fill="#26445F" stroke="#3E8A8F" strokeWidth={1.8 * s} strokeOpacity={0.95} />
        {arcs.map((arc, i) => {
          const p = reveal(frame, fps, arc.appearAt, 1.6);
          if (p <= 0) return null;
          const interp = geoInterpolate(arc.from, arc.to);
          const pts = Array.from({ length: 65 }, (_, j) => projection(interp((j / 64) * p)) as [number, number]);
          const mid = projection(interp(0.5)) as [number, number];
          return (
            <g key={i}>
              <polyline
                points={pts.map((q) => q.join(",")).join(" ")}
                fill="none"
                stroke={colors.gold}
                strokeWidth={2.5 * s}
                strokeDasharray={`${10 * s} ${8 * s}`}
                strokeOpacity={0.85}
              />
              {arc.label && p > 0.6 ? (
                <text
                  x={mid[0]}
                  y={mid[1] - 22 * s}
                  textAnchor="middle"
                  fontFamily={fonts.sans}
                  fontWeight={600}
                  fontSize={30 * s}
                  fill={colors.gold}
                  opacity={(p - 0.6) / 0.4}
                  letterSpacing="0.08em"
                >
                  {arc.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {markers.map((m) => {
          const p = reveal(frame, fps, m.appearAt, 0.7);
          if (p <= 0) return null;
          const xy = projection(m.at);
          if (!xy) return null;
          const [x, y] = xy;
          const pulse = (Math.sin((frame / fps) * 2.2) + 1) / 2;
          const primary = m.kind === "primary";
          const r = (primary ? 11 : 8) * s * p;
          return (
            <g key={m.label} opacity={p}>
              <circle
                cx={x}
                cy={y}
                r={r + (primary ? 14 + 10 * pulse : 8) * s}
                fill="none"
                stroke={colors.gold}
                strokeOpacity={primary ? 0.45 * (1 - pulse) + 0.15 : 0.35}
                strokeWidth={2 * s}
                strokeDasharray={m.kind === "uncertain" ? `${6 * s} ${6 * s}` : undefined}
              />
              {m.kind !== "uncertain" ? <circle cx={x} cy={y} r={r} fill={colors.gold} /> : null}
              <text
                x={x + 24 * s}
                y={y + 12 * s}
                fontFamily={fonts.serif}
                fontWeight={600}
                fontSize={(primary ? 52 : 40) * s}
                fill={colors.offWhite}
                stroke={colors.midnight}
                strokeWidth={6 * s}
                paintOrder="stroke"
              >
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      {title ? (
        <div
          style={{
            position: "absolute",
            top: (portrait ? 140 : 90) * s,
            left: (portrait ? 80 : 110) * s,
            right: 80 * s,
            opacity: titleIn,
            translate: `0 ${(1 - titleIn) * 16 * s}px`,
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 66 * s,
            lineHeight: 1.1,
            color: colors.offWhite,
            textShadow: "0 2px 18px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: (portrait ? 130 : 70) * s,
          left: (portrait ? 80 : 110) * s,
          right: 80 * s,
          fontFamily: fonts.sans,
          fontSize: 26 * s,
          color: colors.mist,
          opacity: 0.85 * noteIn,
        }}
      >
        {note ? `${note} · ` : ""}Map data: Natural Earth (public domain)
      </div>
    </AbsoluteFill>
  );
};
