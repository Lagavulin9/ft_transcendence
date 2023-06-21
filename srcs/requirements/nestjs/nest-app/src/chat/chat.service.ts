import { Injectable, NotFoundException } from '@nestjs/common';
import { resChatDto } from 'src/dto/resChat.dto';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';
import { Socket } from 'socket.io';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserService } from 'src/user/user.service';
import { FriendService } from 'src/friend/friend.service';
import { ReqSocketDto } from 'src/dto/reqSocket.dto';
import { ResMsgDto } from 'src/dto/msg.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  constructor(
    private userService: UserService,
    private friendService: FriendService,
  ) {}
  private Clients: BidirectionalMap<User, Socket> = new BidirectionalMap();
  private ChatRooms: Map<string, Chat> = new Map();
  private RoomIndex: number = 0;

  getAllChatroom(): Chat[] {
    const chatArray = [];
    for (const [roomName, chatroom] of this.ChatRooms) {
      const resdto = new resChatDto(chatroom);
      // resdto.roomId = chatroom.roomId;
      // resdto.roomName = chatroom.roomName;
      // resdto.roomType = chatroom.roomType;
      // resdto.roomOwner = chatroom.roomOwner;
      // resdto.roomAlba = chatroom.roomAlba;
      // resdto.participants = chatroom.participants;
      chatArray.push(resdto);
    }
    return chatArray;
  }

  getChatById(roomId: number): resChatDto {
    let found: Chat | undefined;
    for (const iter of this.ChatRooms.values()) {
      if (iter.roomId == roomId) {
        found = iter;
        break;
      }
    }
    if (found) {
      return new resChatDto(found);
    }
    throw new NotFoundException(`Chatroom ID not found: ${roomId}`);
  }

  getChatByName(roomName: string): resChatDto {
    const found = this.ChatRooms.get(roomName);
    if (found) {
      return new resChatDto(found);
    }
    throw new NotFoundException(`Chatroom ID not found: ${roomName}`);
  }

  async bindUser(client: Socket, uid: number): Promise<boolean> {
    const userdto = await this.userService.getUserByID(uid);
    if (!userdto) {
      return false;
    }
    const user = plainToInstance(User, userdto);
    this.Clients.set(user, client);
    this.userService.updateUserStatus(uid, 'online');
    client.emit('notice', user);
    return true;
  }

  unbindUser(client: Socket): boolean {
    const user = this.Clients.getKey(client);
    if (!user) {
      return false;
    }
    let roomName: string;
    for (const chatroom of this.ChatRooms.values()) {
      const found = chatroom.participants.find((u) => u == user);
      if (found) {
        roomName = chatroom.roomName;
        chatroom.participants = chatroom.participants.filter((u) => u != user);
        chatroom.roomAlba = chatroom.roomAlba.filter((u) => u != user);
        //방에 아무도 없는경우 채팅방 삭제
        if (chatroom.participants.length == 0) {
          this.ChatRooms.delete(roomName);
        }
        //주딱이면 다른놈이 왕위계승
        else if (user == chatroom.roomOwner) {
          let newOwner: User;
          if (chatroom.roomAlba.length) {
            newOwner = chatroom.roomAlba[0];
          } else {
            newOwner = chatroom.participants[0];
            chatroom.roomAlba.push(newOwner);
          }
          chatroom.roomOwner = newOwner;
          const newOwnerSocket = this.Clients.getValue(newOwner);
          newOwnerSocket.emit('notice', 'You are now the owner of this chat');
          newOwnerSocket
            .to(chatroom.roomName)
            .emit(
              'notice',
              `${newOwner.nickname} is now the owner of this chat`,
            );
        }
        break;
      }
    }
    client.to(roomName).emit('notice', `${user.nickname} has left the chat`);
    this.Clients.delete(user);
    this.userService.updateUserStatus(user.uid, 'offline');
    return true;
  }

  async createChatroom(client: Socket, req: ReqSocketDto): Promise<Chat | undefined> {
    if (client.rooms.size >= 2) {
      //에러:채팅방 2개 이상 동시에 만들어서 들어가려할때
      client.emit('no2room', `cant join more than two rooms`);
      return undefined;
    }
    if (this.ChatRooms.get(req.roomName)) {
      //에러:이미 존재하는 채팅방
      client.emit('roomexist', `Chatroom ${req.roomName} already exist`);
      return undefined;
    }
    const user = this.Clients.getKey(client);
    const newChat = new Chat();
    newChat.roomOwner = user;
    newChat.roomId = ++this.RoomIndex;
    newChat.roomName = req.roomName;
    newChat.roomType = req.roomType;
    newChat.hashedPassword = await bcrypt.hash(req.password, 10);
    newChat.roomAlba = [user];
    newChat.participants = [];
    newChat.banned = [];
    newChat.muted = [];
    this.ChatRooms.set(req.roomName, newChat);
    client.emit('notice', 'You are owner of this channel');
    client.join(newChat.roomName);
    client.emit('create', newChat);
    return newChat;
  }
  
  async joinChatroom(client: Socket, req: ReqSocketDto): Promise<Chat | undefined> {
    if (client.rooms.size >= 2) {
      //에러:채팅방 2개 이상 동시에 들어가려할때
      client.emit('no2room', `cant join more than two rooms`);
      return undefined;
    }
    const user = this.Clients.getKey(client);
    const chatroom = this.ChatRooms.get(req.roomName);
    if (!chatroom) {
      //에러:채팅방 낫 파운드
      client.emit('room404', `No such chatroom ${req.roomName}`);
      return undefined;
    }
    client.emit('notice', `You have joined ${chatroom.roomName}`);
    client.to(chatroom.roomName).emit('notice', `${user.nickname} has joined`);
    client.emit('join', new resChatDto(chatroom));
    return chatroom;
  }

  async passCheck(client:Socket, req:ReqSocketDto): Promise<Chat | undefined> {
    const user = this.Clients.getKey(client);
    const chatroom = this.ChatRooms.get(req.roomName);
    if (!chatroom) {
      //에러:채팅방 낫 파운드
      client.emit('room404', `No such chatroom ${req.roomName}`);
      return undefined;
    }
    //패스워드 틀림
    else if (!await bcrypt.compare(req.password, chatroom.hashedPassword)) {
      client.emit('wrongpass', `incorrect password`);
      return undefined;
    }
    //밴당함
    else if (chatroom.banned.find((u) => u == user)) {
      client.emit('banned', `You are banned by channel's admin`);
      return undefined;
    //이미 들어옴
    } else if (chatroom.participants.find((u) => u == user)) {
      client.emit('already', new resChatDto(chatroom));
      return undefined;
    }
    chatroom.participants.push(user);
    client.join(chatroom.roomName);
    client.emit('passok', new resChatDto(chatroom));
    return chatroom;
  }

  leaveChatroom(client: Socket, req: ReqSocketDto): boolean {
    const user = this.Clients.getKey(client);
    const chatroom = this.ChatRooms.get(req.roomName);
    if (!user || !chatroom) {
      //에러:유저가 이미 오프라인이거나 채팅방이 존재하지 않음
      client.emit('nochat', 'failed');
      return false;
    }
    if (!chatroom.participants.find((u) => u == user)) {
      //에러:채팅방안에 없음
      client.emit('notinchat', 'failed');
      return false;
    }
    client.emit('notice', `You have left ${chatroom.roomName}`);
    client
      .to(chatroom.roomName)
      .emit('notice', `${user.nickname} has left the chat`);
    client.leave(chatroom.roomName);
    chatroom.participants = chatroom.participants.filter(
      (u) => u.uid != user.uid,
    );
    chatroom.roomAlba = chatroom.roomAlba.filter((u) => u != user);
    //방에 아무도 없는경우 채팅방 삭제
    if (chatroom.participants.length == 0) {
      this.ChatRooms.delete(chatroom.roomName);
      return true;
    }
    //주딱이면 다른놈이 왕위계승
    else if (user == chatroom.roomOwner) {
      let newOwner: User;
      if (chatroom.roomAlba.length) {
        newOwner = chatroom.roomAlba[0];
      } else {
        newOwner = chatroom.participants[0];
        chatroom.roomAlba.push(newOwner);
      }
      chatroom.roomOwner = newOwner;
      const newOwnerSocket = this.Clients.getValue(newOwner);
      newOwnerSocket.emit('notice', 'You are now the owner of this chat');
      newOwnerSocket
        .to(chatroom.roomName)
        .emit('notice', `${newOwner.nickname} is now the owner of this chat`);
    }
    return true;
  }

  sendMessage(client: Socket, req: ReqSocketDto): boolean {
    const user = this.Clients.getKey(client);
    const chatroom = this.ChatRooms.get(req.roomName);
    if (
      !chatroom ||
      !chatroom.participants.find((u) => u == user) ||
      chatroom.muted.find((u) => u == user)
    ) {
      return false;
    }
    const msgCard = new ResMsgDto();
    msgCard.uid = user.uid;
    msgCard.nickname = user.nickname;
    msgCard.profileURL = user.profileURL;
    msgCard.content = req.msg;
    msgCard.date = new Date().toLocaleTimeString();
    msgCard.isDM = false;
    client.emit('message', msgCard);
    client.to(req.roomName).emit('message', msgCard);
    return true;
  }

  async sendDirectMessage(client: Socket, req: ReqSocketDto): Promise<boolean> {
    const sender = this.Clients.getKey(client);
    let target:User;
    for (const [user, socket] of this.Clients.getForwardMap()){
      if (user.uid == req.target){
        target = user;
        break;
      }
    }
    if (!target) {
      //에러:dm대상이 존재하지 않음
      client.emit('nodmtarget', `No such user: ${req.target}`);
      return false;
    }
    const targetSocket = this.Clients.getValue(target);
    const msgCard = new ResMsgDto();
    msgCard.uid = sender.uid;
    msgCard.nickname = sender.nickname;
    msgCard.profileURL = sender.profileURL;
    msgCard.content = req.msg;
    msgCard.date = new Date().toLocaleTimeString();
    msgCard.isDM = true;
    client.emit('DM', msgCard);
    targetSocket.emit('DM', msgCard);
  }

  kickClient(client: Socket, req: ReqSocketDto): boolean {
    if (!this.validateRequest(client, req)) {
      return false;
    }
    const chatroom = this.ChatRooms.get(req.roomName);
    const target = chatroom.participants.find((u) => u.uid == req.target);
    const targetSocket = this.Clients.getValue(target);
    chatroom.participants = chatroom.participants.filter((u) => u != target);
    targetSocket.leave(chatroom.roomName);
    targetSocket.emit('kick', `You were kicked by channel's admin`);
    client
      .to(chatroom.roomName)
      .emit('kicknotice', `${target.nickname} was kicked by channel's admin`);
    client.emit('kicknotice', 'Success');
    return true;
  }

  banClient(client: Socket, req: ReqSocketDto): boolean {
    if (!this.validateRequest(client, req)) {
      return false;
    }
    const chatroom = this.ChatRooms.get(req.roomName);
    const target = chatroom.participants.find((u) => u.uid == req.target);
    const targetSocket = this.Clients.getValue(target);
    chatroom.participants = chatroom.participants.filter((u) => u != target);
    targetSocket.leave(chatroom.roomName);
    targetSocket.emit('ban', `You were banned by channel's admin`);
    client
      .to(chatroom.roomName)
      .emit('bannotice', `${target.nickname} was banned by channel's admin`);
    client.emit('bannotice', 'Success');
    chatroom.banned.push(target);
    return true;
  }

  muteClient(client: Socket, req: ReqSocketDto): boolean {
    const time = 1000 * 60;
    if (!this.validateRequest(client, req)) {
      return false;
    }
    const chatroom = this.ChatRooms.get(req.roomName);
    const target = chatroom.participants.find((u) => u.uid == req.target);
    const targetSocket = this.Clients.getValue(target);
    chatroom.muted.push(target);
    setTimeout(() => {
      chatroom.muted = chatroom.muted.filter((u) => u != target);
      targetSocket.emit('notice', `You are now unmuted`);
    }, time);
    targetSocket.emit('mute', `You are now muted for ${time / 1000}seconds`);
    client
      .to(chatroom.roomName)
      .emit('mutenotice', `${target.nickname} was muted by channel's admin`);
    client.emit('mutenotice', 'Success');
  }

  addAdmin(client: Socket, req: ReqSocketDto): boolean {
    const user = this.Clients.getKey(client);
    const chatroom = this.ChatRooms.get(req.roomName);
    if (user != chatroom.roomOwner) {
      //에러: 오너가 아님
      client.emit('notowner', 'You are not the owner of this chat');
      return false;
    }
    const target = chatroom.participants.find((u) => u.uid == req.target);
    if (!target) {
      //에러: 어드민으로 추가할 대상이 채팅방에 없음
      client.emit('notarget', `No such user: ${req.target}`);
      return false;
    }
    if (chatroom.roomAlba.find((u) => u == target)) {
      //에러: 이미 대상이 어드민임
      client.emit('isadmin', `${req.target} is already an admin`);
      return false;
    }
    chatroom.roomAlba.push(target);
    const targetSocket = this.Clients.getValue(target);
    targetSocket.emit('usermod', `You are now the channel's admin`);
    targetSocket
      .to(chatroom.roomName)
      .emit('usermodnotice', `${target.nickname} is now the channel's admin`);
    client.emit('usermodnotice', 'Success');
    return true;
  }

  validateRequest(client: Socket, req: ReqSocketDto): boolean {
    const user = this.Clients.getKey(client);
    const chatroom = this.ChatRooms.get(req.roomName);
    //채팅방이 없음
    if (!chatroom) {
      client.emit('nochat', `You are not in chatting room`);
      return false;
    }
    //관리자 권한이 없는 경우
    if (!chatroom.roomAlba.find((u) => u == user)) {
      client.emit('notadmin', 'You are not an admin of this channel');
      return false;
    }
    const target = chatroom.participants.find((u) => u.uid == req.target);
    //타겟이 없음
    if (!target) {
      client.emit('notarget', `No such user: ${req.target}`);
      return false;
    }
    //타겟이 오너, 어드민
    else if (
      target == chatroom.roomOwner ||
      chatroom.roomAlba.find((u) => u == target)
    ) {
      if (user == chatroom.roomOwner || target != chatroom.roomOwner) {
        return true;
      }
      //에러: 오너를 킥,밴,뮤트 할 수 없음
      client.emit('cant', 'You cannot kick, ban, or mute owner/admins');
      return false;
    }
    return true;
  }

  getClientChatroomName(client: Socket): string | undefined {
    if (client.rooms.size < 2) {
      return undefined;
    }
    return Array.from(client.rooms)[1];
  }

  isUserOnline(uid:number){
    for (const [user, socket] of this.Clients.getForwardMap().entries()){
      if (user.uid == uid){
        return true
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
