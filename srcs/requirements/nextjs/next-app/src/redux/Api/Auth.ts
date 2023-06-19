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
    getAuth: bundler.query<User, void>({
      query() {
        return `http://localhost/api/auth/login`;
      },
    }),
    login: bundler.mutation<User, number>({
      query(id: number) {
        return `http://localhost/api/auth/login/${id}`;
      },
    }),
  }),
});

export const { useGetAuthQuery, useLoginMutation } = AuthApi;
