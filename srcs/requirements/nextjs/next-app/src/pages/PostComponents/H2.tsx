import React from "react";
import Spacer from "../globalComponents/Spacer";
import { Grid } from "antd";

type Props = {
  children: React.ReactNode;
};
const { useBreakpoint } = Grid;
/** #, ##, ### 처럼 사용하기 */
const H2 = ({ children }: Props) => {
  const screens = useBreakpoint();
  return (
    <div
      style={{
        fontSize: screens.md ? "1.8rem" : "26px",
        fontFamily: "dunggeunmo-bold",
      }}
    >
      <Spacer />
      <Spacer />
      <Spacer />
      {children}
      <Spacer />
    </div>
  );
};

export default H2;
