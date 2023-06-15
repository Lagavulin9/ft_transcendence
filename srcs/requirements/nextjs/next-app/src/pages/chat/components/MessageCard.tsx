import { Content } from "@/types/ContentType";
import React from "react";
import { Image } from "antd";
import Spacer from "@/pages/globalComponents/Spacer";
import { ResMsgDto } from "@/types/ChatDto";

interface Props {
  Data: ResMsgDto;
  isMe: boolean;
}

// isDm

const MessageCard = ({ Data, isMe }: Props) => {
  if (!Data) {
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
              backgroundColor: "#2271ae",
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
              <Image
                preview={false}
                src={Data.profileURL}
                width={"40px"}
                style={{ borderRadius: "50%" }}
              />
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
              backgroundColor: "#999",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontFamily: "dunggeunmo-bold",
              color: "#111",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                preview={false}
                src={Data.profileURL}
                width={"40px"}
                style={{ borderRadius: "50%" }}
              />
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
