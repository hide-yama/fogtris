import React from 'react';
import { TETROMINO_SHAPES, PREVIEW_HEIGHT, PREVIEW_WIDTH } from '../constants';
import { TetrominoType } from '../types';
import Block from './Block';

interface NextPieceProps {
  type: TetrominoType;
}

const NextPiece: React.FC<NextPieceProps> = ({ type }) => {
  // Get the first rotation of the next piece
  const shape = TETROMINO_SHAPES[type][0];
  
  // Create a preview grid
  const previewGrid = Array(PREVIEW_HEIGHT).fill(null).map(() => 
    Array(PREVIEW_WIDTH).fill(null)
  );
  
  // Center the piece in the preview
  const offsetX = Math.floor((PREVIEW_WIDTH - shape[0].length) / 2);
  const offsetY = Math.floor((PREVIEW_HEIGHT - shape.length) / 2);
  
  // Place the piece in the preview grid
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const previewX = x + offsetX;
        const previewY = y + offsetY;
        
        if (
          previewY >= 0 && 
          previewY < PREVIEW_HEIGHT && 
          previewX >= 0 && 
          previewX < PREVIEW_WIDTH
        ) {
          previewGrid[previewY][previewX] = type;
        }
      }
    }
  }
  
  return (
    <div className="grid grid-rows-preview bg-gray-900 rounded-lg p-2 border-2 border-gray-700">
      {previewGrid.map((row, y) => (
        <div key={y} className="grid grid-cols-preview">
          {row.map((cell, x) => (
            <div key={`${y}-${x}`} className="aspect-square">
              <Block type={cell} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default React.memo(NextPiece);