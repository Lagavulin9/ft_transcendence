import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import axios from 'axios'

@Injectable()
export class FtAuthStrategy extends PassportStrategy(Strategy, 'ft'){
    constructor() {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?
                          client_id=${process.env.FT_APP_UID}
                          &redirect_uri=${process.env.FT_APP_CALLBACK}
                          &response_type=code`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.FT_APP_UID,
      clientSecret: process.env.FT_APP_SECRET,
      callbackURL: process.env.FT_APP_CALLBACK,
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const login = data.login;
    const id = data.id;
    return { id: id, login: login };
  }
}
