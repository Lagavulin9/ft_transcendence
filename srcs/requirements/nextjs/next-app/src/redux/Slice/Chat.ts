import { chat } from "@/types/ChatType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  room: chat;
  rooms: chat[];
}

const initialState: InitialState = {
  room: {
    roomId: 0,
    roomName: "",
    connectUser: [],
    type: -1, // 0: public, 1: private, 2: protected
    password: "",
  },
  rooms: [] as chat[],
};

export const ChatSlice = createSlice({
  name: "Chat",
  initialState: initialState,
  reducers: {
    addRoom(state, action: PayloadAction<chat>) {
      state.room = action.payload;
    },
    addRooms(state, action: PayloadAction<chat[]>) {
      state.rooms = action.payload;
    },
    deleteRoom(state) {
      state.room = initialState.room;
    },
    deleteRooms(state) {
      state.rooms = initialState.rooms;
    },
  },
});
