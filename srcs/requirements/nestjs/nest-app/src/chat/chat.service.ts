import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { resChatDto } from "src/dto/resChat.dto";
import { reqChatDto } from "src/dto/reqChat.dto";
import { User } from "src/user/user.entity";
import { Chat } from "./chat.entity";

@Injectable()
export class ChatService{
	constructor(
		@InjectRepository(User)
		private userRepositiry:Repository<User>
		){}
	private ChatRooms:Chat[] = []
	private RoomIndex:number = 0

	getAllChatroom():Chat[]{
		return this.ChatRooms;
	}

	getChatById(roomId:number): resChatDto{
		const found = this.ChatRooms.find(chat=>chat.roomId == roomId)
		if (found){
			return found
		}
		throw new NotFoundException(`Chatroom ID not found: ${roomId}`)
	}

	getChatByName(roomName:string): resChatDto{
		const found = this.ChatRooms.find(chat=>chat.roomName == roomName)
		if (found){
			return found
		}
		throw new NotFoundException(`Chatroom ID not found: ${roomName}`)
	}

	async createChatroom(reqchatdto:reqChatDto): Promise<void>{
		const newChat = new Chat();
		newChat.roomOwner = await this.userRepositiry.findOne({where:{uid:reqchatdto.roomOwner}});
		if (!newChat.roomOwner){
			throw new NotFoundException(`Could not find uid:${reqchatdto.roomOwner}`);
		}
		if (this.ChatRooms.find(chat=>chat.roomName == reqchatdto.roomName)){
			throw new HttpException(`Chatroom already exist: ${reqchatdto.roomName}`, HttpStatus.CONFLICT);
		}
		newChat.roomId = ++this.RoomIndex;
		newChat.roomName = reqchatdto.roomName;
		newChat.roomType = reqchatdto.roomType;
		newChat.participants = [newChat.roomOwner]
		if (reqchatdto.password){
			newChat.password = reqchatdto.password; // 나중에 해쉬로 바꿔서 저장되도록 바꿔야함
		}
		this.ChatRooms.push(newChat);
		throw new HttpException("Accepted", HttpStatus.ACCEPTED);
	}
}