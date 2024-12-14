import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { WebBotRuntimeService } from './web-bot-runtime.service';
import { BotProject } from '@kickoffbot.com/types';
import { Response } from 'express';

@Controller('api/web-bot-runtime')
export class WebBotRuntimeController {
  constructor(private readonly botRuntimeService: WebBotRuntimeService) {}

  @Post('upload-demo-project')
  uploadDemoProject(
    @Res({ passthrough: true }) nestResponse: Response,
    @Body() response: { project: BotProject; projectId: string },
  ) {
    const result = this.botRuntimeService.uploadDemoProject(
      response.projectId,
      response.project,
    );

    if (Object.hasOwnProperty.call(result, 'errorCode')) {
      return nestResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }

    return result;
  }

  @Get('get-bot-logs')
  async getBotLogs(@Query('projectId') demoProjectId: string) {
    const logs = this.botRuntimeService.getBotLogs(demoProjectId);

    return logs;
  }

  @Post('start-demo-bot')
  async startDemoBot(
    @Res({ passthrough: true }) nestResponse: Response,
    @Query('demoProjectId') demoProjectId: string,
    @Body() body: { externalVariables: Record<string, unknown> },
  ) {
    const result = await this.botRuntimeService.startDemoBot(
      demoProjectId,
      body.externalVariables,
    );

    if (Object.hasOwnProperty.call(result, 'errorCode')) {
      return nestResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }

    return result;
  }

  @Post('start-bot')
  async startBot(
    @Res({ passthrough: true }) nestResponse: Response,
    @Query('projectId') projectId: string,
    @Body() body: { externalVariables: Record<string, unknown> },
  ) {
    const result = await this.botRuntimeService.startBot(
      projectId,
      body.externalVariables,
    );

    if (Object.hasOwnProperty.call(result, 'errorCode')) {
      return nestResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }

    return result;
  }

  @Post('next-step')
  async nextBotStep(
    @Res({ passthrough: true }) nestResponse: Response,
    @Query('demoProjectId') demoProjectId: string,
    @Body() response: { elementId: string; value: unknown },
  ) {
    const result = await this.botRuntimeService.nextStep(
      demoProjectId,
      response.elementId,
      response.value,
    );

    if (Object.hasOwnProperty.call(result, 'errorCode')) {
      return nestResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }

    return result;
  }
}
