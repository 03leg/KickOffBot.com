import { isNil } from "lodash";
import React, { useCallback } from "react";
import { getTextPropertyReference } from "~/components/bot/bot-builder/utils";

export function useInsertPropertyToText(value: string, onChangeValue: (value: string) => void) {
  const [selectionStart, setSelectionStart] = React.useState<number>();
  const inputRef = React.useRef<HTMLInputElement>();

  const updateSelectionStart = () => {
    if (!isNil(inputRef.current) && !isNil(inputRef.current.selectionStart)) {
      setSelectionStart(inputRef.current.selectionStart);
    }
  };

  const handleInsertProperty = useCallback(
    (property: string) => {
      let position = selectionStart;
      const content = value ?? "";

      if (isNil(position)) {
        position = content.length;
      }
      
      const output = [
        content.slice(0, position),
        getTextPropertyReference(property),
        content.slice(position),
      ].join("");

      onChangeValue(output);
    },
    [onChangeValue, selectionStart, value]
  );

  return { handleInsertProperty, inputRef, updateSelectionStart };
}
