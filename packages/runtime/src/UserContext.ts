import { Message, Update } from "telegraf/typings/core/types/typegram";
import { NarrowedContext, Context } from "telegraf";
import { isNil } from "lodash";
import { BotProject, BotVariable } from "@kickoffbot.com/types";

export interface NextBotStep {
  blockId: string;
  elementId: string;
}

export class UserContext {
  private _variables = new Map<string, unknown>();
  private _nextStep: NextBotStep | null = null;

  public get nextStep(): NextBotStep | null {
    return this._nextStep;
  }

  constructor(project: BotProject) {
    this.initVariables(project.variables);
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

  public updateTelegramVariableBasedOnMessage(context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    this._variables.set("user_id", context.message.from.id);
    this._variables.set("user_first_name", context.message.from.first_name);

    if (!isNil(context.message.from.last_name)) {
      this._variables.set("user_last_name", context.message.from.last_name);
    }
    if (!isNil(context.message.from.username)) {
      this._variables.set("username", context.message.from.username);
    }
    if (!isNil(context.message.from.language_code)) {
      this._variables.set("user_language_code", context.message.from.language_code);
    }
    if (!isNil(context.message.from.is_premium)) {
      this._variables.set("is_premium", context.message.from.is_premium);
    }
  }

  public setNextStep(nextStep: NextBotStep | null) {
    // console.log("next step", nextStep);
    this._nextStep = nextStep;
  }

  public updateVariable(name: string, newValue: string | number | boolean | unknown[] | object) {
    this._variables.set(name, newValue);
  }

  public getVariableValueByName(name: string): string | number | boolean | unknown[] | Record<string, unknown> {
    const result = this._variables.get(name);

    if (isNil(result)) {
      return `Variable '${name}' not found`;
    }

    return result as string;
  }
}
