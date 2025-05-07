import React from 'react';
import { Play } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
}

const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="bg-gray-900/90 p-6 rounded-lg border-2 border-blue-700/50 max-w-xs w-full text-center transform transition-all animate-fade-in backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Game Paused</h2>
        <button
          onClick={onResume}
          className="bg-blue-700/80 hover:bg-blue-600 active:bg-blue-500 text-white py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 w-full backdrop-blur-sm border border-blue-500/30"
        >
          <Play size={20} />
          Resume Game
        </button>
      </div>
    </div>
  );
};

export default React.memo(PauseOverlay);