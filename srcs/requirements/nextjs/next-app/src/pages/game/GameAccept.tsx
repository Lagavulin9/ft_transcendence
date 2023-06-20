import { GameRoomDto } from "@/types/GameDto";
import { emitEvent, onEvent } from "@/utils/socket";
import React, { useEffect } from "react";
import { Button } from "react95";
import H3 from "../PostComponents/H3";

interface GameAcceptProps {
  isNormal: boolean;
  gameRoom: GameRoomDto;
}

const GameAccept = ({ isNormal, gameRoom }: GameAcceptProps) => {
  const onAccept = () => {
    emitEvent("game-accept", () => {});
  };
  return (
    <>
      <div style={{ display: "flex" }}>
        <H3>{`${gameRoom.host.nickname} 에게 게임초대가 왔습니다. (${
          isNormal === true ? "일반모드" : "스페셜모드"
        })`}</H3>
      </div>
      <Button>수락</Button>
      <Button>거절</Button>
    </>
  );
};

export default GameAccept;
