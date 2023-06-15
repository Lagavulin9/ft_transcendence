import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  uId: number;
  nickName: string;
  eMail: string;
  profileImage: string;
  isOTP: boolean;
  isAvatar: boolean;
  avatarIndex?: number;
  totalWin: number;
  totalLose: number;
}

const initialState: InitialState = {
  uId: -1,
  nickName: "",
  eMail: "",
  profileImage: "",
  isOTP: false,
  isAvatar: false,
  avatarIndex: -1,
  totalWin: 0,
  totalLose: 0,
};

// 여기도 rudux thunk로 비동기 처리해야함
const UserSlice = createSlice({
  name: "User",
  initialState: initialState,
  reducers: {
    addUser(state, action: PayloadAction<InitialState>) {
      state = action.payload;
    },
    deleteUser(state) {
      state = initialState;
      return state;
    },
  },
});

export default UserSlice;
