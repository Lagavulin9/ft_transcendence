// Home OTP
import { useCheckOtpCodeMutation } from "@/redux/Api/Profile";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, TextInput, WindowContent } from "react95";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import H3 from "../PostComponents/H3";

const OTP = () => {
  const [otpCode, setOtpCode] = useState("");
  const [checkOtpCode] = useCheckOtpCodeMutation();

  const onOtpCodeCheck = async () => {
    await checkOtpCode(Number(otpCode));
  };

  return (
    <>
      <AppLayout>
        <MyModal hName="회원가입" close={close}>
          <WindowContent>
            <div style={{ display: "flex" }}>
              <TextInput
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
              <Button onClick={onOtpCodeCheck}>
                <H3>로그인</H3>
              </Button>
            </div>
          </WindowContent>
        </MyModal>
      </AppLayout>
    </>
  );
};

export default OTP;
