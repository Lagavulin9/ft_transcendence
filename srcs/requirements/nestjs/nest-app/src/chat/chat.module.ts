import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chatroom } from "./chat.entity";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { User } from "src/user/user.entity";

@Module({
	imports:[TypeOrmModule.forFeature([Chatroom, User])],
	controllers:[ChatController],
	providers:[ChatService]
})
export class ChatModule{}