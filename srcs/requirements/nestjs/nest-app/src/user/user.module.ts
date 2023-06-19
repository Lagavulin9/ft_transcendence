import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './user.entity'
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Log } from "../game/log.entity";
import { FriendList } from "src/friend/friend.entity";
import { GameModule } from "src/game/game.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Log, FriendList]),
		GameModule
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule{}