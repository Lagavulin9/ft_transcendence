import { User } from "./UserType";

export interface GameRoomDto {
  host: User;
  guest: User;
  game_start: boolean;
}
