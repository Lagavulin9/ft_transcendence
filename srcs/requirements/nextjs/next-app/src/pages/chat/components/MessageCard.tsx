import { Content } from "@/types/ContentType";
import React from "react";
import { Image } from "antd";
import Spacer from "@/pages/globalComponents/Spacer";
import { ResMsgDto } from "@/types/ChatDto";
import { Avatar } from "react95";

interface Props {
  Data: ResMsgDto;
  isMe: boolean;
  isDm: boolean | undefined;
}

// isDm

const MessageCard = ({ Data, isMe, isDm }: Props) => {
  if (!Data && isDm === undefined) {
    return null;
  }
  return (
    <div style={{ display: "flex", width: "100%" }}>
      {isMe === true ? (
        <>
          <div style={{ flex: "1" }}></div>
          <div
            style={{
              maxWidth: "50%",
              backgroundColor: isDm ? "#7d8e23" : "#2271ae",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontFamily: "dunggeunmo-bold",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <Avatar src={Data.profileURL} size={40} />
              <div style={{ marginRight: "20px", fontSize: "25px" }}>
                {Data.nickname}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <div style={{ marginTop: "10px" }}>{Data.content}</div>
              <div style={{ color: "#333" }}>{Data.date}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              maxWidth: "50%",
              backgroundColor: isDm ? "#7d8e23" : "#999",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontFamily: "dunggeunmo-bold",
              color: "#111",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar src={Data.profileURL} size={30} />
              <div style={{ marginLeft: "20px", fontSize: "25px" }}>
                {Data.nickname}
              </div>
            </div>
            <div>
              <div style={{ marginTop: "10px" }}>{Data.content}</div>
              <div style={{ color: "#444" }}>{Data.date}</div>
            </div>
          </div>
          <div style={{ flex: "1" }}></div>
        </>
      )}
    </div>
  );
};

export default MessageCard;
