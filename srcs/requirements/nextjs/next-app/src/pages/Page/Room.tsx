import { Grid, Row } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  WindowContent,
  ScrollView,
  Tabs,
  Tab,
  TextInput,
} from "react95";
import MessageCard from "../chat/components/MessageCard";
import GameMode from "@/pages/game/GameMode";
import ChatInput from "../chat/components/ChatInput";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import { useGetAllQuery, useGetChatRoomQuery } from "@/redux/Api/ChatRoom";
import { emitEvent, offEvent, onError, onEvent } from "@/utils/socket";
import { ReqSocketDto, ResMsgDto, resChatDto } from "@/types/ChatDto";
import { AppDispatch, RootState } from "@/redux/RootStore";
import { socket } from "@/utils/socket";
import H3 from "../PostComponents/H3";
import RoomAction from "../chat/components/RoomAction";
import { off } from "process";
import { GameRoom, GameRoomDto } from "@/types/GameDto";
import roomSlice, { fetchRoom } from "@/redux/Slice/Room";

const ChatRoom = () => {
  const [state, setState] = useState({ activeTab: 0 });
  const [msg, setMsg] = useState<ResMsgDto[]>([]);
  const [isMute, setIsMute] = useState(false);
  const [isBan, setIsBan] = useState(false);
  const [isKick, setIsKick] = useState(false);
  const [isBlba, setIsBlba] = useState(false);
  const [isRoomAction, setIsRoomAction] = useState(false);
  const [comment, setComment] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [room, setRoom] = useState<resChatDto>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { roomName } = router.query;
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

  const openGameMode = (uid: number) => {
    console.log(`openGameMode: ${uid}`);
    console.log(chatRoomData);
    router.push(
      {
        pathname: "/Page/Game",
        query: { isHost: "Host", hostId: owner, guestId: uid },
      },
      undefined,
      { shallow: false }
    );
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
    setIsRoomAction(false);
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
    await offEvent("banned");
    await offEvent("wrongpass");
    await offEvent("passok");
    await offEvent("already");
    await offEvent("message");
    await offEvent("DM");

    router.back();
  }, [chatRoomData, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (RoomListLoading) {
        chatRoomRefetch();
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [chatRoomRefetch]);

  useEffect(() => {
    setIsRoomAction(false);
    socket.on("mute", () => {
      setIsMute(true);
      const timer = setTimeout(() => {
        setIsMute(false);
      }, 1000 * 60);
    });

    socket.on("leave", () => {
      if (chatRoomData) {
        chatRoomRefetch();
      }
    });

    socket.on("kick", (data) => {
      console.log(data);
      setIsRoomAction(true);
      setComment("님 추방임 ㅅㄱ ㅋㅋ");
    });

    socket.on("ban", (data) => {
      console.log(data);
      setIsRoomAction(true);
      setComment("님 차단당함 이제 못들어옴 ㅋㅋ");
    });

    socket.on("banned", () => {
      setIsRoomAction(true);
      setComment("차단당함 이제 못들어옴 ㅋㅋ");
    });

    socket.on("wrongpass", () => {
      setPassword("");
      setTimeout(() => alert("비밀번호가 틀렸습니다."), 2);
    });

    socket.on("passok", (data: resChatDto) => {
      console.log(data);
      setRoom(data);
      setSuccess(true);
      chatRoomRefetch();
    });

    socket.on("wrongpass", () => {
      console.log("wrongpass");
    });

    socket.on("already", () => {
      setSuccess(true);
    });

    onEvent("usermod", () => {
      console.log("usermod");
      if (chatRoomData) {
        chatRoomRefetch();
      }
    });

    const handleMessage = (data: ResMsgDto) => {
      console.log(`message: ${data}`);
      data.isDm = false;
      setMsg((prevMsg) => [...prevMsg, data]);
    };

    const handleDM = (data: ResMsgDto) => {
      console.log(`DM: ${data}`);
      data.isDm = true;
      setMsg((prevMsg) => [...prevMsg, data]);
    };

    onEvent("message", handleMessage);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    onEvent("DM", handleDM);

    onEvent("game-invite", (data: GameRoom) => {
      // 상태 업데이트 이벤트 핸들링
      console.log(data);
      dispatch(
        fetchRoom({
          gameRoom: {
            host: data.host,
            guest: data.guest,
            game_start: data.game_start,
          },
        })
      );
      router.push(
        {
          pathname: "/Page/Game",
          query: {
            isHost: "Guest",
            hostId: data.host,
            guestId: data.guest,
            normal: data.isNormal,
          },
        },
        undefined,
        { shallow: false }
      );
    });
  }, [chatRoomRefetch, dispatch, isMute, owner, router]);

  const onAlba = async (uid: number) => {
    setIsBlba(true);
    await emitEvent("usermod", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: uid,
      msg: "",
      password: "",
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
  };

  const onMute = async (uid: number) => {
    await emitEvent("mute", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: uid,
      msg: "",
      password: "",
    });
  };

  const onPassword = async () => {
    await emitEvent("password", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: "",
      msg: "",
      password: password,
    });
  };

  if (chatRoomData?.roomType === "Protected" && success === false) {
    return (
      <AppLayout>
        <MyModal hName={chatRoomData?.roomName ?? "채팅룸"} close={close}>
          <div
            style={{
              display: "flex",
              fontFamily: "dunggeunmo-bold",
              fontSize: "20px",
              marginTop: "200px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요..."
              style={{ width: "300px" }}
            />
            <Button
              disabled={password.length === 0}
              style={{ marginLeft: "20px", fontSize: "23px", width: "80px" }}
              onClick={onPassword}
            >
              확인
            </Button>
          </div>
        </MyModal>
      </AppLayout>
    );
  }

  if (chatRoomData?.roomType !== "Protected" && success === false) {
    socket.emit("password", {
      roomName: chatRoomData?.roomName,
      roomType: chatRoomData?.roomType,
      target: "",
      msg: "",
      password: "",
    });
    return (
      <AppLayout>
        <MyModal hName={chatRoomData?.roomName ?? "채팅룸"} close={close}>
          <div
            style={{
              display: "flex",
              fontFamily: "dunggeunmo-bold",
              fontSize: "20px",
              marginTop: "200px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            로딩중...
          </div>
        </MyModal>
      </AppLayout>
    );
  }

  if (isRoomAction === true) {
    return (
      <AppLayout>
        <MyModal hName={chatRoomData?.roomName ?? "채팅룸"} close={close}>
          <div
            style={{
              display: "flex",
              fontFamily: "dunggeunmo-bold",
              fontSize: "20px",
              marginTop: "200px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RoomAction comment={comment} />
          </div>
        </MyModal>
      </AppLayout>
    );
  }

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
                              onClick={() => openGameMode(User.uid)}
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
        {chatRoomData && (
          <ChatInput isMute={isMute} chatRoomData={chatRoomData} />
        )}
      </MyModal>
    </AppLayout>
  );
};

export default ChatRoom;
function useAppdispatch() {
  throw new Error("Function not implemented.");
}
