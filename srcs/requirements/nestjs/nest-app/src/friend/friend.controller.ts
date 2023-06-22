import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { reqFriendDto, resFriendListDto } from 'src/dto/friend.dto';
import { JoiValidationPipe } from 'src/validation.pipe';
import { reqFriendSchema } from 'src/schema/friend.schema';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get('/:uid')
  getFriendList(
    @Param('uid', ParseIntPipe) uid: number,
  ): Promise<resFriendListDto> {
    return this.friendService.getFriendList(uid);
  }

  @Post('/post')
  @UsePipes(new JoiValidationPipe(reqFriendSchema))
  addFriend(
    @Body(new ValidationPipe()) req: reqFriendDto,
  ): Promise<resFriendListDto> {
    return this.friendService.addFriend(req);
  }

  @Post('/block')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(reqFriendSchema))
  blockFriend(
    @Body(new ValidationPipe()) req: reqFriendDto,
  ): Promise<resFriendListDto> {
    return this.friendService.blockUser(req);
  }

  @Post('/unblock')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(reqFriendSchema))
  unblockFriend(@Body(new ValidationPipe()) req: reqFriendDto) {
    console.log(req);
    return this.friendService.unblockUser(req);
  }
}
