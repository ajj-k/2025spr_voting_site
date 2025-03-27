import React, { useState } from "react";

interface Candidate {
  id: number;
  name: string;
  imageUrl: string;
  votes: number;
}

const App: React.FC = () => {
  // 20人分の候補者データ（ダミーデータ）
  const initialCandidates: Candidate[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Candidate ${i + 1}`,
    imageUrl: `https://via.placeholder.com/150?text=C${i + 1}`,
    votes: 0,
  }));

  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  // 投票処理：対象候補の票数を1増加
  const handleVote = (id: number) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );
  };

  // 投票数の多い順にソートし、上位3名をランキングとして取得
  const rankingCandidates = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  return (
    <div className="text-center font-sans">
      {/* 1. キービジュアル */}
      <section className="my-5">
        <img
          src="https://via.placeholder.com/800x400?text=Key+Visual"
          alt="Key Visual"
          className="w-full"
        />
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
