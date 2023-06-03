export class createUserDto{
	readonly uid: number
	readonly nickname: string // Defalut: Intra NickName
	readonly isOTP: boolean
	readonly isAvatar: boolean
	readonly avatarIndex: number // Defalut: 0
	readonly totalWin: number // Defalut: 0
	readonly totalLose: number // Defalut: 0
	readonly level: number // Win의 10당 레벨 +1
}
