import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
  uId: number;
  nickName: string;
  isOn: boolean;
}

interface InitialState {
  user: User[];
  block: User[];
}

const initialState = {
  user: [] as User[],
  block: [] as User[],
};

const FriendSlice = createSlice({
  name: "Friend",
  initialState: initialState,
  reducers: {
    addFriend(state, action: PayloadAction<User>) {
      state.user = [...state.user, action.payload];
    },
    addOn(state, action: PayloadAction<User>) {
      const index = state.user.findIndex(
        (user) => user.uId === action.payload.uId
      );
      state.user[index].isOn = true;
    },
    addOff(state, action: PayloadAction<User>) {
      const index = state.user.findIndex(
        (user) => user.uId === action.payload.uId
      );
      state.user[index].isOn = false;
    },
    block(state, action: PayloadAction<User>) {
      const tmp = state.user.find((user) => user.uId === action.payload.uId);
      if (tmp) {
        state.block = [...state.block, tmp];
        state.user = state.user.filter(
          (user) => user.uId !== action.payload.uId
        );
      }
    },
    unBlock(state, action: PayloadAction<User>) {
      state.user = [...state.user, action.payload];
      state.block = state.block.filter(
        (user) => user.uId !== action.payload.uId
      );
    },
  },
});
