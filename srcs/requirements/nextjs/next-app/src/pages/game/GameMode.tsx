import React from "react";
import Modal from "../globalComponents/ModalWrapper";
import { Button, Window, WindowContent, WindowHeader } from "react95";
import { Grid } from "antd";

interface Props {
  close: () => void;
  gameMode: (value: boolean) => void;
}

const { useBreakpoint } = Grid;

const GameMode = ({ close, gameMode }: Props) => {
  const screens = useBreakpoint();

  const selectNormal = () => {
    gameMode(false);
    close();
  };

  const selectSpecial = () => {
    gameMode(true);
    close();
  };

  return (
    <div>
      <Modal>
        <Window
          className="window"
          style={{
            position: "absolute",
            top: screens.md ? "50%" : "0%",
            left: screens.md ? "50%" : "0%",
            width: "250px",
            height: "200px",
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
              게임모드선택
            </span>
            <Button style={{ marginTop: "3px" }} onClick={close}>
              <span style={{ fontFamily: "dunggeunmo-bold", fontSize: "20px" }}>
                X
              </span>
            </Button>
          </WindowHeader>
          <WindowContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                style={{
                  fontFamily: "dunggeunmo-bold",
                  fontSize: "18px",
                  width: "150px",
                }}
                onClick={selectNormal}
              >
                일반 모드
              </Button>
              <Button
                style={{
                  fontFamily: "dunggeunmo-bold",
                  fontSize: "18px",
                  width: "150px",
                  marginTop: "30px",
                }}
                onClick={selectSpecial}
              >
                스페셜 모드
              </Button>
            </div>
          </WindowContent>
        </Window>
      </Modal>
    </div>
  );
};

export default GameMode;
