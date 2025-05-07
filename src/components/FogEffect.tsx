import React, { useEffect, useRef, useState } from 'react';

interface FogEffectProps {
  gameStartTime: number;
  isPaused: boolean;
  gameOver: boolean;
}

const FogEffect: React.FC<FogEffectProps> = ({ gameStartTime, isPaused, gameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const fogTimeoutRef = useRef<number | null>(null);
  const reappearIntervalRef = useRef<number | null>(null);
  const fogOpacityRef = useRef(0.3);
  const fogCountRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const drawFogWithOpacity = (opacity: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // グラデーションを作成
    const gradient = ctx.createRadialGradient(
      rect.width / 2, rect.height / 2, 0,
      rect.width / 2, rect.height / 2, rect.width / 1.5
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

    // ノイズパターンを描画
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // ブラーエフェクトを適用
    ctx.filter = 'blur(12px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    // 微妙なテクスチャを追加
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const size = Math.random() * 2 + 1;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const animateFog = (startTime: number) => {
    const duration = 1500; // 1.5秒かけてアニメーション
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // イージング関数を使用してスムーズなアニメーション
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentOpacity = easeProgress * fogOpacityRef.current;
      
      drawFogWithOpacity(currentOpacity);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const drawInitialFog = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    fogCountRef.current += 1;
    fogOpacityRef.current = Math.min(0.3 + (fogCountRef.current * 0.08), 0.7);
    
    animateFog(performance.now());
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      if (isActive) {
        drawFogWithOpacity(fogOpacityRef.current);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  useEffect(() => {
    if (fogTimeoutRef.current) {
      clearTimeout(fogTimeoutRef.current);
    }
    if (reappearIntervalRef.current) {
      clearInterval(reappearIntervalRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (!gameOver && !isPaused) {
      fogCountRef.current = 0;
      fogOpacityRef.current = 0.3;
      
      fogTimeoutRef.current = window.setTimeout(() => {
        setIsActive(true);
        drawInitialFog();

        reappearIntervalRef.current = window.setInterval(() => {
          drawInitialFog();
        }, 20000);
      }, 15000);
    }

    return () => {
      if (fogTimeoutRef.current) {
        clearTimeout(fogTimeoutRef.current);
      }
      if (reappearIntervalRef.current) {
        clearInterval(reappearIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStartTime, isPaused, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) {
      setIsActive(false);
      fogOpacityRef.current = 0.3;
      fogCountRef.current = 0;
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [gameOver, isPaused]);

  const clearFog = (event: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.save();
    ctx.beginPath();
    ctx.filter = 'blur(8px)';
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 60;
    ctx.lineCap = 'round';

    if (lastPositionRef.current) {
      const lastX = lastPositionRef.current.x - rect.left;
      const lastY = lastPositionRef.current.y - rect.top;
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    lastPositionRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPointerDown(true);
    clearFog(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    clearFog(e);
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
    lastPositionRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 touch-none ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ width: '100%', height: '100%' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
};

export default React.memo(FogEffect);