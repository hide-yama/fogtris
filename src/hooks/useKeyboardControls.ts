import { useEffect, useCallback, useRef } from 'react';
import { KEYS } from '../constants';

type KeyboardControls = {
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

export const useKeyboardControls = ({
  moveLeft,
  moveRight,
  moveDown,
  rotateClockwise,
  rotateCounterClockwise,
  hardDrop,
  togglePause,
  isPaused,
  gameOver,
}: KeyboardControls) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const repeatIntervals = useRef<{ [key: string]: number }>({});
  const initialDelay = 100; // ms before starting repeat
  const repeatDelay = 30; // ms between repeats

  const clearRepeatInterval = (key: string) => {
    if (repeatIntervals.current[key]) {
      window.clearInterval(repeatIntervals.current[key]);
      delete repeatIntervals.current[key];
    }
  };

  const clearAllIntervals = () => {
    Object.keys(repeatIntervals.current).forEach(clearRepeatInterval);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === KEYS.P || e.key === KEYS.ESCAPE) {
        togglePause();
        return;
      }

      if (isPaused) return;

      // If key is already pressed, don't trigger again
      if (keysPressed.current.has(e.key)) return;
      keysPressed.current.add(e.key);

      const executeMove = () => {
        switch (e.key) {
          case KEYS.LEFT:
            e.preventDefault();
            moveLeft();
            break;
          case KEYS.RIGHT:
            e.preventDefault();
            moveRight();
            break;
          case KEYS.DOWN:
            e.preventDefault();
            moveDown();
            break;
          case KEYS.UP:
            e.preventDefault();
            rotateClockwise();
            break;
          case KEYS.Z:
            e.preventDefault();
            rotateCounterClockwise();
            break;
          case KEYS.SPACE:
            e.preventDefault();
            hardDrop();
            break;
        }
      };

      // Execute move immediately
      executeMove();

      // Start repeat after initial delay for movement keys only
      if ([KEYS.LEFT, KEYS.RIGHT, KEYS.DOWN].includes(e.key)) {
        const timeoutId = window.setTimeout(() => {
          if (keysPressed.current.has(e.key)) {
            repeatIntervals.current[e.key] = window.setInterval(executeMove, repeatDelay);
          }
        }, initialDelay);

        // Store the timeout so we can clear it if needed
        repeatIntervals.current[`${e.key}_timeout`] = timeoutId;
      }
    },
    [
      moveLeft,
      moveRight,
      moveDown,
      rotateClockwise,
      rotateCounterClockwise,
      hardDrop,
      togglePause,
      isPaused,
      gameOver,
    ]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key);
    clearRepeatInterval(e.key);
    clearRepeatInterval(`${e.key}_timeout`);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearAllIntervals();
    };
  }, [handleKeyDown, handleKeyUp]);
};