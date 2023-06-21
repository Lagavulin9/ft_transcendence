
export class reqFriendDto {
	uid: number //request를 보내는 유저
	target: number
}

export class resFriendListDto {
	uid: number
	firendList: number[]
	blockedList: number[]
}