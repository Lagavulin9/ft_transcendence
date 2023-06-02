import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from '../user/user.entity'

export const typeORMConfig: TypeOrmModuleOptions = {
	type:'postgres',
	host:'postgres',
	port: 5432,
	username: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
	database: 'postgres',
	entities: [ User ],
	synchronize: true,
}