import {
  AvailableDateTimes,
  ButtonsRequestElement,
  DateTimeRequestElement,
  ElementType,
  EmailRequestElement,
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
  WebOpinionScaleUIElement,
  WebRatingUIElement,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { WebUserContext } from './WebUserContext';
import { RequestButtonsManager } from './RequestButtonsManager';

export class RequestElementConverter {
  constructor(
    private _utils: WebBotRuntimeUtils,
    private _userContext: WebUserContext,
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
    };

    if (
      element.availableDateTimesVariableId &&
      result.availableDateTimes === AvailableDateTimes.DatesFromVariable
    ) {
      const variable = this._utils.getVariableById(
        element.availableDateTimesVariableId,
      );
      const availableDatesVariableValue =
        this._userContext.getVariableValueByName(variable.name) as string[];

      if (Array.isArray(availableDatesVariableValue)) {
        result.variableAvailableDateTimes = availableDatesVariableValue;
      }
    }

    return result;
  }

  private static getTextInputElement(
    element: WebInputNumberUIElement,
  ): TextRequestElement {
    const result: TextRequestElement = {
      elementType: ElementType.WEB_INPUT_TEXT,
      placeholder: element.placeholder,
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
}
