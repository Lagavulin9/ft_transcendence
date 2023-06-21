import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from 'src/dto/createUser.dto';
import { ResUserDto } from 'src/dto/resUser.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Log } from 'src/game/log.entity';
import { FriendList } from 'src/friend/friend.entity';
import { ReqUserDto } from 'src/dto/reqUser.dto';
import { GameService } from 'src/game/game.service';
import { LogDto } from 'src/dto/log.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
    @InjectRepository(FriendList)
    private friendRepository: Repository<FriendList>,
    private gameService: GameService,
  ) {}

  async getUserByID(uid: number): Promise<ResUserDto> {
    const found = await this.userRepository.findOne({ where: { uid: uid } });
    if (!found) {
      throw new NotFoundException(`Could not find uid:${uid}`);
    }
    const res = plainToInstance(ResUserDto, found);
    res.gameLog = (await this.gameService.getUserGameLogs(uid)).log;
    return res;
  }

  async getUserByNick(nickname: string): Promise<ResUserDto> {
    const found = await this.userRepository.findOne({
      where: { nickname: nickname },
    });
    if (!found) {
      throw new NotFoundException(`Could not find nickname:${nickname}`);
    }
    const res = plainToInstance(ResUserDto, found);
    const gamelogdto = await this.gameService.getUserGameLogs(found.uid);
    return res;
  }

  async createUser(user: createUserDto, data): Promise<User> {
    const newUser = new User();
    newUser.uid = data.id;
    newUser.email = data.email;
    newUser.status = 'offline';
    newUser.nickname = user.nickname;
    await this.userRepository.save(newUser).catch((err) => {
      throw new HttpException(JSON.stringify(err.detail), HttpStatus.CONFLICT);
    });
    const newFriendList = new FriendList();
    newFriendList.uid = newUser.uid;
    await this.friendRepository.save(newFriendList);
    return newUser;
  }

  async updateUser(uid: number, req: ReqUserDto): Promise<User> {
    const toUpdate = await this.userRepository.findOne({ where: { uid: uid } });
    if (!toUpdate) {
      throw new NotFoundException(`Could not find user id:${uid}`);
    }
    toUpdate.nickname = req.nickname;
    toUpdate.isOTP = req.isOTP;
    toUpdate.email = req.email;
    toUpdate.profileURL = req.profileURL;
    await this.userRepository.save(toUpdate);
    return toUpdate;
  }

  async checkUniqueNick(nickname: string): Promise<boolean> {
    const found = await this.userRepository.findOne({
      where: { nickname: nickname },
    });
    if (found) {
      return false;
    }
    return true;
  }

  async updateUserStatus(uid: number, status: string) {
    const user = await this.userRepository.findOne({ where: { uid: uid } });
    if (!user) {
      return false;
    }
    user.status = status;
    await this.userRepository.save(user);
    return true;
  }

  /*
	async updateProfileUrl(uid: number, profileUrl: string):Promise<User>{
		const toUpdate =  await this.userRepository.findOne({where:{uid:uid}});
		if (!toUpdate){
			return undefined;
		}
		toUpdate.profileUrl = profileUrl;
		this.userRepository.save(toUpdate);
		return toUpdate;
	}
*/
  // async getUserGameLogs(uid:number): Promise<GameLogDto[]>{
  // 	const gamelog = []
  // 	gamelog.push(...await this.logRepository.find({where:{fromId:uid}}));
  // 	gamelog.push(...await this.logRepository.find({where:{toId:uid}}));
  // 	const gamelogdto = plainToInstance(GameLogDto, gamelog)
  // 	return gamelogdto;
  // }

  // async saveGameLog(log:LogDto): Promise<Log>{
  // 	const newLog = this.logRepository.create(log);
  // 	newLog.fromScore = log.score[0];
  // 	newLog.toScore = log.score[1];
  // 	const host = await this.userRepository.findOne({where:{uid:log.fromId}});
  // 	const guest = await this.userRepository.findOne({where:{uid:log.toId}});
  // 	if (!host || !guest){
  // 		throw new NotFoundException('No such user');
  // 	}
  // 	if (newLog.fromScore > newLog.toScore){
  // 		host.totalWin++;
  // 		guest.totalLose++;
  // 	}
  // 	else{
  // 		host.totalLose++;
  // 		guest.totalWin++;
  // 	}
  // 	await this.logRepository.save(newLog);
  // 	this.userRepository.save(host);
  // 	this.userRepository.save(guest);
  // 	return newLog;
  // }
}
