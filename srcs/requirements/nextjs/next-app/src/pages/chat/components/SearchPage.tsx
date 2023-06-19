import React, { useState } from "react";
import { TextInput } from "react95";
import { chatMocData } from "@/moc/chat";
import { chat } from "@/types/ChatType";
import SearchRoom from "./SearchRoom";
import { useDispatch, useSelector } from "react-redux";
import { ChatSlice } from "@/redux/Slice/Chat";
import RootState from "@/redux/RootReducer";
import { useGetChatRoomQuery } from "@/redux/Api/ChatRoom";

const SearchPage = () => {
  const [input, setInput] = useState("");
  const [filteredChat, setFilteredChat] = useState<chat>();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const {
    data: chatRoomData,
    error: chatRoomError,
    isFetching: chatRoomIsFetching,
    refetch: chatRoomRefetch,
  } = useGetChatRoomQuery(input, { skip: input === "" });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
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
      {!chatRoomIsFetching && !chatRoomError && (
        <SearchRoom room={chatRoomData} />
      )}
    </div>
  );
};

export default SearchPage;
