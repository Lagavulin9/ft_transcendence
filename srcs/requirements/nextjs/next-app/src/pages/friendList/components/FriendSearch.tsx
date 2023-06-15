import React, { useState } from "react";
import { Button, TextInput } from "react95";
import { useGetUserByNickQuery } from "@/redux/Api/User";
import { useAddFriendMutation } from "@/redux/Api/Friend";
import { useGetAuthQuery } from "@/redux/Api/Auth";

const FriendSearch = () => {
  const [input, setInput] = useState("");

  const {
    data: userData,
    error: userError,
    isFetching: userIsFetching,
    refetch: userRefetch,
  } = useGetUserByNickQuery(input);
  const { data: authData } = useGetAuthQuery();

  const [addFriend] = useAddFriendMutation();

  const clickSearch = () => {
    userRefetch();
  };

  const clickAdd = () => {
    addFriend({ uid: authData?.uid ?? 1, target: userData?.uid ?? 1 });
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
        <Button
          style={{ marginLeft: "20px", width: "70px" }}
          onClick={clickSearch}
        >
          검색
        </Button>
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
              신청
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default FriendSearch;
