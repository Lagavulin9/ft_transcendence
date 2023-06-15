import { chatMocData } from "@/moc/chat";
import Spacer from "@/pages/globalComponents/Spacer";
import H1 from "@/pages/PostComponents/H1";
import H3 from "@/pages/PostComponents/H3";
import { useGetAllQuery } from "@/redux/Api/ChatRoom";
import { data } from "autoprefixer";
import React from "react";
import { Button, ScrollView } from "react95";

const RoomList = () => {
  const {
    data: chatData,
    error: chatError,
    isLoading: chatLoading,
    refetch,
  } = useGetAllQuery();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <ScrollView style={{ width: "60%", height: "430px" }}>
        {chatData?.map((chat, index) => {
          return <Button key={index}>{chat.roomName}</Button>;
        })}
      </ScrollView>
      <div
        style={{
          paddingLeft: "20px",
          flexDirection: "row",
          borderColor: "#999",
          borderWidth: "2px",
        }}
      >
        <H1>{`룸정보`}</H1>
        <Spacer />
        <H3>{`Name: `}</H3>
        <div style={{ padding: "5px" }}></div>
        <H3>{`Connect Users: `}</H3>
        <div style={{ padding: "5px" }}></div>
        <H3>{`Type: `}</H3>
        <div style={{ padding: "5px" }}></div>
      </div>
    </div>
  );
};

export default RoomList;
