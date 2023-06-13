import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FriendList } from "./friend.entity";
import { friendUserDto, reqFriendDto, resFriendListDto } from "src/dto/friend.dto";
import { plainToClass } from "class-transformer";
import { UserService } from "src/user/user.service";

@Injectable()
export class FriendService{
	constructor(
		@InjectRepository(FriendList)
		private friendRepository:Repository<FriendList>,
		private userService:UserService
	){}

	async getFriendList(uid:number): Promise<resFriendListDto>{
		const found = await this.friendRepository.findOne({where:{uid:uid}})
		return plainToClass(resFriendListDto, found);
	}

	async addFriend(req:reqFriendDto): Promise<resFriendListDto>{
		const current = await this.friendRepository.findOne({where:{uid:req.uid}})
		if (!current) {
			throw new NotFoundException(`Could not find uid:${req.uid}`)
		}
		const target = await this.userService.getUserByID(req.target);
		if (current.friendList.find(friend=>friend.uid==target.uid)){
			return plainToClass(resFriendListDto, current);
		}
		const newFriend = new friendUserDto();
		newFriend.uid = target.uid;
		newFriend.nickname = target.nickname;
		//friend.isOn = true? 이 부분 처리를 고민해봐야겠습니다.
		current.friendList.push(newFriend)
		await this.friendRepository.save(current);
		return plainToClass(resFriendListDto, current);
	}

	async blockUser(req:reqFriendDto): Promise<resFriendListDto>{
		const current = await this.friendRepository.findOne({where:{uid:req.uid}})
		const target = await this.userService.getUserByID(req.target);
		if (current.blockedList.find(blocked=>blocked.uid==target.uid)){
			return plainToClass(resFriendListDto, current);
		}
		current.friendList = current.friendList.filter(blocked=>blocked.uid!=target.uid)
		const newFriend = new friendUserDto();
		newFriend.uid = target.uid;
		newFriend.nickname = target.nickname;
		//friend.isOn = true? 이 부분 처리를 고민해봐야겠습니다.
		current.blockedList.push(newFriend);
		await this.friendRepository.save(current);
		return plainToClass(resFriendListDto, current);
	}
}