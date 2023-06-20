import { User } from "./UserType";

export interface GameRoomDto {
  host: User;
  guest: User;
  game_start: boolean;
}

export interface GameRoom {
  host: number;
  guest: number;
  game_start: boolean;
  isNormal?: boolean;
}

export interface GameStateDto {
  gameroom: GameRoom;
  ballPosition: { x: number; y: number };
  paddlePositions: {
    player1: { x: number; y: number };
    player2: { x: number; y: number };
  };
  timeStemp: string;
  isVisible: boolean;
  score: number[]; // [host, guest]
  gameTime: number; // s
}

export interface LogDto {
  fromId: number;
  toId: number;
  fromScore: number;
  toScore: number;
  score: number[];
}
