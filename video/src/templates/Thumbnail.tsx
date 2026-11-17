import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { colors, fonts } from "../brand/tokens";

export const thumbnailSchema = z.object({
  /** Image relative to productions/. Shown whole (share-alike safe), never cropped. */
  image: z.string(),
  kicker: z.string(),
  headline: z.string(),
  /** Optional second line under the headline. */
  subline: z.string().optional(),
});
type Props = z.infer<typeof thumbnailSchema>;

/**
 * 1280×720 YouTube thumbnail: one strong focal object (the whole image, framed
 * like a museum print) and a short headline readable at small sizes.
 */
export const Thumbnail: React.FC<Props> = ({ image, kicker, headline, subline }) => {
  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse at 28% 50%, ${colors.ocean} 0%, ${colors.midnight} 72%)` }}
    >
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 40,
          bottom: 40,
          width: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            outline: `2px solid ${colors.gold}66`,
            outlineOffset: 8,
            boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 560, right: 60, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: colors.gold,
            marginBottom: 18,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 104,
            lineHeight: 0.98,
            color: colors.offWhite,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          {headline}
        </div>
        {subline ? (
          <div style={{ marginTop: 26, fontFamily: fonts.sans, fontWeight: 500, fontSize: 34, color: colors.mist }}>{subline}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
