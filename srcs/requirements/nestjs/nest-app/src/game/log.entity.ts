import { array } from "joi"
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Log{
	@PrimaryGeneratedColumn('increment')
	logID: number
	@Column()
	fromId: number
	@Column()
	toId: number
	@Column()
	fromScore: number
	@Column()
	toScore: number
	@Column({type:"integer", array:true, default:[0,0]})
	score:number[]
}