import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
	@IsNotEmpty()
	@IsNumber()
	@PrimaryGeneratedColumn('identity')
	uid: number;

	@IsNotEmpty()
	@IsString()
	@Column({unique:true})
	nickname: string;

	@Column({default:false})
	isOTP: boolean;

	@Column({default:""})
	email: string;
	
	@Column({default:"api/image/default.jpeg"})
	profileURL: string;

	@Column({default:0})
	totalWin: number;

	@Column({default:0})
	totalLose: number;

	@Column({default:1})
	level: number;

	@Column({default:'offline'})
	status: string;
}
