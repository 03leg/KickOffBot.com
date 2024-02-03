/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";
import {
  type BlockReactContext,
  type FlowDesignerContextDescription,
} from "./types";

export const FlowDesignerContext =
  createContext<FlowDesignerContextDescription>({
    selectedBlock: null,
    selectedElement: null,
    setSelectedBlock: () => {},
    setSelectedElement: () => {},
  });

export const FlowDesignerBlockContext = createContext<BlockReactContext>({
  blockElement: null,
});
