import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
  succes: boolean;
}

const initialState: RoomState = {
  succes: false,
};

export const fetchRoom = createAsyncThunk<
  RoomState | null,
  { state: boolean },
  { rejectValue: string }
>("/room/fetchRoom", async ({ state }, thunkAPI) => {
  try {
    const response = await new Promise<RoomState>((resolve) => {
      resolve({ succes: state });
    });
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue("Error message here");
  }
});

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    resetRoom(state) {
      state.succes = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoom.pending, (state) => {
        state.succes = false;
      })
      .addCase(
        fetchRoom.fulfilled,
        (state, action: PayloadAction<RoomState | null>) => {
          if (action.payload) {
            state.succes = action.payload.succes;
          } else {
            state.succes = false;
          }
        }
      )
      .addCase(fetchRoom.rejected, (state) => {
        state.succes = false;
      });
  },
});

export const { resetRoom } = roomSlice.actions;

export default roomSlice;
