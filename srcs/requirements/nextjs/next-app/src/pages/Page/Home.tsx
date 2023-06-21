import { AppDispatch, RootState } from "@/redux/RootStore";
import { fetchGlobal } from "@/redux/Slice/Global";
import { User } from "@/types/UserType";
import { emitEvent, onEvent, socket } from "@/utils/socket";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../globalComponents/AppLayout";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    onEvent("bind", (data: number) => {
      console.log(data);
      emitEvent("bind", data);
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
