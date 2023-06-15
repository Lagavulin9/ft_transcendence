import { User } from "src/user/user.entity"

export class reqChatDto{
	roomId: number
	roomName: string
	roomType: number // 0: public, 1: private, 2: protected
	roomOwner: User
}