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

export const useTouchControls = ({
  moveLeft,
  moveRight,
  moveDown,
  rotateClockwise,
  rotateCounterClockwise,
  hardDrop,
  togglePause,
  isPaused,
  gameOver,
}: TouchControls) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchTimeRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    touchTimeRef.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (gameOver) return;
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const dx = touchEnd.x - touchStartRef.current.x;
      const dy = touchEnd.y - touchStartRef.current.y;
      const touchDuration = Date.now() - touchTimeRef.current;

      if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && touchDuration < 200) {
        if (dx > 0) {
          rotateClockwise();
        } else {
          rotateCounterClockwise();
        }
        return;
      }

      if (touchDuration < 500) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx > 0) {
            moveRight();
          } else {
            moveLeft();
          }
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > SWIPE_THRESHOLD) {
          if (dy > 0) {
            moveDown();
          } else {
            hardDrop();
          }
        }
      }

      touchStartRef.current = null;
    },
    [moveLeft, moveRight, moveDown, rotateClockwise, rotateCounterClockwise, hardDrop, gameOver]
  );

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
};