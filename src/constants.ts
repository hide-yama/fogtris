import { TetrominoType } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const PREVIEW_WIDTH = 4;
export const PREVIEW_HEIGHT = 4;

export const INITIAL_SPEED = 800;
export const SPEED_DECREASE_PER_LEVEL = 50;
export const MIN_SPEED = 100;

export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

export const LINES_PER_LEVEL = 10;

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0',
  J: '#0000f0',
  L: '#f0a000',
  O: '#f0f000',
  S: '#00f000',
  T: '#a000f0',
  Z: '#f00000',
};

export const TETROMINO_SHAPES: Record<TetrominoType, boolean[][][]> = {
  I: [
    [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ],
    [
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false],
    ],
    [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
    ],
    [
      [false, true, false, false],
      [false, true, false, false],
      [false, true, false, false],
      [false, true, false, false],
    ],
  ],
  J: [
    [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
    [
      [false, true, true],
      [false, true, false],
      [false, true, false],
    ],
    [
      [false, false, false],
      [true, true, true],
      [false, false, true],
    ],
    [
      [false, true, false],
      [false, true, false],
      [true, true, false],
    ],
  ],
  L: [
    [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
    [
      [false, true, false],
      [false, true, false],
      [false, true, true],
    ],
    [
      [false, false, false],
      [true, true, true],
      [true, false, false],
    ],
    [
      [true, true, false],
      [false, true, false],
      [false, true, false],
    ],
  ],
  O: [
    [
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ],
  ],
  S: [
    [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
    [
      [false, true, false],
      [false, true, true],
      [false, false, true],
    ],
    [
      [false, false, false],
      [false, true, true],
      [true, true, false],
    ],
    [
      [true, false, false],
      [true, true, false],
      [false, true, false],
    ],
  ],
  T: [
    [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
    [
      [false, true, false],
      [false, true, true],
      [false, true, false],
    ],
    [
      [false, false, false],
      [true, true, true],
      [false, true, false],
    ],
    [
      [false, true, false],
      [true, true, false],
      [false, true, false],
    ],
  ],
  Z: [
    [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
    [
      [false, false, true],
      [false, true, true],
      [false, true, false],
    ],
    [
      [false, false, false],
      [true, true, false],
      [false, true, true],
    ],
    [
      [false, true, false],
      [true, true, false],
      [true, false, false],
    ],
  ],
};

export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',
  Z: 'z',
  SPACE: ' ',
  P: 'p',
  ESCAPE: 'Escape',
};

export const SWIPE_THRESHOLD = 50;