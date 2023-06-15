// 1개
import { User } from "@/types/UserType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  }),
});

export const { useGetAuthQuery } = AuthApi;
