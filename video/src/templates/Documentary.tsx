import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import {
  type CalculateMetadataFunction,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TRANSITION_FRAMES } from "../brand/tokens";
import { CompareScene } from "../scenes/CompareScene";
import { DiagramScene } from "../scenes/DiagramScene";
import { ImageScene } from "../scenes/ImageScene";
import { LedgerScene } from "../scenes/LedgerScene";
import { MapScene } from "../scenes/MapScene";
import { SourceScene } from "../scenes/SourceScene";
import { StatScene } from "../scenes/StatScene";
import { Statement } from "../scenes/Statement";
import { TimelineScene } from "../scenes/TimelineScene";
import { TitleCard } from "../scenes/TitleCard";
import type { Scene, Storyboard } from "../schema/production";

/**
 * One template for both formats. The scene list comes from a production's
 * storyboard.json, so scenes are generated from data and are not individually
 * editable in Studio — edit storyboard.json instead.
 */
export const Documentary: React.FC<Storyboard> = ({ scenes, audio }) => {
  return (
    <>
      {audio?.narration ? (
        <Audio name="Narration" src={staticFile(audio.narration.src)} volume={audio.narration.volume} />
      ) : null}
      {audio?.music ? <MusicBed src={audio.music.src} volume={audio.music.volume} /> : null}
      <SceneSeries scenes={scenes} />
    </>
  );
};

const MusicBed: React.FC<{ src: string; volume: number }> = ({ src, volume }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = interpolate(frame, [0, fps, durationInFrames - 2 * fps, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <Audio name="Music" src={staticFile(src)} volume={volume * fade} />;
};

const SceneSeries: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
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
          fit={scene.fit}
        />
      );
    case "map":
      return <MapScene title={scene.title} view={scene.view} markers={scene.markers} arcs={scene.arcs} note={scene.note} />;
    case "timeline":
      return <TimelineScene title={scene.title} events={scene.events} />;
    case "compare":
      return <CompareScene title={scene.title} left={scene.left} right={scene.right} footer={scene.footer} />;
    case "stat":
      return <StatScene value={scene.value} countTo={scene.countTo} label={scene.label} sourceNote={scene.sourceNote} />;
    case "source":
      return <SourceScene author={scene.author} work={scene.work} written={scene.written} text={scene.text} gap={scene.gap} />;
    case "diagram":
      return <DiagramScene variant={scene.variant} caption={scene.caption} />;
    case "ledger":
      return <LedgerScene leftHeading={scene.leftHeading} rightHeading={scene.rightHeading} left={scene.left} right={scene.right} />;
  }
};

export const FPS = 30;

const sceneFrames = (scene: Scene, fps: number) => Math.round(scene.durationInSeconds * fps);

/** Total length = sum of scenes minus the overlap of each crossfade. */
export const calculateDocumentaryMetadata: CalculateMetadataFunction<Storyboard> = ({ props }) => {
  const total = props.scenes.reduce((sum, sc) => sum + sceneFrames(sc, FPS), 0);
  return { durationInFrames: total - TRANSITION_FRAMES * (props.scenes.length - 1) };
};
