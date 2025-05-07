import React, { useCallback, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotateClockwise: () => void;
  onHardDrop: () => void;
  isPaused: boolean;
  gameOver: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotateClockwise,
  onHardDrop,
  isPaused,
  gameOver,
}) => {
  const repeatIntervals = useRef<{ [key: string]: number }>({});
  const pressStartTime = useRef<{ [key: string]: number }>({});
  const initialDelay = 200; // 長押し開始までの遅延を200msに増加
  const repeatDelay = 50; // 連続実行の間隔を50msに増加
  const touchDurationThreshold = 150; // タップとホールドを区別する時間閾値を150msに設定

  const clearRepeatInterval = (key: string) => {
    if (repeatIntervals.current[key]) {
      window.clearInterval(repeatIntervals.current[key]);
      delete repeatIntervals.current[key];
    }
  };

  const handleButtonPress = useCallback((action: () => void, key: string) => {
    if (gameOver || isPaused) return;
    
    // 押し始めた時刻を記録
    pressStartTime.current[key] = Date.now();

    // 長押し時の連続実行を設定
    const timeoutId = window.setTimeout(() => {
      if (repeatIntervals.current[key]) return;
      repeatIntervals.current[key] = window.setInterval(action, repeatDelay);
    }, initialDelay);

    repeatIntervals.current[`${key}_timeout`] = timeoutId;
  }, [gameOver, isPaused]);

  const handleButtonRelease = useCallback((action: () => void, key: string) => {
    const pressDuration = Date.now() - (pressStartTime.current[key] || 0);
    
    // タップ（短い押下）の場合のみアクションを実行
    if (pressDuration < touchDurationThreshold && !gameOver && !isPaused) {
      action();
    }

    // タイマーをクリア
    clearRepeatInterval(key);
    clearRepeatInterval(`${key}_timeout`);
    delete pressStartTime.current[key];
  }, [gameOver, isPaused]);

  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2">
      <button
        className="bg-gray-800/80 hover:bg-gray-700 active:bg-gray-600 text-white p-3 rounded-lg flex justify-center items-center transition-all duration-200 backdrop-blur-sm border border-gray-700/30"
        onPointerDown={() => handleButtonPress(onMoveLeft, 'left')}
        onPointerUp={() => handleButtonRelease(onMoveLeft, 'left')}
        onPointerLeave={() => handleButtonRelease(onMoveLeft, 'left')}
        onPointerCancel={() => handleButtonRelease(onMoveLeft, 'left')}
        aria-label="Move left"
      >
        <ArrowLeft size={24} />
      </button>
      <button
        className="bg-gray-800/80 hover:bg-gray-700 active:bg-gray-600 text-white p-3 rounded-lg flex justify-center items-center transition-all duration-200 backdrop-blur-sm border border-gray-700/30"
        onPointerDown={() => handleButtonPress(onMoveRight, 'right')}
        onPointerUp={() => handleButtonRelease(onMoveRight, 'right')}
        onPointerLeave={() => handleButtonRelease(onMoveRight, 'right')}
        onPointerCancel={() => handleButtonRelease(onMoveRight, 'right')}
        aria-label="Move right"
      >
        <ArrowRight size={24} />
      </button>
      <button
        className="bg-gray-800/80 hover:bg-gray-700 active:bg-gray-600 text-white p-3 rounded-lg flex justify-center items-center transition-all duration-200 backdrop-blur-sm border border-gray-700/30"
        onPointerDown={() => handleButtonPress(onMoveDown, 'down')}
        onPointerUp={() => handleButtonRelease(onMoveDown, 'down')}
        onPointerLeave={() => handleButtonRelease(onMoveDown, 'down')}
        onPointerCancel={() => handleButtonRelease(onMoveDown, 'down')}
        aria-label="Move down"
      >
        <ArrowDown size={24} />
      </button>
      <button
        className="bg-teal-700/80 hover:bg-teal-600 active:bg-teal-500 text-white p-3 rounded-lg flex justify-center items-center transition-all duration-200 backdrop-blur-sm border border-teal-500/30"
        onPointerDown={() => handleButtonPress(onRotateClockwise, 'rotate')}
        onPointerUp={() => handleButtonRelease(onRotateClockwise, 'rotate')}
        onPointerLeave={() => handleButtonRelease(onRotateClockwise, 'rotate')}
        onPointerCancel={() => handleButtonRelease(onRotateClockwise, 'rotate')}
        aria-label="Rotate"
      >
        <RotateCw size={24} />
      </button>
    </div>
  );
};

export default React.memo(Controls);