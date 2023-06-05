import { User } from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chatroom{
	@PrimaryGeneratedColumn('identity')
	roomId: number
	@Column({unique:true})
	roomName: string
	@Column({default:0})
	roomType: number
	@ManyToOne(()=>User)
	roomOwner: User
	@ManyToOne(()=>User, {nullable:true})
	roomAlba: User
	@ManyToMany(()=>User)
	@JoinTable()
	invitedUsers: User[]
	@Column({default:null})
	password: string
}