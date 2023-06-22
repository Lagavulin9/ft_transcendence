import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Query,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from 'src/dto/createUser.dto';
import { JoiValidationPipe } from '../validation.pipe';
import { ResUserDto } from 'src/dto/resUser.dto';
import { createUserSchema } from 'src/schema/createUser.schema';
import { User } from './user.entity';
import { ReqUserDto } from 'src/dto/reqUser.dto';
import { UserCreationGuard } from 'src/auth/userCreation.guard';
import { GetGuardData } from 'src/auth/getGuardData.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:uid')
  @UseGuards(JwtAuthGuard)
  getUserByID(@Param('uid', ParseIntPipe) uid: number): Promise<ResUserDto> {
    return this.userService.getUserByID(uid);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserByNick(@Query('nickname') nickname: string): Promise<ResUserDto> {
    return this.userService.getUserByNick(nickname);
  }

  @Post()
  @UseGuards(UserCreationGuard)
  createUser(@Body() body: createUserDto, @GetGuardData() data): Promise<User> {
    console.log('createUser');
    return this.userService.createUser(body, data);
  }

  @Get('/check/nick')
  checkUniqueNick(@Query('nickname') nickname: string): Promise<boolean> {
    return this.userService.checkUniqueNick(nickname);
  }

  @Patch('/:uid')
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('uid', ParseIntPipe) uid: number, @Body() req: ReqUserDto) {
    return this.userService.updateUser(uid, req);
  }
}
