import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
	type:'postgres',
	host:'postgres',
	port: 5432,
	username: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
	database: 'postgres',
	entities: [],
	synchronize: true,
}