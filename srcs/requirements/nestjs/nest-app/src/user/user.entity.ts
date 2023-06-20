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
	
	@Column({default:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fbrunch.co.kr%2F%40samsamvet%2F19&psig=AOvVaw12Uq43ff5rSZ60AX0hYHmb&ust=1686899734069000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNCX063dxP8CFQAAAAAdAAAAABAD'})
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
