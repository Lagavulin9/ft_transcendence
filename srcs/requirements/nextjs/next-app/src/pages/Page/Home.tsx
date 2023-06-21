import { AppDispatch, RootState } from "@/redux/RootStore";
import { fetchGlobal } from "@/redux/Slice/Global";
import { User } from "@/types/UserType";
import { onEvent, socket } from "@/utils/socket";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../globalComponents/AppLayout";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    onEvent("bind", (data: number) => {
      dispatch(fetchGlobal({ uId: data }));
    });
  }, [dispatch]);

  return (
    <AppLayout>
      <></>
    </AppLayout>
  );
};

export default Home;
