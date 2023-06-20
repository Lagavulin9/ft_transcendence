import { LogDto } from "@/types/GameDto";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const GameApi = createApi({
  reducerPath: "GameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (bundler) => ({
    postLog: bundler.mutation<void, LogDto>({
      query(log: LogDto) {
        return {
          url: `http://localhost/api/game/log`,
          method: "POST",
          body: log,
        };
      },
    }),
  }),
});

export const { usePostLogMutation } = GameApi;
