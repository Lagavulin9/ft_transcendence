export interface chat {
  roomId: number;
  roomName: string;
  connectUser: number[];
  type: number; // 0: public, 1: private, 2: protected
  password?: string; // protected일때는 password의 유효성 검사를 해야함
}
