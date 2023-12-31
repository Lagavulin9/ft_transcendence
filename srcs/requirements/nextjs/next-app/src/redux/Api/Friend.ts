import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BlockedList,
  FriendList,
  FriendType,
  PostFriend,
} from "@/types/FriendType";

export const FriendApi = createApi({
  reducerPath: "FriendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (bundler) => ({
    getFriend: bundler.query<FriendType, number>({
      query(userId: number) {
        return `http://localhost/api/friend/${userId}`;
      },
      keepUnusedDataFor: 60, // 캐시된 데이터를 60초 동안 보관
    }),
    addFriend: bundler.mutation<FriendList[], PostFriend>({
      query(friend: PostFriend) {
        return {
          url: `http://localhost/api/friend/post`,
          method: "POST",
          body: friend,
        };
      },
    }),
    blockFriend: bundler.mutation<BlockedList[], PostFriend>({
      query(friend: PostFriend) {
        return {
          url: `http://localhost/api/friend/block`,
          method: "POST",
          body: friend,
        };
      },
    }),
    unBlockFriend: bundler.mutation<BlockedList[], PostFriend>({
      query(friend: PostFriend) {
        return {
          url: `http://localhost/api/friend/unblock`,
          method: "POST",
          body: friend,
        };
      },
    }),
  }),
});

export const {
  useGetFriendQuery,
  useAddFriendMutation,
  useBlockFriendMutation,
  useUnBlockFriendMutation,
} = FriendApi;
