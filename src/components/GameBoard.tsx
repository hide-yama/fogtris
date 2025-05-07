import React, { useEffect, useState, useRef } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINO_SHAPES } from '../constants';
import { TetrominoType } from '../types';
import Block from './Block';

interface GameBoardProps {
  board: (TetrominoType | null)[][];
  currentPiece: {
    type: TetrominoType;
    position: { x: number; y: number };
    rotation: number;
  };
}

const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  const [displayBoard, setDisplayBoard] = useState<(TetrominoType | null)[][]>(
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  );

  useEffect(() => {
    const newDisplayBoard = board.map(row => [...row]);
    const shape = TETROMINO_SHAPES[currentPiece.type][currentPiece.rotation];
    const { x: pieceX, y: pieceY } = currentPiece.position;

    // ゴーストピースの位置を計算
    let ghostY = pieceY;
    let collision = false;

    while (!collision) {
      ghostY++;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (!shape[y][x]) continue;
          const boardX = pieceX + x;
          const boardY = ghostY + y;
          if (
            boardY >= BOARD_HEIGHT ||
            boardX < 0 || 
            boardX >= BOARD_WIDTH ||
            (boardY >= 0 && newDisplayBoard[boardY][boardX] !== null)
          ) {
            collision = true;
            break;
          }
        }
        if (collision) break;
      }
    }
    ghostY--;

    // ゴーストピースを描画
    if (ghostY > pieceY) {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (!shape[y][x]) continue;
          const boardX = pieceX + x;
          const boardY = ghostY + y;
          if (
            boardY >= 0 && 
            boardY < BOARD_HEIGHT && 
            boardX >= 0 && 
            boardX < BOARD_WIDTH &&
            newDisplayBoard[boardY][boardX] === null
          ) {
            newDisplayBoard[boardY][boardX] = 'ghost' as any;
          }
        }
      }
    }

    // 現在のピースを描画
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const boardX = pieceX + x;
        const boardY = pieceY + y;
        if (
          boardY >= 0 && 
          boardY < BOARD_HEIGHT && 
          boardX >= 0 && 
          boardX < BOARD_WIDTH
        ) {
          newDisplayBoard[boardY][boardX] = currentPiece.type;
        }
      }
    }

    setDisplayBoard(newDisplayBoard);
  }, [board, currentPiece]);

  return (
    <div className="absolute inset-0 grid grid-rows-board bg-gray-900/90 backdrop-blur-sm rounded-lg border-2 border-gray-700/50 overflow-hidden">
      {displayBoard.map((row, y) => (
        <div key={y} className="grid grid-cols-board relative">
          {row.map((cell, x) => (
            <div key={`${y}-${x}`} className="aspect-square relative">
              {cell === 'ghost' as any ? (
                <Block type={currentPiece.type} ghost={true} />
              ) : (
                <Block type={cell} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default React.memo(GameBoard);