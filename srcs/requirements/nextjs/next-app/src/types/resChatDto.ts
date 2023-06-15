import { User } from "./UserType";

export interface resChatDto {
  roomId: number;
  roomName: string;
  roomOwner: User;
  participants: User[];
  roomType: number; // 0: public, 1: private, 2: protected
}

export interface ChatRoom {
  roomId: number;
  roomName: string;
  roomOwner: User;
  roomAlba: User[];
  participants: User[];
}

export interface msgCard {
  uId: number;
  nickname: string;
  profileURL: string;
  data: string;
  content: string;
}

export interface reqChatDto {
  roomName: string;
  roomType: number;
  target: string;
  msg: msgCard;
  password: string;
}
