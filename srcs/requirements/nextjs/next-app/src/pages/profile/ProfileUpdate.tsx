import {
  useCheckNicknameMutation,
  useGetUserQuery,
  useImageUploadMutation,
  useProfileUpdateMutation,
} from "@/redux/Api/Profile";
import { ReqUserDto } from "@/types/UserType";
import { data } from "autoprefixer";
import React, { useRef, useState } from "react";
import { Avatar, Button, GroupBox, Radio, Select, TextInput } from "react95";
import { SelectOption } from "react95/dist/Select/Select.types";
import H3 from "../PostComponents/H3";

interface Props {
  uid: number;
}

const ProfileUpdate = ({ uid }: Props) => {
  const [nickname, setNickname] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const [image, setImage] = useState("");
  const [isSkip, setIsSkip] = useState(true);
  const [isCheck, setIsCheck] = useState(false);
  const nickCheck = ["중복체크완료.", "사용할 수 없습니다."];

  const [nickCheckMutation, { data: nickData }] = useCheckNicknameMutation();
  const [profileUpdate, { data: profileData }] = useProfileUpdateMutation();
  const {
    data: userData,
    isFetching: userFetching,
    refetch: userRefetch,
  } = useGetUserQuery(uid);
  const [imageUpload, { data: imageData }] = useImageUploadMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const nickNameCheck = () => {
    setIsSkip(false);
    nickCheckMutation(nickname);
    if (nickData === true) {
      setIsCheck(nickData);
    } else {
      setIsCheck(false);
    }
    setIsSkip(true);
  };

  const handleSubmit = async () => {
    const form = new FormData();
    if (fileInputRef.current?.files?.[0]) {
      form.append("file", fileInputRef.current?.files?.[0]);
      await imageUpload(form);
    }

    const req: ReqUserDto = {
      nickname: nickname,
      isOTP: isOtp,
      profileURL: imageData,
    };

    await profileUpdate({ uid: uid, user: req });
  };

  return (
    <div>
      <GroupBox
        label="닉네임 수정"
        style={{ fontFamily: "dunggeunmo-bold", width: "600px" }}
      >
        <div style={{ display: "flex" }}>
          <TextInput
            value={nickname}
            placeholder="닉네임을 입력하세요..."
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button onClick={nickNameCheck} style={{ marginRight: "10px" }}>
            중복체크
          </Button>
          {nickname && <H3>{isCheck ? nickCheck[0] : nickCheck[1]}</H3>}
        </div>
      </GroupBox>
      <GroupBox
        label="OTP"
        style={{
          fontFamily: "dunggeunmo-bold",
          width: "600px",
          marginTop: "20px",
        }}
      >
        <Radio
          checked={isOtp === false}
          onChange={() => setIsOtp(false)}
          name="OTP해제"
          label={"OTP해제"}
          style={{ marginRight: "20px" }}
        />
        <Radio
          checked={isOtp === true}
          onChange={() => setIsOtp(true)}
          name="OTP설정"
          label={"OTP설정"}
        />
      </GroupBox>
      <GroupBox
        label="프로필 사진"
        style={{
          fontFamily: "dunggeunmo-bold",
          marginTop: "20px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        {image && <Avatar size={200} src={image} alt="프로필 미리보기" />}
        <Button
          onClick={handleButtonClick}
          style={{ marginTop: "20px", width: "100px" }}
        >
          사진 선택
        </Button>
      </GroupBox>
      <GroupBox
        style={{
          fontFamily: "dunggeunmo-bold",
          marginTop: "20px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Button style={{ width: "100px" }} onClick={handleSubmit}>
          완료
        </Button>
      </GroupBox>
    </div>
  );
};

export default ProfileUpdate;
