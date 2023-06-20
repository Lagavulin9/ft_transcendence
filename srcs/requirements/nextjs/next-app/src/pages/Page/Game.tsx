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

const Game = () => {
  const [isNormal, setIsNormal] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const gameRoom = useSelector((state: RootState) => state.rootReducers.room);

  const router = useRouter();
  const { isHost, hostId, guestId, normal } = router.query;

  console.log(`Game: ${isHost}, ${hostId}, ${guestId}, ${typeof normal}`);

  const room = {
    host: Number(hostId),
    guest: Number(guestId),
    game_start: false,
    isNormal: normal === "true" ? true : false,
  };

  console.log(`host: ${hostId}, guest: ${guestId}`);
  const close = () => {
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
    const tmp = {
      host: Number(hostId),
      guest: Number(guestId),
      game_start: false,
      isNormal: mode,
    };
    emitEvent("game-invite", tmp);
    setIsNormal(mode);
    setIsVisible(true);
  };

  return (
    <AppLayout>
      <MyModal hName="게임" close={close}>
        <WindowContent>
          {isHost === "Host" ? (
            <>
              {isVisible ? (
                <GameReady isNormal={room.isNormal} gameRoom={room} />
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
