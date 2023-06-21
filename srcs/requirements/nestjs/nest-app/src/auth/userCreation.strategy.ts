import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenStatusEnum } from './tokenState.enum';

@Injectable()
export class UserCreationStrategy extends PassportStrategy(
  Strategy,
  'JwtCreationStrategy',
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

  validate(payload: {
    status?: TokenStatusEnum;
    id: number;
    login: string;
    email: string;
  }) {
    if (payload) {
      if (payload.status === TokenStatusEnum.SIGNUP) {
        return payload;
      } else {
        return false;
      }
    }
  }
}
