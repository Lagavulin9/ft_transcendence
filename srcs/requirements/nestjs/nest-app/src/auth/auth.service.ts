import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{
  constructor(
    private jwtService:JwtService,
    private userService:UserService){}

  async signUp(id:number){
    const payload = { id:id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}