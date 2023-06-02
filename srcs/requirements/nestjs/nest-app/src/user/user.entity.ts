import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
	@PrimaryGeneratedColumn('identity')
	uid: number;

	@Column()
	nickname: string;

	@Column()
	isOTP: boolean;

	@Column()
	isAvatar: boolean;

	@Column()
	avatarIndex: number;

	@Column()
	totalWin: number;

	@Column()
	totalLose: number;

	@Column()
	level: number;
}
