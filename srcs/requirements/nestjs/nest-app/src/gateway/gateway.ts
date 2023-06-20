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
import { GameStateDto } from 'src/dto/gameState.dto';
import { ReqSocketDto } from 'src/dto/reqSocket.dto';
import { GameService } from 'src/game/game.service';
import { GameRoom } from 'src/game/gameroom.entity';
import { UserService } from 'src/user/user.service';

// @WebSocketGateway({cors:{origin:['nextjs']}})
@WebSocketGateway({ cors: true })
export class socketGateway implements OnModuleInit {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private gameService: GameService
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (client) => {
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
    return this.chatService.bindUser(client, uid) && this.gameService.bindUser(client, uid);
  }

  @SubscribeMessage('create')
  handleCreateReq(client: Socket, req: ReqSocketDto): Promise<Chat | undefined> {
    console.log(req);
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
    console.log(req);
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
    console.log(req);
    return this.chatService.addAdmin(client, req);
  }

  @SubscribeMessage('echo')
  handlePing(client: Socket, req: string): boolean {
    return client.emit('echo', req);
  }

  @SubscribeMessage('game-invite')
  handleGameInvite(client:Socket, req:ReqSocketDto){
    return this.gameService.createNewGame(client, req);
  }

  @SubscribeMessage('game-accept')
  handleGameAccept(client:Socket, req:ReqSocketDto){
    return this.gameService.acceptInvitation(client, req);
  }

  @SubscribeMessage('game-decline')
  handleGameDecline(client:Socket, req:GameRoom){
    return this.gameService.declineInvitation(client, req);
  }

  @SubscribeMessage('game-over')
  handleGameOver(client:Socket, data:GameStateDto){
    return this.gameService.gameOver(client, data);
  }

  @SubscribeMessage('finish')
  handleFinish(client:Socket, data:GameStateDto){
    return this.gameService.finish(client, data);
  }

  @SubscribeMessage('host2guest')
  handleHost2Guest(client:Socket, data:GameStateDto){
    return this.gameService.host2guest(client, data);
  }

  @SubscribeMessage('guest2host')
  handleGuest2Host(client:Socket, data:GameStateDto){
    return this.gameService.guest2host(client, data);
  }

  @SubscribeMessage('random-matching')
  handleRandomMatching(client:Socket){
    return this.gameService.randomMatch(client);
  }
}
