import {
  useCheckNicknameMutation,
  useGetUserQuery,
  useImageUploadMutation,
  useProfileUpdateMutation,
} from "@/redux/Api/Profile";
import { ReqUserDto } from "@/types/UserType";
import { data } from "autoprefixer";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, GroupBox, Radio, Select, TextInput } from "react95";
import { SelectOption } from "react95/dist/Select/Select.types";
import H3 from "../PostComponents/H3";

interface Props {
  uid: number;
  func: (bool: boolean) => void;
}

const ProfileUpdate = ({ uid, func }: Props) => {
  const [nickname, setNickname] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const [image, setImage] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const [newNicknameMessage, setNewNicknameMessage] = useState<string | null>(
    null
  );
  const [nickCheckMutation, { data: nickData }] = useCheckNicknameMutation();
  const [profileUpdate, { data: profileData }] = useProfileUpdateMutation();
  const {
    data: userData,
    isFetching: userFetching,
    refetch: userRefetch,
  } = useGetUserQuery(uid);

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

  const nickNameCheck = async () => {
    await nickCheckMutation(nickname);
  };

  const handleSubmit = async () => {
    const form = new FormData();
    let imageUrl = userData?.profileURL;
    if (fileInputRef.current?.files?.[0]) {
      form.append("file", fileInputRef.current?.files?.[0]);
      // await imageUpload(form);
      const res = await fetch("http://localhost/api/image", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      imageUrl = data.imageURL;
    }

    if (userData) {
      const req: ReqUserDto = {
        nickname: isCheck === true ? nickname : userData.nickname,
        isOTP: isOtp !== userData.isOTP ? isOtp : userData.isOTP,
        profileURL: imageUrl,
      };
      await profileUpdate({ uid: uid, user: req });
      func(true);
      setNewNicknameMessage("수정완료.");
      setIsOtp(false);
      setIsCheck(false);
    }
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
  }, [nickData]);

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
          <Button
            onClick={nickNameCheck}
            style={{ marginRight: "10px" }}
            disabled={nickname.length === 0}
          >
            중복체크
          </Button>
          {isVisible && <H3>{newNicknameMessage}</H3>}
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
