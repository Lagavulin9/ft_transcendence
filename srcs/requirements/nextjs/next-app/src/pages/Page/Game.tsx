import { useRouter } from "next/router";
import React, { useState } from "react";
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

const Game = () => {
  const [isNormal, setIsNormal] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const gameRoom = useSelector((state: RootState) => state.rootReducers.room);
  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );

  const router = useRouter();
  const { isHost, uId } = router.query;

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
    emitEvent("game-invate", {
      host: owner,
      guest: uId,
      game_start: false,
    });
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
                <GameReady isNormal={isNormal} gameRoom={gameRoom} />
              ) : (
                <ModeSelect func={Mode} />
              )}
            </>
          ) : (
            <>
              <GameAccept isNormal={isNormal} gameRoom={gameRoom} />
            </>
          )}
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default Game;
