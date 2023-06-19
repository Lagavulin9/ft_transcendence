import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";
import { FriendList } from "./friend.entity";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/user.entity";
import { Log } from "src/game/log.entity";

@Module({
	imports:[TypeOrmModule.forFeature([User, Log, FriendList]), UserModule],
	controllers:[FriendController],
	providers:[FriendService],
	exports:[FriendService]
})
export class FriendModule{}