import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReqUserDto, User } from "@/types/UserType";

export const ProfileApi = createApi({
  reducerPath: "ProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (builder) => ({
    getUser: builder.query<User, number>({
      query(userId: number) {
        return `http://localhost/api/user/${userId}`;
      },
    }),
    profileUpdate: builder.mutation<User, { user: ReqUserDto; uid: number }>({
      query({ user, uid }) {
        const requestBody = {
          nickname: user.nickname,
          isOTP: user.isOTP,
          profileURL: user.profileURL, // 이미 base64로 변환된 문자열
        };

        return {
          url: `http://localhost/api/user/${uid}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        };
      },
    }),
    checkNickname: builder.mutation<boolean, string>({
      query(nickname: string) {
        return `http://localhost/api/user/check/nick?nickname=${nickname}`;
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useProfileUpdateMutation,
  useCheckNicknameMutation,
} = ProfileApi;
