import React, { useEffect, useState } from "react";
import { Counter } from "react95";

const GameReady = () => {
  const [readyTime, setReadyTime] = useState(0);
  const [isNo, setIsNo] = useState(false);
  const [gameStart, setGameStart] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setReadyTime((prev) => {
        if (prev >= 10) {
          clearInterval(timer);
          setIsNo(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // 게임 대기 상태(10초)
    // 게임 시작(isNo === false && gameStart === true)
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        paddingTop: "100px",
      }}
    >
      <Counter size={"md"} value={readyTime} />
      {isNo === false && gameStart === true && <div>게임 시작</div>}
    </div>
  );
};

export default GameReady;
