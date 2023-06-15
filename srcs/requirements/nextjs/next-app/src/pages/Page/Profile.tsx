import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { resetProfile } from "@/redux/Slice/Profile";
import H1 from "../PostComponents/H1";
import { ScrollView, Tab, Tabs, WindowContent } from "react95";
import { Grid, Row } from "antd";
import UserInfo from "../profile/UserInfo";
import MyModal from "../globalComponents/MyModal";
import AppLayout from "../globalComponents/AppLayout";
import { AppDispatch, RootState } from "@/redux/RootStore";
import { useGetUserQuery } from "@/redux/Api/Profile";
import { useGetAuthQuery, useLoginMutation } from "@/redux/Api/Auth";
import { useGetFriendQuery } from "@/redux/Api/Friend";
import { createSelector } from "@reduxjs/toolkit";

const Profile = () => {
  const [state, setState] = useState({ activeTab: 0 });
  const router = useRouter();
  const { uId } = router.query;
  const {
    data: authData,
    error: authError,
    isLoading: authLoading,
  } = useGetAuthQuery();

  const uid = Number(uId);

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
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

  if (userData && !userLoading) {
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
            {authData?.uid === uid && (
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
                {state.activeTab === 1 && <H1>게임로그</H1>}
                {state.activeTab === 2 && <H1>프로필수정</H1>}
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
