import React, { useEffect, useRef } from "react";

interface MapProps {
  ballPosition: { x: number; y: number };
  paddlePositions: {
    player1: { x: number; y: number };
    player2: { x: number; y: number };
  };
  ballRadius: number;
  paddleHeight: number;
  paddleWidth: number;
  canvasWidth: number;
  canvasHeight: number;
}

const Map = ({
  ballPosition,
  paddlePositions,
  ballRadius,
  paddleHeight,
  paddleWidth,
  canvasWidth,
  canvasHeight,
}: MapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 게임 맵 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 패들 그리기
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      paddlePositions.player1.x,
      paddlePositions.player1.y,
      paddleWidth,
      paddleHeight
    );
    ctx.fillRect(
      paddlePositions.player2.x,
      paddlePositions.player2.y,
      paddleWidth,
      paddleHeight
    );

    // 공 그리기
    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
  }, [ballPosition, paddlePositions, ballRadius, paddleHeight, paddleWidth]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="game-canvas"
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  );
};

export default Map;
