import { User } from "./UserType";

export interface resChatDto {
  roomId: number;
  roomName: string;
  roomOwner: User;
  roomAlba: User[];
  participants: User[];
  roomType: string; // 0: public, 1: private, 2: protected
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

export interface ReqSocketDto {
  roomName: string;
  roomType: number;
  target: string;
  msg: string;
  password: string;
}

export interface ResMsgDto {
  uid: number;
  nickname: string;
  profileURL: string;
  date: string;
  content: string;
  isDm?: boolean;
}
