import { Grid, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Button, WindowContent, ScrollView, Tabs, Tab } from "react95";
import MessageCard from "../chat/components/MessageCard";
import GameMode from "@/pages/game/GameMode";
import ChatInput from "../chat/components/ChatInput";
import { useSelector } from "react-redux";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import { useGetAllQuery, useGetChatRoomQuery } from "@/redux/Api/ChatRoom";
import { emitEvent, onError, onEvent } from "@/utils/socket";
import { ReqSocketDto, ResMsgDto } from "@/types/ChatDto";
import { RootState } from "@/redux/RootStore";

const { useBreakpoint } = Grid;

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

  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );

  const {
    data: chatRoomData,
    refetch: chatRoomRefetch,
    isLoading: RoomListLoading,
  } = useGetChatRoomQuery(roomName as string);

  const { refetch: RoomListRefetch } = useGetAllQuery();

  const screens = useBreakpoint();
  const scrollBottomRef = useRef<HTMLDivElement>(null); // 참조 생성

  // TODO: 서버와 연결시 여기에서 다시 ChatRoom 최신정보 가져오기

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" }); // 참조된 요소가 보이도록 스크롤
    }
  }, [scrollBottomRef]); // mocContentData가 변경될 때마다 실행

  const openGameMode = () => {
    setIsGameMode(true);
  };

  const closeGameMode = () => {
    setIsGameMode(false);
  };

  const handleGameMode = (value: boolean) => {
    setIsNormal(value);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    value.length > 100 ? alert("100자 이내로 입력해주세요") : setInput(value);
  };

  const sendMsg = () => {
    setDisabled(true);
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
    setDisabled(false);
  };

  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setState({ activeTab: value });
  };

  const { activeTab } = state;

  const close = () => {
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
    chatRoomRefetch();
    RoomListRefetch();
    router.back();
  };

  useEffect(() => {
    // 메시지 이벤트 리스너 등록
    const handleMessage = (data: ResMsgDto) => {
      setMsg((prevMsg) => [...prevMsg, data]);
    };

    const handleDM = (data: ResMsgDto) => {
      data.isDm = true;
      setMsg((prevMsg) => [...prevMsg, data]);
    };

    const handleNotice = async (data: ResMsgDto) => {
      chatRoomRefetch();
      RoomListRefetch();
    };

    onEvent("message", handleMessage);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    onEvent("DM", handleDM);
    onEvent("notice", handleNotice);
    return () => {
      onError("message", handleMessage);
    };
  }, []);

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
                      />
                      <div ref={scrollBottomRef} />
                    </div>
                  );
                })}
              {activeTab === 1 &&
                chatRoomData?.participants.map((User, index) => {
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
                        {User.nickname}
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
          disabled={disabled}
        />
      </MyModal>
    </AppLayout>

    // {isGameMode && (
    //   <GameMode close={closeGameMode} gameMode={handleGameMode} />
    // )}
  );
};

export default ChatRoom;
