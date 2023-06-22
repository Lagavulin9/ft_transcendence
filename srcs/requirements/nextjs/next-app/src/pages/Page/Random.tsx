import React, { useEffect, useState } from "react";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import { Button, WindowContent } from "react95";
import H3 from "../PostComponents/H3";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/RootStore";
import { useGetUserQuery } from "@/redux/Api/Profile";
import { emitEvent, onEvent } from "@/utils/socket";
import { GameRoom, GameRoomDto } from "@/types/GameDto";

interface User {
  uId: number;
  uNickName: string;
}

const Random = () => {
  const router = useRouter();
  const [isMatch, setIsMatch] = useState(false);
  const [guestUser, setGuestUser] = useState<User>({ uId: 0, uNickName: "" });
  const [room, setRoom] = useState<GameRoom>({} as GameRoom);

  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );
  const { data, isFetching, refetch } = useGetUserQuery(owner);

  const close = () => {
    router.back();
  };

  const Start = () => {
    // TODO: 게임시작 Router(Page/Game)
    router.push(
      {
        pathname: "/Page/Game",
        query: {
          isHost: room.host === owner ? "Host" : "Guest",
          hostId: room.host,
          guestId: room.guest,
          normal: room.isNormal,
        },
      },
      undefined,
      { shallow: false }
    );
  };

  const match = () => {
    emitEvent("random-matching");
  };

  useEffect(() => {
    onEvent("waiting", () => {});
    onEvent("game-start", (data: GameRoomDto) => {
      setRoom({
        host: data.host.uid,
        guest: data.guest.uid,
        game_start: data.game_start,
        isNormal: true,
      });
      setIsMatch(true);
    });

    if (room.host !== owner) {
      onEvent("game-invite", (data: GameRoom) => {
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
    }
  }, [owner, room.host, router]);

  return (
    <AppLayout>
      <MyModal hName="랜덤매칭" close={close}>
        <WindowContent style={{ marginTop: "150px" }}>
          {data && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <div>
                  <H3>
                    {data.nickname === "" ? `플레이어1` : `${data.nickname}`}
                  </H3>
                </div>
                <div>
                  <H3>
                    {guestUser.uNickName === ""
                      ? `플레이어?`
                      : `${guestUser.uNickName}`}
                  </H3>
                </div>
              </div>
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button onClick={match} style={{ width: "100px" }}>
                  <H3>매칭</H3>
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "40px",
                }}
              >
                {isMatch && (
                  <Button
                    disabled={room.host !== owner}
                    style={{
                      width: "10vw",
                    }}
                    onClick={Start}
                  >
                    <H3>시작</H3>
                  </Button>
                )}
              </div>
            </>
          )}
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default Random;
