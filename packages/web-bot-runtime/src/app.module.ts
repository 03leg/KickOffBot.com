import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebBotRuntimeModule } from './web-bot-runtime/web-bot-runtime.module';

@Module({
  imports: [WebBotRuntimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
