import { useReducer, useCallback, useEffect } from 'react';
import {
  BOARD_WIDTH,
  INITIAL_SPEED,
  SPEED_DECREASE_PER_LEVEL,
  MIN_SPEED,
  LINES_PER_LEVEL,
  POINTS,
} from '../constants';
import { GameState, GameAction, Tetromino } from '../types';
import {
  createEmptyBoard,
  createTetromino,
  checkCollision,
  placeTetromino,
  clearLines,
  calculateLevel,
  tryRotation,
} from '../utils/gameUtils';

const createInitialState = (): GameState => {
  const board = createEmptyBoard();
  const currentPiece = createTetromino();
  const nextPiece = createTetromino();

  return {
    board,
    currentPiece,
    nextPiece,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    isPaused: false,
  };
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  if (state.gameOver && action.type !== 'RESTART') {
    return state;
  }

  if (state.isPaused && 
    action.type !== 'RESUME' && 
    action.type !== 'RESTART') {
    return state;
  }

  switch (action.type) {
    case 'MOVE_LEFT': {
      const newPiece = {
        ...state.currentPiece,
        position: {
          ...state.currentPiece.position,
          x: state.currentPiece.position.x - 1,
        },
      };

      if (!checkCollision(state.board, newPiece)) {
        return {
          ...state,
          currentPiece: newPiece,
        };
      }
      return state;
    }

    case 'MOVE_RIGHT': {
      const newPiece = {
        ...state.currentPiece,
        position: {
          ...state.currentPiece.position,
          x: state.currentPiece.position.x + 1,
        },
      };

      if (!checkCollision(state.board, newPiece)) {
        return {
          ...state,
          currentPiece: newPiece,
        };
      }
      return state;
    }

    case 'MOVE_DOWN': {
      const newPiece = {
        ...state.currentPiece,
        position: {
          ...state.currentPiece.position,
          y: state.currentPiece.position.y + 1,
        },
      };

      if (!checkCollision(state.board, newPiece)) {
        return {
          ...state,
          currentPiece: newPiece,
          score: state.score + POINTS.SOFT_DROP,
        };
      }

      const newBoard = placeTetromino(state.board, state.currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newLines = state.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      
      let score = state.score;
      
      if (linesCleared === 1) score += POINTS.SINGLE * state.level;
      else if (linesCleared === 2) score += POINTS.DOUBLE * state.level;
      else if (linesCleared === 3) score += POINTS.TRIPLE * state.level;
      else if (linesCleared === 4) score += POINTS.TETRIS * state.level;

      const newCurrentPiece = state.nextPiece;
      const newNextPiece = createTetromino();
      const isGameOver = checkCollision(clearedBoard, newCurrentPiece);

      if (isGameOver) {
        return {
          ...state,
          gameOver: true,
        };
      }

      return {
        ...state,
        board: clearedBoard,
        currentPiece: newCurrentPiece,
        nextPiece: newNextPiece,
        score,
        lines: newLines,
        level: newLevel,
      };
    }

    case 'ROTATE_CLOCKWISE': {
      const newRotation = (state.currentPiece.rotation + 1) % 4;
      const rotatedPiece = tryRotation(state.board, state.currentPiece, newRotation);
      
      if (rotatedPiece) {
        return {
          ...state,
          currentPiece: rotatedPiece,
        };
      }
      return state;
    }

    case 'ROTATE_COUNTER_CLOCKWISE': {
      const newRotation = (state.currentPiece.rotation + 3) % 4; // +3 is equivalent to -1 but ensures positive number
      const rotatedPiece = tryRotation(state.board, state.currentPiece, newRotation);
      
      if (rotatedPiece) {
        return {
          ...state,
          currentPiece: rotatedPiece,
        };
      }
      return state;
    }

    case 'HARD_DROP': {
      let newPiece = { ...state.currentPiece };
      let dropDistance = 0;

      while (!checkCollision(state.board, {
        ...newPiece,
        position: { ...newPiece.position, y: newPiece.position.y + 1 },
      })) {
        newPiece = {
          ...newPiece,
          position: { ...newPiece.position, y: newPiece.position.y + 1 },
        };
        dropDistance++;
      }

      const newBoard = placeTetromino(state.board, newPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newLines = state.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      
      let score = state.score + (POINTS.HARD_DROP * dropDistance);
      
      if (linesCleared === 1) score += POINTS.SINGLE * state.level;
      else if (linesCleared === 2) score += POINTS.DOUBLE * state.level;
      else if (linesCleared === 3) score += POINTS.TRIPLE * state.level;
      else if (linesCleared === 4) score += POINTS.TETRIS * state.level;

      const newCurrentPiece = state.nextPiece;
      const newNextPiece = createTetromino();
      const isGameOver = checkCollision(clearedBoard, newCurrentPiece);

      if (isGameOver) {
        return {
          ...state,
          gameOver: true,
        };
      }

      return {
        ...state,
        board: clearedBoard,
        currentPiece: newCurrentPiece,
        nextPiece: newNextPiece,
        score,
        lines: newLines,
        level: newLevel,
      };
    }

    case 'TICK': {
      return gameReducer(state, { type: 'MOVE_DOWN' });
    }

    case 'PAUSE': {
      return {
        ...state,
        isPaused: true,
      };
    }

    case 'RESUME': {
      return {
        ...state,
        isPaused: false,
      };
    }

    case 'RESTART': {
      return createInitialState();
    }

    default:
      return state;
  }
};

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  const moveLeft = useCallback(() => {
    dispatch({ type: 'MOVE_LEFT' });
  }, []);

  const moveRight = useCallback(() => {
    dispatch({ type: 'MOVE_RIGHT' });
  }, []);

  const moveDown = useCallback(() => {
    dispatch({ type: 'MOVE_DOWN' });
  }, []);

  const rotateClockwise = useCallback(() => {
    dispatch({ type: 'ROTATE_CLOCKWISE' });
  }, []);

  const rotateCounterClockwise = useCallback(() => {
    dispatch({ type: 'ROTATE_COUNTER_CLOCKWISE' });
  }, []);

  const hardDrop = useCallback(() => {
    dispatch({ type: 'HARD_DROP' });
  }, []);

  const tick = useCallback(() => {
    dispatch({ type: 'TICK' });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const togglePause = useCallback(() => {
    if (state.isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }, [state.isPaused, pauseGame, resumeGame]);

  const dropSpeed = useCallback(() => {
    const speed = INITIAL_SPEED - (state.level - 1) * SPEED_DECREASE_PER_LEVEL;
    return Math.max(speed, MIN_SPEED);
  }, [state.level]);

  return {
    state,
    moveLeft,
    moveRight,
    moveDown,
    rotateClockwise,
    rotateCounterClockwise,
    hardDrop,
    tick,
    pauseGame,
    resumeGame,
    restartGame,
    togglePause,
    dropSpeed,
  };
};