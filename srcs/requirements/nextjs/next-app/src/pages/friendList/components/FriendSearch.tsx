import React, { useState } from "react";
import { Button, TextInput } from "react95";
import { useGetUserByNickQuery } from "@/redux/Api/User";
import { useAddFriendMutation, useGetFriendQuery } from "@/redux/Api/Friend";
import { useGetAuthQuery } from "@/redux/Api/Auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/RootStore";

const FriendSearch = () => {
  const [input, setInput] = useState("");

  const {
    data: userData,
    error: userError,
    isFetching: userIsFetching,
  } = useGetUserByNickQuery(input, { skip: input === "" });

  const { uId: owner } = useSelector(
    (state: RootState) => state.rootReducers.global
  );

  const [addFriend] = useAddFriendMutation();

  const clickAdd = async () => {
    await addFriend({ uid: owner, target: userData?.uid ?? 1 });
  };

  return (
    <>
      <div
        style={{
          padding: "15px",
          fontFamily: "dunggeunmo-bold",
          fontSize: "20px",
          display: "flex",
        }}
      >
        <TextInput
          style={{ width: "400px" }}
          value={input}
          placeholder="Search..."
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div
        style={{
          padding: "15px",
          fontFamily: "dunggeunmo-bold",
          fontSize: "20px",
          display: "flex",
        }}
      >
        {!userIsFetching && !userError && (
          <>
            <p>{`User : ${
              userData === undefined
                ? "검색을 합시다!"
                : userData?.nickname || "No user found!"
            }`}</p>
            <Button
              style={{ marginLeft: "20px", width: "70px", marginTop: "15px" }}
              onClick={clickAdd}
            >
              팔로우
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default FriendSearch;
