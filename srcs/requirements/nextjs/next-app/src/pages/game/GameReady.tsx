import { AppDispatch, RootState } from "@/redux/RootStore";
import { fetchRoom } from "@/redux/Slice/Room";
import { GameRoom, GameRoomDto, LogDto } from "@/types/GameDto";
import { offEvent, onEvent } from "@/utils/socket";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Counter } from "react95";
import H3 from "../PostComponents/H3";
import InGame from "./InGame";

interface GameReadyProps {
  isNormal: boolean;
  gameRoom: GameRoom;
  setFinish: (data: LogDto) => void;
}

const GameReady = ({ isNormal, gameRoom, setFinish }: GameReadyProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [readyTime, setReadyTime] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [mode, setMode] = useState(true);
  const [isStart, setIsStart] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [room, setRoom] = useState<GameRoom>({} as GameRoom);
  let arg: GameRoom;

  useEffect(() => {
    const timer = setInterval(() => {
      setReadyTime((prev) => {
        if (isStart === true) {
          return prev;
        }
        if (prev >= 10) {
          // test때문에 100초 나중에 10초로 바꿔야함
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    onEvent("game-start", (data: GameRoomDto) => {
      arg = {
        host: data.host.uid,
        guest: data.guest.uid,
        game_start: true,
        isNormal: isNormal,
      };
      setRoom(arg);
      dispatch(
        fetchRoom({
          gameRoom: arg,
        })
      );
      setMode(arg.isNormal as boolean);
      setIsStart(true);
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
      offEvent("game-decline");
    };
  }, [dispatch, gameRoom.guest, gameRoom.host, isNormal]);

  return (
    <>
      {isEnd ? (
        <H3>님 게임 못함ㅋㅋ</H3>
      ) : (
        <>
          {isVisible ? (
            <>
              {room && (
                <div>
                  <InGame
                    isHost={true}
                    isNormal={room.isNormal as boolean}
                    room={room}
                  />
                </div>
              )}
            </>
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
