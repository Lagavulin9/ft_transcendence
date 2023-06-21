import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { WindowContent } from "react95";
import InGame from "../game/InGame";
import ModeSelect from "../game/ModeSelect";
import GameReady from "../game/GameReady";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/RootStore";
import GameAccept from "../game/GameAccept";
import { emitEvent, offEvent, onError, onEvent } from "@/utils/socket";
import { GameRoom } from "@/types/GameDto";
import { usePostLogMutation } from "@/redux/Api/Game";
import { LogDto } from "@/types/UserType";

const Game = () => {
  const [isNormal, setIsNormal] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [finish, setFinish] = useState<LogDto>({} as LogDto);
  const [mode, setMode] = useState(true);
  const [postLogMutation] = usePostLogMutation();

  const gameRoom = useSelector((state: RootState) => state.rootReducers.room);

  const router = useRouter();
  const { isHost, hostId, guestId, normal } = router.query;

  console.log(`Game: ${isHost}, ${hostId}`);

  let room = {
    host: Number(hostId),
    guest: Number(guestId),
    game_start: false,
    isNormal: normal === "true" ? true : false,
  };

  console.log(`host: ${hostId}, guest: ${guestId}`);
  const close = async () => {
    console.log(`GameClose : ${gameRoom.game_start}`);
    if (gameRoom.game_start === true) {
      emitEvent("game-over", {
        host: gameRoom.host,
        guest: gameRoom.guest,
        game_start: gameRoom.game_start,
      });
    }
    offEvent("game-start");
    offEvent("game-decline");
    offEvent("game-over");

    router.back();
  };

  const Mode = (mode: boolean) => {
    setMode(mode);
    room = {
      host: Number(hostId),
      guest: Number(guestId),
      game_start: false,
      isNormal: mode,
    };
    emitEvent("game-invite", room);
    setIsNormal(mode);
    setIsVisible(true);
  };

  const from = (data: LogDto) => {
    setFinish(data);
  };

  return (
    <AppLayout>
      <MyModal hName="게임" close={close}>
        <WindowContent>
          {isHost === "Host" ? (
            <>
              {isVisible ? (
                <GameReady isNormal={mode} gameRoom={room} setFinish={from} />
              ) : (
                <ModeSelect func={Mode} />
              )}
            </>
          ) : (
            <>
              <GameAccept isNormal={room.isNormal} room={room} />
            </>
          )}
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default Game;
