import React, { useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { useInterval } from './hooks/useInterval';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useTouchControls } from './hooks/useTouchControls';
import GameBoard from './components/GameBoard';
import NextPiece from './components/NextPiece';
import Controls from './components/Controls';
import ScoreBoard from './components/ScoreBoard';
import GameOver from './components/GameOver';
import PauseOverlay from './components/PauseOverlay';
import FogEffect from './components/FogEffect';

function App() {
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const {
    state,
    moveLeft,
    moveRight,
    moveDown,
    rotateClockwise,
    hardDrop,
    tick,
    pauseGame,
    resumeGame,
    restartGame,
    togglePause,
    dropSpeed,
  } = useGameState();

  useEffect(() => {
    if (!state.gameOver && !state.isPaused) {
      setGameStartTime(Date.now());
    }
  }, [state.gameOver, state.isPaused]);

  useKeyboardControls({
    moveLeft,
    moveRight,
    moveDown,
    rotateClockwise,
    rotateCounterClockwise: rotateClockwise,
    hardDrop,
    togglePause,
    isPaused: state.isPaused,
    gameOver: state.gameOver,
  });

  useTouchControls({
    moveLeft,
    moveRight,
    moveDown,
    rotateClockwise,
    rotateCounterClockwise: rotateClockwise,
    hardDrop,
    togglePause,
    isPaused: state.isPaused,
    gameOver: state.gameOver,
  });

  useInterval(tick, state.gameOver || state.isPaused ? null : dropSpeed());

  useEffect(() => {
    document.title = `テトリス - Score: ${state.score}`;
  }, [state.score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-2 py-2 md:px-4 md:py-4 h-[100dvh] flex flex-col">
        <div className="flex-1 grid grid-cols-4 gap-2 md:gap-4 min-h-0">
          <div className="col-span-3 relative">
            <div className="h-full flex items-center justify-center">
              <div className="h-full aspect-[10/20] relative">
                <GameBoard 
                  board={state.board} 
                  currentPiece={state.currentPiece} 
                />
                <FogEffect
                  gameStartTime={gameStartTime}
                  isPaused={state.isPaused}
                  gameOver={state.gameOver}
                />
                {state.gameOver && (
                  <GameOver 
                    score={state.score} 
                    onRestart={restartGame} 
                  />
                )}
                {state.isPaused && !state.gameOver && (
                  <PauseOverlay onResume={resumeGame} />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <ScoreBoard 
              score={state.score}
              level={state.level}
              lines={state.lines}
            />
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50">
              <h3 className="text-gray-400 mb-1 font-medium text-sm">Next</h3>
              <div className="w-full">
                <NextPiece type={state.nextPiece.type} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={togglePause}
                className="bg-purple-800/80 hover:bg-purple-700 active:bg-purple-600 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-500/30 w-full flex items-center justify-center gap-2"
                aria-label={state.isPaused ? "Resume game" : "Pause game"}
              >
                {state.isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={restartGame}
                className="bg-blue-700/80 hover:bg-blue-600 active:bg-blue-500 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-blue-500/30 w-full flex items-center justify-center gap-2"
                aria-label="Restart game"
              >
                Restart
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 md:mt-4">
          <Controls
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onMoveDown={moveDown}
            onRotateClockwise={rotateClockwise}
            onHardDrop={hardDrop}
            isPaused={state.isPaused}
            gameOver={state.gameOver}
          />
        </div>
      </div>
    </div>
  );
}

export default App;