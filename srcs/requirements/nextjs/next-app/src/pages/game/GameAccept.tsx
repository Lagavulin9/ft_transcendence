import { AppDispatch, RootState } from "@/redux/RootStore";
import { fetchRoom } from "@/redux/Slice/Room";
import { GameRoom, GameRoomDto } from "@/types/GameDto";
import { emitEvent, offEvent, onEvent } from "@/utils/socket";
import { off } from "process";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Counter } from "react95";
import H3 from "../PostComponents/H3";
import InGame from "./InGame";

interface GameAcceptProps {
  isNormal: boolean;
  room: GameRoom;
}

const GameAccept = ({ isNormal, room }: GameAcceptProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [readyTime, setReadyTime] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  console.log(`GameAccept: ${isNormal}`);

  const onAccept = () => {
    emitEvent("game-accept", {
      host: room.host,
      guest: room.guest,
      game_start: true,
    });
  };

  const onDecline = () => {
    emitEvent("game-decline", room);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setReadyTime((prev) => {
        if (prev >= 100) {
          // test때문에 100초 나중에 10초로 바꿔야함
          clearInterval(timer);
          emitEvent("game-decline", {
            host: room.host,
            guest: room.guest,
            game_start: false,
          });
          setIsEnd(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    onEvent("game-start", () => {
      const arg: GameRoom = {
        host: room.host,
        guest: room.guest,
        game_start: true,
      };
      dispatch(
        fetchRoom({
          gameRoom: arg,
        })
      );
      offEvent("game-accept");
      setIsVisible(true);
    });
  }, [dispatch, room.guest, room.host]);

  return (
    <>
      {isEnd ? (
        <H3>님 게임 못함ㅋㅋ</H3>
      ) : (
        <>
          {isVisible ? (
            <div>
              <InGame isHost={false} isNormal={isNormal} room={room} />
            </div>
          ) : (
            <>
              <Counter size={"md"} value={readyTime} />
              <div style={{ display: "flex" }}>
                <H3>{`게임초대가 왔습니다. (${
                  isNormal === true ? "일반모드" : "스페셜모드"
                })`}</H3>
              </div>
              <Button
                style={{
                  fontFamily: "dunggeunmo-bold",
                  fontSize: "22px",
                  width: "100px",
                }}
                onClick={onAccept}
              >
                수락
              </Button>
              <Button
                style={{
                  fontFamily: "dunggeunmo-bold",
                  fontSize: "22px",
                  width: "100px",
                }}
                onClick={onDecline}
              >
                거절
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default GameAccept;
