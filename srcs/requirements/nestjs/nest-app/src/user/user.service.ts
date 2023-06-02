import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './user.entity'
import { Repository } from "typeorm";
import { UserDto } from "src/dto/user.dto";


@Injectable()
export class UserService{
	constructor(
		@InjectRepository(User)
		private userRepository:Repository<User>,
	){}

	async getUserByID(uid:number): Promise<User> {
		const found = await this.userRepository.findOne({where:{uid:uid}});
		if (!found){
			throw new NotFoundException(`Could not find uid:${uid}`);
		}
		return found;
	}

	async getUserByNick(nickname:string): Promise<User> {
		const found = await this.userRepository.findOne({where:{nickname:nickname}});
		if (!found){
			throw new NotFoundException(`Could not find nickname:${nickname}`)
		}
		return found;
	}

	async saveUser(user:UserDto): Promise<void> {
		const newUser = this.userRepository.create(user);
		await this.userRepository.save(newUser);
	}
}