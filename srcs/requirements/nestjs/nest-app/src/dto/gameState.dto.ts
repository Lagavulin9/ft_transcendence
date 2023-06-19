import { GameRoom } from "src/game/gameroom.entity";

export class gameState {
	gameroom: GameRoom
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