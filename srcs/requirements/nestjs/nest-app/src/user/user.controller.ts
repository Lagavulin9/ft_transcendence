import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto, UserSchema } from "src/dto/user.dto";
import { User } from './user.entity'
import { JoiValidationPipe } from "../validation.pipe";

@Controller('user')
export class UserController{
	constructor(private readonly userService:UserService){}

	@Get('/:uid')
	getUserByID(@Param('uid', ParseIntPipe) uid:number):Promise<User> {
		return this.userService.getUserByID(uid);
	}

	@Get('/nick/:nickname')
	getUserByNick(@Param('nickname') nickname:string):Promise<User> {
		return this.userService.getUserByNick(nickname);
	}

	@Post()
	@UsePipes(new JoiValidationPipe(UserSchema))
	saveUser(@Body(new ValidationPipe) user:UserDto):Promise<void> {
		return this.userService.saveUser(user);
	}
}