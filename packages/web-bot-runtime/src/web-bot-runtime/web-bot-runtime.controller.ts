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

  @Get('get-bot-logs')
  async getBotLogs(@Query('projectId') demoProjectId: string) {
    const logs = this.botRuntimeService.getBotLogs(demoProjectId);

    return logs;
  }

  @Post('start-demo-bot')
  async startDemoBot(
    @Query('demoProjectId') demoProjectId: string,
    @Body() body: { externalVariables: Record<string, unknown> },
  ) {
    const result = await this.botRuntimeService.startDemoBot(
      demoProjectId,
      body.externalVariables,
    );
    return result;
  }

  @Post('start-bot')
  async startBot(
    @Query('projectId') projectId: string,
    @Body() body: { externalVariables: Record<string, unknown> },
  ) {
    const result = await this.botRuntimeService.startBot(
      projectId,
      body.externalVariables,
    );
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

    return result;
  }
}
