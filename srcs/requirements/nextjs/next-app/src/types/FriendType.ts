export interface FriendType {
  uid: number;
  friendList: number[];
  blockedList: number[];
}

export interface PostFriend {
  uid: number;
  target: number;
}
