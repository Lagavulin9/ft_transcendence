import { GameRoomDto } from "@/types/GameDto";
import { User } from "@/types/UserType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: GameRoomDto = {
  host: {} as User,
  guest: {} as User,
  game_start: false,
};

export const fetchRoom = createAsyncThunk<
  GameRoomDto | null,
  { gameRoom: GameRoomDto },
  { rejectValue: string }
>("/room/fetchRoom", async ({ gameRoom }, thunkAPI) => {
  try {
    const response = await new Promise<GameRoomDto>((resolve) => {
      resolve({
        host: gameRoom.host,
        guest: gameRoom.guest,
        game_start: false,
      });
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
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoom.pending, (state) => {
        state.game_start = false;
      })
      .addCase(
        fetchRoom.fulfilled,
        (state, action: PayloadAction<GameRoomDto | null>) => {
          if (action.payload) {
            state = action.payload;
          }
        }
      )
      .addCase(fetchRoom.rejected, (state) => {
        state.game_start = false;
      });
  },
});

export const { resetRoom } = roomSlice.actions;

export default roomSlice;
