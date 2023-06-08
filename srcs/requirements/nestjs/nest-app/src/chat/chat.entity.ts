import { User } from "src/user/user.entity"

export class Chat{
	roomId:number
	roomName: string
	roomOwner: User
	roomAlba: User[]
	participants: User[]
	banned: User[]
	muted: User[]
	roomType: number
	password: string
}