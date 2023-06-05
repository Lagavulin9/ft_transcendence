import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { resChatDto } from "src/dto/resChat.dto";
import { JoiValidationPipe } from "src/validation.pipe";
import { reqChatSchema } from "src/schema/reqChat.schema";
import { reqChatDto } from "src/dto/reqChat.dto";

@Controller('chat')
export class ChatController{
	constructor(private readonly chatService:ChatService){}

	@Get('/:roomId')
	getChatById(@Param('roomId', ParseIntPipe) roomId:number): Promise<resChatDto>{
		return this.chatService.getChatById(roomId);
	}

	@Get()
	getChatByName(@Query('roomName') roomName:string): Promise<resChatDto>{
		return this.chatService.getChatByName(roomName)
	}

	@Post()
	@UsePipes(new JoiValidationPipe(reqChatSchema))
	createChatroom(@Body(new ValidationPipe) reqchatdto:reqChatDto): Promise<void>{
		return this.chatService.createChatroom(reqchatdto);
	}
}