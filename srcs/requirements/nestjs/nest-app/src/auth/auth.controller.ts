import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { FtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { GetGuardData } from "./getGuardData.decorator";
import { UserService } from "src/user/user.service";
import { Response } from 'express';
import { ResUserDto } from "src/dto/resUser.dto";
import axios from "axios";

@Controller('auth')
export class AuthController{
  constructor(
    private authService:AuthService,
    private userService:UserService,
  ){}

  @Get()
  @UseGuards(FtAuthGuard)
  authCheck(){}

  @Get('/redirect')
  @UseGuards(FtAuthGuard)
  async redirect(@GetGuardData() data, @Res({passthrough: true}) res:Response):Promise<any>{
    const user = await this.userService.getUserByID(data.id).catch((e)=>{});
    if (!user){
      console.log('no such user');
      //redirect to signup
    }
    else{
      console.log(user)
      //redirect to home
    }
    return user
  }

  @Get('/login')
  mockUp(){
    const user = new ResUserDto();
    user.uid = 1;
    user.nickname = 'testuser';
    user.profileURL = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fbrunch.co.kr%2F%40samsamvet%2F19&psig=AOvVaw12Uq43ff5rSZ60AX0hYHmb&ust=1686899734069000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNCX063dxP8CFQAAAAAdAAAAABAD'
    user.isOTP = false;
    user.level = 0;
    user.totalWin = 0;
    user.totalLose = 0;
    user.gameLog = [];
    return user;
  }

  @Post('send-email')
  sendEmail(@Body() req:{uid:number}){
    return this.authService.sendEmail(req.uid);
  }

  @Post('verify')
  verifyPasscode(@Body() req:{uid:number, passcode:number}){
    return this.authService.verifyPasscode(req.uid, req.passcode);
  }
}