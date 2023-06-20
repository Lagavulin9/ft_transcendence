import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AuthApi } from "./Api/Auth";
import { ChatRoomApi } from "./Api/ChatRoom";
import { FriendApi } from "./Api/Friend";
import { GameApi } from "./Api/Game";
import { ProfileApi } from "./Api/Profile";
import { UserApi } from "./Api/User";
import { rootReducer } from "./RootReducer";

const store = configureStore({
  reducer: {
    rootReducers: rootReducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [FriendApi.reducerPath]: FriendApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ChatRoomApi.reducerPath]: ChatRoomApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [GameApi.reducerPath]: GameApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ProfileApi.middleware)
      .concat(FriendApi.middleware)
      .concat(AuthApi.middleware)
      .concat(ChatRoomApi.middleware)
      .concat(UserApi.middleware)
      .concat(GameApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
