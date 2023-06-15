import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { FtAuthGuard } from "./auth.guard";
import { FtAuthStrategy } from "./auth.strategy";
import { jwtConstants } from "./constanats";
import { JwtModule } from '@nestjs/jwt';
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";

@Module({
	imports:[
		JwtModule.register({
		global: true,
		secret: jwtConstants.secret,
		signOptions: { expiresIn: '60s' },
		}),
		UserModule,
	],
	controllers:[AuthController],
	providers:[AuthService, FtAuthStrategy, FtAuthGuard],
	exports:[AuthService]
})
export class AuthModule{}