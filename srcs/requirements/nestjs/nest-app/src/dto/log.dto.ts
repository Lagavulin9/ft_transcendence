export class LogDto{
	fromId: number
	toId: number
	fromScore: number
	toScore: number
	score: number[]
}

export class GameLogDto{
	uId: number
	log: LogDto[]
}