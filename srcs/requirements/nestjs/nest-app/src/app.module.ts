import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
            TypeOrmModule.forRoot(typeORMConfig),
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
