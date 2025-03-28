import React from "react";
import { mentors } from "../data/mentors";
import top_left from "../assets/left_contents.svg";
import top_right from "../assets/right_contents.svg";
import top_background from "../assets/top-background.svg";

const sortedMentors = [...mentors].sort((a, b) => a.id - b.id);

const FirstSection: React.FC = () => {
  // URL の末尾が "/ayapo" なら true
  const useJokeImages = window.location.pathname.endsWith("/ayapo");

  // useJokeImages が true なら固定画像、false なら mentor.img を利用
  const getImageSrc = (mentor: { id: number; img: string }) =>
    useJokeImages
      ? "/assets/mentors-joke/ayapo.svg"
      : `/assets/mentors/${mentor.img}`;

  return (
    <section className="relative">
      <img src={top_background} alt="Key Visual" className="w-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="grid grid-cols-8 grid-rows-3 transform scale-88">
          {/* Row 0 */}
          {/* 左側: top_left（2列分） */}
          <div className="col-span-2 flex items-start">
            <img
              src={top_left}
              alt="Top Left"
              className="w-full h-full object-contain opacity-0 mt-8"
              style={{
                animation: "fadeInUp 0.5s forwards",
                animationDelay: "1000ms",
              }}
            />
          </div>
          {/* 中央: 4セル分、sortedMentors の先頭4件を順に表示 */}
          {sortedMentors.slice(0, 4).map((mentor, i) => (
            <img
              key={`center-${mentor.id}`}
              src={getImageSrc(mentor)}
              alt={mentor.img}
              className="w-full object-cover opacity-0"
              style={{
                animation: "fadeInUp 0.5s forwards",
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
          {/* 右側: top_right（2列分） */}
          <div className="col-span-2 flex items-start">
            <img
              src={top_right}
              alt="Top Right"
              className="w-full h-full object-contain opacity-0 scale-132 mt-4"
              style={{
                animation: "fadeInUp 0.5s forwards",
                animationDelay: "1200ms",
              }}
            />
          </div>

          {/* Row 1: 8セル分、sortedMentors のインデックス 4～11 */}
          {sortedMentors.slice(4, 12).map((mentor, i) => {
            const cellIndex = 8 + i; // row1 の先頭は 8 番目
            return (
              <img
                key={`r1c${mentor.id}`}
                src={getImageSrc(mentor)}
                alt={mentor.img}
                className="w-full object-cover opacity-0"
                style={{
                  animation: "fadeInUp 0.5s forwards",
                  animationDelay: `${cellIndex * 50}ms`,
                }}
              />
            );
          })}
          {/* Row 2: 8セル分、sortedMentors のインデックス 12～19 */}
          {sortedMentors.slice(12, 20).map((mentor, i) => {
            const cellIndex = 16 + i; // row2 の先頭は 16 番目
            return (
              <img
                key={`r2c${mentor.id}`}
                src={getImageSrc(mentor)}
                alt={mentor.img}
                className="w-full object-cover opacity-0"
                style={{
                  animation: "fadeInUp 0.5s forwards",
                  animationDelay: `${cellIndex * 50}ms`,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FirstSection;
