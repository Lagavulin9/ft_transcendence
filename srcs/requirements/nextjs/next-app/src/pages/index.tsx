import { useGetAuthQuery } from "@/redux/Api/Auth";
import { RootState } from "@/redux/RootStore";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AppLayout from "./globalComponents/AppLayout";

const Home = () => {
  const { data, error, isLoading } = useGetAuthQuery();
  return (
    <AppLayout>
      <div></div>
    </AppLayout>
  );
};

export default Home;
