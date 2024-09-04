import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebBotRuntimeModule } from './web-bot-runtime/web-bot-runtime.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), WebBotRuntimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
