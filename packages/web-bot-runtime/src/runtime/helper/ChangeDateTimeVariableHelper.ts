import {
  ChangeVariableUIElement,
  ChangeDateTimeVariableWorkflow,
  ChangeDateTimeVariableOperation,
  TimeDurationUnit,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from '../WebBotRuntimeUtils';
import { WebUserContext } from '../WebUserContext';
import * as moment from 'moment';
import { LogService } from '../log/LogService';

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
    logService: LogService,
  ) {
    const workflow =
      element.workflowDescription as ChangeDateTimeVariableWorkflow;

    let newValue = null;
    const sourceVariable = utils.getVariableById(element.selectedVariableId);

    if (sourceVariable === null) {
      logService.error('Could not find variable for updating. Skipping...');
      return null;
    }

    switch (workflow.operation) {
      case ChangeDateTimeVariableOperation.SET_NEW_VALUE: {
        const valueString = utils.getParsedText(workflow.newValue, userContext);

        newValue = moment(valueString).format(sourceVariable.dateTimeFormat);
        break;
      }

      case ChangeDateTimeVariableOperation.REMOVE_DURATION:
      case ChangeDateTimeVariableOperation.ADD_DURATION: {
        const durationText = utils.getParsedText(
          workflow.duration,
          userContext,
        );
        const durationNumber = Number(durationText);
        const variableCurrentValue = userContext.getVariableValueByName(
          sourceVariable.name,
        ) as string;

        if (isNaN(durationNumber)) {
          logService.error(
            `DurationNumber is not a number. Value is "${durationText}" and it's not parsable to number. It does not support in this operation (${workflow.operation}). Skipping...`,
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
        logService.error(
          `Service does not support this operation (${workflow.operation}). Skipping...`,
        );
      }
    }

    return newValue;
  }
}
