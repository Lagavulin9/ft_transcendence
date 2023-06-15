import { useGetAuthQuery } from "@/redux/Api/Auth";
import { useBlockFriendMutation, useGetFriendQuery } from "@/redux/Api/Friend";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "react95";

interface User {
  userNickName: string;
  stateOn: boolean;
  uId: number;
}

const FriendUser = ({ userNickName, stateOn, uId }: User) => {
  const router = useRouter();
  const openProfile = () => {
    document.body.style.overflow = "hidden";
    router.push({ pathname: "/Page/Profile", query: { uId } }, undefined, {
      shallow: false,
    });
  };
  const { data, error, isLoading } = useGetAuthQuery();
  const [BlockUser] = useBlockFriendMutation();
  const { refetch } = useGetFriendQuery(data?.uid ?? 1);
  // TODO: 차단할때 사용할 API콜함수

  const blockFriend = async () => {
    await BlockUser({ uid: data?.uid ?? 1, target: uId });
    refetch();
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
          <div
            style={{
              marginRight: "8px",
              backgroundColor: stateOn ? "green" : "red",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              marginLeft: "10px",
            }}
          ></div>
        </div>
        <div>
          <Button style={{ width: "10vw" }} onClick={openProfile}>
            <span
              style={{
                fontFamily: "dunggeunmo-bold",
                fontSize: "18px",
                width: "200px",
              }}
            >
              프로필
            </span>
          </Button>
          <Button style={{ width: "10vw" }} onClick={blockFriend}>
            <span
              style={{
                fontFamily: "dunggeunmo-bold",
                fontSize: "18px",
                width: "200px",
              }}
            >
              차단
            </span>
          </Button>
        </div>
      </div>
      <div
        style={{ width: "100", height: "2px", backgroundColor: "#999" }}
      ></div>
    </div>
  );
};

export default FriendUser;
