import {
  ChangeVariableUIElement,
  ChangeDateTimeVariableWorkflow,
  ChangeDateTimeVariableOperation,
  TimeDurationUnit,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from '../WebBotRuntimeUtils';
import { WebUserContext } from '../WebUserContext';
import * as moment from 'moment';

export class ChangeDateTimeVariableHelper {
  private static getDurationType(durationType: TimeDurationUnit) {
    switch (durationType) {
      case TimeDurationUnit.DAYS:
        return 'days';
      case TimeDurationUnit.MINUTES:
        return 'minutes';
      case TimeDurationUnit.HOURS:
        return 'hours';

      default:
        throw new Error('NotImplementedError: ' + durationType);
    }
  }

  public static getDateTimeValue(
    element: ChangeVariableUIElement,
    userContext: WebUserContext,
    utils: WebBotRuntimeUtils,
  ) {
    const workflow =
      element.workflowDescription as ChangeDateTimeVariableWorkflow;

    let newValue = '';
    const sourceVariable = utils.getVariableById(element.selectedVariableId);

    switch (workflow.operation) {
      case ChangeDateTimeVariableOperation.SET_NEW_VALUE: {
        const valueString = utils.getParsedText(workflow.newValue, userContext);

        newValue = moment(valueString).format(sourceVariable.dateTimeFormat);
        break;
      }

      case ChangeDateTimeVariableOperation.REMOVE_DURATION:
      case ChangeDateTimeVariableOperation.ADD_DURATION: {
        const durationNumber = Number(
          utils.getParsedText(workflow.duration, userContext),
        );
        const variableCurrentValue = userContext.getVariableValueByName(
          sourceVariable.name,
        ) as string;

        if (isNaN(durationNumber)) {
          console.warn(
            `ADD_DURATION or REMOVE_DURATION: durationNumber is not a number`,
          );
          break;
        }

        newValue = moment(variableCurrentValue, sourceVariable.dateTimeFormat)
          .add(
            workflow.operation === ChangeDateTimeVariableOperation.ADD_DURATION
              ? durationNumber
              : -durationNumber,
            this.getDurationType(
              workflow.durationType ?? TimeDurationUnit.MINUTES,
            ),
          )
          .format(sourceVariable.dateTimeFormat);

        break;
      }

      default: {
        throw new Error('NotImplementedError');
      }
    }

    return newValue;
  }
}
