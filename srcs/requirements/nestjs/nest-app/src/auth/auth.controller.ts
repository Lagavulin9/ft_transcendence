import { Body, Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { FtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { GetGuardData } from "./getGuardData.decorator";
import { UserService } from "src/user/user.service";
import { Response } from 'express';

@Controller('auth')
export class AuthController{
  constructor(private authService:AuthService, private userService:UserService){}

  @Get()
  @UseGuards(FtAuthGuard)
  login(){}

  @Get('/redirect')
  @UseGuards(FtAuthGuard)
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
}