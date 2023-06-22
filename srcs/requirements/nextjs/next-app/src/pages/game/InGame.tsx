import React, { useEffect, useState } from "react";
import Map from "./Map";
import GameClose from "./Close";
import GameScore from "./Score";
import { GameRoom, GameRoomDto, GameStateDto, LogDto } from "@/types/GameDto";
import { emitEvent, onEvent } from "@/utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/RootStore";
import { usePostLogMutation } from "@/redux/Api/Game";

const ballRadius = 10; // 공의 반지름
const paddleHeight = 80; // 패들의 높이
const paddleWidth = 10; // 패들의 너비
const canvasWidth = 500; // 게임 영역의 너비
const canvasHeight = 300; // 게임 영역의 높이

interface InGameProps {
  isHost: boolean;
  isNormal: boolean;
  room: GameRoom;
}

interface keyPress {
  ArrowUp: boolean;
  ArrowDown: boolean;
  w: boolean;
  s: boolean;
}

interface gameKeyPressDto {
  gameroom: GameRoom;
  ArrowUp: boolean;
  ArrowDown: boolean;
  w: boolean;
  s: boolean;
}

const InGame = ({ isHost, isNormal, room }: InGameProps) => {
  const initialDirection = Math.random() > 0.5 ? -1 : 1;
  const [ballPosition, setBallPosition] = useState({ x: 250, y: 150 });
  const [ballSpeed, setBallSpeed] = useState({ x: 4 * initialDirection, y: 4 });
  const [paddlePositions, setPaddlePositions] = useState({
    player1: { x: 20, y: canvasHeight / 2 - paddleHeight / 2 },
    player2: { x: 480, y: canvasHeight / 2 - paddleHeight / 2 },
  });
  const [keysPressed, setKeysPressed] = useState<keyPress>({
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  });

  const [score, setScore] = useState({ player1: 0, player2: 0 }); // Add score state
  const [gameTime, setGameTime] = useState(0); // Add gameTime state
  const [isEnd, setIsEnd] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [delay, setDelay] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [postLogMutation] = usePostLogMutation();

  useEffect(() => {
    if (isEnd) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHost && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        setKeysPressed((prev) => ({ ...prev, [event.key]: true }));
      } else if (!isHost && (event.key === "w" || event.key === "s")) {
        setKeysPressed((prev) => ({ ...prev, [event.key]: true }));
        emitEvent("guest2host", {
          gameroom: {
            host: room.host,
            guest: room.guest,
            game_start: true,
            isNormal: isNormal,
          },
          ArrowUp: false,
          ArrowDown: false,
          w: event.key === "w",
          s: event.key === "s",
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isHost && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        setKeysPressed((prev) => ({ ...prev, [event.key]: false }));
      } else if (!isHost && (event.key === "w" || event.key === "s")) {
        setKeysPressed((prev) => ({ ...prev, [event.key]: false }));
        emitEvent("guest2host", {
          gameroom: {
            host: room.host,
            guest: room.guest,
            game_start: true,
            isNormal: isNormal,
          },
          ArrowUp: false,
          ArrowDown: false,
          w: false,
          s: false,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    isEnd,
    isHost,
    isNormal,
    keysPressed.ArrowDown,
    keysPressed.ArrowUp,
    keysPressed.s,
    keysPressed.w,
    room.guest,
    room.host,
  ]);

  useEffect(() => {
    if (!isHost) {
      return;
    }
    const interval = setInterval(() => {
      if (isEnd) {
        return;
      }
      // Handle paddle movements
      if (keysPressed.w && paddlePositions.player2.y > 0) {
        setPaddlePositions((prev) => ({
          ...prev,
          player2: { ...prev.player2, y: prev.player2.y - 5 },
        }));
      }

      if (
        keysPressed.s &&
        paddlePositions.player2.y < canvasHeight - paddleHeight
      ) {
        setPaddlePositions((prev) => ({
          ...prev,
          player2: { ...prev.player2, y: prev.player2.y + 5 },
        }));
      }

      if (keysPressed.ArrowUp && paddlePositions.player1.y > 0) {
        setPaddlePositions((prev) => ({
          ...prev,
          player1: { ...prev.player1, y: prev.player1.y - 5 },
        }));
      }

      if (
        keysPressed.ArrowDown &&
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
      emitEvent("host2guest", {
        gameroom: { host: room.host, guest: room.guest, game_start: true },
        ballPosition: ballPosition,
        paddlePositions: paddlePositions,
        timeStamp: new Date().toISOString(),
        isVisible: isVisible,
        score: [score.player1, score.player2],
        gameTime: gameTime,
      });
    }, 33);

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
    isHost,
    delay,
    room,
    score.player1,
    score.player2,
    gameTime,
    isNormal,
    isVisible,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHost) {
        return;
      }
      setGameTime((prev) => {
        if (prev >= 100 || isEnd) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    console.log("isHost");
    console.log(isHost);
    if (isHost) {
      onEvent("guest2host", (data: gameKeyPressDto) => {
        setKeysPressed({
          ArrowDown: data.ArrowDown,
          ArrowUp: data.ArrowUp,
          s: data.s,
          w: data.w,
        });
      });
    } else if (!isHost) {
      onEvent("host2guest", (data: GameStateDto) => {
        setPaddlePositions(() => ({
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
      if (isHost === false) {
        return;
      }
      if (isEnd === false) {
        emitEvent("host2guest", {
          gameroom: { host: room.host, guest: room.guest, game_start: true },
          ballPosition: ballPosition,
          paddlePositions: paddlePositions,
          timeStamp: new Date().toISOString(),
          isVisible: isVisible,
          score: [score.player1, score.player2],
          gameTime: gameTime,
        });
        emitEvent("finish", {
          gameroom: { host: room.host, guest: room.guest, game_start: true },
          ballPosition: ballPosition,
          paddlePositions: paddlePositions,
          timeStamp: new Date().toISOString(),
          isVisible: isVisible,
          score: [score.player1, score.player2],
          gameTime: gameTime,
        });
        postLogMutation({
          fromId: room.host,
          toId: room.guest,
          fromScore: score.player1,
          toScore: score.player2,
          score: [score.player1, score.player2],
        });
        setIsEnd(true);
      }
    }
  }, [
    score,
    gameTime,
    room.host,
    room.guest,
    ballPosition,
    paddlePositions,
    isVisible,
    postLogMutation,
    isHost,
    isEnd,
  ]);

  useEffect(() => {
    onEvent("finish", () => {
      setIsEnd(true);
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          paddingLeft: "75px",
        }}
      >
        {!isEnd && (
          <Map
            ballPosition={ballPosition}
            paddlePositions={paddlePositions}
            ballRadius={ballRadius}
            paddleHeight={paddleHeight}
            paddleWidth={paddleWidth}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            room={room}
            score={[score.player1, score.player2]}
            gameTime={gameTime}
          />
        )}
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
