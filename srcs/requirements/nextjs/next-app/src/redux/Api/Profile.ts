import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/types/UserType";

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
  }),
});

export const { useGetUserQuery } = ProfileApi;
