import React, { useState } from "react";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import { useRouter } from "next/router";
import { WindowContent, Tabs, Tab, ScrollView } from "react95";
import { Row } from "antd";
import SearchPage from "../chat/components/SearchPage";
import RoomList from "../chat/components/RoomList";
import RoomCreate from "../chat/components/RoomCreate";
import { offEvent } from "@/utils/socket";

const ChatList = () => {
  const [state, setState] = useState({ activeTab: 0 });
  const router = useRouter();

  const close = () => {
    router.back();
    offEvent("join");
  };
  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setState({ activeTab: value });
  };
  const { activeTab } = state;

  return (
    <AppLayout>
      <MyModal hName="채팅" close={close}>
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab value={0}>
            <span
              style={{
                fontFamily: "dunggeunmo-bold",
                fontSize: "22px",
                width: "100px",
              }}
            >
              채팅목록
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
              채널찾기
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
              채널생성
            </span>
          </Tab>
        </Tabs>
        <WindowContent>
          {activeTab === 0 && <RoomList />}
          {activeTab === 1 && (
            <Row>
              <ScrollView
                shadow={false}
                style={{ width: "100%", height: "430px" }}
              >
                <SearchPage />
              </ScrollView>
            </Row>
          )}
          {activeTab === 2 && <RoomCreate />}
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default ChatList;
