import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINO_SHAPES, LINES_PER_LEVEL } from '../constants';
import { Point, Tetromino, TetrominoType } from '../types';

export const createEmptyBoard = (): (TetrominoType | null)[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null)
  );
};

export const getRandomTetrominoType = (): TetrominoType => {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  return types[Math.floor(Math.random() * types.length)];
};

export const createTetromino = (type?: TetrominoType, board?: (TetrominoType | null)[][]): Tetromino => {
  const tetrominoType = type || getRandomTetrominoType();
  const shape = TETROMINO_SHAPES[tetrominoType][0];
  const x = Math.floor((BOARD_WIDTH - shape[0].length) / 2);
  let y = 0;
  if (board) {
    // ピースが収まる最上部の空きスペースを探索
    outer: for (let testY = 0; testY <= BOARD_HEIGHT - shape.length; testY++) {
      for (let sy = 0; sy < shape.length; sy++) {
        for (let sx = 0; sx < shape[sy].length; sx++) {
          if (shape[sy][sx]) {
            const boardY = testY + sy;
            const boardX = x + sx;
            if (
              boardY < 0 ||
              boardY >= BOARD_HEIGHT ||
              boardX < 0 ||
              boardX >= BOARD_WIDTH ||
              (board[boardY][boardX] !== null)
            ) {
              continue outer;
            }
          }
        }
      }
      y = testY;
      break;
    }
  }
  return {
    type: tetrominoType,
    position: { x, y },
    rotation: 0,
  };
};

export const checkCollision = (
  board: (TetrominoType | null)[][],
  tetromino: Tetromino
): boolean => {
  if (!TETROMINO_SHAPES[tetromino.type] || !TETROMINO_SHAPES[tetromino.type][tetromino.rotation]) {
    return true;
  }

  const shape = TETROMINO_SHAPES[tetromino.type][tetromino.rotation];
  const { x: pieceX, y: pieceY } = tetromino.position;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;

      const boardX = pieceX + x;
      const boardY = pieceY + y;

      if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
        return true;
      }

      if (
        boardY >= 0 && 
        boardY < BOARD_HEIGHT && 
        boardX >= 0 && 
        boardX < BOARD_WIDTH && 
        board[boardY][boardX] !== null
      ) {
        return true;
      }
    }
  }

  return false;
};

export const tryRotation = (
  board: (TetrominoType | null)[][],
  piece: Tetromino,
  newRotation: number
): Tetromino | null => {
  const rotatedPiece = {
    ...piece,
    rotation: newRotation,
  };

  if (!checkCollision(board, rotatedPiece)) {
    return rotatedPiece;
  }

  const kicks = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
  ];

  for (const kick of kicks) {
    const kickedPiece = {
      ...rotatedPiece,
      position: {
        x: rotatedPiece.position.x + kick.x,
        y: rotatedPiece.position.y + kick.y,
      },
    };

    if (!checkCollision(board, kickedPiece)) {
      return kickedPiece;
    }
  }

  return null;
};

export const placeTetromino = (
  board: (TetrominoType | null)[][],
  tetromino: Tetromino
): (TetrominoType | null)[][] => {
  const newBoard = board.map(row => [...row]);
  const shape = TETROMINO_SHAPES[tetromino.type][tetromino.rotation];
  const { x: pieceX, y: pieceY } = tetromino.position;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardY = pieceY + y;
        const boardX = pieceX + x;
        
        if (
          boardY >= 0 &&
          boardY < BOARD_HEIGHT &&
          boardX >= 0 &&
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = tetromino.type;
        }
      }
    }
  }

  return newBoard;
};

export const clearLines = (
  board: (TetrominoType | null)[][]
): { newBoard: (TetrominoType | null)[][], linesCleared: number } => {
  let linesCleared = 0;
  const newBoard = board.map(row => [...row]);
  const fullLines: number[] = [];

  // 消去する行を特定
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (newBoard[y].every(cell => cell !== null)) {
      fullLines.push(y);
      linesCleared++;
    }
  }

  // 行を消去して上の行を下に移動
  fullLines.forEach(lineY => {
    // 消去する行より上の行を1つずつ下に移動
    for (let y = lineY; y > 0; y--) {
      newBoard[y] = [...newBoard[y - 1]];
    }
    // 最上段に空の行を追加
    newBoard[0] = Array(BOARD_WIDTH).fill(null);
  });

  return { newBoard, linesCleared };
};

export const calculateLevel = (totalLines: number): number => {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
};