import {
  BotProject,
  BotVariable,
  ChangeBooleanVariableWorkflowStrategy,
  FlowDesignerLink,
  FlowDesignerUIBlockDescription,
  NOW_DATE_TIME_VARIABLE_NAME,
  PortType,
  UIElement,
  VariableConverter,
  VariableType,
} from '@kickoffbot.com/types';
import { isNil, isPlainObject } from 'lodash';
import { Parser } from 'expr-eval';
import { WebUserContext } from './WebUserContext';
import * as moment from 'moment';
import { LogService } from './log/LogService';

export class WebBotRuntimeUtils {
  private _botProject: BotProject;
  private _logService: LogService;

  public constructor(project: BotProject, logService: LogService) {
    this._logService = logService;
    this._botProject = project;
  }

  public getLinkByBlockId(linkId: string): FlowDesignerLink {
    const currentLink = this._botProject.links.find(
      (l) => l.output.blockId === linkId || l.input.blockId === linkId,
    );

    if (isNil(currentLink)) {
      return null;
    }

    return currentLink;
  }

  public getBlockById(blockId: string): FlowDesignerUIBlockDescription {
    const currentBlock = this._botProject.blocks.find(
      (block) => block.id === blockId,
    );

    if (isNil(currentBlock)) {
      this._logService.error(`Could not find block by id`);
      return null;
    }

    return currentBlock;
  }

  private static parseConverterParams(input: string): (string | number)[] {
    const result: (string | number)[] = [];
    const regex = /(".*?"|[^,]+)/g;
    const matches = input.match(regex);

    if (matches) {
      for (const match of matches) {
        const trimmed = match.trim();
        // Check if the match is a number or a quoted string
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          result.push(trimmed.slice(1, -1)); // Remove quotes
        } else {
          const numberValue = Number(trimmed);
          if (!isNaN(numberValue)) {
            result.push(numberValue);
          } else {
            result.push(trimmed); // In case of unexpected values
          }
        }
      }
    }

    return result;
  }

  private getVariableValue(text: string, userContext: WebUserContext): string {
    const parsedArray = text.split('|') as [string, string];
    const converterPart: string | undefined = parsedArray[1] as
      | VariableConverter
      | undefined;
    let converter: VariableConverter | undefined = undefined;
    let converterParams: (string | number)[] | undefined = undefined;

    if (converterPart) {
      const paramsStartIndex = converterPart.indexOf('(');
      const paramsEndIndex = converterPart.indexOf(')');
      if (paramsStartIndex > 0 && paramsEndIndex > 0 && paramsEndIndex) {
        converter = converterPart.slice(
          0,
          paramsStartIndex,
        ) as VariableConverter;

        const paramsString = converterPart.slice(
          paramsStartIndex + 1,
          paramsEndIndex,
        );

        converterParams = WebBotRuntimeUtils.parseConverterParams(paramsString);
      } else {
        converter = converterPart as VariableConverter;
      }
    }

    const variablePathArray = parsedArray[0].split('.') as [string, string];
    const variableName = variablePathArray[0];
    const path = variablePathArray[1];

    if (variableName === NOW_DATE_TIME_VARIABLE_NAME) {
      return this.getCurrentDateTime(converter, converterParams);
    }

    if (path ?? converter) {
      const variableValue = userContext.getVariableValueByName(variableName);

      const variableMetaData = this._botProject.variables.find(
        (v) => v.name === variableName,
      );

      if (isPlainObject(variableValue)) {
        if (path in (variableValue as Record<string, unknown>)) {
          return (variableValue as Record<string, string>)[path] ?? '';
        } else {
          // path does not exist in object
          return '';
        }
      } else if (variableValue instanceof Array) {
        if (isNil(converter)) {
          // TODO: return empty string and add it to service messages
          return 'We cannot convert an array to a string';
        }

        if (isNil(variableValue)) {
          // TODO: return empty string and add it to service messages
          return 'We cannot convert an empty array to a string';
        }

        if (variableMetaData?.arrayItemType === VariableType.OBJECT) {
          if (VariableConverter.COUNT === converter) {
            return variableValue.length.toString();
          }

          if (isNil(path)) {
            this._logService.error(
              `Cannot convert an array of objects to a string without a path`,
            );
            return '';
          }

          const valueForArrayOfObjects =
            WebBotRuntimeUtils.getValueForArrayOfNumbersOrString(
              this._logService,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              variableValue.map((v: any) => v[path] as number),
              converter,
              converterParams,
            );

          return valueForArrayOfObjects.toString();
        } else if (
          variableMetaData?.arrayItemType === VariableType.NUMBER ||
          variableMetaData?.arrayItemType === VariableType.STRING
        ) {
          const valueForArrayOfNumbers =
            WebBotRuntimeUtils.getValueForArrayOfNumbersOrString(
              this._logService,
              variableValue as number[],
              converter,
              converterParams,
            );
          return valueForArrayOfNumbers.toString();
        }

        return text;
      } else if (
        typeof variableValue === 'string' &&
        !isNil(variableMetaData.dateTimeFormat) &&
        variableMetaData.type === VariableType.DATE_TIME &&
        converter === VariableConverter.FORMAT &&
        converterParams.length === 1
      ) {
        return moment(variableValue, variableMetaData.dateTimeFormat).format(
          converterParams[0] as string,
        );
      } else {
        return variableValue as string;
      }
    }

    return userContext.getVariableValueByName(text) as string;
  }

  private getCurrentDateTime(
    converter: VariableConverter,
    converterParams: (string | number)[],
  ): string {
    if (converter === 'format' && converterParams.length === 1) {
      const format = converterParams[0] as string;
      return moment().format(format);
    }

    return moment().format();
  }

  private static getValueForArrayOfNumbersOrString(
    logService: LogService,
    arrayOfItems: number[],
    converter: VariableConverter,
    converterParams?: (string | number)[],
  ): number | string {
    switch (converter) {
      case VariableConverter.SUM: {
        const v = arrayOfItems.reduce(
          (partialSum: number, a: number) => partialSum + a,
          0,
        );
        return Math.ceil(v * 100) / 100;
      }
      case VariableConverter.AVG: {
        const v =
          arrayOfItems.reduce(
            (partialSum: number, a: number) => partialSum + a,
            0,
          ) / arrayOfItems.length;
        return Math.ceil(v * 100) / 100;
      }
      case VariableConverter.MAX: {
        return Math.max(...arrayOfItems);
      }
      case VariableConverter.MIN: {
        return Math.min(...arrayOfItems);
      }
      case VariableConverter.COUNT: {
        return arrayOfItems.length;
      }
      case VariableConverter.RANDOM: {
        return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
      }
      case VariableConverter.CONCAT: {
        const separator = (converterParams?.[0] as string) ?? ', ';

        return arrayOfItems
          .map((v) => v.toString())
          .join(separator)
          .toString();
      }
      default: {
        logService.error(
          `InvalidOperationError: converter ${converter} is not supported. Returning empty string`,
        );
        return '';
      }
    }
  }

  public getTextForContextObject(
    contextObject: unknown,
    template: string,
    index: number,
  ): string {
    const getParsedTemplate = (
      textArgument: string,
      matches1: IterableIterator<RegExpExecArray | RegExpMatchArray>,
    ) => {
      for (const m of matches1) {
        const property = m[1]!;
        let content = '';

        if (property === 'index') {
          content = (index + 1).toString();
        } else if (isPlainObject(contextObject)) {
          content = (contextObject as Record<string, string>)[property] ?? '';
        } else if (
          (m[0] === '<%value%>' || m[0] === '&lt;%value%&gt;') &&
          ['string', 'number', 'boolean'].includes(typeof contextObject)
        ) {
          content = contextObject as string;
        }

        textArgument = textArgument.replace(m[0], content);
      }

      return textArgument;
    };

    let result = getParsedTemplate(template, template.matchAll(/<%(.*?)%>/g));
    result = getParsedTemplate(result, result.matchAll(/&lt;%(.*?)%&gt;/g));

    return result;
  }

  private getTemplateValue(
    templateName: string,
    userContext: WebUserContext,
  ): string {
    const defaultResult = '';

    this._logService.debug(`Get template value ${templateName}`);

    const template = (this._botProject.templates ?? []).find(
      (t) => t.name === templateName,
    );

    if (isNil(template)) {
      this._logService.error(`Template ${templateName} not found`);
      return defaultResult;
    }

    const variableName = this._botProject.variables.find(
      (v) => v.id === template.contextVariableId,
    )?.name;

    if (isNil(variableName)) {
      this._logService.error(
        `Variable ${template.contextVariableId} not found`,
      );
      return defaultResult;
    }

    const arrayItems = userContext.getVariableValueByName(
      variableName,
    ) as unknown[];
    let result = '';

    this._logService.debug(`Template items count = ${arrayItems.length} `);

    for (let index = 0; index < arrayItems.length; index++) {
      const item = arrayItems[index];
      const itemText = this.getTextForContextObject(
        item,
        template.htmlContent ?? '',
        index,
      );
      result += this.getParsedText(itemText, userContext);
    }

    if (arrayItems.length === 0 && template.showContentWhenArrayIsEmpty) {
      this._logService.debug(`Show template content when array is empty`);
      result = this.getParsedText(
        template.emptyArrayHtmlContent ?? defaultResult,
        userContext,
      );
    }

    return result;
  }

  private parseVariables(text: string, userContext: WebUserContext) {
    const variableMatches1 = text.matchAll(/&lt;%variables.(.*?)%&gt;/g);
    for (const m of variableMatches1) {
      const value = this.getVariableValue(m[1]!, userContext);
      text = text.replace(m[0], value);
    }

    const variableMatches2 = text.matchAll(/<%variables.(.*?)%>/g);
    for (const m of variableMatches2) {
      const value = this.getVariableValue(m[1]!, userContext);

      text = text.replace(m[0], value);
    }

    return text;
  }

  private parseTemplates(text: string, userContext: WebUserContext) {
    const templateMatches1 = text.matchAll(/&lt;%templates.(.*?)%&gt;/g);
    for (const m of templateMatches1) {
      const value = this.getTemplateValue(m[1]!, userContext);
      text = text.replace(m[0], value);
    }

    const templateMatches2 = text.matchAll(/<%templates.(.*?)%>/g);
    for (const m of templateMatches2) {
      const value = this.getTemplateValue(m[1]!, userContext);

      text = text.replace(m[0], value);
    }

    return text;
  }

  getParsedText(text: string, userContext: WebUserContext): string {
    if (text === undefined) {
      return undefined;
    }

    let result = this.parseTemplates(text, userContext);

    result = this.parseVariables(result, userContext);

    return result;
  }

  getParsedPropertyTemplate(
    template: string,
    value: Record<string, string>,
    userContext: WebUserContext,
  ): string {
    // debugger;
    let text = this.parseVariables(template, userContext);

    const matches1 = text.matchAll(/<%(.*?)%>/g);

    for (const m of matches1) {
      let content = value[m[1]!] ?? '';
      if (m[1] === 'value') {
        // TODO: when value is item from array ["string1", "string2"], [1,2,3] etc.
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        content = value.toString();
      }
      text = text.replace(m[0], content);
    }

    return text;
  }

  public getLinkFromBlock(
    block: FlowDesignerUIBlockDescription,
  ): FlowDesignerLink | null {
    const currentLink = this._botProject.links.find(
      (l) => l.output.blockId === block.id && l.output.type === PortType.BLOCK,
    );

    if (isNil(currentLink)) {
      return null;
    }

    return currentLink;
  }

  public getVariableById(variableId: string): BotVariable | null {
    const currentVariable = this._botProject.variables.find(
      (v) => v.id === variableId,
    );

    if (isNil(currentVariable)) {
      this._logService.error("Variable not found. It's very bad! 😰");
      return null;
    }

    return currentVariable;
  }

  getNumberValueFromExpression(
    expression: string,
    userContext: WebUserContext,
  ): number | null {
    try {
      const parsedExpression = this.getParsedText(expression, userContext);
      const result = Parser.evaluate(parsedExpression);

      if (typeof result === 'number') {
        return result;
      }
    } catch (e) {
      console.log('getNumberValueFromExpression', e);
    }

    return null;
  }

  getStringValueFromExpression(
    expression: string,
    userContext: WebUserContext,
  ): string | null {
    try {
      const result = this.getParsedText(expression, userContext);

      if (typeof result === 'string') {
        return result;
      }
    } catch (e) {
      console.log('getStringValueFromExpression', e);
    }

    return null;
  }

  getBooleanValue(
    strategy: ChangeBooleanVariableWorkflowStrategy,
    variable: BotVariable,
    userContext: WebUserContext,
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
            variable.name,
          );

          if (typeof currentValue === 'boolean') {
            return !currentValue;
          }

          break;
        }
      }
    } catch (e) {
      console.log('getBooleanValue', e);
    }

    return null;
  }

  public getElementById(elementId: string): UIElement {
    const elements = this._botProject.blocks.map((e) => e.elements).flat(1);
    const currentElement = elements.find((e) => e.id === elementId);

    if (isNil(currentElement)) {
      this._logService.error('Could not find element by id');
    }

    return currentElement;
  }

  public static convertStringSheetCellValue(
    cellValue: string,
    sampleValue: unknown,
  ): unknown {
    try {
      switch (typeof sampleValue) {
        case 'boolean': {
          if (
            cellValue.toUpperCase() === 'TRUE' ||
            cellValue.toUpperCase() === 'YES' ||
            cellValue.toUpperCase() === '1'
          ) {
            return true;
          }

          return false;
        }
        case 'number': {
          return Number(cellValue.replace(',', '.'));
        }
      }
    } catch {}

    return cellValue;
  }
}
