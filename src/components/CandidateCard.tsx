import React, { useState } from "react";
import { Candidate } from "../model/Candidate";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const CandidateCard: React.FC<{
  mentor: { id: number; img: string };
  candidate?: Candidate;
  onVote: (id: number) => void;
}> = ({ mentor, candidate, onVote }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  const handleClick = () => {
    if (candidate) {
      onVote(candidate.id);
      setShowAnimation(true);
      // 1秒後にアニメーションを非表示にする
      setTimeout(() => setShowAnimation(false), 1000);
    }
  };

  return (
    <div className="p-4 w-80 relative mt-1">
      <div className="relative group">
        <img
          src={`/assets/mentors/${mentor.img}`}
          alt={mentor.img}
          className="w-full h-full mx-auto filter transition duration-200 group-hover:brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-2xl">
          {candidate ? candidate.votes : 0} 票
        </div>
      </div>
      <div className="relative">
        <button
          onClick={handleClick}
          className="mt-[-2rem] transform transition-transform duration-200 hover:scale-105 origin-center"
        >
          <img
            src="/assets/button.svg"
            alt="投票する"
            className="w-50 h-20 mx-auto mt-10"
          />
        </button>
        {showAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <DotLottieReact
              src="https://lottie.host/5e57199d-ba6a-4e5f-8bb1-02a891c32e73/WGJWIy0xy6.lottie"
              loop
              autoplay
              style={{ width: "15rem", height: "15rem" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
