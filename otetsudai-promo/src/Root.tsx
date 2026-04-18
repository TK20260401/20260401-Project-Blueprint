import React from "react";
import { Composition } from "remotion";
import { PromoVertical } from "./compositions/PromoVertical";
import { PromoHorizontal } from "./compositions/PromoHorizontal";

export const Root: React.FC = () => {
  return (
    <>
      {/* 縦動画: SNS/ストア/ショート向け */}
      <Composition
        id="PromoVertical"
        component={PromoVertical}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* 横動画: YouTube/LP埋込向け */}
      <Composition
        id="PromoHorizontal"
        component={PromoHorizontal}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
