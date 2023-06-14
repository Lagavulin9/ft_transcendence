import React, { useState } from "react";
import { TextInput } from "react95";
import { chatMocData } from "@/moc/chat";
import { chat } from "@/types/ChatType";
import SearchRoom from "./SearchRoom";
import { useDispatch, useSelector } from "react-redux";
import { ChatSlice } from "@/redux/Slice/Chat";
import { Room } from "@/types/RoomType";
import RootState from "@/redux/RootReducer";

const SearchPage = () => {
  const [input, setInput] = useState("");
  const [filteredChat, setFilteredChat] = useState<chat>();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const room = useSelector((state: RootState) => state.chat.room);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    if (timer) clearTimeout(timer);

    if (value !== "") {
      const newTimer = setTimeout(() => {
        const result = chatMocData.find((chat) => chat.roomName === value);
        setFilteredChat(result);
        if (result) {
          dispatch(ChatSlice.actions.addRoom(result));
        } else {
          dispatch(ChatSlice.actions.deleteRoom());
        }
      }, 500);
      setTimer(newTimer);
    }
  };

  return (
    <div
      style={{
        padding: "15px",
        fontFamily: "dunggeunmo-bold",
        fontSize: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            value={input}
            onChange={handleSearch}
            placeholder="Search..."
            style={{ fontFamily: "dunggeunmo" }}
          />
        </div>
      </div>
      <SearchRoom room={room} />
    </div>
  );
};

export default SearchPage;
