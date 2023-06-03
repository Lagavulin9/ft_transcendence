import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { createUserDto } from "src/dto/createUser.dto";
import { User } from './user.entity'
import { JoiValidationPipe } from "../validation.pipe";
import { getUserDto } from "src/dto/getUser.dto";
import { createUserSchema } from "src/schema/createUser.schema";
import { LogSchema } from "src/schema/log.schema";
import { LogDto } from "src/dto/log.dto";

@Controller('user')
export class UserController{
	constructor(private readonly userService:UserService){}

	@Get('/:uid')
	getUserByID(@Param('uid', ParseIntPipe) uid:number):Promise<getUserDto> {
		return this.userService.getUserByID(uid);
	}

	@Get()
	getUserByNick(@Query('nickname') nickname:string):Promise<User> {
		return this.userService.getUserByNick(nickname);
	}

	@Post()
	@UsePipes(new JoiValidationPipe(createUserSchema))
	saveUser(@Body(new ValidationPipe) user:createUserDto):Promise<void> {
		return this.userService.saveUser(user);
	}

	@Post('/log')
	@UsePipes(new JoiValidationPipe(LogSchema))
	saveGameLog(@Body(new ValidationPipe) log:LogDto):Promise<void>{
		return this.userService.saveGameLog(log);
	}
}