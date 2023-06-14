import { Grid } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const { useBreakpoint } = Grid;
/** #, ##, ### 처럼 사용하기 */
const H3 = ({ children }: Props) => {
  const screens = useBreakpoint();
  return (
    <div
      style={{
        fontSize: screens.md ? "1.6rem" : "22px",
        fontFamily: "dunggeunmo-bold",
      }}
    >
      {children}
    </div>
  );
};

export default H3;
