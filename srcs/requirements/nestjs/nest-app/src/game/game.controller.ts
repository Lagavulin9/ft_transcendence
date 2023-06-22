import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameLogDto, LogDto } from "src/dto/log.dto";
import { JwtAuthGuard } from "src/auth/jwt.guard";

@Controller('game')
export class GameController{
	constructor(
		private gameService:GameService
	){}

	@Get('/log/:uid')
	@UseGuards(JwtAuthGuard)
	getLogs(@Param('uid', ParseIntPipe) uid:number){
		return this.gameService.getUserGameLogs(uid);
	}

	@Post('/log')
	@UseGuards(JwtAuthGuard)
	saveGameLog(@Body() req:LogDto){
		return this.gameService.saveGameLog(req);
	}
}