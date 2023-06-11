import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { resChatDto } from "src/dto/resChat.dto";
import { reqChatDto } from "src/dto/reqChat.dto";
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
	public Clients:BidirectionalMap<User, Socket>
	private ChatRooms:Chat[] = []
	private RoomIndex:number = 0

	getAllChatroom():Chat[]{
		return this.ChatRooms;
	}

	getChatById(roomId:number): resChatDto{
		const found = this.ChatRooms.find(chat=>chat.roomId == roomId)
		if (found){
			return plainToInstance(resChatDto, found);
		}
		throw new NotFoundException(`Chatroom ID not found: ${roomId}`)
	}

	getChatByName(roomName:string): resChatDto{
		const found = this.ChatRooms.find(chat=>chat.roomName == roomName)
		if (found){
			return plainToInstance(resChatDto, found);
		}
		throw new NotFoundException(`Chatroom ID not found: ${roomName}`)
	}

	sendMessage(req:ReqSocketDto):boolean{
		const chatroom = this.ChatRooms.find(Chat=>Chat.roomName == req.roomName);
		if (!chatroom){
			req.client.emit('error', 400); //나중에 뉴메릭 수정
			return false;
		}
		const speaker = this.Clients.getKey(req.client);
		if (chatroom.muted.find((user)=>user==speaker)){
			req.client.emit('notice', `You are muted in this chat`);
			return false;
		}
		req.client.to(req.roomName).emit('message', req.msg);
		return true
	}

	async sendDirectMessage(req:ReqSocketDto){
		const speaker = this.Clients.getKey(req.client);
		const target = await this.userService.getUserByNick(req.target);
		const friendList = await this.friendService.getFriendList(target.uid);
		if (!friendList.blockedList.find(blocked=>blocked==target)){
			const targetSocket = this.Clients.getValue(target);
			targetSocket.emit('DM', `From:${speaker.nickname} ${req.msg}`)
		}
	}

	async createChatroom(reqchatdto:reqChatDto): Promise<void>{
		const newChat = new Chat();
		newChat.roomOwner = await this.userService.getUserByID(reqchatdto.roomOwner);
		if (!newChat.roomOwner){
			throw new NotFoundException(`Could not find uid:${reqchatdto.roomOwner}`);
		}
		if (this.ChatRooms.find(chat=>chat.roomName == reqchatdto.roomName)){
			throw new HttpException(`Chatroom already exist: ${reqchatdto.roomName}`, HttpStatus.CONFLICT);
		}
		newChat.roomId = ++this.RoomIndex;
		newChat.roomName = reqchatdto.roomName;
		newChat.roomType = reqchatdto.roomType;
		newChat.roomAlba = [newChat.roomOwner];
		newChat.participants = [newChat.roomOwner];
		newChat.banned = [];
		newChat.muted = [];
		if (reqchatdto.password){
			newChat.password = reqchatdto.password; // 나중에 해쉬로 바꿔서 저장되도록 바꿔야함
		}
		this.ChatRooms.push(newChat);
		throw new HttpException("Accepted", HttpStatus.ACCEPTED);
	}

	async joinChatroom(req:ReqSocketDto):Promise<boolean>{
		const chatroom = this.ChatRooms.find(Chat=>Chat.roomName == req.roomName);
		if (!chatroom){
			req.client.emit('error', 400); //나중에 뉴메릭 수정
			return false;
		}
		const target = this.Clients.getKey(req.client)
		if (chatroom.banned.find(user=>user==target)){
			req.client.emit('error', 412);
			return false;
		}
		if (chatroom.password){
			if (chatroom.password != req.password){
				req.client.emit('error', 411)
				return false;
			}
		}
		//chatroom.participants.push(); 현재 USER랑 맵핑 불가능, 로그인시 소켓과 유저정보 맵핑필요.
		req.client.join(req.roomName);
		return true;
	}

	leaveChatroom(req:ReqSocketDto):boolean{
		const chatroom = this.ChatRooms.find(Chat=>Chat.roomName == req.roomName);
		if (!chatroom){
			req.client.emit('error', 400); //나중에 뉴메릭 수정
			return false;
		}
		req.client.leave(req.roomName);
		req.client.emit('notice', `You have left the chat`);
		//client의 정보를 가져옴
		const target = this.Clients.getKey(req.client);
		// client가 owner인경우, 다른 유저에게 상속?
		// if (chatroom.roomOwner == target){
		// }

		//유저를 참여자에서 제거
		chatroom.roomAlba = chatroom.roomAlba.filter((user)=>user!=target)
		chatroom.participants = chatroom.participants.filter((user)=>user!=target)

		//비어있는방이면 메모리에서 제거
		if (chatroom.participants.length == 0){
			this.ChatRooms = this.ChatRooms.filter((chat)=>chat.roomId != chatroom.roomId)
		}
	}

	kickClient(req:ReqSocketDto):boolean{
		if (this.validateReq(req) == false){
			return false;
		}
		const chatroom = this.ChatRooms.find(Chat=>Chat.roomName == req.roomName);
		const target = chatroom.participants.find(user=>user.nickname == req.target)
		const targetSocket = this.Clients.getValue(target);
		targetSocket.leave(req.roomName);
		targetSocket.emit('notice', `You've been kicked by admin`);
		return true;
	}

	banClient(req:ReqSocketDto):boolean{
		if (this.validateReq(req) == false){
			return false;
		}
		const chatroom = this.ChatRooms.find(Chat=>Chat.roomName == req.roomName);
		const target = chatroom.participants.find(user=>user.nickname == req.target)
		const targetSocket = this.Clients.getValue(target);
		targetSocket.leave(chatroom.roomName);
		targetSocket.emit('notice', `You've been banned by admin`);
		chatroom.banned.push(target);
		return true;
	}

	muteClient(req:ReqSocketDto):boolean{
		if (this.validateReq(req) == false){
			return false;
		}
		const chatroom = this.ChatRooms.find(Chat=>Chat.roomName == req.roomName);
		const target = chatroom.participants.find(user=>user.nickname == req.target)
		const targetSocket = this.Clients.getValue(target);
		targetSocket.leave(req.roomName);
		targetSocket.emit('notice', `You've been muted by admin`);
		chatroom.muted.push(target);
		setTimeout(()=>{
			chatroom.muted = chatroom.muted.filter(user=>user!=target)
			targetSocket.emit('notice', `You are unmuted`);
		}, 1000 * 60)
		return true;
	}

	validateReq(req:ReqSocketDto):boolean{
		const chatroom = this.ChatRooms.find(Chat=>Chat.roomName == req.roomName);
		//채팅방이 존재하지 않는 경우
		if (!chatroom){
			req.client.emit('error', 400); //나중에 뉴메릭 수정
			return false;
		}
		//요청자가 admin이 아닌 경우
		const admin = this.Clients.getKey(req.client);
		if (!chatroom.roomAlba.find(user=>user==admin)){
			req.client.emit('error', 403);
			return false;
		}
		//대상이 채팅방안에 없는 경우
		const target = chatroom.participants.find(user=>user.nickname == req.target)
		if (!target){
			req.client.emit('error', 400); //나중에 뉴메릭 수정
			return false;
		}
		//대상이 채팅방 오너인 경우
		if (target == chatroom.roomOwner){
			req.client.emit('error', 404);
		}
		return true;
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
}