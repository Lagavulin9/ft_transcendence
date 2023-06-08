import { Body, Inject, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "src/chat/chat.service";
import { ReqSocketDto } from "src/dto/reqSocket.dto";

// @WebSocketGateway({cors:{origin:['nextjs']}})
@WebSocketGateway()
export class socketGateway implements OnModuleInit{
	constructor(
		private chatService:ChatService
	){}

	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.server.on('connection', client=>{
			console.log(`client connected. id: ${client.id}`)
			client.on('disconnect', ()=>{
				console.log(`client disconnected. id: ${client.id}`)
			})
		})
	}

	@SubscribeMessage('message')
	handleMessage(client:Socket, msg:string){
		if (client.rooms.size != 2)
			return ;
		const [id, roomName] = client.rooms.keys();
		const newReq = new ReqSocketDto();
		newReq.client = client;
		newReq.roomName = roomName;
		newReq.msg = msg;
		this.chatService.sendMessage(newReq);
	}

	@SubscribeMessage('DM')
	handleDirectMessage(client:Socket, req:{target:string,msg:string}){
		const newReq = new ReqSocketDto();
		newReq.client = client;
		newReq.target = req.target;
		newReq.msg = req.msg;
		this.chatService.sendDirectMessage(newReq);
	}

	@SubscribeMessage('join')
	handleJoinReq(client:Socket, roomName:string){
		if (client.rooms.size != 1){
			client.emit('error', 400)
			return ;
		}
		const newReq = new ReqSocketDto();
		newReq.client = client;
		newReq.roomName = roomName;
		if (this.chatService.joinChatroom(newReq)){
			this.server.to(roomName).emit('notice', `${client.id} has joined`)
		}
	}

	@SubscribeMessage('leave')
	handleLeaveReq(client:Socket){
		if (client.rooms.size != 2)
		{
			client.emit('error', 401)
			return ;
		}
		const [id, roomName] = client.rooms.keys();
		const newReq = new ReqSocketDto();
		newReq.client = client;
		newReq.roomName = roomName;
		if (this.chatService.leaveChatroom(newReq)){
			this.server.to(roomName).emit('notice', `${client.id} has left`)
		}
	}

	@SubscribeMessage('kick')
	handleKickReq(client:Socket, target:string){
		const newReq = new ReqSocketDto();
		newReq.client = client;
		newReq.target = target;
		this.chatService.kickClient(newReq);
	}

	@SubscribeMessage('ban')
	handleBanReq(client:Socket, target:string){
		const newReq = new ReqSocketDto();
		newReq.client = client;
		newReq.target = target;
		this.chatService.banClient(newReq)
	}

	@SubscribeMessage('mute')
	handleMuteReq(client:Socket, target:string){
		const newReq = new ReqSocketDto();
		newReq.client = client;
		newReq.target = target;
		this.chatService.muteClient(newReq)
	}
}