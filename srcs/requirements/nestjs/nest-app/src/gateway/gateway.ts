import { Body, Inject, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "src/chat/chat.service";

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
		const [id, room_name] = client.rooms.keys();
		this.chatService.sendMessage();
	}

	@SubscribeMessage('DM')
	handleDirectMessage(client:Socket, req:{target:string,msg:string}){
		this.chatService.sendDirectMessage();
	}

	@SubscribeMessage('join')
	handleJoinReq(client:Socket, room_name:string){
		if (client.rooms.size != 1){
			client.emit('error', 400)
			return ;
		}
		//chatService의 join 호출해서 req수행, 경우에따라 exception발생후 catch도 해야할듯
		//join 성공시 서버는 방 참여자들에게 메세지, client의 닉네임과의 맵핑 필요
		if (this.chatService.joinChatroom()){
			this.server.to(room_name).emit('notice', `${client.id} has joined`)
		}
	}

	@SubscribeMessage('leave')
	handleLeaveReq(client:Socket){
		if (client.rooms.size != 2)
		{
			client.emit('error', 401)
			return ;
		}
		const [id, room_name] = client.rooms.keys();
		if (this.chatService.leaveChatroom()){
			this.server.to(room_name).emit('notice', `${client.id} has left`)
		}
	}

	@SubscribeMessage('kick')
	handleKickReq(client:Socket, target:string){
		this.chatService.kickClient();
	}

	@SubscribeMessage('ban')
	handleBanReq(client:Socket, target:string){
		this.chatService.banClient()
	}

	@SubscribeMessage('mute')
	handleMuteReq(client:Socket, target:string){
		this.chatService.muteClient()
	}
}