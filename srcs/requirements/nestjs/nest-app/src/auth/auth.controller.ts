import { Body, Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { FtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { GetGuardData } from "./getGuardData.decorator";
import { UserService } from "src/user/user.service";
import { Response } from 'express';
import { getUserDto } from "src/dto/getUser.dto";

@Controller('auth')
export class AuthController{
  constructor(private authService:AuthService, private userService:UserService){}

  @Get()
  //@UseGuards(FtAuthGuard)
  authCheck(){}

  @Get('/redirect')
  //@UseGuards(FtAuthGuard)
  async redirect(@GetGuardData() data, @Res() res:Response):Promise<any>{
    // const uid = await this.userService.getUserByID(data.id);
    // if (!uid){
    //   //회원가입으로 보내줌
    //   //uid랑 닉네임
    //   const redirectURL = `http://localhost/signup`
    //   return res.redirect(redirectURL);
    // }
    // else{
    //   const redirectURL = `http://localhost/`
    //   return res.redirect(redirectURL);
    // }
    return 'redirected successfully'
  }

  @Get('/login')
  mockUp(){
    const user = new getUserDto();
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
}