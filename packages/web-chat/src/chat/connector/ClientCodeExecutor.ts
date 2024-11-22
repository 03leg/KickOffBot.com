import { BotVariable, ClientCodeDescriptionRuntime, CodeResultDescription } from "@kickoffbot.com/types";
import dayjs from 'dayjs';

export class VariablesManager {
  public newValues: Record<BotVariable["name"], unknown> = {};
  constructor(public variables: Record<BotVariable["name"], unknown>) {}

  public getValue(name: string) {
    return this.variables[name];
  }

  public setValue(name: string, value: unknown) {
    this.variables[name] = value;
    this.newValues[name] = value;
  }
}

export class ClientCodeExecutor {
  public static async execute(codeDescription: ClientCodeDescriptionRuntime) {
    const AsyncFunction = async function () {}.constructor as { new (...args: any[]): any };

    const variablesManager = new VariablesManager(codeDescription.requestedVariables);
    const fn = new AsyncFunction("VariablesManager", "libs", codeDescription.code);

    await fn(variablesManager, { dayjs: dayjs });

    const result: CodeResultDescription = {
      updatedVariables: variablesManager.newValues,
    };

    return result;
  }
}
