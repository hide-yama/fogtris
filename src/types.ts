export type Point = {
  x: number;
  y: number;
};

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type Tetromino = {
  type: TetrominoType;
  position: Point;
  rotation: number;
};

export type GameState = {
  board: (TetrominoType | null)[][];
  currentPiece: Tetromino;
  nextPiece: Tetromino;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
};

export type GameAction =
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_DOWN' }
  | { type: 'ROTATE_CLOCKWISE' }
  | { type: 'ROTATE_COUNTER_CLOCKWISE' }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESTART' };