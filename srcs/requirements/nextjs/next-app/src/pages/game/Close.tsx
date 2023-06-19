import React, { useEffect } from "react";
import H1 from "../PostComponents/H1";
import H3 from "../PostComponents/H3";

interface Props {
  WinPlayerId: number;
  WinPlayerNickName: string;
  Score: number[];
}

const GameClose = ({ WinPlayerId, WinPlayerNickName, Score }: Props) => {
  useEffect(() => {
    // TODO: WinPlayerId로 승리 콜 보내기
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "15px",
      }}
    >
      {WinPlayerId === 0 ? (
        <H1>무승부입니다.</H1>
      ) : (
        <H1>{`${WinPlayerNickName}이 승리하셨습니다.`}</H1>
      )}
    </div>
  );
};

export default GameClose;
