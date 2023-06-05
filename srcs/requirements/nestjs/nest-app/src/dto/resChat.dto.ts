import { User } from "src/user/user.entity"

export class resChatDto{
	roomId: number
	roomName: string
	roomOwner: User
	roomAlba: User
	participants: User[]
	roomType: number // 0: public, 1: private, 2: protected
	password?: string
}