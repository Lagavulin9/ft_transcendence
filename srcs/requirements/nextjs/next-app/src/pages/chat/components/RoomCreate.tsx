import { Row } from "antd";
import React, { useState } from "react";
import { Button, GroupBox, Radio, TextInput } from "react95";

const RoomCreate = () => {
  const [input, setInput] = useState("");
  const [state, setState] = useState("Public");

  return (
    <>
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
          placeholder="Room Name"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button style={{ width: "80px", fontSize: "23px", marginLeft: "15px" }}>
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
          value={input}
          placeholder="Password"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
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
