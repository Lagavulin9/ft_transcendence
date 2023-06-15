import { Content } from "@/types/ContentType";
import React from "react";
import { Image } from "antd";
import Spacer from "@/pages/globalComponents/Spacer";

interface Props {
  Data: Content;
}

const MessageCard = ({ Data }: Props) => {
  if (!Data) {
    return null;
  }
  return (
    <div style={{ display: "flex", width: "100%" }}>
      {Data.isTo === true ? (
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
                src={Data.profileImage}
                width={"40px"}
                style={{ borderRadius: "50%" }}
              />
              <div style={{ marginRight: "20px", fontSize: "25px" }}>
                {Data.userNickName}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <div style={{ marginTop: "10px" }}>{Data.Content}</div>
              <div style={{ color: "#333" }}>{Data.Date}</div>
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
                src={Data.profileImage}
                width={"40px"}
                style={{ borderRadius: "50%" }}
              />
              <div style={{ marginLeft: "20px", fontSize: "25px" }}>
                {Data.userNickName}
              </div>
            </div>
            <div>
              <div style={{ marginTop: "10px" }}>{Data.Content}</div>
              <div style={{ color: "#444" }}>{Data.Date}</div>
            </div>
          </div>
          <div style={{ flex: "1" }}></div>
        </>
      )}
    </div>
  );
};

export default MessageCard;
