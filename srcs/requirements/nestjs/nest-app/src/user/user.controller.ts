import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Query, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { createUserDto } from "src/dto/createUser.dto";
import { JoiValidationPipe } from "../validation.pipe";
import { getUserDto } from "src/dto/getUser.dto";
import { createUserSchema } from "src/schema/createUser.schema";
import { LogSchema } from "src/schema/log.schema";
import { LogDto } from "src/dto/log.dto";
import { User } from "./user.entity";
import { Log } from "./log.entity";

@Controller('user')
export class UserController{
	constructor(private readonly userService:UserService){}

	@Get('/:uid')
	getUserByID(@Param('uid', ParseIntPipe) uid:number):Promise<getUserDto> {
		return this.userService.getUserByID(uid);
	}

	@Get()
	getUserByNick(@Query('nickname') nickname:string):Promise<getUserDto> {
		return this.userService.getUserByNick(nickname);
	}

	@Post()
	@UsePipes(new JoiValidationPipe(createUserSchema))
	createUser(@Body(new ValidationPipe) user:createUserDto):Promise<User> {
		return this.userService.createUser(user);
	}

	@Post('/log')
	@UsePipes(new JoiValidationPipe(LogSchema))
	saveGameLog(@Body(new ValidationPipe) log:LogDto):Promise<Log>{
		return this.userService.saveGameLog(log);
	}

	@Patch('/nickname')
	updateNickname(@Body() req:{'uid':number, 'nickname':string}):Promise<User> {
		console.log(req.uid, req.nickname);
		return this.userService.updateNickname(req.uid, req.nickname);
	}
	/* 나중에 프로필을 Url로 대체 할 때 사용할 Patch 입니다.
	@Patch('/profile')
	updateProfileUrl(@Body() req:{'uid':number, 'profileUrl':string}):Promise<User> {
		console.log(req.uid, req.profileUrl);
		return this.userService.updateNickname(req.uid, req.profileUrl);
	}
	*/
}

// Nickname -> User -> nickname