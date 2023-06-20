import React, { useEffect, useState } from "react";
import Map from "./Map";
import GameClose from "./Close";
import GameScore from "./Score";
import { GameRoomDto, GameStateDto } from "@/types/GameDto";
import { emitEvent, onEvent } from "@/utils/socket";

const ballRadius = 10; // 공의 반지름
const paddleHeight = 80; // 패들의 높이
const paddleWidth = 10; // 패들의 너비
const canvasWidth = 500; // 게임 영역의 너비
const canvasHeight = 300; // 게임 영역의 높이

interface InGameProps {
  isHost: boolean;
  isNormal: boolean;
  room: GameRoomDto;
}

const InGame = ({ isHost, isNormal, room }: InGameProps) => {
  const initialDirection = Math.random() > 0.5 ? -1 : 1;
  const [ballPosition, setBallPosition] = useState({ x: 250, y: 150 });
  const [ballSpeed, setBallSpeed] = useState({ x: 4 * initialDirection, y: 4 });
  const [paddlePositions, setPaddlePositions] = useState({
    player1: { x: 20, y: canvasHeight / 2 - paddleHeight / 2 },
    player2: { x: 480, y: canvasHeight / 2 - paddleHeight / 2 },
  });
  const [keysPressed, setKeysPressed] = useState({
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  });
  const [isGuest, setIsGuest] = useState(false);

  const [score, setScore] = useState({ player1: 0, player2: 0 }); // Add score state
  const [gameTime, setGameTime] = useState(0); // Add gameTime state
  const [isEnd, setIsEnd] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (isEnd) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (isGuest && (event.key === "w" || event.key === "s")) ||
        (!isGuest && (event.key === "ArrowUp" || event.key === "ArrowDown"))
      ) {
        setKeysPressed((prev) => ({ ...prev, [event.key]: true }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        (isGuest && (event.key === "w" || event.key === "s")) ||
        (!isGuest && (event.key === "ArrowUp" || event.key === "ArrowDown"))
      ) {
        setKeysPressed((prev) => ({ ...prev, [event.key]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isEnd, isGuest]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnd) {
        return;
      }
      // Handle paddle movements
      if (isHost) {
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
      } else {
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
      }

      // Handle ball movement and collision
      let newBallPosition = {
        x: ballPosition.x + ballSpeed.x * delay,
        y: ballPosition.y + ballSpeed.y * delay,
      };

      // Check if the ball hits the top or bottom wall
      if (newBallPosition.y <= 0 || newBallPosition.y >= canvasHeight) {
        setBallSpeed((prev) => ({
          x: prev.x,
          y: -prev.y,
        }));
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
        setBallSpeed((prev) => ({
          x: -prev.x,
          y: prev.y,
        }));
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
        // TODO: 여기서 보내고
      }
      if (isHost) {
        emitEvent("host2guest", {
          gameroom: room,
          ballPosition: ballPosition,
          paddlePositions: paddlePositions,
          timeStamp: new Date().toISOString(), // 예시입니다. 실제로는 고유한 타임스탬프를 생성해야 합니다.
          isVisible: false, // 필요에 따라 변경하십시오.
          score: [score.player1, score.player2],
          gameTime: gameTime,
        });
      } else {
        emitEvent("guest2host", {
          gameroom: room,
          ballPosition: ballPosition,
          paddlePositions: paddlePositions,
          timeStamp: new Date().toISOString(), // 예시입니다. 실제로는 고유한 타임스탬프를 생성해야 합니다.
          isVisible: false, // 필요에 따라 변경하십시오.
          score: [score.player1, score.player2],
          gameTime: gameTime,
        });
      }
    }, 16);

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
    isGuest,
    isHost,
    delay,
    room,
    score.player1,
    score.player2,
    gameTime,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev >= 100 || isEnd) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    if (isHost) {
      onEvent("guest2host", (data: GameStateDto) => {
        setPaddlePositions((prev) => ({
          ...prev,
          player2: {
            x: data.paddlePositions.player2.x,
            y: data.paddlePositions.player2.y,
          },
        }));
      });
    } else {
      onEvent("host2guest", (data: GameStateDto) => {
        setPaddlePositions((prev) => ({
          player1: {
            x: data.paddlePositions.player1.x,
            y: data.paddlePositions.player1.y,
          },
          player2: {
            x: data.paddlePositions.player2.x,
            y: data.paddlePositions.player2.y,
          },
        }));
        setBallPosition({ x: data.ballPosition.x, y: data.ballPosition.y });
        setDelay(new Date(data.timeStemp).getTime() - new Date().getTime());
        setScore({ player1: data.score[0], player2: data.score[1] });
        setGameTime(data.gameTime);
      });
    }

    return () => {
      clearInterval(timer);
    };
  }, [isEnd, isHost]);

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

  useEffect(() => {
    // TODO: 여기서 받고 (소켓으로 받아야함)
    // TODO: setIsGuest(true or false);
  }, []);

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
          isVisible={false} // TODO: 나중에 객체에서 받은 값으로 변경해야함
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
