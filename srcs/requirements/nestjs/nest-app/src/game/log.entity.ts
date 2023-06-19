import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log{
	@PrimaryGeneratedColumn('increment')
	@IsNumber()
	@IsNotEmpty()
	logId: number

	@Column()
	@IsNumber()
	@IsNotEmpty()
	fromId: number

	@Column()
	@IsNumber()
	@IsNotEmpty()
	toId: number

	@Min(0)
	@Max(6)
	@Column()
	@IsNotEmpty()
	fromScore: number

	@Min(0)
	@Max(6)
	@Column()
	@IsNotEmpty()
	toScore: number

	@Column({type:"integer", array:true, default:[0,0]})
	score:number[]
}
