import React from "react";
import WindowIcon from "../globalComponents/WindowIcon";
import { useRouter } from "next/router";


const GameIcon = () => {

  const router = useRouter();
  const openModal = () => {
    document.body.style.overflow = "hidden";
    router.push("/Page/Game", "/Page/Game", {shallow: false});
  };

  return (
    <div>
      <WindowIcon
        IconName="게임(임시)."
        func={openModal}
        ImageUrl="https://user-images.githubusercontent.com/86397600/239874067-d60aa992-9004-4ada-8856-481f9d35a20a.png"
      />
    </div>
  );
};

export default GameIcon;
