import React, { useEffect, useState } from "react";
import { WindowContent, Tabs, Tab, ScrollView } from "react95";
import { Row } from "antd";
import BlockUser from "../friendList/components/BlockUser";
import FriendUser from "../friendList/components/FriendUser";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import FriendSearch from "../friendList/components/FriendSearch";
import { useGetFriendQuery } from "@/redux/Api/Friend";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/RootStore";
import H3 from "../PostComponents/H3";

const FriendList = () => {
  const [state, setState] = useState({ activeTab: 0 });
  const router = useRouter();
  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );
  const { data, isFetching, refetch } = useGetFriendQuery(owner);

  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setState({ activeTab: value });
  };

  const close = async () => {
    router.back();
    if (data) {
      await refetch();
    }
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
                    <FriendUser key={index} uId={user} />
                  ))}
                </>
              )}
              {activeTab === 1 && data?.blockedList && (
                <>
                  {data.blockedList.map((user, index) => (
                    <BlockUser key={index} uId={user} />
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
