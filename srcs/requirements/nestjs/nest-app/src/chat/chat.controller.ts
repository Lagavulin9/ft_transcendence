import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { resChatDto } from 'src/dto/resChat.dto';
import { JoiValidationPipe } from 'src/validation.pipe';
import { reqChatSchema } from 'src/schema/reqChat.schema';
import { reqChatDto } from 'src/dto/reqChat.dto';
import { Chat } from './chat.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  getAllChatrooms(): resChatDto[] {
    return this.chatService.getAllChatroom();
  }

  @Get('/:roomId')
  @UseGuards(JwtAuthGuard)
  getChatById(@Param('roomId', ParseIntPipe) roomId: number): resChatDto {
    return this.chatService.getChatById(roomId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getChatByName(@Query('roomName') roomName: string): resChatDto {
    return this.chatService.getChatByName(roomName);
  }

  // @Post()
  // @UsePipes(new JoiValidationPipe(reqChatSchema))
  // createChatroom(@Body(new ValidationPipe) reqchatdto:reqChatDto): Promise<Chat>{
  // 	return this.chatService.createChatroom(reqchatdto);
  // }
}
