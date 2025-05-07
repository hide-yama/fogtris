import React from 'react';
import { Trophy, LineChart, Timer } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  level: number;
  lines: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, level, lines }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
      <h2 className="text-xl font-bold text-center mb-4">
        <span className="text-cyan-400">テ</span>
        <span className="text-orange-400">ト</span>
        <span className="text-green-400">リ</span>
        <span className="text-purple-400">ス</span>
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
            <Trophy size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Score</span>
            <span className="text-lg font-bold">{score.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/20 text-green-400">
            <LineChart size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Lines</span>
            <span className="text-lg font-bold">{lines}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
            <Timer size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Level</span>
            <span className="text-lg font-bold">{level}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScoreBoard);