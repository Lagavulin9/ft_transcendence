import { chatMocData } from "@/moc/chat";
import Spacer from "@/pages/globalComponents/Spacer";
import H1 from "@/pages/PostComponents/H1";
import H3 from "@/pages/PostComponents/H3";
import { useGetAllQuery, useGetChatRoomQuery } from "@/redux/Api/ChatRoom";
import { useGetUserQuery } from "@/redux/Api/Profile";
import { RootState } from "@/redux/RootStore";
import { emitEvent, onError } from "@/utils/socket";
import { data } from "autoprefixer";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, ScrollView } from "react95";

const RoomList = () => {
  const router = useRouter();

  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );

  const {
    data: chatData,
    error: chatError,
    isFetching: chatRoomIsFetching,
    refetch,
  } = useGetAllQuery(owner);

  const ChatRoomJoin = (index: number) => {
    emitEvent("join", {
      roomName: chatData?.[index].roomName,
      roomType: chatData?.[index].roomType,
      target: "",
      msg: "",
      password: "",
    });
    onError("error", () => {
      return;
    });
    router.push(
      {
        pathname: "/Page/Room",
        query: { roomName: chatData?.[index].roomName },
      },
      undefined,
      { shallow: false }
    );
  };

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 5000);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [refetch]);

  if (chatRoomIsFetching) {
    return <H3>...로딩중</H3>;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <ScrollView style={{ width: "100%", height: "430px" }}>
        {chatData?.map((chat, index) => {
          return (
            <>
              <div
                key={index}
                style={{
                  display: "flex",
                  fontFamily: "dunggeunmo-bold",
                  fontSize: "22px",
                  margin: "5px",
                }}
              >
                <span style={{ width: "80%" }}>{chat.roomName}</span>
                <Button
                  style={{
                    width: "20%",
                  }}
                  onClick={() => ChatRoomJoin(index)}
                >
                  참가
                </Button>
              </div>
              <div
                style={{ width: "100", height: "2px", backgroundColor: "#999" }}
              ></div>
            </>
          );
        })}
      </ScrollView>
    </div>
  );
};

export default RoomList;
