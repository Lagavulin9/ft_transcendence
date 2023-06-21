import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { Gateway } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
            TypeOrmModule.forRoot(typeORMConfig),
            UserModule,
            ChatModule,
            FriendModule,
            Gateway,
            AuthModule,
            ImageModule
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
