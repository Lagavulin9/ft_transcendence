import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constanats';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // passport-jwt strategy 를 통해서 jwt token 을 검증 & payload 를 추출
  constructor(private userService:UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string => {
          return req?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: {uid:number}) {
    if (await this.userService.getUserByID(payload.uid)) {
      return payload;
    } else {
      return false;
    }
  }
}
