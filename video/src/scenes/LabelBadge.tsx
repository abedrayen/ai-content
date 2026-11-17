import { colors, fonts } from "../brand/tokens";
import type { ClaimLabel } from "../schema/production";

const TEXT: Record<ClaimLabel, string | null> = {
  fact: null, // verified facts need no badge
  interpretation: null, // shown as an attribution line instead (see Statement)
  "open-question": "Unresolved question",
  hypothesis: "Hypothesis",
  speculation: "Speculation",
};

/** On-screen epistemic label. Renders nothing for verified facts. */
export const LabelBadge: React.FC<{ label: ClaimLabel | null; s: number }> = ({ label, s }) => {
  const text = label ? TEXT[label] : null;
  if (!text) return null;
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 26 * s,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: colors.gold,
        border: `${1.5 * s}px solid ${colors.gold}`,
        padding: `${10 * s}px ${20 * s}px`,
        borderRadius: 4 * s,
      }}
    >
      {text}
    </div>
  );
};
