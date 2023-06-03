import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './user.entity'
import { Repository } from "typeorm";
import { createUserDto } from "src/dto/createUser.dto";
import { getUserDto } from "src/dto/getUser.dto";
import { plainToInstance } from "class-transformer";
import { LogDto, GameLogDto } from "src/dto/log.dto";
import { Log } from "src/user/log.entity";

@Injectable()
export class UserService{
	constructor(
		@InjectRepository(User)
		private userRepository:Repository<User>,
		@InjectRepository(Log)
		private logRepository:Repository<Log>
	){}

	async getUserByID(uid:number): Promise<getUserDto> {
		const found = await this.userRepository.findOne({where:{uid:uid}});
		if (!found){
			throw new NotFoundException(`Could not find uid:${uid}`);
		}
		const getuserdto = plainToInstance(getUserDto, found);
		getuserdto.gameLog = await this.getUserGameLogs(uid);
		return getuserdto;
	}

	async getUserByNick(nickname:string): Promise<getUserDto> {
		const found = await this.userRepository.findOne({where:{nickname:nickname}});
		if (!found){
			throw new NotFoundException(`Could not find nickname:${nickname}`)
		}
		const getuserdto = plainToInstance(getUserDto, found);
		getuserdto.gameLog = await this.getUserGameLogs(found.uid);
		return getuserdto;
	}

	async createUser(user:createUserDto): Promise<void> {
		const newUser = this.userRepository.create(user);
		await this.userRepository.save(newUser).catch(err=>{throw new HttpException(JSON.stringify(err.detail), HttpStatus.CONFLICT)});
		throw new HttpException("Accepted", HttpStatus.ACCEPTED);
	}

	async getUserGameLogs(uid:number): Promise<GameLogDto[]>{
		const gamelog = await this.logRepository.find({where:{fromId:uid}});
		const gamelogdto = plainToInstance(GameLogDto, gamelog)
		return gamelogdto;
	}

	async saveGameLog(log:LogDto): Promise<void>{
		const newLog = this.logRepository.create(log);
		newLog.fromScore = log.score[0];
		newLog.toScore = log.score[1];
		await this.logRepository.save(newLog);
		throw new HttpException("Accepted", HttpStatus.ACCEPTED);
	}
}