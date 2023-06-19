import { useState } from "react";
import { Button } from "react95";
import H3 from "../PostComponents/H3";

interface props {
  func: (value: boolean) => void;
}

const ModeSelect = ({ func }: props) => {
  const [isNormal, setIsNormal] = useState(true);

  return (
    <div>
      <Button onClick={() => setIsNormal(true)}>
        <H3>일반 모드</H3>
      </Button>
      <Button onClick={() => setIsNormal(false)}>
        <H3>스페셜 모드</H3>
      </Button>
    </div>
  );
};

export default ModeSelect;
