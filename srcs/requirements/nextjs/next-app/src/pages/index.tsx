import { useGetAuthQuery } from "@/redux/Api/Auth";
import { RootState } from "@/redux/RootStore";
import { connectSocket } from "@/utils/socket";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AppLayout from "./globalComponents/AppLayout";

const Home = () => {
  return (
    <AppLayout>
      <div></div>
    </AppLayout>
  );
};

export default Home;
