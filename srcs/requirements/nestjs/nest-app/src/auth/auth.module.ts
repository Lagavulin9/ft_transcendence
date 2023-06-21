import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FtAuthGuard } from './auth.guard';
import { FtAuthStrategy } from './auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from './mail.config';
import { JwtConfig } from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserCreationStrategy } from './userCreation.strategy';
import { TwoFactorStrategy } from './twoFactor.strategy';
import { UserCreationGuard } from './userCreation.guard';
import { TwoFactorGuard } from './twoFactor.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register(JwtConfig),
    MailerModule.forRoot(MailConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FtAuthStrategy,
    FtAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    UserCreationStrategy,
    TwoFactorStrategy,
    UserCreationGuard,
    TwoFactorGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
