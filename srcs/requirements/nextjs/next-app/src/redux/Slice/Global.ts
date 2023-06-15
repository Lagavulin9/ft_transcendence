import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface GlobalState {
  uId: number;
  isLoading: boolean;
  accessToken: string;
}
const initialState: GlobalState = {
  uId: 0, // TODO: 추후엔 0으로
  isLoading: false,
  accessToken: "",
};

export const fetchGlobal = createAsyncThunk<
  GlobalState | null,
  { uId: number }
>("global/featchGlobal", async ({ uId }) => {
  const ret = {
    uId: uId,
    isLoading: false,
    accessToken: "",
  };

  return ret;
});

const GlobalSlice = createSlice({
  name: "Global",
  initialState: initialState,
  reducers: {
    login(state, action: PayloadAction<GlobalState>) {
      state = action.payload;
      console.log("login", state);
    },
    logout(state) {
      state = initialState;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchGlobal.fulfilled,
        (state, action: PayloadAction<GlobalState | null>) => {
          state.uId = action.payload ? action.payload.uId : 0;
          state.isLoading = false;
          state.accessToken = "";
        }
      );
  },
});

export const { login } = GlobalSlice.actions;
export default GlobalSlice;
