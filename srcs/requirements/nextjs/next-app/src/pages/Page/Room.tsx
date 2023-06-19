import { Grid, Row } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, WindowContent, ScrollView, Tabs, Tab } from "react95";
import MessageCard from "../chat/components/MessageCard";
import GameMode from "@/pages/game/GameMode";
import ChatInput from "../chat/components/ChatInput";
import { useSelector } from "react-redux";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import { useGetAllQuery, useGetChatRoomQuery } from "@/redux/Api/ChatRoom";
import { emitEvent, offEvent, onError, onEvent } from "@/utils/socket";
import { ReqSocketDto, ResMsgDto } from "@/types/ChatDto";
import { RootState } from "@/redux/RootStore";
import H3 from "../PostComponents/H3";

const ChatRoom = () => {
  const [input, setInput] = useState("");
  const [isGameMode, setIsGameMode] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [isDm, setIsDm] = useState(false);
  const [state, setState] = useState({ activeTab: 0 });
  const [msg, setMsg] = useState<ResMsgDto[]>([]);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const { roomName } = router.query;
  const [isMute, setIsMute] = useState(false);
  const [isBan, setIsBan] = useState(false);
  const [isKick, setIsKick] = useState(false);
  const [isBlba, setIsBlba] = useState(false);

  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );

  if (roomName === undefined || roomName === null) {
    return null;
  }

  const {
    data: chatRoomData,
    refetch: chatRoomRefetch,
    isFetching: RoomListLoading,
  } = useGetChatRoomQuery(roomName as string);

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" }); // 참조된 요소가 보이도록 스크롤
    }
  }, [scrollBottomRef]);

  const openGameMode = () => {
    router.push("/Page/Game", "Page/Game", { shallow: false });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    value.length > 100 ? alert("100자 이내로 입력해주세요") : setInput(value);
  };

  const sendMsg = () => {
    if (input.length === 0) {
      return;
    }
    if (chatRoomData) {
      const tmp = {
        roomName: chatRoomData.roomName,
        roomType: chatRoomData.roomType,
        target: "",
        msg: input,
        password: "",
      } as ReqSocketDto;
      emitEvent("message", tmp);
      setInput("");
    }
  };

  const openProfile = (uId: number) => {
    document.body.style.overflow = "hidden";
    router.push({ pathname: "/Page/Profile", query: { uId } }, undefined, {
      shallow: false,
    });
  };

  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setState({ activeTab: value });
  };

  const { activeTab } = state;

  const close = useCallback(async () => {
    console.log("close");
    if (chatRoomData) {
      const tmp = {
        roomName: chatRoomData.roomName,
        roomType: chatRoomData.roomType,
        target: "",
        msg: "",
        password: "",
      } as ReqSocketDto;
      emitEvent("leave", tmp);
    }
    await offEvent("kick");
    await offEvent("ban");
    await offEvent("mute");
    await offEvent("usermod");
    await offEvent("message");
    await offEvent("DM");
    router.back();
  }, [chatRoomData, router]);

  useEffect(() => {
    // 메시지 이벤트 리스너 등록
    const handleMessage = (data: ResMsgDto) => {
      data.isDm = false;
      setMsg((prevMsg) => [...prevMsg, data]);
    };

    const handleDM = (data: ResMsgDto) => {
      data.isDm = true;
      setMsg((prevMsg) => [...prevMsg, data]);
    };

    onEvent("message", handleMessage);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    onEvent("DM", handleDM);

    // 게임 게스트 입장 이벤트 리스너 등록
  }, [chatRoomRefetch]);

  useEffect(() => {
    const timer = setInterval(() => {
      chatRoomRefetch();
    }, 5000);
    return () => clearInterval(timer);
  }, [chatRoomRefetch]);

  useEffect(() => {
    onEvent("mute", () => {
      setIsMute(true);
      const timer = setTimeout(() => {
        setIsMute(false);
      }, 1000 * 60);
    });

    onEvent("leave", () => {
      chatRoomRefetch();
    });

    onEvent("kick", (data) => {
      console.log(data);
      close();
    });
  }, [close, isMute, chatRoomRefetch, RoomListLoading]);

  const onAlba = async (uid: number) => {
    setIsBlba(true);
    await emitEvent("usermod", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: uid,
      msg: "",
      password: "",
    });

    await onEvent("usermod", () => {
      console.log("usermod");
      chatRoomRefetch();
    });
  };

  const onKick = async (uid: number) => {
    setIsKick(!isKick);
    await emitEvent("kick", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: uid,
      msg: "",
      password: "",
    });

    await onEvent("kicknotice", (data) => {
      console.log(data);
      chatRoomRefetch();
    });
  };

  const onBan = async (uid: number) => {
    setIsBan(!isBan);
    await emitEvent("ban", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: uid,
      msg: "",
      password: "",
    });

    await onEvent("ban", () => {
      chatRoomRefetch();
    });
  };

  const onMute = async (uid: number) => {
    setIsMute(!isMute);
    await emitEvent("mute", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: uid,
      msg: "",
      password: "",
    });

    await onEvent("mute", () => {
      chatRoomRefetch();
    });
  };

  return (
    <AppLayout>
      <MyModal hName={chatRoomData?.roomName ?? "채팅룸"} close={close}>
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab value={0}>
            <span
              style={{
                fontFamily: "dunggeunmo-bold",
                fontSize: "22px",
                width: "200px",
              }}
            >
              채팅로그
            </span>
          </Tab>
          <Tab value={1}>
            <span
              style={{
                fontFamily: "dunggeunmo-bold",
                fontSize: "22px",
                width: "200px",
              }}
            >
              {`유저목록 (${chatRoomData?.participants.length})`}
            </span>
          </Tab>
        </Tabs>
        <WindowContent>
          <Row>
            <ScrollView
              shadow={false}
              style={{ width: "100%", height: "380px" }}
            >
              {activeTab === 0 &&
                msg.map((data, index) => {
                  return (
                    <div key={index}>
                      <MessageCard
                        Data={data}
                        isMe={data.uid === owner ? true : false}
                        isDm={data.isDm}
                      />
                      <div ref={scrollBottomRef} />
                    </div>
                  );
                })}
              {activeTab === 1 &&
                chatRoomData?.participants.map((User, index) => {
                  const isAlba = chatRoomData.roomAlba?.find(
                    (alba) => alba.uid === User.uid
                  );

                  return (
                    <div key={index}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontFamily: "dunggeunmo-bold",
                          fontSize: "20px",
                        }}
                      >
                        {`${
                          chatRoomData.roomOwner.uid === User.uid
                            ? "👑"
                            : isAlba?.uid === User.uid
                            ? "😎"
                            : ""
                        } ${User.nickname}`}

                        {User.uid !== owner && (
                          <div>
                            {/* 자기 자신이 방장이고, 대상 유저가 일반인 경우 */}
                            {owner === chatRoomData.roomOwner.uid &&
                              chatRoomData.roomAlba.findIndex(
                                (alba) => alba.uid === owner
                              ) <= 0 && (
                                <Button
                                  onClick={() => onAlba(User.uid)}
                                  disabled={isBlba}
                                >
                                  알바고용
                                </Button>
                              )}

                            {/* 자기 자신이 알바이거나 방장일 때 */}
                            {chatRoomData.roomAlba.findIndex(
                              (alba) => alba.uid === owner
                            ) >= 0 &&
                              User.uid !== chatRoomData.roomOwner.uid && (
                                <>
                                  <Button onClick={() => onBan(User.uid)}>
                                    차단
                                  </Button>
                                  <Button onClick={() => onKick(User.uid)}>
                                    강퇴
                                  </Button>
                                  <Button onClick={() => onMute(User.uid)}>
                                    뮤트
                                  </Button>
                                </>
                              )}

                            <Button
                              style={{
                                fontFamily: "dunggeunmo-bold",
                                fontSize: "17px",
                              }}
                              onClick={() => openProfile(User.uid)}
                            >
                              프로필
                            </Button>
                            <Button
                              style={{
                                fontFamily: "dunggeunmo-bold",
                                fontSize: "17px",
                              }}
                              onClick={openGameMode}
                            >
                              게임하기
                            </Button>
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          width: "100",
                          height: "2px",
                          backgroundColor: "#999",
                          marginBottom: "5px",
                        }}
                      />
                    </div>
                  );
                })}
              <div ref={scrollBottomRef} />
            </ScrollView>
          </Row>
        </WindowContent>
        <ChatInput
          input={input}
          func={handleInput}
          click={sendMsg}
          isMute={isMute}
        />
      </MyModal>
    </AppLayout>
  );
};

export default ChatRoom;
