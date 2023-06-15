import React from "react";
import { Counter } from "react95";
import H3 from "../PostComponents/H3";

interface Score {
  player1: number;
  player2: number;
  time: number;
}

const GameScore = ({ player1, player2, time }: Score) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        paddingTop: "10px",
      }}
    >
      <Counter size={"md"} value={player1} />
      <Counter size={"md"} value={time} />
      <Counter size={"md"} value={player2} />
    </div>
  );
};

export default GameScore;
