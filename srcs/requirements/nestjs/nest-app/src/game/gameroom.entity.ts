import { User } from 'src/user/user.entity';

export class GameRoom {
  host: User;
  guest: User;
  game_start: boolean;
}

export class reqGameRoom {
  host: number;
  guest: number;
  game_start: boolean;
}
