import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import H1 from "../PostComponents/H1";
import { ScrollView, Tab, Tabs, WindowContent } from "react95";
import { Grid, Row } from "antd";
import UserInfo from "../profile/UserInfo";
import MyModal from "../globalComponents/MyModal";
import AppLayout from "../globalComponents/AppLayout";
import { useGetUserQuery } from "@/redux/Api/Profile";
import { RootState } from "@/redux/RootStore";
import ProfileUpdate from "../profile/ProfileUpdate";
import GameLog from "../profile/GameLog";

const Profile = () => {
  const [state, setState] = useState({ activeTab: 0 });
  const router = useRouter();
  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );
  const { uId } = router.query;
  const uid = Number(uId);

  const {
    data: userData,
    error: userError,
    isFetching: userFetching,
  } = useGetUserQuery(uid);

  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setState({ activeTab: value });
  };

  const close = () => {
    router.back();
  };

  if (userFetching) {
    return (
      <AppLayout>
        <MyModal hName="프로필" close={close}>
          <H1>...로딩중</H1>
        </MyModal>
      </AppLayout>
    );
  }

  if (userData) {
    return (
      <AppLayout>
        <MyModal hName="프로필" close={close}>
          <Tabs value={state.activeTab} onChange={handleChange}>
            <Tab value={0}>
              <span
                style={{
                  fontFamily: "dunggeunmo-bold",
                  fontSize: "22px",
                  width: "100px",
                }}
              >
                유저정보
              </span>
            </Tab>
            <Tab value={1}>
              <span
                style={{
                  fontFamily: "dunggeunmo-bold",
                  fontSize: "22px",
                  width: "100px",
                }}
              >
                게임로그
              </span>
            </Tab>
            {owner === uid && (
              <Tab value={2}>
                <span
                  style={{
                    fontFamily: "dunggeunmo-bold",
                    fontSize: "22px",
                    width: "100px",
                  }}
                >
                  수정하기
                </span>
              </Tab>
            )}
          </Tabs>
          <WindowContent>
            <Row>
              <ScrollView
                shadow={false}
                style={{ width: "100%", height: "430px" }}
              >
                {state.activeTab === 0 && <UserInfo user={userData} />}
                {state.activeTab === 1 && <GameLog uid={uid} />}
                {state.activeTab === 2 && <ProfileUpdate uid={uid} />}
              </ScrollView>
            </Row>
          </WindowContent>
        </MyModal>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <MyModal hName="프로필" close={close}>
        <H1>유저를 선택하세요</H1>
      </MyModal>
    </AppLayout>
  );
};

export default Profile;
