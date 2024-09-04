import { Module } from '@nestjs/common';
import { WebBotRuntimeService } from './web-bot-runtime.service';
import { WebBotRuntimeController } from './web-bot-runtime.controller';

@Module({
  providers: [WebBotRuntimeService],
  controllers: [WebBotRuntimeController],
})
export class WebBotRuntimeModule {}
