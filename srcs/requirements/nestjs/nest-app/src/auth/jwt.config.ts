import { jwtConstants } from "./constanats";

export const JwtConfig = {
	global: true,
	secret: jwtConstants.secret,
	signOptions: { expiresIn: '60s' },
}