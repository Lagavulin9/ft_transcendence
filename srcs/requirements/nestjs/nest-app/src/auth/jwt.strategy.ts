import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenStatusEnum } from './tokenState.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // passport-jwt strategy 를 통해서 jwt token 을 검증 & payload 를 추출
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string => {
          return req?.cookies?.Auth;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    if (payload.status === TokenStatusEnum.SUCCESS) {
      return payload;
    } else {
      return false;
    }
  }
}
