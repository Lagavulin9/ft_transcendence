import { resChatDto } from "@/types/ChatDto";
import { emitEvent } from "@/utils/socket";
import React, { useState } from "react";
import { Button, TextInput } from "react95";

interface Props {
  chatRoomData: resChatDto;
  isMute: boolean;
}

const ChatInput = ({ chatRoomData, isMute }: Props) => {
  const [isDm, setIsDm] = useState(false);
  const [input, setInput] = useState("");

  const sendMsg = () => {
    if (input.length === 0 || chatRoomData === undefined) {
      return;
    }
    const inputArray = input.split(" ");
    const dm = {
      cmd: inputArray[0],
      target: inputArray[1],
      content: inputArray.slice(2).join(" "),
    };
    const currentUser = chatRoomData.participants.find(
      (user) => user.nickname === dm.target
    );

    console.log(chatRoomData);
    console.log(
      `currentUser : ${currentUser}\n dm : ${dm.cmd}, ${dm.content}, ${dm.target}\n`
    );
    if (dm.cmd === "/w") {
      if (currentUser) {
        emitEvent("DM", {
          roomName: chatRoomData.roomName,
          roomType: chatRoomData.roomType,
          target: currentUser.uid,
          msg: dm.content,
          password: "",
        });
        setInput("");
      }
    } else {
      emitEvent("message", {
        roomName: chatRoomData.roomName,
        roomType: chatRoomData.roomType,
        target: 0,
        msg: input,
        password: "",
      });
      setInput("");
    }

    // if (isDm === true && currentUser) {
    //   console.log(dm);
    //   emitEvent("DM", {
    //     roomName: chatRoomData.roomName,
    //     roomType: chatRoomData.roomType,
    //     target: currentUser.uid,
    //     msg: dm.content,
    //     password: "",
    //   });
    //   setInput("");
    // } else {
    //   emitEvent("message", {
    //     roomName: chatRoomData.roomName,
    //     roomType: chatRoomData.roomType,
    //     target: "",
    //     msg: input,
    //     password: "",
    //   });
    //   setInput("");
    // }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    value.length > 100 ? alert("100자 이내로 입력해주세요") : setInput(value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      <div style={{ width: "500px" }}>
        <TextInput
          disabled={isMute}
          value={input}
          onChange={handleInput}
          placeholder="Input..."
          style={{ fontFamily: "dunggeunmo" }}
        />
      </div>
      <Button
        disabled={isMute}
        style={{
          fontFamily: "dunggeunmo-bold",
          fontSize: "20px",
          width: "100px",
        }}
        onClick={sendMsg}
      >
        보내기
      </Button>
    </div>
  );
};

export default ChatInput;
