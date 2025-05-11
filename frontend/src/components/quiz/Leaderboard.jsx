import React from 'react';

const Leaderboard = ({ scores }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-white">Top Scores</h3>
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div key={index} 
            className="flex justify-between items-center p-3 rounded-lg
              bg-white/5 backdrop-blur-sm border border-white/10
              hover:border-yellow-500/20 transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="text-yellow-500 font-bold">{index + 1}</span>
              <span className="text-white/80">{new Date(score.timestamp).toLocaleDateString()}</span>
            </div>
            <span className="text-yellow-400 font-bold">{score.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
