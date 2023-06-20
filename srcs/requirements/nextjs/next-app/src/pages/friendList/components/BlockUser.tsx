import H3 from "@/pages/PostComponents/H3";
import { useUnBlockFriendMutation } from "@/redux/Api/Friend";
import { useGetUserQuery } from "@/redux/Api/Profile";
import { RootState } from "@/redux/RootStore";
import { data } from "autoprefixer";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "react95";

interface User {
  uId: number;
}

const BlockUser = ({ uId }: User) => {
  const [BlockUser] = useUnBlockFriendMutation();
  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );
  const {
    data: userData,
    isFetching: userIsFetching,
    refetch: userRefetch,
  } = useGetUserQuery(uId);

  const cancelBlock = async () => {
    await BlockUser({ uid: owner, target: uId });
  };

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      userRefetch();
    }, 1000);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [userRefetch]);

  if (userIsFetching) {
    return <H3>...로딩중</H3>;
  }

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
