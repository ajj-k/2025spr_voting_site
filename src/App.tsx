import React, { useEffect, useState } from "react";
import top_background from "./assets/top-background.svg";
import top_left from "./assets/left_contents.svg";
import top_right from "./assets/right_contents.svg";

interface Candidate {
  id: number;
  name: string;
  imageUrl: string;
  votes: number;
}

const backendUrl = "https://2025sprvotingsitebackend-production.up.railway.app";

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // 初期データ（メンター情報）の取得
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
        const mentors = data.mentors.map((mentor: any) => ({
          id: mentor.id,
          name: mentor.name,
          votes: mentor.voting, // API では voting というフィールド名
          imageUrl: `https://via.placeholder.com/150?text=C${mentor.id}`,
        }));
        setCandidates(mentors);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // 投票処理: 楽観的更新を行い、POST 通信で最新票数に更新
  const handleVote = (id: number) => {
    // 楽観的更新: ボタン押下と同時に票数を+1
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );

    // API に投票リクエストを送信
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
        // APIから返ってきた最新の票数で state を更新
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
        // エラー時は楽観的更新を戻す（票数を-1）
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.id === id
              ? { ...candidate, votes: candidate.votes - 1 }
              : candidate
          )
        );
      });
  };

  // 投票数の多い順にソートし、上位3名をランキングとして取得
  const rankingCandidates = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  return (
    <div className="text-center font-sans">
      {/* 1. キービジュアル */}
      <section className="my-5">
        <img src={top_background} alt="Key Visual" className="w-full" />
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
