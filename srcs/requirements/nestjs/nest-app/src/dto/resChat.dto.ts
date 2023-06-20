import { Chat } from "src/chat/chat.entity"
import { User } from "src/user/user.entity"

export class resChatDto{
	roomId: number
	roomName: string
	roomOwner: User
	roomAlba: User[]
	participants: User[]
	roomType: string

	constructor(ref: Chat) {
		this.roomId = ref.roomId;
		this.roomName = ref.roomName;
		this.roomOwner = ref.roomOwner;
		this.roomAlba = ref.roomAlba;
		this.participants = ref.participants;
		this.roomType = ref.roomType;
	  }
}