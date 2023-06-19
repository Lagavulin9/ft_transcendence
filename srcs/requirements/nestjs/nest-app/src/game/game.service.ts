import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Log } from "./log.entity";
import { GameLogDto, LogDto } from "src/dto/log.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class GameService{
	constructor(
		@InjectRepository(User)
		private userRepository:Repository<User>,
		@InjectRepository(Log)
		private logRepository:Repository<Log>
	){}

	async getUserGameLogs(uid:number): Promise<GameLogDto[]>{
		const gamelog = []
		gamelog.push(...await this.logRepository.find({where:{fromId:uid}}));
		gamelog.push(...await this.logRepository.find({where:{toId:uid}}));
		const gamelogdto = plainToInstance(GameLogDto, gamelog)
		return gamelogdto;
	}

	async saveGameLog(log:LogDto): Promise<Log>{
		const newLog = this.logRepository.create(log);
		newLog.fromScore = log.score[0];
		newLog.toScore = log.score[1];
		const host = await this.userRepository.findOne({where:{uid:log.fromId}});
		const guest = await this.userRepository.findOne({where:{uid:log.toId}});
		if (!host || !guest){
			throw new NotFoundException('No such user');
		}
		if (newLog.fromScore > newLog.toScore){
			host.totalWin++;
			guest.totalLose++;
		}
		else{
			host.totalLose++;
			guest.totalWin++;
		}
		await this.logRepository.save(newLog);
		this.userRepository.save(host);
		this.userRepository.save(guest);
		return newLog;
	}
}
