import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { User } from "src/user/user.entity";

@Module({
	imports:[TypeOrmModule.forFeature([User])],
	controllers:[ChatController],
	providers:[ChatService]
})
export class ChatModule{}