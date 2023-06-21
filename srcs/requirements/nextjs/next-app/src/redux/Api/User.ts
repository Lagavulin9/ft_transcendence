import { User } from "@/types/UserType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getUserByNick: builder.query<User, string>({
      query(nickname: string) {
        return {
          url: `http://localhost/api/user?nickname=${nickname}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 2,
    }),
  }),
});

export const { useGetUserByNickQuery } = UserApi;
