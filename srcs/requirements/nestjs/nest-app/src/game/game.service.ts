import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { GameLogDto, LogDto } from 'src/dto/log.dto';
import { plainToInstance } from 'class-transformer';
import { Socket } from 'socket.io';
import { GameRoom } from './gameroom.entity';
import { ReqSocketDto } from 'src/dto/reqSocket.dto';
import { GameStateDto } from 'src/dto/gameState.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}
  private Clients = new BidirectionalMap<number, Socket>();
  private GameRooms = new Map<number, GameRoom>();
  private GameQueue = [];

  async getUserGameLogs(uid: number): Promise<GameLogDto[]> {
    const gamelog = [];
    gamelog.push(
      ...(await this.logRepository.find({ where: { fromId: uid } })),
    );
    gamelog.push(...(await this.logRepository.find({ where: { toId: uid } })));
    const gamelogdto = plainToInstance(GameLogDto, gamelog);
    return gamelogdto;
  }

  async saveGameLog(log: LogDto): Promise<Log> {
    const newLog = this.logRepository.create(log);
    console.log(newLog);
    const host = await this.userRepository.findOne({
      where: { uid: log.fromId },
    });
    const guest = await this.userRepository.findOne({
      where: { uid: log.toId },
    });
    if (!host || !guest) {
      throw new NotFoundException('No such user');
    }
    if (newLog.fromScore > newLog.toScore) {
      host.totalWin++;
      guest.totalLose++;
    } else {
      host.totalLose++;
      guest.totalWin++;
    }
    await this.logRepository.save(newLog);
    this.userRepository.save(host);
    this.userRepository.save(guest);
    return newLog;
  }

  async bindUser(client: Socket, uid: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { uid: uid } });
    if (!user) {
      return false;
    }
    if (this.Clients.getValue(user.uid)) {
      return false;
    }
    this.Clients.set(user.uid, client);
    client.emit('notice', user);
    return true;
  }

  unbindUser(client: Socket): boolean {
    const uid = this.Clients.getKey(client);
    if (!uid) {
      return false;
    }
    for (const [key, gameroom] of this.GameRooms.entries()) {
      if (gameroom.host.uid == uid || gameroom.guest.uid == uid) {
        this.Clients.delete(gameroom.host.uid);
      }
      if (gameroom.host.uid == uid) {
        const guestSocket = this.Clients.getValue(gameroom.guest.uid);
        guestSocket.emit('game-over', undefined);
      } else if (gameroom.guest.uid == uid) {
        const hostSocket = this.Clients.getValue(gameroom.host.uid);
        hostSocket.emit('game-over', undefined);
      }
    }
    return true;
  }

  async createNewGame(client: Socket, req: ReqSocketDto): Promise<boolean> {
    const hostUid = this.Clients.getKey(client);
    if (!hostUid) {
      console.log('no such user. bind first');
      return false;
    }
    const host = await this.userRepository.findOne({ where: { uid: hostUid } });
    const guest = await this.userRepository.findOne({
      where: { uid: req.target },
    });
    if (!guest) {
      console.log('no such target');
      return false;
    }
    const guestSocket = this.Clients.getValue(guest.uid);
    if (!guestSocket) {
      console.log('guest is offline');
      return false;
    }
    console.log(req);
    const gameroom = new GameRoom();
    gameroom.host = host;
    gameroom.guest = guest;
    gameroom.game_start = false;
    guestSocket.emit('game-invite', gameroom);
    client.emit('host-invite', 'invitation was sent');
    this.GameRooms.set(host.uid, gameroom);
    setTimeout(() => {
      if (gameroom.game_start === true) {
        this.GameRooms.delete(hostUid);
      }
    }, 1000 * 15);
    return true;
  }

  acceptInvitation(client: Socket, req: ReqSocketDto): boolean {
    const guestUid = this.Clients.getKey(client);
    if (!guestUid) {
      console.log('guest is offline');
      return false;
    }
    if (req.msg == 'ok') {
      for (const [key, gameroom] of this.GameRooms.entries()) {
        if (gameroom.guest.uid == guestUid) {
          gameroom.game_start = true;
          const hostSocket = this.Clients.getValue(gameroom.host.uid);
          if (!hostSocket) {
            console.log('host is offline');
            return false;
          }
          hostSocket.emit('game-start', gameroom);
          client.emit('game-start', gameroom);
          break;
        }
      }
    }
  }

  declineInvitation(client: Socket, req: GameRoom) {
    const hostSocket = this.Clients.getValue(req.host.uid);
    this.GameRooms.delete(req.host.uid);
    if (!hostSocket) {
      return false;
    }
    hostSocket.emit('game-decline', 'declined');
    // client.emit('game-decline', 'declined');
  }

  host2guest(client: Socket, data: GameStateDto) {
    const hostSocket = this.Clients.getValue(data.gameroom.host.uid);
    const guestSocket = this.Clients.getValue(data.gameroom.guest.uid);
    if (!guestSocket) {
      console.log('guest is offline');
      // if (hostSocket){
      // 	hostSocket.emit('game-over', data);
      // }
      // this.GameRooms.delete(data.gameroom.host.uid);
      return false;
    }
    guestSocket.emit('host2guest', data);
    return true;
  }

  guest2host(client: Socket, data: GameStateDto) {
    const guestSocket = this.Clients.getValue(data.gameroom.guest.uid);
    const hostSocket = this.Clients.getValue(data.gameroom.host.uid);
    if (!hostSocket) {
      console.log('host is offline');
      // if (guestSocket){
      // 	guestSocket.emit('game-over', data);
      // }
      // this.GameRooms.delete(data.gameroom.host.uid);
      return false;
    }
    hostSocket.emit('guest2host', data);
    return true;
  }

  //비정상 종료인경우만..
  gameOver(client: Socket, data: GameStateDto) {
    this.GameRooms.delete(data.gameroom.host.uid);
    const hostSocket = this.Clients.getValue(data.gameroom.host.uid);
    const guestSocket = this.Clients.getValue(data.gameroom.guest.uid);
    if (data.gameroom.game_start === false) {
      if (hostSocket) {
        hostSocket.emit('game-decline', true);
      }
      if (guestSocket) {
        guestSocket.emit('game-declien', true);
      }
    } else {
      if (client == hostSocket) {
        guestSocket.emit('game-over');
      } else if (client == guestSocket) {
        hostSocket.emit('game-over');
      }
    }
  }

  //정상종료인경우
  finish(client: Socket, data: GameStateDto) {
    const hostSocket = this.Clients.getValue(data.gameroom.host.uid);
    const guestSocket = this.Clients.getValue(data.gameroom.guest.uid);
    hostSocket.emit('finish', true);
    guestSocket.emit('finish', true);
    this.GameRooms.delete(data.gameroom.host.uid);
  }

  async randomMatch(client: Socket) {
    if (this.GameQueue.length) {
      const newGame = new GameRoom();
      newGame.host = this.GameQueue.pop();
      newGame.guest = await this.userRepository.findOne({
        where: { uid: this.Clients.getKey(client) },
      });
      newGame.game_start = true;
      this.GameRooms.set(newGame.host.uid, newGame);
      const hostSocket = this.Clients.getValue(newGame.host.uid);
      const guestSocket = this.Clients.getValue(newGame.guest.uid);
      hostSocket.emit('game-start', newGame);
      guestSocket.emit('game-start', newGame);
    } else {
      const user = this.userRepository.findOne({
        where: { uid: this.Clients.getKey(client) },
      });
      if (!user) {
        //에러: 서버에서 유저를 못찾음
        client.emit('user404', 'user not found');
        return;
      }
      this.GameQueue.push(user);
      client.emit('waiting', 'waiting for another user');
    }
  }
}

class BidirectionalMap<Key, Value> {
  private forwardMap: Map<Key, Value>;
  private reverseMap: Map<Value, Key>;

  constructor() {
    this.forwardMap = new Map<Key, Value>();
    this.reverseMap = new Map<Value, Key>();
  }

  set(key: Key, value: Value) {
    this.forwardMap.set(key, value);
    this.reverseMap.set(value, key);
  }

  getKey(value: Value): Key | undefined {
    return this.reverseMap.get(value);
  }

  getValue(key: Key): Value | undefined {
    return this.forwardMap.get(key);
  }

  delete(key: Key) {
    const value = this.forwardMap.get(key);
    if (value !== undefined) {
      this.forwardMap.delete(key);
      this.reverseMap.delete(value);
    }
  }

  getForwardMap(): Map<Key, Value> {
    return this.forwardMap;
  }
}
