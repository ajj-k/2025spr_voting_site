import React, { useEffect, useState } from "react";
import { mentors } from "./data/mentors";
import top_left from "./assets/left_contents.svg";
import top_right from "./assets/right_contents.svg";
import top_background from "./assets/top-background.svg";

// 例として、Candidate や投票処理などはそのまま残しています

interface Candidate {
  id: number;
  name: string;
  imageUrl: string;
  votes: number;
}

const backendUrl = "https://2025sprvotingsitebackend-production.up.railway.app";

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // 初期データ（メンター情報）の取得（投票用データ）
  useEffect(() => {
    fetch(`${backendUrl}/mentors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("候補者情報の取得に失敗しました");
        }
        return response.json();
      })
      .then((data) => {
        // API のレスポンスは { mentors: [...] } を想定
        const mentorsData = data.mentors.map((mentor: any) => ({
          id: mentor.id,
          name: mentor.name,
          votes: mentor.voting,
          imageUrl: `https://via.placeholder.com/150?text=C${mentor.id}`,
        }));
        setCandidates(mentorsData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // 投票処理は省略（既存コードそのまま）
  const handleVote = (id: number) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );
    fetch(`${backendUrl}/${id}/count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("候補者が存在しません");
        }
        return response.json();
      })
      .then((data) => {
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.id === data.id
              ? { ...candidate, votes: data.voting }
              : candidate
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("投票に失敗しました。");
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.id === id
              ? { ...candidate, votes: candidate.votes - 1 }
              : candidate
          )
        );
      });
  };

  // 投票数の多い順にソートして上位3名を抽出（そのまま）
  const rankingCandidates = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  // mentors 配列を id 昇順にソート（ここで得られるのは 20 件のデータ）
  const sortedMentors = [...mentors].sort((a, b) => a.id - b.id);

  return (
    <div className="text-center font-sans">
      {/* 1. キービジュアル */}
      <section className="relative my-5">
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
                src={`./assets/mentors/${mentor.img}`}
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
                  src={`./assets/mentors/${mentor.img}`}
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
                  src={`./assets/mentors/${mentor.img}`}
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

      {/* 2. 総選挙説明 */}
      <section className="my-5 px-4">
        <h2 className="text-2xl font-bold mb-2">総選挙説明</h2>
        <p className="text-base">
          ここに総選挙に関する説明文を記載します。候補者の紹介、選挙の概要、投票方法などの情報を掲載してください。
        </p>
      </section>

      {/* 3. ランキング (上位3位) */}
      <section className="my-5 px-4">
        <h2 className="text-2xl font-bold mb-4">ランキング (上位3位)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-items-center">
          {rankingCandidates.map((candidate, index) => (
            <div key={candidate.id} className="border border-gray-300 p-4 w-40">
              <div className="mb-2">順位: {index + 1}</div>
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                className="w-24 h-24 mx-auto"
              />
              <div className="mt-2">{candidate.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 投票 */}
      <section className="my-5 px-4">
        <h2 className="text-2xl font-bold mb-4">投票</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-items-center">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="border border-gray-300 p-4 w-40 relative"
            >
              <div className="relative group">
                <img
                  src={candidate.imageUrl}
                  alt={candidate.name}
                  className="w-24 h-24 mx-auto"
                />
                <div className="absolute bottom-1 left-0 right-0 bg-black bg-opacity-70 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {candidate.votes} 票
                </div>
              </div>
              <div className="mt-2">{candidate.name}</div>
              <button
                onClick={() => handleVote(candidate.id)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
              >
                投票する
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
