import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface GlobalState {
  uId: number;
  isLogin: boolean;
  accessToken: string;
}
const initialState: GlobalState = {
  uId: 3, // TODO: 추후엔 0으로
  isLogin: false,
  accessToken: "",
};

const GlobalSlice = createSlice({
  name: "Global",
  initialState: initialState,
  reducers: {
    login(state, action: PayloadAction<GlobalState>) {
      state = action.payload;
    },
    logout(state) {
      state = initialState;
      return state;
    },
  },
});

export default GlobalSlice;
