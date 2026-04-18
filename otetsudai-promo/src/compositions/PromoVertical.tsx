import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TitleScene } from "../scenes/TitleScene";
import { ProblemScene } from "../scenes/ProblemScene";
import { QuestScene } from "../scenes/QuestScene";
import { SplitScene } from "../scenes/SplitScene";
import { LevelPetScene } from "../scenes/LevelPetScene";
import { CtaScene } from "../scenes/CtaScene";

/**
 * 縦動画 1080x1920 30fps 30s (900フレーム)
 * Scene配置:
 *  1. Title   : 0-90   (3s)
 *  2. Problem : 90-240 (5s)
 *  3. Quest   : 240-420 (6s)
 *  4. Split   : 420-570 (5s)
 *  5. LevelPet: 570-720 (5s)
 *  6. CTA     : 720-900 (6s)
 */
export const PromoVertical: React.FC = () => {
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
