import { useLoginMutation } from "@/redux/Api/Auth";
import { AppDispatch } from "@/redux/RootStore";
import { fetchGlobal, login } from "@/redux/Slice/Global";
import { User } from "@/types/UserType";
import { socket } from "@/utils/socket";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextInput, WindowContent } from "react95";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";

const Login = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loginMutation, { data, error, isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();

  const close = () => {
    router.back();
  };

  const onClickLogin = async () => {
    loginMutation(Number(input))
      .unwrap()
      .then((response: User) => {
        if (response) {
          console.log(response);
          socket.emit("bind", response.uid);
          Promise.all([
            // login({ uId: response.uid, isLoading: true, accessToken: ""
            dispatch(fetchGlobal({ uId: response.uid })),
          ]);
        }
        router.push("/Page/Home");
      })
      .catch((error) => {
        // 실패 시 처리할 작업
      });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <MyModal hName="로그인" close={close}>
          <div
            style={{
              fontFamily: "dunggeunmo-bold",
              fontSize: "22px",
              width: "100px",
            }}
          >
            ...로딩중
          </div>
        </MyModal>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MyModal hName="로그인" close={close}>
        <WindowContent>
          <div style={{ display: "flex" }}>
            <TextInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={onClickLogin}>로그인</Button>
          </div>
        </WindowContent>
      </MyModal>
    </AppLayout>
  );
};

export default Login;
