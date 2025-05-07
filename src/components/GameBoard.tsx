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
  const [ghostPosition, setGhostPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [clearingLines, setClearingLines] = useState<number[]>([]);
  const [clearingEffect, setClearingEffect] = useState(0);
  const clearAnimationRef = useRef<number | null>(null);

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
    setGhostPosition({ x: pieceX, y: ghostY });

    // 消去される行を検出
    const fullLines: number[] = [];
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newDisplayBoard[y].every(cell => cell !== null)) {
        fullLines.push(y);
      }
    }

    if (fullLines.length > 0 && !clearingLines.length) {
      setClearingLines(fullLines);
      setClearingEffect(0);
      
      if (clearAnimationRef.current) {
        cancelAnimationFrame(clearAnimationRef.current);
      }

      const animate = (startTime: number) => {
        const elapsed = performance.now() - startTime;
        const duration = 500; // 0.5秒
        const progress = Math.min(elapsed / duration, 1);

        setClearingEffect(progress);

        if (progress < 1) {
          clearAnimationRef.current = requestAnimationFrame(() => animate(startTime));
        } else {
          setClearingLines([]);
          setClearingEffect(0);
        }
      };

      clearAnimationRef.current = requestAnimationFrame(() => animate(performance.now()));
    }

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

    return () => {
      if (clearAnimationRef.current) {
        cancelAnimationFrame(clearAnimationRef.current);
      }
    };
  }, [board, currentPiece, clearingLines]);

  return (
    <div className="absolute inset-0 grid grid-rows-board bg-gray-900/90 backdrop-blur-sm rounded-lg border-2 border-gray-700/50 overflow-hidden">
      {displayBoard.map((row, y) => (
        <div 
          key={y} 
          className={`grid grid-cols-board relative ${
            clearingLines.includes(y) 
              ? 'after:absolute after:inset-0 after:bg-white after:animate-pulse'
              : ''
          }`}
        >
          {row.map((cell, x) => (
            <div 
              key={`${y}-${x}`} 
              className={`aspect-square relative ${
                clearingLines.includes(y) 
                  ? 'animate-[shake_0.05s_ease-in-out_infinite]'
                  : ''
              }`}
              style={{
                transform: clearingLines.includes(y) 
                  ? `scale(${1 + Math.sin(clearingEffect * Math.PI) * 0.2})`
                  : undefined,
                opacity: clearingLines.includes(y)
                  ? 1 - clearingEffect
                  : 1
              }}
            >
              {cell === 'ghost' as any ? (
                <Block type={currentPiece.type} ghost={true} />
              ) : (
                <Block type={cell} />
              )}
              {clearingLines.includes(y) && (
                <div 
                  className="absolute inset-0 bg-white mix-blend-overlay"
                  style={{
                    opacity: Math.sin(clearingEffect * Math.PI) * 0.8
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default React.memo(GameBoard);