export class createUserDto{
	readonly nickname: string // Defalut: Intra NickName
	readonly isOTP: boolean
	readonly isAvatar: boolean
	readonly avatarIndex: number // Defalut: 0
}
