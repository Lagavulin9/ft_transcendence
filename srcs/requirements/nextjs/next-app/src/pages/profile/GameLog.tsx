import { useGetUserQuery } from "@/redux/Api/Profile";
import { GameLogDto, LogDto } from "@/types/UserType";
import React from "react";
import H3 from "../PostComponents/H3";
import LogCard from "./LogCard";

interface GameLogProps {
  uid: number;
}

const GameLog = ({ uid }: GameLogProps) => {
  const {
    data: userData,
    error: userError,
    isFetching: userFetching,
  } = useGetUserQuery(uid);

  if (userFetching) {
    return <H3>...로딩중</H3>;
  }

  if (userData?.gameLog === undefined) {
    return <H3>로그데이터가 없습니다.</H3>;
  }

  return (
    <div>
      {userData &&
        userData.gameLog.log.map((log, index) => {
          console.log("userData", log);
          return (
            <LogCard
              key={index}
              fromId={log.fromId}
              toId={log.toId}
              fromScore={log.fromScore}
              toScore={log.toScore}
              score={log.score}
            />
          );
        })}
    </div>
  );
};

export default GameLog;
