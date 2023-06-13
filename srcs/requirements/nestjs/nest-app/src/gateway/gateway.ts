import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { subscribe } from "diagnostics_channel";
import { Server, Socket } from "socket.io";
import { Chat } from "src/chat/chat.entity";
import { ChatService } from "src/chat/chat.service";
import { ReqSocketDto } from "src/dto/reqSocket.dto";
import { UserService } from "src/user/user.service";

// @WebSocketGateway({cors:{origin:['nextjs']}})
@WebSocketGateway()
export class socketGateway implements OnModuleInit{
	constructor(
		private chatService:ChatService,
		private userService:UserService
	){}

	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.server.on('connection', client=>{
			console.log(`client connected. id: ${client.id}`)
			client.on('disconnect', ()=>{
				console.log(`client disconnected. id: ${client.id}`);
				this.chatService.unbindUser(client);
			})
		})
	}

	//소켓이 열릴때 훅을 걸어서 바인드
	@SubscribeMessage('bind')
	handleBind(client:Socket, uid:number):Promise<boolean>{
		return this.chatService.bindUser(client, uid);
	}

	@SubscribeMessage('create')
	handleCreateReq(client:Socket, req:ReqSocketDto):Chat|undefined{
		return this.chatService.createChatroom(client, req);
	}

	@SubscribeMessage('join')
	handleJoinReq(client:Socket, req:ReqSocketDto):Chat|undefined{
		return this.chatService.joinChatroom(client, req)
	}

	@SubscribeMessage('leave')
	handleLeaveReq(client:Socket, req:ReqSocketDto):boolean{
		return this.chatService.leaveChatroom(client, req)
	}

	@SubscribeMessage('message')
	handleMessage(client:Socket, req:ReqSocketDto):boolean{
		return this.chatService.sendMessage(client, req);
	}

	@SubscribeMessage('DM')
	handleDirectMessage(client:Socket, req:ReqSocketDto){
		this.chatService.sendDirectMessage(client, req);
	}

	@SubscribeMessage('kick')
	handleKickReq(client:Socket, req:ReqSocketDto):boolean{
		return this.chatService.kickClient(client, req);
	}

	@SubscribeMessage('ban')
	handleBanReq(client:Socket, req:ReqSocketDto):boolean{
		return this.chatService.banClient(client, req);
	}

	@SubscribeMessage('mute')
	handleMuteReq(client:Socket, req:ReqSocketDto):boolean{
		return this.chatService.muteClient(client, req);
	}

	@SubscribeMessage('usermod')
	handleUsermod(client:Socket, req:ReqSocketDto):boolean{
		return this.chatService.addAdmin(client, req);
	}
}