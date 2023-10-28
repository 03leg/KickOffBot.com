import { type FlowDesignerUIBlockDescription, type UIElement } from "../types";

export interface PositionDescription {
  x: number;
  y: number;
}

export interface TransformDescription extends PositionDescription {
  scale: number;
}

export interface FlowDesignerContextDescription {
  selectedBlock: FlowDesignerUIBlockDescription | null;
  setSelectedBlock: (newBlock: FlowDesignerUIBlockDescription | null) => void;

  selectedElement: UIElement | null;
  setSelectedElement: (newBlock: UIElement | null) => void;
}

export interface FlowDesignerState {
  scale: number;
  changeScale: (newValue: number) => void;
  showTemporaryLink: boolean;
  tempLinkPath: string | null;
  showTempLink: VoidFunction;
  hideTempLink: VoidFunction;
  setTempLinkPath: (value: string) => void;
}
