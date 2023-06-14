import { chat } from "@/types/ChatType";

export const chatMocData: chat[] = [
  {
    roomId: 1,
    roomName: "room1",
    connectUser: [1, 2, 3],
    type: 0,
  },
  {
    roomId: 2,
    roomName: "room2",
    connectUser: [4, 5],
    type: 1,
  },
  {
    roomId: 3,
    roomName: "room3",
    connectUser: [6, 1, 2, 5, 7, 8, 9, 12],
    type: 0,
  },
  {
    roomId: 4,
    roomName: "room4",
    connectUser: [7, 8, 9, 10],
    type: 2,
    password: "1234",
  },
  {
    roomId: 5,
    roomName: "room5",
    connectUser: [11, 12, 13],
    type: 1,
  },
  {
    roomId: 6,
    roomName: "room6",
    connectUser: [1, 3, 6],
    type: 0,
  },
];
