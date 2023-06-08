import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { User } from "src/user/user.entity";
import { FriendList } from "src/friend/friend.entity";
import { FriendModule } from "src/friend/friend.module";
import { UserModule } from "src/user/user.module";

@Module({
	imports:[
		TypeOrmModule.forFeature([User, FriendList]),
		UserModule,
		FriendModule,
		],
	controllers:[ChatController],
	providers:[ChatService],
	exports:[ChatService]
})
export class ChatModule{}