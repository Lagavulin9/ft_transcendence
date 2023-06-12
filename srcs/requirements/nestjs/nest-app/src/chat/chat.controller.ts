import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { resChatDto } from "src/dto/resChat.dto";
import { JoiValidationPipe } from "src/validation.pipe";
import { reqChatSchema } from "src/schema/reqChat.schema";
import { reqChatDto } from "src/dto/reqChat.dto";
import { Chat } from "./chat.entity";

@Controller('chat')
export class ChatController{
	constructor(private chatService:ChatService){}

	@Get('/all')
	getAllChatrooms(): Chat[]{
		return this.chatService.getAllChatroom();
	}

	@Get('/:roomId')
	getChatById(@Param('roomId', ParseIntPipe) roomId:number): resChatDto{
		return this.chatService.getChatById(roomId);
	}

	@Get()
	getChatByName(@Query('roomName') roomName:string): resChatDto{
		return this.chatService.getChatByName(roomName)
	}

	// @Post()
	// @UsePipes(new JoiValidationPipe(reqChatSchema))
	// createChatroom(@Body(new ValidationPipe) reqchatdto:reqChatDto): Promise<Chat>{
	// 	return this.chatService.createChatroom(reqchatdto);
	// }
}