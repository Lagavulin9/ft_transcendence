
export interface FriendList {
	uid: number,
	nickname: string,
	// TODO : state체크 string state: "on, off, game"
}

export interface BlockedList {
	uid: number,
	nickname: string,
}


export interface FriendType {
	uid: number,
	friendList: FriendList[],
	blockedList: BlockedList[],
}


export interface PostFriend {
	uid: number,
	target: number,
}
