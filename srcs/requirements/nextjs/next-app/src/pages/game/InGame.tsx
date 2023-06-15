import React, { useEffect, useState } from "react";
import Map from "./Map";
import GameClose from "./Close";
import GameScore from "./Score";

const ballRadius = 10; // 공의 반지름
const paddleHeight = 80; // 패들의 높이
const paddleWidth = 10; // 패들의 너비
const canvasWidth = 500; // 게임 영역의 너비
const canvasHeight = 300; // 게임 영역의 높이

const InGame: React.FC = () => {
  const initialDirection = Math.random() > 0.5 ? -1 : 1;
  const [ballPosition, setBallPosition] = useState({ x: 250, y: 150 });
  const [ballSpeed, setBallSpeed] = useState({ x: 4 * initialDirection, y: 4 });
  const [paddlePositions, setPaddlePositions] = useState({
    player1: { x: 20, y: canvasHeight / 2 - paddleHeight / 2 },
    player2: { x: 480, y: canvasHeight / 2 - paddleHeight / 2 },
  });
  // Define a state to keep track of which keys are pressed
  const [keysPressed, setKeysPressed] = useState({
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  });

  const [score, setScore] = useState({ player1: 0, player2: 0 }); // Add score state
  const [gameTime, setGameTime] = useState(0); // Add gameTime state
  const [isEnd, setIsEnd] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);

  useEffect(() => {
    if (isEnd) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [event.key]: true }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [event.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isEnd]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnd) {
        return;
      }
      // Handle paddle movements
      if (keysPressed.ArrowUp && paddlePositions.player2.y > 0) {
        setPaddlePositions((prev) => ({
          ...prev,
          player2: { ...prev.player2, y: prev.player2.y - 5 },
        }));
      }

      if (
        keysPressed.ArrowDown &&
        paddlePositions.player2.y < canvasHeight - paddleHeight
      ) {
        setPaddlePositions((prev) => ({
          ...prev,
          player2: { ...prev.player2, y: prev.player2.y + 5 },
        }));
      }

      if (keysPressed.w && paddlePositions.player1.y > 0) {
        setPaddlePositions((prev) => ({
          ...prev,
          player1: { ...prev.player1, y: prev.player1.y - 5 },
        }));
      }

      if (
        keysPressed.s &&
        paddlePositions.player1.y < canvasHeight - paddleHeight
      ) {
        setPaddlePositions((prev) => ({
          ...prev,
          player1: { ...prev.player1, y: prev.player1.y + 5 },
        }));
      }

      // Handle ball movement and collision
      let newBallPosition = {
        x: ballPosition.x + ballSpeed.x,
        y: ballPosition.y + ballSpeed.y,
      };

      // Check if the ball hits the top or bottom wall
      if (newBallPosition.y <= 0 || newBallPosition.y >= canvasHeight) {
        setBallSpeed((prev) => ({ x: prev.x, y: -prev.y }));
      }

      // Check if the ball hits a paddle
      if (
        (newBallPosition.x - ballRadius <=
          paddlePositions.player1.x + paddleWidth &&
          newBallPosition.y >= paddlePositions.player1.y &&
          newBallPosition.y <= paddlePositions.player1.y + paddleHeight) ||
        (newBallPosition.x + ballRadius >= paddlePositions.player2.x &&
          newBallPosition.y >= paddlePositions.player2.y &&
          newBallPosition.y <= paddlePositions.player2.y + paddleHeight)
      ) {
        setBallSpeed((prev) => ({ x: -prev.x, y: prev.y }));
      }

      // Update ball position
      setBallPosition(newBallPosition);

      // Check if a player has lost
      if (
        newBallPosition.x - ballRadius < 0 ||
        newBallPosition.x + ballRadius > canvasWidth
      ) {
        clearInterval(interval);
        // Update the score
        if (newBallPosition.x - ballRadius < 0) {
          setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
        } else {
          setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
        }
        // Reset the positions of the ball and paddles
        setBallPosition({ x: 250, y: 150 });
        setPaddlePositions({
          player1: { x: 20, y: canvasHeight / 2 - paddleHeight / 2 },
          player2: { x: 480, y: canvasHeight / 2 - paddleHeight / 2 },
        });
        setBallSpeed({ x: 4 * initialDirection, y: 4 }); // Reset the ball speed
        // TODO: Declare the winner
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [
    keysPressed,
    ballPosition,
    ballSpeed,
    paddlePositions,
    initialDirection,
    isEnd,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev >= 100 || isEnd) {
          clearInterval(timer); // End interval when gameTime reaches 100
          return prev; // Return previous state, gameTime won't be incremented
        }
        return prev + 1; // Increment gameTime
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isEnd]);

  useEffect(() => {
    if (score.player1 === 5 || score.player2 === 5 || gameTime > 100) {
      if (score.player1 === 5) {
        setPlayerIndex(1);
      } else if (score.player2 === 5) {
        setPlayerIndex(2);
      } else if (gameTime > 100) {
        if (score.player1 < score.player2) {
          setPlayerIndex(2);
        } else if (score.player1 > score.player2) {
          setPlayerIndex(1);
        }
      }
      setIsEnd(true);
      console.log("Game over");
    }
  }, [score, gameTime]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          paddingLeft: "75px",
        }}
      >
        <Map
          ballPosition={ballPosition}
          paddlePositions={paddlePositions}
          ballRadius={ballRadius}
          paddleHeight={paddleHeight}
          paddleWidth={paddleWidth}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      </div>
      <GameScore
        player1={score.player1}
        player2={score.player2}
        time={gameTime}
      />
      {isEnd && (
        <GameClose
          WinPlayerId={playerIndex === 1 ? 1 : playerIndex === 2 ? 2 : 0} // 승리한 플레이어로 넘겨주기
          WinPlayerNickName={playerIndex === 1 ? "player1" : "player2"} // TODO: 승리한 플레이어로 넘겨주기
          Score={[score.player1, score.player2]}
        />
      )}
    </div>
  );
};

export default InGame;
