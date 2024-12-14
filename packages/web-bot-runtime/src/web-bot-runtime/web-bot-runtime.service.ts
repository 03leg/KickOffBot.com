import {
  BotProject,
  StartSavedBotResponse,
  WebBotLogsType,
  WebBotResponse,
} from '@kickoffbot.com/types';
import { Injectable } from '@nestjs/common';
import { BotStore } from 'src/runtime/BotStore';
import { EmptyLogService } from 'src/runtime/log/EmptyLogService';
import { RuntimeLogService } from 'src/runtime/log/RuntimeLogService';
import { WebBotRuntime } from 'src/runtime/WebBotRuntime';
import { v4 } from 'uuid';

@Injectable()
export class WebBotRuntimeService {
  private _configDemoBotMap = new Map<string, BotProject>();
  private _runtimeMap = new Map<string, WebBotRuntime>();
  private _runtimeLogsServiceMap = new Map<string, RuntimeLogService>();

  uploadDemoProject(projectId: string, project: BotProject): string {
    const demoProjectId = projectId;

    this._configDemoBotMap.set(demoProjectId, project);

    return demoProjectId;
  }

  public getBotLogs(projectId: string) {
    const runtimeLogsService = this._runtimeLogsServiceMap.get(projectId);
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
    const demoProject = this._configDemoBotMap.get(demoProjectId);
    if (!demoProject) {
      throw new Error('InvalidOperationError: demoProject is null');
    }

    const logService = new RuntimeLogService(demoProject);
    this._runtimeLogsServiceMap.set(demoProjectId, logService);

    const runtime = new WebBotRuntime(
      demoProject,
      logService,
      externalVariables,
    );

    const newChatItems = await runtime.startBot();

    const response: WebBotResponse = {
      newItems: newChatItems,
    };

    this._runtimeMap.set(demoProjectId, runtime);

    return response;
  }

  async startBot(
    projectId: string,
    externalVariables?: Record<string, unknown>,
  ) {
    if (!projectId) {
      throw new Error('InvalidOperationError: projectId is null');
    }

    const projectFromDb = await BotStore.getActualBotProjectById(projectId);

    if (!projectFromDb) {
      throw new Error(
        'InvalidOperationError: Failed to get project from db. projectId: ' +
          projectId,
      );
    }

    const runtime = new WebBotRuntime(
      projectFromDb.project,
      new EmptyLogService(projectFromDb.author, projectFromDb.botName),
      externalVariables,
    );

    const newChatItems = await runtime.startBot();
    const runtimeProjectId = v4();

    const response: StartSavedBotResponse = {
      newItems: newChatItems,
      runtimeProjectId,
    };

    this._runtimeMap.set(runtimeProjectId, runtime);

    return response;
  }

  async nextStep(demoProjectId: string, elementId: string, value: unknown) {
    const runtime = this._runtimeMap.get(demoProjectId);
    if (!runtime) {
      throw new Error('InvalidOperationError: runtime is null');
    }

    const newChatItems = await runtime.handleUserResponse(elementId, value);

    const response: WebBotResponse = {
      newItems: newChatItems,
    };

    return response;
  }
}
