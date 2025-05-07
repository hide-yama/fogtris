import React from 'react';
import { RotateCcw } from 'lucide-react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="bg-gray-900/90 p-6 rounded-lg border-2 border-red-700/50 max-w-xs w-full text-center transform transition-all animate-fade-in backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-2 text-red-500">Game Over</h2>
        <p className="text-gray-300 mb-2">Your final score:</p>
        <p className="text-3xl font-bold mb-6 text-white">{score.toLocaleString()}</p>
        <button
          onClick={onRestart}
          className="bg-blue-700/80 hover:bg-blue-600 active:bg-blue-500 text-white py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 w-full backdrop-blur-sm border border-blue-500/30"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default React.memo(GameOver);