import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameLogDto, LogDto } from "src/dto/log.dto";

@Controller('game')
export class GameController{
	constructor(
		private gameService:GameService
	){}

	@Get('/log/:uid')
	getLogs(@Param('uid', ParseIntPipe) uid:number){
		return this.gameService.getUserGameLogs(uid);
	}

	@Post('/log')
	saveGameLog(@Body() req:LogDto){
		return this.gameService.saveGameLog(req);
	}
}