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
        return {
          url: `http://localhost/api/user/${uid}`,
          method: "PATCH",
          body: user,
        };
      },
    }),
    checkNickname: builder.query<boolean, string>({
      query(nickname: string) {
        return `http://localhost/api/user/nickChecker?nickname=${nickname}`;
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useProfileUpdateMutation,
  useCheckNicknameQuery,
} = ProfileApi;
