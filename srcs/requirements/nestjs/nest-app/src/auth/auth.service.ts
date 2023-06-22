import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as cookie from 'cookie';
import { Request, Response } from 'express';
import { access } from 'fs';
import { TokenStatusEnum } from './tokenState.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  private otpMap = new Map<number, number>();

  async redirect(data, res: Response): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { uid: data.id },
    });
    if (!user) {
      return this.signUp(data, res);
    } else if (user.isOTP) {
      return this.twoFactor(user.uid, res);
    } else {
      return this.signIn(user, res);
    }
  }

  twoFactor(uid: number, res: Response): void {
    const accessToken = this.jwtService.sign({
      status: TokenStatusEnum.TWO_FACTOR,
      uid: uid,
    });
    res.cookie('Auth', accessToken, {
      httpOnly: true,
    });
    res.redirect('/Page/OTP');
    // res.redirect('http://localhost/api/auth/test')
  }

  signIn(user: User, res: Response): void {
    // if (user.status == 'online') {
    //   throw new UnauthorizedException('user already connected');
    // }
    const accessToken = this.jwtService.sign({
      status: TokenStatusEnum.SUCCESS,
      uid: user.uid,
    });
    res.cookie('Auth', accessToken, {
      httpOnly: true,
    });
    res.redirect('/Page/Home');
  }

  twofaSignIn(user: User, res: Response): void {
    const accessToken = this.jwtService.sign({
      status: TokenStatusEnum.SUCCESS,
      uid: user.uid,
    });
    res.cookie('Auth', accessToken, {
      httpOnly: true,
    });
    res.setHeader('Location', '/Page/Home');
    res.status(200).end();
  }

  signUp(data, res: Response): void {
    const accessToken = this.jwtService.sign({
      status: TokenStatusEnum.SIGNUP,
      id: data.id,
      login: data.login,
      email: data.email,
    });
    res.cookie('Auth', accessToken, {
      httpOnly: true,
    });
    res.redirect('/Page/SignUp');
  }

  async sendEmail(uid: number): Promise<boolean> {
    const to = await this.userRepository.findOne({ where: { uid: uid } });
    if (!to) {
      throw new NotFoundException(`Could not find user id:${uid}`);
    }
    if (!to.isOTP) {
      return false;
    }
    const otp = this.generateRandomNumber();
    this.mailerService
      .sendMail({
        to: to.email,
        from: '"No Reply"<noreply@gmail.com>',
        subject: 'Verify your login',
        text: '',
        html: `<h4>Your verification code is: <h3><b>${otp}</b></h3></h4>`,
      })
      .then((result) => {
        this.otpMap.set(uid, otp);
        setTimeout(() => {
          this.otpMap.delete(uid);
        }, 1000 * 60 * 10);
      })
      .catch((error) => {
        console.log(error);
        throw new HttpException('internal server error', 500);
      });
    return true;
  }

  async verifyPasscode(uid: number, passcode: number, res: Response) {
    console.log(this.otpMap);
    console.log(passcode);
    const user = await this.userRepository.findOne({ where: { uid: uid } });
    const answer = this.otpMap.get(uid);
    if (!answer || answer != passcode) {
      console.log('signin');
      return this.twofaSignIn(user, res);
    }
    res.redirect('/Page/OTP');
    // throw new UnauthorizedException('invalid passcode');
  }

  private generateRandomNumber(): number {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }
}
