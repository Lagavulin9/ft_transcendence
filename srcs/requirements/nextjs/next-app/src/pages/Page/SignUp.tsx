import { useLoginMutation, useSignupMutation } from "@/redux/Api/Auth";
import { useCheckNicknameMutation } from "@/redux/Api/Profile";
import { AppDispatch } from "@/redux/RootStore";
import { fetchGlobal } from "@/redux/Slice/Global";
import { SignIn } from "@/utils/SignIn";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextInput, WindowContent } from "react95";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import H3 from "../PostComponents/H3";

const SignUp = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [newNicknameMessage, setNewNicknameMessage] = useState<string | null>(
    null
  );
  const [isLogin, setIsLogin] = useState(false);
  // TODO : 로그인요청

  const [signUp, { data: userData, isLoading }] = useSignupMutation();
  const [nickCheckMutation, { data: nickData }] = useCheckNicknameMutation();
  const dispatch = useDispatch<AppDispatch>();

  const onClickLogin = async () => {
    await signUp(nickname);

    if (userData) {
      await dispatch(fetchGlobal({ uId: userData.uid }));
    }
    setIsLogin(true);
    await SignIn();
  };

  const onNickCheck = async () => {
    // TODO : 닉네임 중복체크
    await nickCheckMutation(nickname);
  };

  useEffect(() => {
    if (nickData === true) {
      setNewNicknameMessage("중복체크완료.");
      setIsCheck(true);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    } else if (nickData === false) {
      setNewNicknameMessage("사용할 수 없습니다.");
      setIsCheck(false);
      setIsVisible(true);
      setNickname("");
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  }, [nickData, userData]);

  const close = () => {
    router.back();
  };

  return (
    <>
      <AppLayout>
        <MyModal hName="회원가입" close={close}>
          <WindowContent>
            <div style={{ display: "flex" }}>
              <TextInput
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Button onClick={onNickCheck}>
                <H3>중복체크</H3>
              </Button>
              {isVisible && <H3>{newNicknameMessage}</H3>}
              {isCheck && (
                <Button onClick={onClickLogin}>
                  <H3>로그인</H3>
                </Button>
              )}
            </div>
          </WindowContent>
        </MyModal>
      </AppLayout>
    </>
  );
};

export default SignUp;
function useSignUpMutation(): [any] {
  throw new Error("Function not implemented.");
}
