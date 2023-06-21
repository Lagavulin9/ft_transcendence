import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FriendList } from "./friend.entity";
import { reqFriendDto, resFriendListDto } from "src/dto/friend.dto";
import { plainToClass } from "class-transformer";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";

@Injectable()
export class FriendService{
	constructor(
		@InjectRepository(FriendList)
		private friendRepository:Repository<FriendList>,
		@InjectRepository(User)
		private userRepository:Repository<User>,
		private userService:UserService,
	){}

	async getFriendList(uid:number): Promise<resFriendListDto>{
		const found = await this.friendRepository.findOne({where:{uid:uid}})
		return plainToClass(resFriendListDto, found);
	}

	async addFriend(req:reqFriendDto): Promise<resFriendListDto>{
		if (req.uid == req.target){
			throw new HttpException('Cannot add self to friend', HttpStatus.BAD_REQUEST);
		}
		const current = await this.friendRepository.findOne({where:{uid:req.uid}})
		if (!current) {
			throw new NotFoundException(`Could not find uid:${req.uid}`)
		}
		const target = await this.userRepository.findOne({where:{uid:req.target}});
		if (!target){
			throw new NotFoundException(`Could not find uid:${req.target}`)
		}
		if (!current.friendList.find((uid)=>uid==target.uid)){
			current.friendList.push(target.uid)
			await this.friendRepository.save(current);
		}
		return plainToClass(resFriendListDto, current);
	}

	async blockUser(req:reqFriendDto): Promise<resFriendListDto>{
		if (req.uid == req.target){
			throw new HttpException('Cannot add self block', HttpStatus.BAD_REQUEST);
		}
		const current = await this.friendRepository.findOne({where:{uid:req.uid}})
		const target = await this.userRepository.findOne({where:{uid:req.target}});
		if (!target){
			throw new NotFoundException(`Could not find uid:${req.target}`)
		}
		if (current.blockedList.find(blocked=>blocked==target.uid)){
			return plainToClass(resFriendListDto, current);
		}
		current.friendList = current.friendList.filter(blocked=>blocked!=target.uid)
		current.blockedList.push(target.uid);
		await this.friendRepository.save(current);
		return plainToClass(resFriendListDto, current);
	}

	async unblockUser(req:reqFriendDto):Promise<resFriendListDto>{
		if (req.uid == req.target){
			throw new HttpException('Cannot self unblock', HttpStatus.BAD_REQUEST);
		}
		const current = await this.friendRepository.findOne({where:{uid:req.uid}})
		const target = await this.userService.getUserByID(req.target);
		current.blockedList = current.blockedList.filter(blocked=>blocked!=target.uid);
		await this.friendRepository.save(current);
		return plainToClass(resFriendListDto, current);
	}
}