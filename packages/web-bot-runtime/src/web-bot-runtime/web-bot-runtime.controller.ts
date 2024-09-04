import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebBotRuntimeService } from './web-bot-runtime.service';
import { BotProject } from '@kickoffbot.com/types';

@Controller('api/web-bot-runtime')
export class WebBotRuntimeController {
  constructor(private readonly botRuntimeService: WebBotRuntimeService) {}

  @Post('upload-demo-project')
  uploadDemoProject(
    @Body() response: { project: BotProject; projectId: string },
  ): string {
    return this.botRuntimeService.uploadDemoProject(
      response.projectId,
      response.project,
    );
  }

  @Get('start-demo-bot')
  async startBot(@Query('demoProjectId') demoProjectId: string) {
    const result = await this.botRuntimeService.startDemoBot(demoProjectId);
    return result;
  }

  @Post('next-step')
  async nextBotStep(
    @Query('demoProjectId') demoProjectId: string,
    @Body() response: { elementId: string; value: unknown },
  ) {
    const result = await this.botRuntimeService.nextStep(
      demoProjectId,
      response.elementId,
      response.value,
    );

    console.log('result1', result);

    return result;
  }
}
