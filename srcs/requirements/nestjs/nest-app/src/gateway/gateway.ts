import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { subscribe } from 'diagnostics_channel';
import { Server, Socket } from 'socket.io';
import { Chat } from 'src/chat/chat.entity';
import { ChatService } from 'src/chat/chat.service';
import { gameKeyPressDto } from 'src/dto/gameKeyPress.dto';
import { GameStateDto } from 'src/dto/gameState.dto';
import { ReqGameDto } from 'src/dto/reqGame.dto';
import { ReqSocketDto } from 'src/dto/reqSocket.dto';
import { GameService } from 'src/game/game.service';
import { GameRoom, reqGameRoom } from 'src/game/gameroom.entity';
import { UserService } from 'src/user/user.service';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';

// @WebSocketGateway({cors:{origin:['nextjs']}})
@WebSocketGateway({
  cors: {
    origin: 'http://localhost', // 클라이언트 도메인으로 변경
    credentials: true,
  },
})
export class socketGateway implements OnModuleInit {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private gameService: GameService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (client) => {
      // 클라이언트로부터 받은 쿠키 추출
      const cookies = cookie.parse(client.handshake.headers.cookie || '');
      const authenticationCookie = cookies['Auth'];
      if (authenticationCookie) {
        const decoded = this.jwtService.verify(authenticationCookie);
        client.emit('bind', decoded.uid);
      }

      // 필요한 경우 사용자 인증 및 쿠키 처리를 여기에서 수행하십시오
      // ...

      console.log(`client connected. id: ${client.id}`);
      client.on('disconnect', () => {
        console.log(`client disconnected. id: ${client.id}`);
        this.chatService.unbindUser(client);
        this.gameService.unbindUser(client);
      });
    });
  }

  //소켓이 열릴때 훅을 걸어서 바인드
  @SubscribeMessage('bind')
  handleBind(client: Socket, uid: number): Promise<boolean> {
    console.log(`bind request from ${uid}`);
    return (
      this.chatService.bindUser(client, uid) &&
      this.gameService.bindUser(client, uid)
    );
  }

  @SubscribeMessage('create')
  handleCreateReq(
    client: Socket,
    req: ReqSocketDto,
  ): Promise<Chat | undefined> {
    return this.chatService.createChatroom(client, req);
  }

  @SubscribeMessage('join')
  handleJoinReq(client: Socket, req: ReqSocketDto): Promise<Chat | undefined> {
    return this.chatService.joinChatroom(client, req);
  }

  @SubscribeMessage('password')
  handlePassword(client: Socket, req: ReqSocketDto): Promise<Chat | undefined> {
    return this.chatService.passCheck(client, req);
  }

  @SubscribeMessage('leave')
  handleLeaveReq(client: Socket, req: ReqSocketDto): boolean {
    return this.chatService.leaveChatroom(client, req);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, req: ReqSocketDto): boolean {
    return this.chatService.sendMessage(client, req);
  }

  @SubscribeMessage('DM')
  handleDirectMessage(client: Socket, req: ReqSocketDto) {
    this.chatService.sendDirectMessage(client, req);
  }

  @SubscribeMessage('kick')
  handleKickReq(client: Socket, req: ReqSocketDto): boolean {
    return this.chatService.kickClient(client, req);
  }

  @SubscribeMessage('ban')
  handleBanReq(client: Socket, req: ReqSocketDto): boolean {
    return this.chatService.banClient(client, req);
  }

  @SubscribeMessage('mute')
  handleMuteReq(client: Socket, req: ReqSocketDto): boolean {
    return this.chatService.muteClient(client, req);
  }

  @SubscribeMessage('usermod')
  handleUsermod(client: Socket, req: ReqSocketDto): boolean {
    return this.chatService.addAdmin(client, req);
  }

  @SubscribeMessage('echo')
  handlePing(client: Socket, req: string): boolean {
    return client.emit('echo', req);
  }

  @SubscribeMessage('game-invite')
  handleGameInvite(client: Socket, req: ReqGameDto) {
    return this.gameService.createNewGame(client, req);
  }

  @SubscribeMessage('game-accept')
  handleGameAccept(client: Socket, req: ReqGameDto) {
    return this.gameService.acceptInvitation(client, req);
  }

  @SubscribeMessage('game-decline')
  handleGameDecline(client: Socket, req: GameRoom) {
    return this.gameService.declineInvitation(client, req);
  }

  @SubscribeMessage('game-over')
  handleGameOver(client: Socket, data: any) {
    return this.gameService.gameOver(client, data);
  }

  @SubscribeMessage('finish')
  handleFinish(client: Socket, data: GameStateDto) {
    return this.gameService.finish(client, data);
  }

  @SubscribeMessage('host2guest')
  handleHost2Guest(client: Socket, data: GameStateDto) {
    return this.gameService.host2guest(client, data);
  }

  @SubscribeMessage('guest2host')
  handleGuest2Host(client: Socket, data: gameKeyPressDto) {
    return this.gameService.guest2host(client, data);
  }

  @SubscribeMessage('random-matching')
  handleRandomMatching(client: Socket) {
    return this.gameService.randomMatch(client);
  }
}
