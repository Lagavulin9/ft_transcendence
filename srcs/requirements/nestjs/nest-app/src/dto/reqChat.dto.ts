export class reqChatDto{
	roomOwner: number // UserId
	roomType: number // 0: public, 1: private, 2: protected
	roomName: string
	password?: string // 받고 나서 hash로 저장하는 방식
}