import { chatMocData } from "@/moc/chat";
import Spacer from "@/pages/globalComponents/Spacer";
import H1 from "@/pages/PostComponents/H1";
import H3 from "@/pages/PostComponents/H3";
import { useGetAllQuery, useGetChatRoomQuery } from "@/redux/Api/ChatRoom";
import { useGetUserQuery } from "@/redux/Api/Profile";
import { AppDispatch, RootState } from "@/redux/RootStore";
import { resChatDto } from "@/types/ChatDto";
import { emitEvent, onError, onEvent } from "@/utils/socket";
import { data } from "autoprefixer";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const ChatRoomJoin = async (index: number) => {
    console.log(chatData?.[index].roomName);
    await emitEvent("join", {
      roomName: chatData?.[index].roomName,
      roomType: chatData?.[index].roomType,
      target: "",
      msg: "",
      password: "",
    });
  };

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 2000);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [refetch]);

  useEffect(() => {
    onEvent("join", (data: resChatDto) => {
      console.log(data);
      router.push(
        {
          pathname: "/Page/Room",
          query: { roomName: data.roomName },
        },
        undefined,
        { shallow: false }
      );
    });
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <ScrollView style={{ width: "100%", height: "430px" }}>
        {chatData?.map((chat, index) => {
          if (chat.roomType !== "Private") {
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
                  style={{
                    width: "100",
                    height: "2px",
                    backgroundColor: "#999",
                  }}
                ></div>
              </>
            );
          }
        })}
      </ScrollView>
    </div>
  );
};

export default RoomList;
