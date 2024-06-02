import { BotVariable, VariableConverter } from "@kickoffbot.com/types";
import { isNil } from "lodash";
import React, { useCallback } from "react";
import { getTextVariableReference } from "~/components/bot/bot-builder/utils";

export function useInsertVariableToText(value: string, onChangeValue: (value: string) => void) {
  const [selectionStart, setSelectionStart] = React.useState<number>();
  const inputRef = React.useRef<HTMLInputElement>();

  const updateSelectionStart = () => {
    if (!isNil(inputRef.current) && !isNil(inputRef.current.selectionStart)) {
      setSelectionStart(inputRef.current.selectionStart);
    }
  };

  const handleInsertVariable = useCallback(
    (variable: BotVariable, path?: string, converter?: VariableConverter) => {
      let position = selectionStart;
      const content = value ?? "";

      if (isNil(position)) {
        position = content.length;
      }
      
      const output = [
        content.slice(0, position),
        getTextVariableReference(variable, path, converter),
        content.slice(position),
      ].join("");

      onChangeValue(output);
    },
    [onChangeValue, selectionStart, value]
  );

  return { handleInsertVariable, inputRef, updateSelectionStart };
}
