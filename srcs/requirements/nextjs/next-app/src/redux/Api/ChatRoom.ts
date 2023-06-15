// 2개
import { resChatDto } from "@/types/resChatDto";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ChatRoomApi = createApi({
  reducerPath: "ChatRoomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (bundler) => ({
    getAll: bundler.query<resChatDto[], void>({
      query() {
        return `http://localhost/api/chat/all`;
      },
    }),
    getChatRoom: bundler.query<resChatDto, string>({
      query(roomName: string) {
        return `http://localhost/api/chat?roomName=${roomName}`;
      },
    }),
  }),
});

export const { useGetAllQuery, useGetChatRoomQuery } = ChatRoomApi;
