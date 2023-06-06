import { GameLogDto } from "./log.dto"

export class getUserDto{
	uid: number
	nickname: string // Defalut: Intra nickname
	isOTP: boolean
	isAvatar: boolean
	avatarIndex: number // Defalut: 0
	totalWin: number // Defalut: 0
	totalLose: number // Defalut: 0
	level: number // Win의 10당 레벨 +1
	gameLog: GameLogDto[]
}