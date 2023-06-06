import { blockedUserDto, friendUserDto } from "src/dto/friend.dto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendList{
	@PrimaryGeneratedColumn('identity')
	uid: number

	@Column({type:'json', default:[]})
	friendList: friendUserDto[]

	@Column({type:'json', default:[]})
	blockedList: blockedUserDto[]
}