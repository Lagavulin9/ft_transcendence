export interface user {
  uId: number;
  profileImage: string;
  userEmail: string;
  userNickName: string;
  stateOn: boolean;
}

export interface User {
  gameLog: any[]; // TODO : gameLog 해당 타입으로 대체 해야함
  isAvatar: boolean;
  isOTP: boolean;
  level: number;
  nickname: string;
  totalLose: number;
  totalWin: number;
  uid: number;
}
