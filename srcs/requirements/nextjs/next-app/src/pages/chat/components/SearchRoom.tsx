import { mocUserData } from "@/moc/user";
import React, { useEffect, useState } from "react";
import { Button } from "react95";
import { useRouter } from "next/router";
import { chat } from "@/types/ChatType";
import { resChatDto } from "@/types/ChatDto";
import { Room } from "@/types/roomType";

interface Room {
  room: resChatDto;
}

const SearchRoom = ({ room }: Room) => {
  const router = useRouter();

  const openModal = () => {
    router.push(
      { pathname: "/Page/Room", query: { roomName: room.roomName } },
      undefined,
      {
        shallow: false,
      }
    );
  };
  return (
    <div
      style={{
        margin: "10px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {room.roomName.length > 0 ? (
        <div style={{ width: "70vw" }}>
          <p>Matching chat room found:</p>
          <p>
            {"Connect User: "}
            {room.participants.map((user) => user.nickname).join(", ")}
          </p>
          <p>Type: {`${Room[room.roomType].type}`}</p>
        </div>
      ) : (
        <div style={{ fontSize: "30px", color: "red" }}>Not Found</div>
      )}
      <Button
        style={{
          width: "10vw",
          minWidth: "80px",
          fontFamily: "dunggeunmo-bold",
          fontSize: "22px",
        }}
        onClick={openModal}
      >
        참여
      </Button>
    </div>
  );
};

export default SearchRoom;
