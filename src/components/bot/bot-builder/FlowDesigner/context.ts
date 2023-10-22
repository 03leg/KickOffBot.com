/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";
import { type FlowDesignerContextDescription } from "./types";

export const FlowDesignerContext =
  createContext<FlowDesignerContextDescription>({
    selectedBlock: null,
    selectedElement: null,
    setSelectedBlock: () => {},
    setSelectedElement: () => {},
  });
