import { Module, forwardRef } from "@nestjs/common";
import { socketGateway } from "./gateway";
import { ChatModule } from "src/chat/chat.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";

@Module({
	imports:[ 
		TypeOrmModule.forFeature([User]),
		ChatModule 
	],
	providers: [socketGateway]
})
export class Gateway{}