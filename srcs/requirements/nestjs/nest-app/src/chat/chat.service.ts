import { Injectable, NotFoundException } from "@nestjs/common";
import { resChatDto } from "src/dto/resChat.dto";
import { User } from "src/user/user.entity";
import { Chat } from "./chat.entity";
import { Socket } from "socket.io";
import { plainToInstance } from "class-transformer";
import { UserService } from "src/user/user.service";
import { FriendService } from "src/friend/friend.service";
import { ReqSocketDto } from "src/dto/reqSocket.dto";

@Injectable()
export class ChatService{
	constructor(
		private userService:UserService,
		private friendService:FriendService
		){}
	private Clients:BidirectionalMap<User, Socket> = new BidirectionalMap();
	private ChatRooms:Map<string, Chat> = new Map();
	private RoomIndex:number = 0;

	getAllChatroom():Chat[]{
		const chatArray = []
		for (const [roomName, chatroom] of this.ChatRooms){
			chatArray.push(chatroom);
		}
		return chatArray;
	}

	getChatById(roomId:number): resChatDto{
		let found: Chat|undefined;
		for (const iter of this.ChatRooms.values()){
			if (iter.roomId == roomId){
				found = iter;
				break;
			}
		}
		if (found){
			return plainToInstance(resChatDto, found);
		}
		throw new NotFoundException(`Chatroom ID not found: ${roomId}`)
	}

	getChatByName(roomName:string): resChatDto{
		const found = this.ChatRooms.get(roomName);
		if (found){
			return plainToInstance(resChatDto, found);
		}
		throw new NotFoundException(`Chatroom ID not found: ${roomName}`)
	}

	async bindUser(client:Socket, uid:number): Promise<boolean>{
		const userdto = await this.userService.getUserByID(uid);
		if (!userdto){
			return false
		}
		const user = plainToInstance(User, userdto);
		this.Clients.set(user, client);
		client.emit('notice', user)
		return true;
	}

	unbindUser(client:Socket): boolean{
		const user = this.Clients.getKey(client);
		if (!user){
			return false;
		}
		let roomName:string;
		for (const chatroom of this.ChatRooms.values()){
			const found = chatroom.participants.find(u=>u == user)
			if (found){
				roomName = chatroom.roomName;
				chatroom.participants = chatroom.participants.filter(u=>u != user);
				chatroom.roomAlba = chatroom.roomAlba.filter(u=>u != user);
				//방에 아무도 없는경우 채팅방 삭제
				if (chatroom.participants.length == 0){
					this.ChatRooms.delete(roomName);
					console.log(this.ChatRooms);
				}
				//주딱이면 다른놈이 왕위계승
				else if (user == chatroom.roomOwner){
					let newOwner:User
					if (chatroom.roomAlba.length){
						newOwner = chatroom.roomAlba[0];
					}
					else{
						newOwner = chatroom.participants[0];
						chatroom.roomAlba.push(newOwner);
					}
					chatroom.roomOwner = newOwner;
					const newOwnerSocket = this.Clients.getValue(newOwner);
					newOwnerSocket.emit('notice', 'You are now the owner of this chat');
					newOwnerSocket.to(chatroom.roomName).emit('notice', `${newOwner.nickname} is now the owner of this chat`);
				}
				break ;
			}
		}
		client.to(roomName).emit('notice', `${user.nickname} has left the chat`);
		this.Clients.delete(user);
		return true;
	}

	createChatroom(client:Socket, req:ReqSocketDto):Chat|undefined{
		if (client.rooms.size >= 2){
			client.emit('error', `cant join more than two rooms`);
			return undefined;
		}
		if (this.ChatRooms.get(req.roomName)){
			client.emit('error', `Chatroom ${req.roomName} already exist`);
			return undefined;
		}
		const user = this.Clients.getKey(client);
		const newChat = new Chat();
		newChat.roomOwner = user;
		newChat.roomId = ++this.RoomIndex;
		newChat.roomName = req.roomName;
		newChat.roomType = req.roomType;
		newChat.password = req.password;
		newChat.roomAlba = [ user ];
		newChat.participants = [ user ];
		newChat.banned = [];
		newChat.muted = [];
		this.ChatRooms.set(req.roomName, newChat);
		client.emit('notice', 'You are owner of this channel');
		client.join(newChat.roomName);
		return newChat;
	}

	joinChatroom(client:Socket, req:ReqSocketDto):Chat|undefined{
		if (client.rooms.size >= 2){
			client.emit('error', `cant join more than two rooms`);
			return undefined;
		}
		const user = this.Clients.getKey(client);
		const chatroom = this.ChatRooms.get(req.roomName);
		if (!chatroom){
			client.emit('error', `No such chatroom ${req.roomName}`);
			return undefined;
		}
		//패스워드 틀림
		else if (chatroom.password != req.password){
			client.emit('error', `incorrect password`);
			return undefined;
		}
		//밴당함
		else if (chatroom.banned.find(u=>u==user)){
			client.emit('error', `You are banned by channel's admin`);
			return undefined;
		}
		else if (chatroom.participants.find(u=>u==user)){
			client.emit('error', `You are already in ${req.roomName}`);
		}
		chatroom.participants.push(user);
		client.join(chatroom.roomName);
		client.emit('notice', `You have joined ${chatroom.roomName}`);
		client.to(chatroom.roomName).emit('notice', `${user.nickname} has joined`);
		return chatroom;
	}

	leaveChatroom(client:Socket, req:ReqSocketDto):boolean{
		const user = this.Clients.getKey(client);
		const chatroom = this.ChatRooms.get(req.roomName);
		if (!user || !chatroom){
			client.emit('error', 'failed');
			return false;
		}
		if (!chatroom.participants.find(u=>u==user)) {
			client.emit('error', 'failed');
			return false;
		}
		client.emit('notice', `You have left ${chatroom.roomName}`);
		client.to(chatroom.roomName).emit('notice', `${user.nickname} has left the chat`);
		client.leave(chatroom.roomName);
		chatroom.participants = chatroom.participants.filter(u=>u.uid != user.uid);
		chatroom.roomAlba = chatroom.roomAlba.filter(u=>u != user);
		//방에 아무도 없는경우 채팅방 삭제
		if (chatroom.participants.length == 0){
			this.ChatRooms.delete(chatroom.roomName);
			console.log(this.ChatRooms);
			return true;
		}
		//주딱이면 다른놈이 왕위계승
		else if (user == chatroom.roomOwner){
			let newOwner:User
			if (chatroom.roomAlba.length){
				newOwner = chatroom.roomAlba[0];
			}
			else{
				newOwner = chatroom.participants[0];
				chatroom.roomAlba.push(newOwner);
			}
			chatroom.roomOwner = newOwner;
			const newOwnerSocket = this.Clients.getValue(newOwner);
			newOwnerSocket.emit('notice', 'You are now the owner of this chat');
			newOwnerSocket.to(chatroom.roomName).emit('notice', `${newOwner.nickname} is now the owner of this chat`);
		}
		return true
	}

	sendMessage(client:Socket, req:ReqSocketDto):boolean{
		const user = this.Clients.getKey(client);
		const chatroom = this.ChatRooms.get(req.roomName);
		if (!chatroom ||
			!chatroom.participants.find(u=>u==user) ||
			chatroom.muted.find(u=>u==user)){
			return false;
		}
		client.to(req.roomName).emit('message', req.msg);
		return true;
	}

	async sendDirectMessage(client:Socket, req:ReqSocketDto):Promise<boolean>{
		const sender = this.Clients.getKey(client);
		const target = await this.userService.getUserByNick(req.target);
		if (!target){
			client.emit('error', `No such user: ${req.target}`);
			return false;
		}
		const targetSocket = this.Clients.getValue(target);
		targetSocket.emit('DM', `From:${sender.nickname} ${req.msg}`);
	}

	kickClient(client:Socket, req:ReqSocketDto):boolean{
		if (!this.validateRequest(client, req)){
			return false;
		}
		const chatroom = this.ChatRooms.get(req.roomName);
		const target = chatroom.participants.find(u=>u.nickname==req.target);
		const targetSocket = this.Clients.getValue(target);
		chatroom.participants = chatroom.participants.filter(u=>u!=target);
		targetSocket.leave(chatroom.roomName);
		targetSocket.emit('notice', `You were kicked by channel's admin`);
		client.to(chatroom.roomName).emit('notice', `${target.nickname} was kicked by channel's admin`);
		return true;
	}

	banClient(client:Socket, req:ReqSocketDto):boolean{
		if (!this.validateRequest(client, req)){
			return false
		}
		const chatroom = this.ChatRooms.get(req.roomName);
		const target = chatroom.participants.find(u=>u.nickname==req.target);
		const targetSocket = this.Clients.getValue(target);
		chatroom.participants = chatroom.participants.filter(u=>u!=target);
		targetSocket.leave(chatroom.roomName);
		targetSocket.emit('notice', `You were banned by channel's admin`);
		client.to(chatroom.roomName).emit('notice', `${target.nickname} was banned by channel's admin`);
		chatroom.banned.push(target);
		return true;
	}

	muteClient(client:Socket, req:ReqSocketDto):boolean{
		const time = 1000 * 60;
		if (!this.validateRequest(client, req)){
			return false
		}
		const chatroom = this.ChatRooms.get(req.roomName);
		const target = chatroom.participants.find(u=>u.nickname==req.target);
		const targetSocket = this.Clients.getValue(target);
		targetSocket.emit('notice', `You are now muted for ${time/1000}seconds`);
		client.to(chatroom.roomName).emit('notice', `${target.nickname} was muted by channel's admin`);
		chatroom.muted.push(target);
		setTimeout(()=>{
			chatroom.muted = chatroom.muted.filter(u=>u!=target);
			targetSocket.emit('notice', `You are now unmuted`);
		}, time);
	}

	addAdmin(client:Socket, req:ReqSocketDto):boolean{
		const user = this.Clients.getKey(client);
		const chatroom = this.ChatRooms.get(req.roomName);
		if (user != chatroom.roomOwner){
			client.emit('notice', 'You are now the owner of this chat');
			return false;
		}
		const target = chatroom.participants.find(u=>u.nickname==req.target);
		if (!target){
			client.emit('error', `No such user: ${req.target}`);
			return false;
		}
		if (chatroom.roomAlba.find(u=>u==target)){
			client.emit('error', `${req.target} is already an admin`);
			return false;
		}
		chatroom.roomAlba.push(target);
		const targetSocket = this.Clients.getValue(target);
		targetSocket.emit('notice', `You are now the channel's admin`);
		targetSocket.to(chatroom.roomName).emit('notice', `${target.nickname} is now the channel's admin`)
		return true;
	}

	validateRequest(client:Socket, req:ReqSocketDto):boolean{
		const user = this.Clients.getKey(client);
		const chatroom = this.ChatRooms.get(req.roomName);
		//채팅방이 없음
		if (!chatroom){
			client.emit('error', `You are not in chatting room`);
			return false;
		}
		//관리자 권한이 없는 경우
		if (!chatroom.roomAlba.find(u=>u==user)){
			client.emit('error', 'You are not an admin of this channel');
			return false;
		}
		const target = chatroom.participants.find(u=>u.nickname==req.target);
		//타겟이 없음
		if (!target){
			client.emit('error', `No such user: ${req.target}`);
			return false;
		}
		//타겟이 오너, 어드민
		else if (target == chatroom.roomOwner || chatroom.roomAlba.find(u=>u==target)){
			if (user == chatroom.roomOwner || target != chatroom.roomOwner){
				return true;
			}
			client.emit('error', 'You cannot kick, ban, or mute owner/admins');
			return false;
		}
		return true;
	}

	getClientChatroomName(client:Socket):string|undefined{
		console.log(client.rooms);
		if (client.rooms.size < 2){
			return undefined;
		}
		console.log(Array.from(client.rooms)[1])
		return Array.from(client.rooms)[1];
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