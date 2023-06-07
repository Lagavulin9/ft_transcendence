import { Body, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { subscribe } from "diagnostics_channel";
import { Server, Socket } from "socket.io";

// @WebSocketGateway({cors:{origin:['nextjs']}})
@WebSocketGateway()
export class socketGateway implements OnModuleInit{
	Clients = []
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
		client.to(room_name).emit('message', `${id}:${msg}`);
	}

	@SubscribeMessage('join')
	handleJoinReq(client:Socket, room_name:string){
		if (client.rooms.size != 1){
			client.emit('error', 400)
			return ;
		}
		client.join(room_name);
		client.to(room_name).emit('message', `${client.id} has joined`);
		client.send(`You are now in ${room_name}`);
	}

	@SubscribeMessage('leave')
	handleLeaveReq(client:Socket){
		if (client.rooms.size != 2)
		{
			client.emit('error', 401)
			return ;
		}
		const [id, room_name] = client.rooms.keys();
		client.to(room_name).emit('message', `${id} has left`)
		client.leave(room_name);
		client.send(`You left ${room_name}`)
	}
}