import { useGetUserQuery } from "@/redux/Api/Profile";
import React from "react";

interface GameLogProps {
  uid: number;
}

const GameLog = ({ uid }: GameLogProps) => {
  const {
    data: userData,
    error: userError,
    isFetching: userFetching,
  } = useGetUserQuery(uid);

  return (
    <div>
      <div>GameLog</div>
    </div>
  );
};

export default GameLog;
