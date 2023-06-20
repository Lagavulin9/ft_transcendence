import { Module} from "@nestjs/common";
import { socketGateway } from "./gateway";
import { ChatModule } from "src/chat/chat.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { UserModule } from "src/user/user.module";
import { GameModule } from "src/game/game.module";

@Module({
	imports:[ 
		TypeOrmModule.forFeature([User]),
		ChatModule,
		UserModule,
		GameModule
	],
	providers: [socketGateway]
})
export class Gateway{}