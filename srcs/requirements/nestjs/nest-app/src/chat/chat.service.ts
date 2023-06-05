import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chatroom } from './chat.entity'
import { resChatDto } from "src/dto/resChat.dto";
import { plainToClass } from "class-transformer";
import { reqChatDto } from "src/dto/reqChat.dto";
import { User } from "src/user/user.entity";

@Injectable()
export class ChatService{
	constructor(
		@InjectRepository(Chatroom)
		private chatRepository:Repository<Chatroom>,
		@InjectRepository(User)
		private userRepositiry:Repository<User>
	){}

	async getChatById(roomId:number): Promise<resChatDto>{
		const found = await this.chatRepository.findOne({where:{roomId:roomId}});
		if (!found){
			throw new NotFoundException(`Chatroom ID: ${roomId} not found`)
		}
		const reschatdto = plainToClass(resChatDto, found);
		return reschatdto
	}

	async getChatByName(roomName:string): Promise<resChatDto>{
		const found = await this.chatRepository.findOne({where:{roomName:roomName}});
		if (!found){
			throw new NotFoundException(`Chatroom ID: ${roomName} not found`)
		}
		const reschatdto = plainToClass(resChatDto, found);
		return reschatdto
	}

	async createChatroom(reqchatdto:reqChatDto): Promise<void>{
		const newChatroom = new Chatroom();
		const roomOwner = await this.userRepositiry.findOne({where:{uid:reqchatdto.roomOwner}});
		if (!roomOwner){
			throw new NotFoundException(`UID ${reqchatdto.roomOwner} does not exist`)
		}
		newChatroom.roomOwner = roomOwner;
		newChatroom.invitedUsers = [roomOwner];
		newChatroom.password = reqchatdto.password; // 나중에 해쉬함수 거쳐서저장
		newChatroom.roomName = reqchatdto.roomName;
		newChatroom.roomType = reqchatdto.roomType;
		await this.chatRepository.save(newChatroom).catch(err=>{throw new HttpException(JSON.stringify(err.detail), HttpStatus.CONFLICT)});
		throw new HttpException("Accepted", HttpStatus.ACCEPTED);
	}
}