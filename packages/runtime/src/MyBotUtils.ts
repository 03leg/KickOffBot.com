import { isNil } from "lodash";

import { UserContext } from "./UserContext";
import {
  BotProject,
  BotVariable,
  ChangeBooleanVariableWorkflowStrategy,
  FlowDesignerLink,
  FlowDesignerUIBlockDescription,
  PortType,
  UIElement,
  VariableType,
} from "@kickoffbot.com/types";
import { Parser } from "expr-eval";

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

  public getLinkFromBlock(
    block: FlowDesignerUIBlockDescription
  ): FlowDesignerLink | null {
    const currentLink = this._botProject.links.find(
      (l) => l.output.blockId === block.id && l.output.type === PortType.BLOCK
    );

    if (isNil(currentLink)) {
      return null;
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

  getParsedText(text: string, userContext: UserContext): string {
    const matches1 = text.matchAll(/&lt;%variables.(.*?)%&gt;/g);
    for (const m of matches1) {
      const value = userContext.getVariableValueByName(m[1]);
      text = text.replace(m[0], value as string);
    }

    const matches2 = text.matchAll(/<%variables.(.*?)%>/g);
    for (const m of matches2) {
      const value = userContext.getVariableValueByName(m[1]);
      text = text.replace(m[0], value as string);
    }

    return text;
  }

  getNumberValueFromExpression(
    expression: string,
    userContext: UserContext
  ): number | null {
    try {
      const parsedExpression = this.getParsedText(expression, userContext);
      const result = Parser.evaluate(parsedExpression);

      if (typeof result === "number") {
        return result;
      }
    } catch {}

    return null;
  }

  getStringValueFromExpression(
    expression: string,
    userContext: UserContext
  ): string | null {
    try {
      const result = this.getParsedText(expression, userContext);

      if (typeof result === "string") {
        return result;
      }
    } catch {}

    return null;
  }

  getBooleanValue(
    strategy: ChangeBooleanVariableWorkflowStrategy,
    variable: BotVariable,
    userContext: UserContext
  ): boolean | null {
    try {
      switch (strategy) {
        case ChangeBooleanVariableWorkflowStrategy.SET_FALSE: {
          return false;
        }
        case ChangeBooleanVariableWorkflowStrategy.SET_TRUE: {
          return true;
        }
        case ChangeBooleanVariableWorkflowStrategy.TOGGLE: {
          const currentValue = userContext.getVariableValueByName(
            variable.name
          );

          if (typeof currentValue === "boolean") {
            return !currentValue;
          }

          break;
        }
      }
    } catch {}

    return null;
  }

  getTypedValueFromText(text: string, type: VariableType) {
    switch (type) {
      case VariableType.STRING: {
        return text;
      }
      case VariableType.NUMBER: {
        const strNumber = text.replace(/\s/g, "");
        let numberResult = Number(strNumber);

        if (Number.isNaN(numberResult)) {
          numberResult = Number(strNumber.replace(",", "."));
        }

        return numberResult;
      }
      default: {
        throw new Error("NotImplementedError");
      }
    }
  }
}
