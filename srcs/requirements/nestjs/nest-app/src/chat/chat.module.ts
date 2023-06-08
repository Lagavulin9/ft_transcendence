import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { User } from "src/user/user.entity";
import { FriendList } from "src/friend/friend.entity";
import { FriendService } from "src/friend/friend.service";
import { FriendModule } from "src/friend/friend.module";

@Module({
	imports:[
		TypeOrmModule.forFeature([User, FriendList]),
		FriendModule
		],
	controllers:[ChatController],
	providers:[ChatService, FriendService],
	exports:[ChatService]
})
export class ChatModule{}