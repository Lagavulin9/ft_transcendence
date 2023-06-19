import { chat } from "@/types/ChatType";
import { ChatRoom } from "@/types/ChatDto";
import { User } from "@/types/UserType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  rooms: ChatRoom[];
}

const initialState: InitialState = {
  rooms: [] as ChatRoom[],
};

export const ChatSlice = createSlice({
  name: "Chat",
  initialState: initialState,
  reducers: {
    addRooms(state, action: PayloadAction<ChatRoom[]>) {
      state.rooms = action.payload;
    },
    deleteRooms(state) {
      state.rooms = initialState.rooms;
    },
  },
});
