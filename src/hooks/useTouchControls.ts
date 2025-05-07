import { useEffect, useRef, useCallback } from 'react';
import { SWIPE_THRESHOLD } from '../constants';

type TouchControls = {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  hardDrop: () => void;
  togglePause: () => void;
  isPaused: boolean;
  gameOver: boolean;
};

// グローバルなタッチイベントは廃止し、コントローラーのボタンのみでタッチ操作を完結させる
export const useTouchControls = (_: TouchControls) => {
  // 何も処理しない（空実装）
};