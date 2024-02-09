import { isNil } from "lodash";

import { UserContext } from "./UserContext";
import { BotProject, BotVariable, FlowDesignerLink, FlowDesignerUIBlockDescription, UIElement } from "@kickoffbot.com/types";

export class MyBotUtils {
  private _botProject: BotProject;

  public setProject(project: BotProject) {
    this._botProject = project;
  }

  public getBlockById(blockId: string): FlowDesignerUIBlockDescription {
    const currentBlock = this._botProject.blocks.find(
      (block) => block.id === blockId
    );

    if (isNil(currentBlock)) {
      throw new Error("InvalidOperationError: block is null");
    }

    return currentBlock;
  }

  public getElementById(elements: UIElement[], elementId: string): UIElement {
    const currentElement = elements.find((e) => e.id === elementId);

    if (isNil(currentElement)) {
      throw new Error("InvalidOperationError: element is null");
    }

    return currentElement;
  }

  public getLinkByBlockId(linkId: string): FlowDesignerLink {
    const currentLink = this._botProject.links.find(
      (l) => l.output.blockId === linkId || l.input.blockId === linkId
    );

    if (isNil(currentLink)) {
      throw new Error("InvalidOperationError: link is null");
    }

    return currentLink;
  }

  public getVariableById(variableId: string): BotVariable {
    const currentVariable = this._botProject.variables.find(
      (v) => v.id === variableId
    );

    if (isNil(currentVariable)) {
      throw new Error("InvalidOperationError: variable is null");
    }

    return currentVariable;
  }

  getMessage(telegramContent: string, userContext: UserContext): string {
    const matches1 = telegramContent.matchAll(/&lt;%variables.(.*?)%&gt;/g);
    for (const m of matches1) {
      const value = userContext.getVariableValueByName(m[1]);
      telegramContent = telegramContent.replace(m[0], value);
    }

    const matches2 = telegramContent.matchAll(/<%variables.(.*?)%>/g);
    for (const m of matches2) {
      const value = userContext.getVariableValueByName(m[1]);
      telegramContent = telegramContent.replace(m[0], value);
    }

    return telegramContent;
  }
}
