import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TitleScene } from "../scenes/TitleScene";
import { ProblemScene } from "../scenes/ProblemScene";
import { QuestScene } from "../scenes/QuestScene";
import { SplitScene } from "../scenes/SplitScene";
import { LevelPetScene } from "../scenes/LevelPetScene";
import { CtaScene } from "../scenes/CtaScene";

/**
 * 横動画 1920x1080 30fps 30s
 * 縦版と同一シーン構成
 */
export const PromoHorizontal: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0618" }}>
      <Sequence from={0} durationInFrames={90} name="Title">
        <TitleScene durationInFrames={90} width={width} height={height} />
      </Sequence>
      <Sequence from={90} durationInFrames={150} name="Problem">
        <ProblemScene />
      </Sequence>
      <Sequence from={240} durationInFrames={180} name="Quest">
        <QuestScene width={width} height={height} />
      </Sequence>
      <Sequence from={420} durationInFrames={150} name="Split">
        <SplitScene />
      </Sequence>
      <Sequence from={570} durationInFrames={150} name="LevelPet">
        <LevelPetScene />
      </Sequence>
      <Sequence from={720} durationInFrames={180} name="CTA">
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};
