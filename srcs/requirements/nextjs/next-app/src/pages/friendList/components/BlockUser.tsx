import { useGetAuthQuery } from "@/redux/Api/Auth";
import {
  useBlockFriendMutation,
  useGetFriendQuery,
  useUnBlockFriendMutation,
} from "@/redux/Api/Friend";
import { RootState } from "@/redux/RootStore";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "react95";

interface User {
  userNickName: string;
  uId: number;
  func: () => void;
}

const BlockUser = ({ userNickName, uId, func }: User) => {
  const [BlockUser] = useUnBlockFriendMutation();
  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );
  const { refetch } = useGetFriendQuery(owner);

  const cancelBlock = async () => {
    await BlockUser({ uid: owner, target: uId });
    func();
  };

  return (
    <div
      style={{
        padding: "15px",
        fontFamily: "dunggeunmo-bold",
        fontSize: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {userNickName ? userNickName : "user1"}
        </div>
        <Button style={{ width: "10vw" }} onClick={cancelBlock}>
          해제
        </Button>
      </div>
      <div
        style={{ width: "100", height: "2px", backgroundColor: "#999" }}
      ></div>
    </div>
  );
};

export default BlockUser;
