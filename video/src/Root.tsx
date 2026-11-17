import { Composition, Folder, Still } from "remotion";
import { storyboard } from "./schema/production";
import { calculateDocumentaryMetadata, Documentary } from "./templates/Documentary";
import { Thumbnail, thumbnailSchema } from "./templates/Thumbnail";

// Default props are a brand demo with no factual claims. Real productions are
// rendered with: npx remotion render Short --props=../productions/<slug>/storyboard.json
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Templates">
      <Composition
        id="Short"
        component={Documentary}
        schema={storyboard}
        calculateMetadata={calculateDocumentaryMetadata}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          slug: "brand-demo",
          title: "Brand demo",
          format: "short",
          scenes: [
            { type: "title", name: "Opening", durationInSeconds: 3.5, kicker: "The Hidden World", heading: "There is more to reality than meets the eye." },
            { type: "statement", name: "Hook", durationInSeconds: 3.5, text: "Example statement scene. Replace with a sourced line from claims.json.", claimId: null, label: null },
            { type: "statement", name: "Label demo", durationInSeconds: 3.5, text: "Non-fact claims are always labelled on screen.", claimId: null, label: "speculation" },
            { type: "image", name: "Image demo", durationInSeconds: 4, src: "_template/assets/placeholder.svg", caption: "Image scene with credit line", credit: "Placeholder artwork · The Hidden World (original)", isReconstruction: true },
          ],
        }}
      />
      <Composition
        id="LongForm"
        component={Documentary}
        schema={storyboard}
        calculateMetadata={calculateDocumentaryMetadata}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          slug: "brand-demo",
          title: "Brand demo",
          format: "long",
          scenes: [
            { type: "title", name: "Opening", durationInSeconds: 3.5, kicker: "The Hidden World", heading: "There is more to reality than meets the eye." },
            { type: "statement", name: "Label demo", durationInSeconds: 3.5, text: "Hypotheses, open questions and speculation are labelled on screen.", claimId: null, label: "hypothesis" },
            { type: "image", name: "Image demo", durationInSeconds: 4, src: "_template/assets/placeholder.svg", caption: "Image scene with credit line", credit: "Placeholder artwork · The Hidden World (original)", isReconstruction: false },
          ],
        }}
      />
      <Still
        id="Thumbnail"
        component={Thumbnail}
        schema={thumbnailSchema}
        width={1280}
        height={720}
        defaultProps={{
          image: "_template/assets/placeholder.svg",
          kicker: "The Hidden World",
          headline: "Thumbnail headline",
          subline: "Rendered with --props=../productions/<slug>/thumbnail.json",
        }}
      />
    </Folder>
  );
};
