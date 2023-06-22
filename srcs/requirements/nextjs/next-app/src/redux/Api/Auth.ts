// 1개
import { User } from "@/types/UserType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import store from "../RootStore";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (bundler) => ({
    getAuth: bundler.query<void, void>({
      query() {
        return `http://localhost/api/auth`;
      },
    }),
    login: bundler.mutation<User, void>({
      query() {
        return `http://localhost/api/auth`; //로그인이라고 가정
      },
    }),
    signup: bundler.mutation<User, string>({
      query(nickname: string) {
        return {
          url: `http://localhost/api/user`,
          method: "POST",
          body: { nickname: nickname },
        };
      },
    }),
    sendMail: bundler.mutation<void, void>({
      query() {
        return {
          url: `http://localhost/api/auth/send-email`,
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useGetAuthQuery,
  useLoginMutation,
  useSignupMutation,
  useSendMailMutation,
} = AuthApi;
