import { BotVariable } from "@kickoffbot.com/types";
import { isNil } from "lodash";
import React, { useCallback } from "react";
import { getTextVariableReference } from "~/components/bot/bot-builder/utils";

export function useInsertVariableToText([value, setValue]: [
  string,
  React.Dispatch<React.SetStateAction<string>> | ((newValue: string) => void)
]) {
  const [selectionStart, setSelectionStart] = React.useState<number>();
  const inputRef = React.useRef<HTMLInputElement>();

  const updateSelectionStart = () => {
    if (!isNil(inputRef.current) && !isNil(inputRef.current.selectionStart)) {
      setSelectionStart(inputRef.current.selectionStart);
    }
  };

  const handleInsertVariable = useCallback(
    (variable: BotVariable) => {
      let position = selectionStart;
      const content = value ?? "";

      if (isNil(position)) {
        position = content.length;
      }
      
      const output = [
        content.slice(0, position),
        getTextVariableReference(variable),
        content.slice(position),
      ].join("");

      setValue(output);
    },
    [selectionStart, setValue, value]
  );

  return { handleInsertVariable, inputRef, updateSelectionStart };
}
