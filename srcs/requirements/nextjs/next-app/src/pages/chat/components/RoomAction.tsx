import H3 from "@/pages/PostComponents/H3";
import React from "react";

interface RoomActionProps {
  comment: string;
}

const RoomAction = ({ comment }: RoomActionProps) => {
  return (
    <div>
      <H3>{`${comment}`}</H3>
    </div>
  );
};

export default RoomAction;
