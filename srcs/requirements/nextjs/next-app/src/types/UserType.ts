export interface user {
  uId: number;
  profileImage: string;
  userEmail: string;
  userNickName: string;
  stateOn: boolean;
}

export interface LogDto {
  fromId: number;
  toId: number;
  fromScore: number;
  toScore: number;
  score: number[];
}

export interface GameLogDto {
  uId: number;
  log: LogDto[];
}

export interface User {
  gameLog: LogDto[]; // TODO : gameLog 해당 타입으로 대체 해야함
  isAvatar: boolean;
  isOTP: boolean;
  level: number;
  nickname: string;
  totalLose: number;
  totalWin: number;
  uid: number;
  profileURL: string;
  status: string;
}

export interface ReqUserDto {
  nickname: string;
  isOTP: boolean;
  profileURL: string | undefined;
}
