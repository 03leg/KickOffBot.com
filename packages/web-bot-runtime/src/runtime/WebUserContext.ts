import { isNil } from 'lodash';
import { BotProject, BotVariable } from '@kickoffbot.com/types';
import { WordpressVariableChecker } from './helper/WordpressVariableChecker';
import { LogService } from './log/LogService';

export interface NextBotStep {
  blockId: string;
  elementId: string;
}

export class WebUserContext {
  private _variables = new Map<string, unknown>();
  private _nextStep: NextBotStep | null = null;

  public get nextStep(): NextBotStep | null {
    return this._nextStep;
  }

  constructor(
    private _project: BotProject,
    private _logService: LogService,
    externalVariables?: Record<string, unknown>,
  ) {
    this.initVariables(_project.variables);

    if (externalVariables) {
      this.setExternalVariables(externalVariables);
    }
  }

  private setExternalVariables(externalVariables: Record<string, unknown>) {
    for (const [key, value] of Object.entries(externalVariables)) {
      let typedValue: unknown;

      try {
        typedValue = JSON.parse(value as string);
      } catch {
        typedValue = value;
      }

      this._variables.set(key, typedValue);
    }
  }

  private initVariables(botVariables: BotVariable[]) {
    for (const botVariable of botVariables) {
      const valueString = botVariable.value as string;
      let value: unknown;

      try {
        value = JSON.parse(valueString);
      } catch {
        value = valueString;
      }

      this._variables.set(botVariable.name, value);
    }
  }

  public setNextStep(nextStep: NextBotStep | null) {
    this._nextStep = nextStep;
  }

  public updateVariable(
    name: string,
    newValue: string | number | boolean | unknown[] | object | unknown,
  ) {
    this._logService.logChangeVariable(name, newValue);

    this._variables.set(name, newValue);
  }

  public getVariableValueByName(
    name: string,
  ): string | number | boolean | unknown[] | Record<string, unknown> {
    let result = this._variables.get(name);

    if (isNil(result)) {
      if (WordpressVariableChecker.isWordpressVariable(name)) {
        result = 'N/A';
      } else {
        result = `Variable '${name}' not found`;
      }
    }

    this._logService.logRequestVariable(name, result);

    return result as string;
  }

  public getCurrentState() {
    return this._variables;
  }
}
