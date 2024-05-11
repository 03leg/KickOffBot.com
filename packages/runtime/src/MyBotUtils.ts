import { isNil } from "lodash";

import { UserContext } from "./UserContext";
import {
  BotProject,
  BotVariable,
  ButtonPortDescription,
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
    const currentBlock = this._botProject.blocks.find((block) => block.id === blockId);

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
    const currentLink = this._botProject.links.find((l) => l.output.blockId === linkId || l.input.blockId === linkId);

    if (isNil(currentLink)) {
      throw new Error("InvalidOperationError: link is null");
    }

    return currentLink;
  }

  public getLinkForButton(outputBlockId: string, buttonId: string): FlowDesignerLink {
    const currentLink = this._botProject.links.find(
      (l) => l.output.blockId === outputBlockId && (l.output as ButtonPortDescription).buttonId === buttonId
    );

    if (isNil(currentLink)) {
      throw new Error("InvalidOperationError: link is null");
    }

    return currentLink;
  }

  public getLinkFromBlock(block: FlowDesignerUIBlockDescription): FlowDesignerLink | null {
    const currentLink = this._botProject.links.find((l) => l.output.blockId === block.id && l.output.type === PortType.BLOCK);

    if (isNil(currentLink)) {
      return null;
    }

    return currentLink;
  }

  public getVariableById(variableId: string): BotVariable {
    const currentVariable = this._botProject.variables.find((v) => v.id === variableId);

    if (isNil(currentVariable)) {
      throw new Error("InvalidOperationError: variable is null");
    }

    return currentVariable;
  }

  private getValue(text: string, userContext: UserContext): string {
    const arr = text.split(".");
    if (arr.length >= 2) {
      const variableName = arr[0];
      const path = arr[1];

      const variableValue = userContext.getVariableValueByName(variableName);

      if (typeof variableValue === "object" && path in variableValue) {
        return (variableValue as Record<string, string>)[path];
      } else {
        throw new Error("InvalidOperationError: variable value does not contain the path");
      }
    }

    return userContext.getVariableValueByName(text) as string;
  }

  getParsedText(text: string, userContext: UserContext): string {
    const matches1 = text.matchAll(/&lt;%variables.(.*?)%&gt;/g);
    for (const m of matches1) {
      const value = this.getValue(m[1], userContext);
      text = text.replace(m[0], value);
    }

    const matches2 = text.matchAll(/<%variables.(.*?)%>/g);
    for (const m of matches2) {
      const value = this.getValue(m[1], userContext);

      text = text.replace(m[0], value);
    }

    return text;
  }

  getParsedPropertyTemplate(template: string, value: Record<string, string>, userContext: UserContext): string {
    let text = this.getParsedText(template, userContext);

    const matches1 = text.matchAll(/<%(.*?)%>/g);

    for (const m of matches1) {
      const content = value[m[1]] ?? "unknown";
      text = text.replace(m[0], content);
    }

    return text;
  }

  getNumberValueFromExpression(expression: string, userContext: UserContext): number | null {
    try {
      const parsedExpression = this.getParsedText(expression, userContext);
      const result = Parser.evaluate(parsedExpression);

      if (typeof result === "number") {
        return result;
      }
    } catch {}

    return null;
  }

  getStringValueFromExpression(expression: string, userContext: UserContext): string | null {
    try {
      const result = this.getParsedText(expression, userContext);

      if (typeof result === "string") {
        return result;
      }
    } catch {}

    return null;
  }

  getBooleanValue(strategy: ChangeBooleanVariableWorkflowStrategy, variable: BotVariable, userContext: UserContext): boolean | null {
    try {
      switch (strategy) {
        case ChangeBooleanVariableWorkflowStrategy.SET_FALSE: {
          return false;
        }
        case ChangeBooleanVariableWorkflowStrategy.SET_TRUE: {
          return true;
        }
        case ChangeBooleanVariableWorkflowStrategy.TOGGLE: {
          const currentValue = userContext.getVariableValueByName(variable.name);

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
