import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { GameLogDto, LogDto } from 'src/dto/log.dto';
import { plainToInstance } from 'class-transformer';
import { Socket } from 'socket.io';
import { GameRoom } from './gameroom.entity';
import { GameStateDto } from 'src/dto/gameState.dto';
import { ReqGameDto } from 'src/dto/reqGame.dto';
import { gameKeyPressDto } from 'src/dto/gameKeyPress.dto';
import { UserService } from 'src/user/user.service';

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

  async getUserGameLogs(uid: number): Promise<GameLogDto> {
    const newLog = new GameLogDto();
    newLog.uId = uid;
    const gamelogs = [];
    gamelogs.push(
      ...(await this.logRepository.find({ where: { fromId: uid } })),
    );
    gamelogs.push(...(await this.logRepository.find({ where: { toId: uid } })));
    newLog.log = gamelogs;
    return newLog;
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
        if (guestSocket) {
          guestSocket.emit('game-over', undefined);
        }
      } else if (gameroom.guest.uid == uid) {
        const hostSocket = this.Clients.getValue(gameroom.host.uid);
        if (hostSocket) {
          hostSocket.emit('game-over', undefined);
        }
      }
    }
    return true;
  }

  async createNewGame(client: Socket, req: ReqGameDto): Promise<boolean> {
    const host = await this.userRepository.findOne({
      where: { uid: req.host },
    });
    const guest = await this.userRepository.findOne({
      where: { uid: req.guest },
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
    const gameroom = new GameRoom();
    gameroom.host = host;
    gameroom.guest = guest;
    gameroom.game_start = false;

    const emitTmp = new ReqGameDto();
    emitTmp.host = host.uid;
    emitTmp.guest = guest.uid;
    emitTmp.game_start = false;
    emitTmp.isNormal = req.isNormal;

    guestSocket.emit('game-invite', emitTmp);
    client.emit('notice', 'invitation was sent');
    this.GameRooms.set(host.uid, gameroom);
    setTimeout(() => {
      if (gameroom.game_start === true) {
        this.GameRooms.delete(host.uid);
      }
    }, 1000 * 15);
    return true;
  }

  async acceptInvitation(client: Socket, req: ReqGameDto): Promise<boolean> {
    const guestUid = this.Clients.getKey(client);
    if (!guestUid) {
      console.log('guest is offline');
      return false;
    }
    if (req.game_start === true) {
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
          const host = await this.userRepository.findOne({
            where: { uid: gameroom.host.uid },
          });
          host.status = 'inGame';
          const guest = await this.userRepository.findOne({
            where: { uid: gameroom.guest.uid },
          });
          guest.status = 'inGame';
          await this.userRepository.save(host);
          await this.userRepository.save(guest);
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
    const hostSocket = this.Clients.getValue(data.gameroom.host);
    const guestSocket = this.Clients.getValue(data.gameroom.guest);
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

  guest2host(client: Socket, data: gameKeyPressDto) {
    const guestSocket = this.Clients.getValue(data.gameroom.guest);
    const hostSocket = this.Clients.getValue(data.gameroom.host);
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
  async gameOver(client: Socket, data: any) {
    const left = this.Clients.getKey(client);
    let gameroom: GameRoom;
    for (const [hostuid, game] of this.GameRooms.entries()) {
      if (game.host.uid == left || game.guest.uid == left) {
        gameroom = game;
        break;
      }
    }
    this.GameRooms.delete(gameroom.host.uid);
    const hostSocket = this.Clients.getValue(gameroom.host.uid);
    const guestSocket = this.Clients.getValue(gameroom.guest.uid);
    if (gameroom.game_start === false) {
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
      const host = await this.userRepository.findOne({
        where: { uid: gameroom.host.uid },
      });
      if (host && host.status == 'inGame') {
        host.status = 'online';
        await this.userRepository.save(host);
      }
      const guest = await this.userRepository.findOne({
        where: { uid: gameroom.guest.uid },
      });
      if (guest && guest.status == 'inGame') {
        guest.status = 'online';
        await this.userRepository.save(guest);
      }
    }
  }

  //정상종료인경우
  async finish(client: Socket, data: GameStateDto) {
    const hostSocket = this.Clients.getValue(data.gameroom.host);
    const guestSocket = this.Clients.getValue(data.gameroom.guest);
    if (hostSocket) {
      hostSocket.emit('finish', true);
    }
    if (guestSocket) {
      guestSocket.emit('finish', true);
    }
    this.GameRooms.delete(data.gameroom.host);
    const host = await this.userRepository.findOne({
      where: { uid: data.gameroom.host },
    });
    if (host && host.status == 'inGame') {
      host.status = 'online';
      await this.userRepository.save(host);
    }
    const guest = await this.userRepository.findOne({
      where: { uid: data.gameroom.guest },
    });
    if (guest && guest.status == 'inGame') {
      guest.status = 'online';
      await this.userRepository.save(guest);
    }
  }

  async randomMatch(client: Socket) {
    const uid = this.Clients.getKey(client);
    if (this.GameQueue.length) {
      if (this.GameQueue.find((u) => u == uid)) {
        return;
      }
      const newGame = new GameRoom();
      newGame.host = await this.userRepository.findOne({
        where: { uid: this.GameQueue.pop() },
      });
      newGame.guest = await this.userRepository.findOne({
        where: { uid: uid },
      });
      console.log(newGame.guest);
      newGame.game_start = false;
      const hostSocket = this.Clients.getValue(newGame.host.uid);
      const guestSocket = this.Clients.getValue(newGame.guest.uid);
      if (hostSocket) {
        hostSocket.emit('game-start', newGame);
      }
      if (guestSocket) {
        guestSocket.emit('game-start', newGame);
      }
    } else {
      if (!uid) {
        //에러: 서버에서 유저를 못찾음
        client.emit('user404', 'user not found');
        return;
      }
      this.GameQueue.push(uid);
      client.emit('waiting', 'waiting for another user');
    }
  }

  isUserInGame(uid: number) {
    for (const [hostuid, gameroom] of this.GameRooms.entries()) {
      if (gameroom.host.uid == uid || gameroom.guest.uid == uid) {
        return true;
      }
    }
    return false;
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
