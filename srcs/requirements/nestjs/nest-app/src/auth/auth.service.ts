import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from "src/user/user.service";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService{
  constructor(
    private jwtService:JwtService,
    private userService:UserService,
    private mailerService:MailerService){}
  
  private otpMap = new Map<number, number>();

  async signUp(id:number){
    const payload = { id:id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async sendEmail(uid:number):Promise<boolean>{
    const to = await this.userService.getUserByID(uid);
    if (!to){
      throw new NotFoundException(`Could not find user id:${uid}`);
    }
    if (!to.isOTP){
      return false;
    }
    const otp = this.generateRandomNumber();
    this.mailerService.sendMail({
      to: to.email,
      from: '"No Reply"<noreply@gmail.com>',
      subject: 'Verify your login',
      text: '',
      html: `<h4>Your verification code is: <h3><b>${otp}</b></h3></h4>`
    })
    .then((result)=>{
      this.otpMap.set(uid, otp);
      setTimeout(()=>{
        this.otpMap.delete(uid);
      }, 1000*60*10);
    })
    .catch((error)=>{
      console.log(error);
      throw new HttpException('internal server error', 500);
    })
    return true;
  }

  verifyPasscode(uid:number, passcode:number):boolean{
    const answer = this.otpMap.get(uid);
    if (!answer || answer != passcode){
      return false;
    }
    return true;
  }

  private generateRandomNumber(): number {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
  
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }
}