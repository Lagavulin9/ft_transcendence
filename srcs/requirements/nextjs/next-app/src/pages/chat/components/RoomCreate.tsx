import ChatRoom from "@/pages/Page/Room";
import { useGetAllQuery } from "@/redux/Api/ChatRoom";
import { emitEvent, onEvent } from "@/utils/socket";
import { Row } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, GroupBox, Radio, TextInput } from "react95";

const RoomCreate = () => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("Public");
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    data: chatData,
    error: chatError,
    isLoading: chatLoading,
    refetch,
  } = useGetAllQuery();

  const onClickCreate = async () => {
    console.log("create");
    emitEvent("create", {
      roomName: input,
      roomType: state,
      target: "",
      msg: "",
      password: "",
    });
    await refetch();
    router.push(
      { pathname: "/Page/Room", query: { roomName: input } },
      undefined,
      { shallow: false }
    );
  };

  return (
    <>
      <GroupBox>
        <div
          style={{
            padding: "15px",
            fontFamily: "dunggeunmo-bold",
            fontSize: "20px",
            display: "flex",
          }}
        >
          <TextInput
            style={{ width: "400px" }}
            value={input}
            placeholder="Room Name..."
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            style={{ width: "80px", fontSize: "23px", marginLeft: "15px" }}
            onClick={onClickCreate}
          >
            생성
          </Button>
        </div>
        <div
          style={{
            padding: "15px",
            fontFamily: "dunggeunmo-bold",
            fontSize: "20px",
            display: "flex",
          }}
        >
          <TextInput
            disabled={state !== "Protected"}
            style={{ width: "400px" }}
            value={password}
            placeholder="Password..."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </GroupBox>
      <GroupBox
        label="Room Type"
        style={{ fontFamily: "dunggeunmo-bold", width: "100px" }}
      >
        <Radio
          checked={state === "Public"}
          onChange={() => setState("Public")}
          value="Public"
          name="Public"
          label={"Public"}
        />
        <Radio
          checked={state === "Private"}
          onChange={() => setState("Private")}
          value="Private"
          name="Private"
          label={"Private"}
        />
        <Radio
          checked={state === "Protected"}
          onChange={() => setState("Protected")}
          value="Protected"
          name="Protected"
          label={"Protected"}
        />
      </GroupBox>
    </>
  );
};

export default RoomCreate;
