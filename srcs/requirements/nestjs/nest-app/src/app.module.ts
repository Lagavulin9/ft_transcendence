import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
            TypeOrmModule.forRoot(typeORMConfig),
            UserModule,
            FriendModule
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
