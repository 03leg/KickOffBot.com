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
      this._variables.set(botVariable.name, botVariable.value);
    }
  }

  public updateTelegramVariableBasedOnMessage(
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  ) {
    this._variables.set("user_id", context.message.from.id);
    this._variables.set("user_first_name", context.message.from.first_name);
    this._variables.set("user_last_name", context.message.from.last_name);
    this._variables.set("user_name", context.message.from.username);
    this._variables.set(
      "user_language_code",
      context.message.from.language_code
    );
  }

  public setNextStep(nextStep: NextBotStep | null) {
    // console.log("next step", nextStep);
    this._nextStep = nextStep;
  }

  public updateVariable(name: string, newValue: string | number | boolean) {
    this._variables.set(name, newValue);
  }

  public getVariableValueByName(name: string): string {
    const result = this._variables.get(name);

    if (isNil(result)) {
      return `Variable '${name}' not found`;
    }

    return result as string;
  }
}
