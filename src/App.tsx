import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { mentors } from "./data/mentors";
import FirstSection from "./sections/first";
import { Candidate } from "./model/Candidate";
import { CandidateCard } from "./components/CandidateCard";
import { RankingCard } from "./components/RankingCard";

const backendUrl = "https://2025sprvotingsitebackend-production.up.railway.app";

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // URLの末尾が /ayapo なら useJokeImages を true にする
  const useJokeImages = window.location.pathname.endsWith("/ayapo");

  // 投票用データの取得
  useEffect(() => {
    fetch(`${backendUrl}/mentors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("候補者情報の取得に失敗しました");
        }
        return response.json();
      })
      .then((data) => {
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 投票処理（楽観的更新）
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
      headers: { "Content-Type": "application/json" },
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

  // 投票数上位3名
  const rankingCandidates = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  // mentors 配列を id 昇順にソート（全20件）
  const sortedMentors = [...mentors].sort((a, b) => a.id - b.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotLottieReact
          src="https://lottie.host/25c6acba-20bb-4a12-8b7d-4568aa47f284/fc1Da5Ytdq.lottie"
          loop
          autoplay
          style={{ width: "300px", height: "300px" }}
        />
      </div>
    );
  }

  return (
    <div className="text-center font-sans">
      {/* 1. キービジュアル */}
      <FirstSection />

      {/* 4. 投票セクション */}
      <section className="my-[8rem] px-4 w-4/6 mx-auto">
        <h2
          className="text-4xl font-bold mb-[4rem]"
          style={{ fontFamily: "VDL-LogoJrBlack" }}
        >
          かわいいメンターにいっぱい投票しよう！
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-items-center">
          {sortedMentors.map((mentor) => {
            const candidate = candidates.find((c) => c.id === mentor.id);
            return (
              <CandidateCard
                key={mentor.id}
                mentor={mentor}
                candidate={candidate}
                onVote={handleVote}
                useJokeImages={useJokeImages}
              />
            );
          })}
        </div>
      </section>

      {/* 3. ランキング (上位3位) セクション */}
      <section className="my-10 px-4 w-4/6 mx-auto mb-32">
        <h2
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: "VDL-LogoJrBlack" }}
        >
          ランキング
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 justify-items-center">
          {rankingCandidates.map((candidate, index) => {
            const mentorData = sortedMentors.find(
              (mentor) => mentor.id === candidate.id
            );
            return mentorData ? (
              <RankingCard
                key={candidate.id}
                mentor={mentorData}
                candidate={candidate}
                index={index}
                useJokeImages={useJokeImages}
              />
            ) : null;
          })}
        </div>
      </section>
      <footer className="bg-[#2E2E2E] text-white py-4">
        <div className="text-center text-sm">
          <span className="mr-1">ⓒ</span>2025 meijo camp
        </div>
      </footer>
    </div>
  );
};

export default App;
