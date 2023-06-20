import { User } from "src/user/user.entity"

export class reqChatDto{
	roomId: number
	roomName: string
	roomType: string
	roomOwner: User
}