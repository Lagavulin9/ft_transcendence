import H3 from "@/pages/PostComponents/H3";
import { useGetAuthQuery } from "@/redux/Api/Auth";
import { useBlockFriendMutation, useGetFriendQuery } from "@/redux/Api/Friend";
import { useGetUserQuery } from "@/redux/Api/Profile";
import { RootState } from "@/redux/RootStore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "react95";

interface User {
  uId: number;
}

const State: string[] = ["green", "red", "yellow"];

const FriendUser = ({ uId }: User) => {
  const router = useRouter();
  const openProfile = () => {
    document.body.style.overflow = "hidden";
    router.push({ pathname: "/Page/Profile", query: { uId } }, undefined, {
      shallow: false,
    });
  };
  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );
  const [BlockUser] = useBlockFriendMutation();
  const { data: friendData, refetch } = useGetFriendQuery(owner);
  // TODO: 차단할때 사용할 API콜함수

  const {
    data: userData,
    isFetching: userFetching,
    refetch: userRefetch,
  } = useGetUserQuery(uId);

  const blockFriend = async () => {
    await BlockUser({ uid: owner, target: uId });
  };

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      if (userData) {
        userRefetch();
      }
      if (friendData) {
        refetch();
      }
    }, 1000);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [refetch, userRefetch]);

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
          {userData && userData.nickname}
          <div
            style={{
              marginRight: "8px",
              backgroundColor:
                userData && userData.status === "online"
                  ? "green"
                  : userData && userData.status === "offline"
                  ? "red"
                  : "yellow",
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
