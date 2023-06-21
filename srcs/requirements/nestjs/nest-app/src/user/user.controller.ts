import { Controller, Get, Post, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Query, Patch, Req } from "@nestjs/common";
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
  createUser(@Body(new ValidationPipe()) body: createUserDto, @Req() req): Promise<User> {
    return this.userService.createUser(body, req.user);
  }

  @Get('/check/nick')
  checkUniqueNick(@Query('nickname') nickname: string): Promise<boolean> {
    return this.userService.checkUniqueNick(nickname);
  }

  @Patch('/:uid')
  updateUser(@Param('uid', ParseIntPipe) uid: number, @Body() req: ReqUserDto) {
    console.log(uid);
    console.log(req);
    return this.userService.updateUser(uid, req);
  }
}
