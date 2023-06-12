import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
	@PrimaryGeneratedColumn('identity')
	uid: number;

	@Column({unique:true})
	nickname: string;

	@Column({default:false})
	isOTP: boolean;

	@Column({default:false})
	isAvatar: boolean;

	@Column({default:0})
	avatarIndex: number;

	@Column({default:0})
	totalWin: number;

	@Column({default:0})
	totalLose: number;

	@Column({default:1})
	level: number;
}
