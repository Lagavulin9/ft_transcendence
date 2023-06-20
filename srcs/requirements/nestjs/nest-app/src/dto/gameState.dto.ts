import { ReqGameDto } from "./reqGame.dto";

export class GameStateDto {
	gameroom: ReqGameDto
	ballPosition: { x: number; y: number };
  paddlePositions: {
    player1: { x: number; y: number };
    player2: { x: number; y: number };
  }
	timeStemp: string;
	isVisible: boolean;
	score: number[]; // [host, guest]
	gameTime: number; // s
}