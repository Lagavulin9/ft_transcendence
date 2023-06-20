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

const Game = () => {
  const [isNormal, setIsNormal] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const gameRoom = useSelector((state: RootState) => state.rootReducers.room);

  const router = useRouter();
  const { isHost } = router.query;

  const close = () => {
    router.back();
  };

  const Mode = (mode: boolean) => {
    setIsNormal(mode);
    setIsVisible(true);
  };

  return (
    <AppLayout>
      <MyModal hName="게임" close={close}>
        <WindowContent>
          {isHost === "Host" ? (
            <>{isVisible ? <GameReady /> : <ModeSelect func={Mode} />}</>
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
