import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Log } from "./log.entity";
import { UserModule } from "src/user/user.module";

@Module({
	imports:[
		TypeOrmModule.forFeature([User, Log]),
	],
	controllers:[GameController],
	providers:[GameService],
	exports:[GameService]
})
export class GameModule{}