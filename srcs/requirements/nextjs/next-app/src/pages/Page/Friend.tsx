import React, { useState } from "react";
import { WindowContent, Tabs, Tab, ScrollView } from "react95";
import { Row } from "antd";
import { mocUserData } from "@/moc/user";
import BlockUser from "../friendList/components/BlockUser";
import FriendUser from "../friendList/components/FriendUser";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import H3 from "../PostComponents/H3";
import FriendSearch from "../friendList/components/FriendSearch";
import { useGetFriendQuery } from "@/redux/Api/Friend";
import { useGetAuthQuery } from "@/redux/Api/Auth";

const FriendList = () => {
  const [state, setState] = useState({ activeTab: 0 });
  const router = useRouter();
  const {
    data: authData,
    error: authError,
    isLoading: authLoading,
  } = useGetAuthQuery();
  const { data, error, isLoading } = useGetFriendQuery(authData?.uid ?? 1);

  console.log(data);
  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setState({ activeTab: value });
  };

  const close = () => {
    router.back();
  };

  const { activeTab } = state;
  return (
    <AppLayout>
      <MyModal hName="친구목록" close={close}>
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab value={0}>
            <span
              style={{
                fontFamily: "dunggeunmo-bold",
                fontSize: "22px",
                width: "100px",
              }}
            >
              친구
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
              차단
            </span>
          </Tab>
          <Tab value={2}>
            <span
              style={{
                fontFamily: "dunggeunmo-bold",
                fontSize: "22px",
                width: "100px",
              }}
            >
              팔로우
            </span>
          </Tab>
        </Tabs>
        <WindowContent>
          <Row>
            <ScrollView
              shadow={false}
              style={{ width: "100%", height: "420px" }}
            >
              {activeTab === 0 && data?.friendList && (
                <>
                  {data.friendList.map((user, index) => (
                    <FriendUser
                      key={index}
                      userNickName={user.nickname}
                      stateOn={true} // TODO: 나중에 상태값으로 변경
                      uId={user.uid}
                    />
                  ))}
                </>
              )}
              {activeTab === 1 && data?.blockedList && (
                <>
                  {data.blockedList.map((user, index) => (
                    <BlockUser
                      key={index}
                      userNickName={user.nickname}
                      uId={user.uid}
                    />
                  ))}
                </>
              )}
              {activeTab === 2 && <FriendSearch />}
            </ScrollView>
          </Row>
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default FriendList;
