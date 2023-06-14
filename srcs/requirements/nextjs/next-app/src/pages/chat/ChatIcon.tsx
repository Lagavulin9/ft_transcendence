import React from "react";
import WindowIcon from "../globalComponents/WindowIcon";
import { useRouter } from "next/router";
import ChatList from "../Page/Chat";

const ChatIcon = () => {
  const router = useRouter();

  const openModal = () => {
    document.body.style.overflow = "hidden";
    router.push("/Page/Chat", "/Page/Chat", { shallow: false });
  };

  return (
    <div>
      <WindowIcon
        IconName="채팅목록."
        func={openModal}
        ImageUrl="https://user-images.githubusercontent.com/86397600/239874911-135e4e97-bc7e-4b5f-b4dc-cc773ff04fb2.png"
      />
    </div>
  );
};

export default ChatIcon;
