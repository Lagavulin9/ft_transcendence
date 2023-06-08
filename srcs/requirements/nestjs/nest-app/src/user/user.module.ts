import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './user.entity'
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Log } from "./log.entity";
import { FriendList } from "src/friend/friend.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User, Log, FriendList])],
	controllers: [UserController],
	providers: [UserService],
	exports:[UserService]
})
export class UserModule{}