import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from '../user/user.entity'
import { Log } from "src/game/log.entity";
import { FriendList } from "src/friend/friend.entity";

export const typeORMConfig: TypeOrmModuleOptions = {
	type:'postgres',
	host:'postgres',
	port: 5432,
	username: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
	database: 'postgres',
	entities: [ User, Log, FriendList ],
	synchronize: true,
	extra:{
		"isArray": true
	}
}