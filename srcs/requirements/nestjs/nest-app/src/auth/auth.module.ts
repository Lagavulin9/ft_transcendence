import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { FtAuthGuard } from "./auth.guard";
import { FtAuthStrategy } from "./auth.strategy";
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from "src/user/user.module";
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from "./mail.config";
import { JwtConfig } from "./jwt.config";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt.guard";

@Module({
	imports:[
		JwtModule.register(JwtConfig),
		MailerModule.forRoot(MailConfig),
		UserModule,
	],
	controllers:[AuthController],
	providers:[AuthService, FtAuthStrategy, FtAuthGuard, JwtStrategy, JwtAuthGuard],
	exports:[AuthService]
})
export class AuthModule{}