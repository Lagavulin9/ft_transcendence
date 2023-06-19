import { useRouter } from "next/router";
import React, { useState } from "react";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { WindowContent } from "react95";
import InGame from "../game/InGame";
import ModeSelect from "../game/ModeSelect";
import GameReady from "../game/GameReady";

const Game = () => {
  const [isNormal, setIsNormal] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

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
          {isVisible ? <GameReady /> : <ModeSelect func={Mode} />}
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default Game;
