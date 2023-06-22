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
  const [isStart, setIsStart] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const onAccept = () => {
    console.log("accept");
    console.log(room);
    emitEvent("game-accept", {
      host: room.host,
      guest: room.guest,
      game_start: true,
      isNormal: room.isNormal,
    });
  };

  const onDecline = () => {
    emitEvent("game-decline", room);
    setIsEnd(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isStart === true) {
        return;
      }
      setReadyTime((prev) => {
        if (prev >= 10) {
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

    onEvent("game-start", (data: GameRoom) => {
      dispatch(
        fetchRoom({
          gameRoom: data,
        })
      );
      setIsVisible(true);
      clearInterval(timer);
      setIsStart(true);
    });
  }, [dispatch, room.guest, room.host, room.isNormal]);

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
