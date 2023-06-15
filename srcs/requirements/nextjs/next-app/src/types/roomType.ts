interface RoomType {
  type: string;
}

export const Room: RoomType[] = [
  { type: "Public" },
  { type: "Private" },
  { type: "Protected" },
];
