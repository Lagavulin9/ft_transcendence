import { GameRoomDto } from "@/types/GameDto";
import { emitEvent, onEvent } from "@/utils/socket";
import React, { useEffect, useState } from "react";
import { Button, Counter } from "react95";
import H3 from "../PostComponents/H3";
import InGame from "./InGame";

interface GameAcceptProps {
  isNormal: boolean;
  gameRoom: GameRoomDto;
}

const GameAccept = ({ isNormal, gameRoom }: GameAcceptProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [readyTime, setReadyTime] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const onAccept = () => {
    emitEvent("game-accept", {
      msg: "ok",
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setReadyTime((prev) => {
        if (prev >= 100) {
          // test때문에 100초 나중에 10초로 바꿔야함
          clearInterval(timer);
          emitEvent("game-decline", {
            host: gameRoom.host,
            guest: gameRoom.guest,
            game_start: false,
          });
          setIsEnd(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    onEvent("game-start", () => {
      setIsVisible(true);
    });
  }, [gameRoom.guest, gameRoom.host]);

  return (
    <>
      {isEnd ? (
        <H3>게임이 종료되었습니다.</H3>
      ) : (
        <>
          {isVisible ? (
            <div>
              <InGame isHost={false} isNormal={isNormal} room={gameRoom} />
            </div>
          ) : (
            <>
              <Counter size={"md"} value={readyTime} />
              <div style={{ display: "flex" }}>
                <H3>{`${gameRoom.host.nickname} 에게 게임초대가 왔습니다. (${
                  isNormal === true ? "일반모드" : "스페셜모드"
                })`}</H3>
              </div>
              <Button>수락</Button>
              <Button>거절</Button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default GameAccept;
