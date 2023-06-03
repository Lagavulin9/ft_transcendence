import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log{
	@PrimaryGeneratedColumn('increment')
	logId: number

	@Column()
	fromId: number

	@Column()
	toId: number

	@Column()
	fromScore: number

	@Column()
	toScore: number
}
