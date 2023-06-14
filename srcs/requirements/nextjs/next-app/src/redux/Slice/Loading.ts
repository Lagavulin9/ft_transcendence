import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Loading {
  isLoading: boolean;
}

const initialState: Loading = {
  isLoading: true,
};

const LoadingSlice = createSlice({
  name: "Loading",
  initialState: initialState,
  reducers: {
    stateLoading(state) {
      state.isLoading = true;
    },
    endLoading(state) {
      state.isLoading = false;
    },
  },
});

export default LoadingSlice;
