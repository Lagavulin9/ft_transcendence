import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenStatusEnum } from './tokenState.enum';

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(
  Strategy,
  'JwtTwoFactorStrategy',
) {
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

  validate(payload) {
    if (payload) {
      if (payload.status === TokenStatusEnum.TWO_FACTOR) {
        return payload;
      } else {
        return false;
      }
    }
  }
}
