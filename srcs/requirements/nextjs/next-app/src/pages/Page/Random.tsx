import React, { useState } from "react";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import { Button, WindowContent } from "react95";
import H3 from "../PostComponents/H3";
import { useSelector } from "react-redux";
import RootState from "@/redux/RootReducer";

interface User {
  uId: number;
  uNickName: string;
}

const Random = () => {
  const router = useRouter();
  const [isMatch, setIsMatch] = useState(false);
  const [guestUser, setGuestUser] = useState<User>({ uId: 0, uNickName: "" });
  const host = useSelector((state: RootState) => state.user);

  const close = () => {
    router.back();
  };

  const Match = () => {
    // TODO : 랜덤 요청
    // isMatch 바꿔주기
  };

  const Start = () => {
    // TODO: 게임시작 Router(Page/Game)
  };

  return (
    <AppLayout>
      <MyModal hName="랜덤매칭" close={close}>
        <WindowContent style={{ marginTop: "150px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div>
              <H3>{host.nickName === "" ? `플레이어1` : `${host.nickName}`}</H3>
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "40px",
            }}
          >
            {isMatch ? (
              <Button
                style={{
                  width: "10vw",
                }}
                onClick={Start}
              >
                <H3>시작</H3>
              </Button>
            ) : (
              <Button
                style={{
                  width: "10vw",
                }}
                onClick={Match}
              >
                <H3>매칭</H3>
              </Button>
            )}
          </div>
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default Random;
