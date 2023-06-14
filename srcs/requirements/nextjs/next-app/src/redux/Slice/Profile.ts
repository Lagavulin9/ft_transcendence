import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mocUserData } from "@/moc/user";
import { user } from "@/types/UserType";

interface ProfileState {
  uId: number | null;
  user: user;
  isMe: boolean | undefined;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
}

const initialState: ProfileState = {
  uId: null,
  user: {} as user,
  isMe: false,
  status: "idle",
  error: undefined,
};

export const fetchProfile = createAsyncThunk<
  ProfileState | null,
  { userId: number; ownerId: number },
  { rejectValue: string }
>("profile/fetchProfile", async ({ userId, ownerId }, thunkAPI) => {
  try {
    const response = await new Promise<user | null>((resolve) => {
      const user = mocUserData.find((user) => user.uId === userId);
      resolve(user || null);
    });

    const ret = {
      user: response,
      isMe: ownerId === userId ? true : false,
      uId: userId,
      status: "idle",
      error: undefined,
    } as ProfileState;

    return ret;
  } catch (error) {
    return thunkAPI.rejectWithValue("Error message here");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile(state) {
      state.uId = null;
      state.user = {} as user;
      state.isMe = false;
      state.status = "idle";
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<ProfileState | null>) => {
          state.status = "succeeded";
          state.user = action.payload ? action.payload.user : ({} as user);
          state.isMe = action.payload?.isMe;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetProfile } = profileSlice.actions;

export default profileSlice.reducer;
