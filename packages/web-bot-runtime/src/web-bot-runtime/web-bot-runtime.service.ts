import {
  BotProject,
  StartSavedBotResponse,
  WebBotLogsType,
  WebBotResponse,
} from '@kickoffbot.com/types';
import { Inject, Injectable } from '@nestjs/common';
import { TempObjectMap } from 'src/common/TempObjectMap';
import { BotStore } from 'src/runtime/BotStore';
import { EmptyLogService } from 'src/runtime/log/EmptyLogService';
import { RuntimeLogService } from 'src/runtime/log/RuntimeLogService';
import { WebBotRuntime } from 'src/runtime/WebBotRuntime';
import { ResponseErrorCode } from 'src/types/ResponseErrorCode';
import { errorToString } from 'src/utils/errorToString';
import { v4 } from 'uuid';
import { Logger } from 'winston';

@Injectable()
export class WebBotRuntimeService {
  private _configDemoBotMap = new TempObjectMap<
    string,
    { project: BotProject; logService: RuntimeLogService }
  >(
    'Uploaded configurations for demo bots and their logs',
    12 * 60 * 60,
    1 * 60 * 60,
  );
  private _botRuntimeMap = new TempObjectMap<string, WebBotRuntime>(
    'Runtime instances',
    24 * 59 * 60,
    1 * 59 * 60,
  );

  constructor(
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  uploadDemoProject(projectId: string, project: BotProject) {
    try {
      const demoProjectId = projectId;

      this._configDemoBotMap.set(demoProjectId, {
        project,
        logService: new RuntimeLogService(project),
      });

      return demoProjectId;
    } catch (e) {
      const errorMessage = e.message || e.toString();

      this.logger.error(errorToString(e));

      return {
        errorCode: ResponseErrorCode.UNKNOWN_APP_ERROR,
        message: `Unexpected error (#4): ${errorMessage}`,
      };
    }
  }

  public getBotLogs(projectId: string) {
    const { logService: runtimeLogsService } =
      this._configDemoBotMap.get(projectId);
    if (!runtimeLogsService) {
      return [{ message: 'No logs yet...', type: WebBotLogsType.DEBUG }];
    }

    const result = runtimeLogsService.getLogs();

    if (result.length === 0) {
      return [{ message: 'No logs yet...', type: WebBotLogsType.DEBUG }];
    }

    return result;
  }

  async startDemoBot(
    demoProjectId: string,
    externalVariables?: Record<string, unknown>,
  ) {
    try {
      const demoProject = this._configDemoBotMap.get(demoProjectId);

      if (!demoProject) {
        this.logger.warn('No found uploaded demo bot project');

        return {
          errorCode: ResponseErrorCode.NO_FOUND_BOT_PROJECT,
          message: 'No found uploaded demo bot project',
        };
      }

      const runtime = new WebBotRuntime(
        demoProject.project,
        demoProject.logService,
        externalVariables,
      );

      const newChatItems = await runtime.startBot();

      const response: WebBotResponse = {
        newItems: newChatItems,
      };

      this._botRuntimeMap.set(demoProjectId, runtime);

      return response;
    } catch (e) {
      const errorMessage = e.message || e.toString();

      this.logger.error(errorToString(e));

      return {
        errorCode: ResponseErrorCode.UNKNOWN_APP_ERROR,
        message: `Unexpected error (#3): ${errorMessage}`,
      };
    }
  }

  async startBot(
    projectId: string,
    externalVariables?: Record<string, unknown>,
  ) {
    try {
      const projectFromDb = await BotStore.getActualBotProjectById(projectId);

      if (!projectFromDb) {
        this.logger.warn('No found  bot project with id: ' + projectId);

        return {
          errorCode: ResponseErrorCode.NO_FOUND_BOT_PROJECT,
          message: 'No found bot project',
        };
      }

      const runtime = new WebBotRuntime(
        projectFromDb.project,
        new EmptyLogService(projectFromDb.author, projectFromDb.botName),
        externalVariables,
      );

      const newChatItems = await runtime.startBot();
      const runtimeKey = v4();

      const response: StartSavedBotResponse = {
        newItems: newChatItems,
        runtimeProjectId: runtimeKey,
      };

      this._botRuntimeMap.set(runtimeKey, runtime);

      return response;
    } catch (e) {
      const errorMessage = e.message || e.toString();

      this.logger.error(errorToString(e));

      return {
        errorCode: ResponseErrorCode.UNKNOWN_APP_ERROR,
        message: `Unexpected error (#2): ${errorMessage}`,
      };
    }
  }

  async nextStep(runtimeKey: string, elementId: string, value: unknown) {
    try {
      const runtime = this._botRuntimeMap.get(runtimeKey);

      if (!runtime) {
        this.logger.warn('No found runtime context');

        return {
          errorCode: ResponseErrorCode.NO_FOUND_RUNTIME_CONTEXT,
          message: 'No found runtime context',
        };
      }

      const newChatItems = await runtime.handleUserResponse(elementId, value);

      const response: WebBotResponse = {
        newItems: newChatItems,
      };

      return response;
    } catch (e) {
      const errorMessage = e.message || e.toString();

      this.logger.error(errorToString(e));

      return {
        errorCode: ResponseErrorCode.UNKNOWN_APP_ERROR,
        message: `Unexpected error (#1): ${errorMessage}`,
      };
    }
  }
}
