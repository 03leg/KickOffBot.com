import {
  AvailableDateTimes,
  ButtonsRequestElement,
  DataSourceType,
  DateTimeRequestElement,
  ElementType,
  EmailRequestElement,
  MultipleChoiceOptionDescription,
  MultipleChoiceRequestElement,
  NumberRequestElement,
  OpinionScaleRequestElement,
  PhoneRequestElement,
  RatingRequestElement,
  RequestElementBase,
  TextRequestElement,
  UIElement,
  WebInputButtonsUIElement,
  WebInputDateTimeUIElement,
  WebInputEmailUIElement,
  WebInputNumberUIElement,
  WebInputPhoneUIElement,
  WebInputTextUIElement,
  WebMultipleChoiceUIElement,
  WebOpinionScaleUIElement,
  WebRatingUIElement,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { WebUserContext } from './WebUserContext';
import { RequestButtonsManager } from './RequestButtonsManager';
import { LogService } from './log/LogService';

export class RequestElementConverter {
  constructor(
    private _utils: WebBotRuntimeUtils,
    private _userContext: WebUserContext,
    private _logService: LogService,
  ) {}

  public getRequestElement(typedElement: UIElement): RequestElementBase {
    switch (typedElement.type) {
      case ElementType.WEB_INPUT_TEXT: {
        return RequestElementConverter.getTextInputElement(
          typedElement as WebInputTextUIElement,
        );
      }
      case ElementType.WEB_INPUT_NUMBER: {
        return RequestElementConverter.getNumberInputElement(
          typedElement as WebInputNumberUIElement,
        );
      }
      case ElementType.WEB_INPUT_DATE_TIME: {
        return this.getDateTimeInputElement(
          typedElement as WebInputDateTimeUIElement,
        );
      }
      case ElementType.WEB_INPUT_PHONE: {
        return RequestElementConverter.getPhoneInputElement(
          typedElement as WebInputPhoneUIElement,
        );
      }
      case ElementType.WEB_INPUT_EMAIL: {
        return RequestElementConverter.getEmailInputElement(
          typedElement as WebInputEmailUIElement,
        );
      }
      case ElementType.WEB_INPUT_BUTTONS: {
        return this.getButtonsInputElement(
          typedElement as WebInputButtonsUIElement,
        );
      }
      case ElementType.WEB_OPINION_SCALE: {
        return this.getOpinionScaleInputElement(
          typedElement as WebOpinionScaleUIElement,
        );
      }
      case ElementType.WEB_RATING: {
        return this.getRatingInputElement(typedElement as WebRatingUIElement);
      }
      case ElementType.WEB_MULTIPLE_CHOICE: {
        return this.getMultipleChoiceInputElement(
          typedElement as WebMultipleChoiceUIElement,
        );
      }
      default:
        throw new Error('Unsupported element type');
    }
  }

  public getDateTimeInputElement(
    element: WebInputDateTimeUIElement,
  ): DateTimeRequestElement {
    const result: DateTimeRequestElement = {
      elementType: ElementType.WEB_INPUT_DATE_TIME,
      useTime: element.useTime,
      dateTimeFormat: element.dateTimeFormat,
      maxTime: element.maxTime,
      minTime: element.minTime,
      minutesStep: element.minutesStep,
      useAmPm: element.useAmPm,
      availableDateTimes: element.availableDateTimes,
      maxDate: element.maxDate,
      minDate: element.minDate,
      disableDaysOfWeek: element.disableDaysOfWeek,
      disabledDaysOfWeek: element.disabledDaysOfWeek,
    };

    if (
      element.availableDateTimesVariableId &&
      result.availableDateTimes === AvailableDateTimes.DatesFromVariable
    ) {
      const variable = this._utils.getVariableById(
        element.availableDateTimesVariableId,
      );
      if (variable === null) {
        this._logService.error(
          'Could not find variable with available date times.',
        );
      } else {
        const availableDatesVariableValue =
          this._userContext.getVariableValueByName(variable.name) as string[];

        if (Array.isArray(availableDatesVariableValue)) {
          result.variableAvailableDateTimes = availableDatesVariableValue;
        } else {
          this._logService.error(
            `Available dates variable value is not an array. It's not supported.`,
          );
        }
      }
    }

    if (
      element.disabledDatesVariableId &&
      result.availableDateTimes !== AvailableDateTimes.DatesFromVariable
    ) {
      const variable = this._utils.getVariableById(
        element.disabledDatesVariableId,
      );
      if (variable === null) {
        this._logService.error('Could not find variable with disabled dates.');
      } else {
        const disabledDatesVariableValue =
          this._userContext.getVariableValueByName(variable.name) as string[];

        if (Array.isArray(disabledDatesVariableValue)) {
          result.disabledDates = disabledDatesVariableValue;
        } else {
          this._logService.error(
            `Disabled dates variable value is not an array. It's not supported.`,
          );
        }
      }
    }

    if (
      element.disabledTimesVariableId &&
      result.availableDateTimes !== AvailableDateTimes.DatesFromVariable
    ) {
      const variable = this._utils.getVariableById(
        element.disabledTimesVariableId,
      );
      if (variable === null) {
        this._logService.error('Could not find variable with disabled times.');
      } else {
        const disabledTimesVariableValue =
          this._userContext.getVariableValueByName(variable.name) as string[];

        if (Array.isArray(disabledTimesVariableValue)) {
          result.disabledTimes = disabledTimesVariableValue;
        } else {
          this._logService.error(
            `Disabled times variable value is not an array. It's not supported.`,
          );
        }
      }
    }

    if (
      element.disabledDateAndTimesVariableId &&
      result.availableDateTimes !== AvailableDateTimes.DatesFromVariable
    ) {
      const variable = this._utils.getVariableById(
        element.disabledDateAndTimesVariableId,
      );
      if (variable === null) {
        this._logService.error(
          'Could not find variable with disabled date and times.',
        );
      } else {
        const disabledDateAndTimesVariableValue =
          this._userContext.getVariableValueByName(variable.name) as string[];

        if (Array.isArray(disabledDateAndTimesVariableValue)) {
          result.disabledDateAndTimes = disabledDateAndTimesVariableValue;
        } else {
          this._logService.error(
            `Disabled date and times variable value is not an array. It's not supported.`,
          );
        }
      }
    }

    if (
      element.parkTimeVariableId &&
      (element.maxDate ||
        (element.maxTime && element.useTime) ||
        element.availableDateTimes === AvailableDateTimes.FutureDates ||
        element.availableDateTimes === AvailableDateTimes.FutureDatesAndToday)
    ) {
      const variable = this._utils.getVariableById(element.parkTimeVariableId);
      if (variable === null) {
        this._logService.error('Could not find variable with park time.');
      } else {
        let parkTimeVariableValue = this._userContext.getVariableValueByName(
          variable.name,
        ) as number;

        if (typeof parkTimeVariableValue === 'string') {
          parkTimeVariableValue = Number(parkTimeVariableValue);
        }

        if (
          typeof parkTimeVariableValue === 'number' &&
          !isNaN(parkTimeVariableValue)
        ) {
          result.parkTime = parkTimeVariableValue;
          result.parkTimeType = element.parkTimeType;
        } else {
          this._logService.error(
            `Could not parse variable value as number: ${parkTimeVariableValue} (${typeof parkTimeVariableValue}).`,
          );
        }
      }
    }

    return result;
  }

  private static getTextInputElement(
    element: WebInputTextUIElement,
  ): TextRequestElement {
    const result: TextRequestElement = {
      elementType: ElementType.WEB_INPUT_TEXT,
      placeholder: element.placeholder,
      multiline: element.multiline,
    };

    return result;
  }

  private static getNumberInputElement(
    element: WebInputNumberUIElement,
  ): NumberRequestElement {
    const result: NumberRequestElement = {
      elementType: ElementType.WEB_INPUT_NUMBER,
      placeholder: element.placeholder,
      min: element.min,
      max: element.max,
      step: element.step,
    };

    return result;
  }

  private static getPhoneInputElement(
    element: WebInputPhoneUIElement,
  ): PhoneRequestElement {
    const result: PhoneRequestElement = {
      elementType: ElementType.WEB_INPUT_PHONE,
      defaultCountry: element.defaultCountry,
    };

    return result;
  }

  private static getEmailInputElement(
    element: WebInputEmailUIElement,
  ): RequestElementBase {
    const result: EmailRequestElement = {
      elementType: ElementType.WEB_INPUT_EMAIL,
      placeholder: element.placeholder,
    };

    return result;
  }

  getButtonsInputElement(
    element: WebInputButtonsUIElement,
  ): RequestElementBase {
    const result: ButtonsRequestElement = {
      elementType: ElementType.WEB_INPUT_BUTTONS,
      buttons: RequestButtonsManager.getButtonsForMessage(
        this._userContext,
        element.id,
        element,
        this._utils,
        this._logService,
      ),
    };

    return result;
  }

  getOpinionScaleInputElement(
    element: WebOpinionScaleUIElement,
  ): RequestElementBase {
    const result: OpinionScaleRequestElement = {
      elementType: ElementType.WEB_OPINION_SCALE,

      min: element.min,
      max: element.max,
      defaultAnswer: element.defaultAnswer,

      showLabels: element.showLabels,
      minLabel: element.minLabel,
      maxLabel: element.maxLabel,

      showLabelsMode: element.showLabelsMode,
      eachOptionLabel: element.eachOptionLabel,
    };

    return result;
  }

  getRatingInputElement(element: WebRatingUIElement): RequestElementBase {
    const result: RatingRequestElement = {
      elementType: ElementType.WEB_RATING,

      elementCount: element.elementCount,
      defaultAnswer: element.defaultAnswer,

      showLabels: element.showLabels,
      eachOptionLabel: element.eachOptionLabel,

      precision: element.precision,
      view: element.view,
    };

    return result;
  }

  getMultipleChoiceInputElement(
    element: WebMultipleChoiceUIElement,
  ): RequestElementBase {
    let result: MultipleChoiceRequestElement | null = null;

    let options: MultipleChoiceOptionDescription[] = [];
    let selectedOptions: string[] = [];

    if (element.dataSourceType === DataSourceType.Static) {
      options = this._utils
        .getParsedText(element.optionsText, this._userContext)
        .split('\n')
        .filter((option) => option !== '')
        .map((option) => ({
          title: option,
          value: option,
          autoId: option,
        }));

      if (element.defaultOptionsVariableId) {
        const variable = this._utils.getVariableById(
          element.defaultOptionsVariableId,
        );
        if (variable === null) {
          this._logService.error(
            'Could not find variable with default options.',
          );
        } else {
          const defaultOptionsVariableValue =
            this._userContext.getVariableValueByName(variable.name) as string[];
          if (Array.isArray(defaultOptionsVariableValue)) {
            selectedOptions = defaultOptionsVariableValue;
          } else {
            this._logService.error(
              "Could not parse variable value as array for default options. It's not supported.",
            );
          }
        }
      } else if (Array.isArray(element.defaultOptions)) {
        selectedOptions = element.defaultOptions;
      }
    } else if (element.dataSourceType === DataSourceType.Dynamic) {
      const dataSourceVariable = this._utils.getVariableById(
        element.dataSourceVariableId,
      );

      if (dataSourceVariable === null) {
        this._logService.error('Could not find variable with data source.');
      } else {
        const dataSourceVariableValue =
          this._userContext.getVariableValueByName(dataSourceVariable.name);

        if (Array.isArray(dataSourceVariableValue)) {
          for (let i = 0; i < dataSourceVariableValue.length; i++) {
            const optionValue = this._utils.getTextForContextObject(
              dataSourceVariableValue[i],
              element.optionValue,
              i,
            );

            let optionTitle = optionValue;

            if (element.optionTitle) {
              optionTitle = this._utils.getTextForContextObject(
                dataSourceVariableValue[i],
                element.optionTitle,
                i,
              );
            }

            options.push({
              title: optionTitle,
              value: optionValue,
              autoId: i.toString(),
            });
          }
        } else {
          this._logService.error(
            `Could not parse variable ${dataSourceVariable.name} value as array for data source. It's not supported.`,
          );
        }

        if (element.defaultOptionsVariableId) {
          const variable = this._utils.getVariableById(
            element.defaultOptionsVariableId,
          );
          if (variable === null) {
            this._logService.error(
              'Could not find variable with default options.',
            );
          } else {
            const defaultOptionsVariableValue =
              this._userContext.getVariableValueByName(
                variable.name,
              ) as string[];
            if (Array.isArray(defaultOptionsVariableValue)) {
              if (
                defaultOptionsVariableValue.length > 0 &&
                typeof defaultOptionsVariableValue[0] === 'object'
              ) {
                selectedOptions = defaultOptionsVariableValue.map(
                  (o, index) => {
                    const optionValue = this._utils.getTextForContextObject(
                      o,
                      element.optionValue,
                      index,
                    );
                    return optionValue;
                  },
                );
              } else {
                selectedOptions = defaultOptionsVariableValue;
              }
            } else {
              this._logService.error(
                `Could not parse variable ${variable.name} value as array for data source. It's not supported.`,
              );
            }
          }
        }
      }
    }

    if (element.shuffleOptions) {
      options = options.sort(() => Math.random() - 0.5);
    }

    selectedOptions = selectedOptions
      .map((option) => option.toString())
      .filter((option) => options.some((o) => o.value.toString() === option));

    result = {
      elementType: ElementType.WEB_MULTIPLE_CHOICE,
      options,
      selectedOptions,
    };

    return result;
  }
}
