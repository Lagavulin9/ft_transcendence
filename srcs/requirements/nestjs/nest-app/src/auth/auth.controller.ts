import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { GetGuardData } from './getGuardData.decorator';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { ResUserDto } from 'src/dto/resUser.dto';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { TwoFactorGuard } from './twoFactor.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  ß;
  @Get()
  @UseGuards(FtAuthGuard)
  authCheck() {}

  @Get('/redirect')
  @UseGuards(FtAuthGuard)
  async redirect(
    @GetGuardData() data,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return await this.authService.redirect(data, res);
    // try {
    // return await this.authService.redirect(data, res);
    // } catch (e) {
    //   if (e instanceof UnauthorizedException) {
    //     return 'duplicate login';
    //     // res.redirect('/signin_duplicated');
    //   } else {
    //     return 'signin failed';
    //     // res.redirect('/signin_fail');
    //   }
    // }
  }

  @Post('send-email')
  @UseGuards(TwoFactorGuard)
  sendEmail(@Body() req: { uid: number }) {
    return this.authService.sendEmail(req.uid);
  }

  @Post('verify')
  @UseGuards(TwoFactorGuard)
  verifyPasscode(
    @Body() req: { uid: number; passcode: number },
    @Res() res: Response,
  ) {
    return this.authService.verifyPasscode(req.uid, req.passcode, res);
  }
}
