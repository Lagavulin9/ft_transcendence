import { AppDispatch } from "@/redux/RootStore";
import { fetchRoom } from "@/redux/Slice/Room";
import { GameRoomDto } from "@/types/GameDto";
import { onEvent } from "@/utils/socket";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Counter } from "react95";
import H3 from "../PostComponents/H3";
import InGame from "./InGame";

interface GameReadyProps {
  isNormal: boolean;
  gameRoom: GameRoomDto;
}

const GameReady = ({ isNormal, gameRoom }: GameReadyProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [readyTime, setReadyTime] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timer = setInterval(() => {
      setReadyTime((prev) => {
        if (prev >= 100) {
          // test때문에 100초 나중에 10초로 바꿔야함
          clearInterval(timer);
          setIsEnd(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    onEvent("game-start", () => {
      const arg: GameRoomDto = {
        host: gameRoom.host,
        guest: gameRoom.guest,
        game_start: true,
      };
      dispatch(
        fetchRoom({
          gameRoom: arg,
        })
      );
      setIsVisible(true);
    });

    onEvent("game-decline", () => {
      setIsVisible(false);
      setIsEnd(true);
    });

    onEvent("game-over", () => {
      setIsVisible(false);
      setIsEnd(true);
    });

    return () => {
      clearInterval(timer);
    };
  }, [dispatch, gameRoom.guest, gameRoom.host]);

  return (
    <>
      {isEnd ? (
        <H3>님 게임 못함ㅋㅋ</H3>
      ) : (
        <>
          {isVisible ? (
            <div>
              <InGame isHost={true} isNormal={isNormal} room={gameRoom} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                paddingTop: "100px",
              }}
            >
              <Counter size={"md"} value={readyTime} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GameReady;
