import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './user.entity'
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Log } from "./log.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User, Log])],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule{}