import { useGetUserQuery } from "@/redux/Api/Profile";
import React, { useEffect } from "react";
import H3 from "../PostComponents/H3";

interface LogCardProps {
  fromId: number;
  toId: number;
  fromScore: number;
  toScore: number;
  score: number[];
}

const LogCard = ({ fromId, toId, fromScore, toScore }: LogCardProps) => {
  const {
    data: fromData,
    isFetching: fromFetching,
    refetch: fromIdRefetch,
  } = useGetUserQuery(fromId);

  const {
    data: toData,
    isFetching: toFetching,
    refetch: toRefetch,
  } = useGetUserQuery(toId);

  console.log("fromData", fromData);
  return (
    <div>
      {fromData && toData && (
        <H3>
          {fromData.nickname} {fromScore} : {toScore} {toData.nickname}
        </H3>
      )}
    </div>
  );
};

export default LogCard;
