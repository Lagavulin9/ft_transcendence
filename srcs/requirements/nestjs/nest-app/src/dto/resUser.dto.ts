import { LogDto } from "./log.dto"

export class ResUserDto{
	uid: number
	nickname: string // Defalut: Intra nickname
	isOTP: boolean
	email: string
	profileURL: string
	totalWin: number // Defalut: 0
	totalLose: number // Defalut: 0
	level: number // Win의 10당 레벨 +1
	status: string
	gameLog: LogDto[]
}