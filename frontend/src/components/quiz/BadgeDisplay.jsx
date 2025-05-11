import React from 'react';

const BadgeDisplay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-yellow-500/10 rounded-xl backdrop-blur-sm border border-yellow-500/20">
      <div className="text-4xl">🏆</div>
      <h3 className="text-2xl font-bold text-yellow-500">Jetpack Genius!</h3>
      <p className="text-yellow-400/80">Perfect Score Achievement Unlocked</p>
    </div>
  );
};

export default BadgeDisplay;
