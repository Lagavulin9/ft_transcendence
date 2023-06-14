import { useRouter } from "next/router";
import React from "react";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { WindowContent } from "react95";
import InGame from "../game/InGame";

const Game = () => {
  const router = useRouter();

  const close = () => {
    router.back();
  };

  return (
    <AppLayout>
      <MyModal hName="게임" close={close}>
        <WindowContent>
          <InGame />
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default Game;
