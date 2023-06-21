import React from "react";
import H1 from "../PostComponents/H1";
import H3 from "../PostComponents/H3";
import Div from "../PostComponents/Div";
import { user, User } from "@/types/UserType";
import { Avatar } from "react95";

interface Props {
  user: User;
}

const UserInfo = ({ user }: Props) => {
  if (user === undefined) {
    return null;
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "20px",
        }}
      >
        <div style={{ marginTop: "80px" }}>
          <H1>{`${user.nickname}`}</H1>
        </div>
        <Avatar src={`http://localhost/${user.profileURL}`} size={200} />
      </div>
      <Div />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <H1>게임전적</H1>
        <H3>{`${user.totalWin}승 ${user.totalLose}패`}</H3>
      </div>
    </div>
  );
};

export default UserInfo;
