import { User } from "src/user/user.entity"

export class resChatDto{
	roomId: number
	roomName: string
	roomOwner: User
	roomAlba: User[]
	participants: User[]
	roomType: string
}