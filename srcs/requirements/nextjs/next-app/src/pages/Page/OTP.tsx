// Home OTP
import { useSendMailMutation } from "@/redux/Api/Auth";
import { useCheckOtpCodeMutation } from "@/redux/Api/Profile";
import { OTPSignIn } from "@/utils/OTPSignIn";
import { SignIn } from "@/utils/SignIn";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, TextInput, WindowContent } from "react95";
import AppLayout from "../globalComponents/AppLayout";
import MyModal from "../globalComponents/MyModal";
import H3 from "../PostComponents/H3";

const OTP = () => {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [checkOtpCode] = useCheckOtpCodeMutation();
  const [sendEmail] = useSendMailMutation();
  const [isVisible, setIsVisible] = useState(false);

  const onOtpCodeCheck = async () => {
    await OTPSignIn(Number(otpCode));
  };

  const close = () => {
    router.back();
  };

  const onClickCodeSend = async () => {
    await sendEmail();
    setIsVisible(true);
  };

  return (
    <>
      <AppLayout>
        <MyModal hName="2차인증" close={close}>
          <WindowContent>
            <Button
              disabled={isVisible}
              onClick={onClickCodeSend}
              style={{ marginBottom: "20px" }}
            >
              <H3>코드요청</H3>
            </Button>
            <div style={{ display: "flex" }}>
              <TextInput
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
              <Button onClick={onOtpCodeCheck}>
                <H3>확인</H3>
              </Button>
            </div>
          </WindowContent>
        </MyModal>
      </AppLayout>
    </>
  );
};

export default OTP;
