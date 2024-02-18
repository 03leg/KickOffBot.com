import { ConditionOperator } from "@kickoffbot.com/types";
import { throwIfNil } from "~/utils/guard";

export function getConditionOperatorLabelByType(operator: ConditionOperator) {
  const result = [];

  result.push({ id: ConditionOperator.EQUAL_TO, label: "EQUAL TO" });
  result.push({ id: ConditionOperator.NOT_EQUAL_TO, label: "NOT EQUAL TO" });
  result.push({ id: ConditionOperator.GREATER_THAN, label: "GREATER THAN" });
  result.push({ id: ConditionOperator.LESS_THAN, label: "LESS THAN" });
  result.push({ id: ConditionOperator.CONTAINS, label: "CONTAINS" });
  result.push({
    id: ConditionOperator.DOES_NOT_CONTAIN,
    label: "DOES NOT CONTAIN",
  });
  result.push({ id: ConditionOperator.IS_EMPTY, label: "IS EMPTY" });
  result.push({ id: ConditionOperator.STARTS_WITH, label: "STARTS WITH" });
  result.push({ id: ConditionOperator.END_WITH, label: "END WITH" });
  result.push({ id: ConditionOperator.MATCHES_REGEX, label: "MATCHES REGEX" });
  result.push({
    id: ConditionOperator.DOES_NOT_MATCHES_REGEX,
    label: "DOES NOT MATCHES REGEX",
  });

  const label = result.find((o) => o.id === operator)?.label;

  throwIfNil(label);

  return label;
}
