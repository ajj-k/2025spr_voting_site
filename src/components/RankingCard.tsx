import React from "react";
import { Candidate } from "../model/Candidate";

export const RankingCard: React.FC<{
  mentor: { id: number; img: string };
  candidate: Candidate;
  index: number;
}> = ({ mentor, candidate, index }) => {
  // オーバーレイ画像の配列（public/assets/ 内に配置）
  const overlayImages = [
    "/assets/first.svg",
    "/assets/second.svg",
    "/assets/third.svg",
  ];

  return (
    <div className="p-4 w-80 relative mt-1">
      <div className="relative group">
        <img
          src={`/assets/mentors/${mentor.img}`}
          alt={mentor.img}
          className="w-full h-full mx-auto filter transition duration-200 group-hover:brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-2xl">
          {candidate.votes} 票
        </div>
        {/* オーバーレイ画像をカードの上部に重ねる */}
        <div className="absolute -top-6 left-0 right-0 flex justify-center">
          <img
            src={overlayImages[index]}
            alt={`Overlay ${index + 1}`}
            className="w-16 h-auto"
          />
        </div>
      </div>
      <div className="mt-2 text-xl font-bold">{candidate.name}</div>
    </div>
  );
};
