import { IsNotEmpty, IsNumber } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendList{
	@PrimaryGeneratedColumn('identity')
	@IsNumber()
	@IsNotEmpty()
	uid: number

	@Column({type:'integer', array:true ,default:[]})
	friendList: number[]

	@Column({type:'integer', array:true ,default:[]})
	blockedList: number[]
}