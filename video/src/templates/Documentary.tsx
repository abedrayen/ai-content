import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import type { CalculateMetadataFunction } from "remotion";
import { TRANSITION_FRAMES } from "../brand/tokens";
import { ImageScene } from "../scenes/ImageScene";
import { Statement } from "../scenes/Statement";
import { TitleCard } from "../scenes/TitleCard";
import type { Scene, Storyboard } from "../schema/production";

/**
 * One template for both formats. The scene list comes from a production's
 * storyboard.json, so scenes are generated from data and are not individually
 * editable in Studio — edit storyboard.json instead.
 */
export const Documentary: React.FC<Storyboard> = ({ scenes }) => {
  return (
    <TransitionSeries name="Scenes">
      {scenes.map((scene, i) => (
        <Fragment key={i}>
          {i > 0 ? (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />
          ) : null}
          <TransitionSeries.Sequence name={scene.name} durationInFrames={sceneFrames(scene, FPS)}>
            <SceneView scene={scene} />
          </TransitionSeries.Sequence>
        </Fragment>
      ))}
    </TransitionSeries>
  );
};

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "title":
      return <TitleCard kicker={scene.kicker} heading={scene.heading} />;
    case "statement":
      return (
        <Statement
          text={scene.text}
          label={scene.label}
          attribution={scene.attribution}
          sourceNote={scene.sourceNote}
        />
      );
    case "image":
      return (
        <ImageScene
          src={scene.src}
          caption={scene.caption}
          credit={scene.credit}
          isReconstruction={scene.isReconstruction}
        />
      );
  }
};

export const FPS = 30;

const sceneFrames = (scene: Scene, fps: number) => Math.round(scene.durationInSeconds * fps);

/** Total length = sum of scenes minus the overlap of each crossfade. */
export const calculateDocumentaryMetadata: CalculateMetadataFunction<Storyboard> = ({ props }) => {
  const total = props.scenes.reduce((sum, sc) => sum + sceneFrames(sc, FPS), 0);
  return { durationInFrames: total - TRANSITION_FRAMES * (props.scenes.length - 1) };
};
