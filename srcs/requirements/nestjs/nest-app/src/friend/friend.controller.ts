import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { reqFriendDto, resFriendListDto } from "src/dto/friend.dto";
import { JoiValidationPipe } from "src/validation.pipe";
import { reqFriendSchema } from "src/schema/friend.schema";

@Controller('friend')
export class FriendController{
	constructor(private friendService:FriendService){}

	@Get('/:uid')
	getFriendList(@Param('uid', ParseIntPipe) uid:number): Promise<resFriendListDto>{
		return this.friendService.getFriendList(uid);
	}

	@Post('/post')
	@UsePipes(new JoiValidationPipe(reqFriendSchema))
	addFriend(@Body(new ValidationPipe) req:reqFriendDto): Promise<resFriendListDto>{
		return this.friendService.addFriend(req);
	}

	@Post('/block')
	@UsePipes(new JoiValidationPipe(reqFriendSchema))
	blockFriend(@Body(new ValidationPipe) req:reqFriendDto): Promise<resFriendListDto>{
		return this.friendService.blockUser(req);
	}
}