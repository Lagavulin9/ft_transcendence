import React from "react";
import Modal from "./ModalWrapper";
import { Button, Window, WindowHeader } from "react95";
import { Grid } from "antd";

interface Props {
  children: React.ReactNode;
  hName: string;
  close: () => void;
}

const { useBreakpoint } = Grid;

const MyModal = ({ children, hName, close }: Props) => {
  const screens = useBreakpoint();
  return (
    <Modal>
      <Window
        className="window"
        style={{
          position: "absolute",
          top: screens.md ? "50%" : "0%",
          left: screens.md ? "50%" : "0%",
          width: "700px",
          height: "550px",
          transform: screens.md
            ? "translate(-50%, -50%)"
            : "translate(0%, 15%)",
        }}
      >
        <WindowHeader
          className="window-title"
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <span style={{ fontFamily: "dunggeunmo-bold", fontSize: "22px" }}>
            {`${hName}`}
          </span>
          <Button style={{ marginTop: "3px" }} onClick={close}>
            <span style={{ fontFamily: "dunggeunmo-bold", fontSize: "20px" }}>
              X
            </span>
          </Button>
        </WindowHeader>
        {children}
      </Window>
    </Modal>
  );
};

export default MyModal;
