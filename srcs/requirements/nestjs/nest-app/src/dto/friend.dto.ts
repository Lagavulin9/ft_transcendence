export class friendUserDto {
	uid: number
	nickname: string
	isOn: boolean
}

export class blockedUserDto {
	uid: number
	nickname: string
}

export class reqFriendDto {
	uid: number //request를 보내는 유저
	target: number
}

export class resFriendListDto {
	firendList: friendUserDto[]
	blockedList: blockedUserDto[]
}