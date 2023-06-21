import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Query, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { createUserDto } from "src/dto/createUser.dto";
import { JoiValidationPipe } from "../validation.pipe";
import { ResUserDto } from "src/dto/resUser.dto";
import { createUserSchema } from "src/schema/createUser.schema";
import { User } from "./user.entity";
import { ReqUserDto } from "src/dto/reqUser.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:uid')
  getUserByID(@Param('uid', ParseIntPipe) uid: number): Promise<ResUserDto> {
    return this.userService.getUserByID(uid);
  }

  @Get()
  getUserByNick(@Query('nickname') nickname: string): Promise<ResUserDto> {
    return this.userService.getUserByNick(nickname);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  createUser(@Body(new ValidationPipe()) user: createUserDto): Promise<User> {
    return this.userService.createUser(user);
  }

  @Get('/check/nick')
  checkUniqueNick(@Query('nickname') nickname: string): Promise<boolean> {
    console.log(nickname);
    return this.userService.checkUniqueNick(nickname);
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
