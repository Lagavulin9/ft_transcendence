export interface Content {
  uId: number; // ex) 1, 2, 3, 4, 5
  profileImage: string; // 실제로 보여줄 수 있는 이미지 URL
  userNickName: string; // ex) user1, user2와 같은
  Date: string; // ex) 00월 00일 00시 00분
  Content: string; // 최대 50글자
  isTo: boolean;
}
