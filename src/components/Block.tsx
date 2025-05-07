import React from 'react';
import { TetrominoType } from '../types';
import { TETROMINO_COLORS } from '../constants';

interface BlockProps {
  type: TetrominoType | null;
  ghost?: boolean;
}

const Block: React.FC<BlockProps> = ({ type, ghost = false }) => {
  if (!type) return <div className="w-full h-full bg-gray-900 border border-gray-800" />;

  const color = TETROMINO_COLORS[type];
  
  return (
    <div 
      className={`w-full h-full border ${ghost ? 'opacity-30' : ''}`}
      style={{ 
        backgroundColor: ghost ? 'rgba(255,255,255,0.1)' : color, 
        borderColor: `rgba(0,0,0,0.3)`,
        boxShadow: ghost ? 'none' : 'inset 3px 3px 6px rgba(255,255,255,0.2), inset -3px -3px 6px rgba(0,0,0,0.4)'
      }}
    />
  );
};

export default React.memo(Block);