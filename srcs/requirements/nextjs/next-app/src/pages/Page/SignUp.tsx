import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, TextInput, WindowContent } from "react95";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";

const SignUp = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("");
  // TODO : 로그인요청

  const onClickLogin = async () => {
    // loginMutation(Number(input))
    //   .unwrap()
    //   .then((response: User) => {
    //     if (response) {
    //       console.log(response);
    //       socket.emit("bind", response.uid);
    //       Promise.all([
    //         // login({ uId: response.uid, isLoading: true, accessToken: ""
    //         dispatch(fetchGlobal({ uId: response.uid })),
    //       ]);
    //     }
    //     router.push("/Page/Home");
    //   })
    // .catch((error) => {
    //   // 실패 시 처리할 작업
    // });
  };
  return (
    <>
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
    </>
  );
};

export default SignUp;
