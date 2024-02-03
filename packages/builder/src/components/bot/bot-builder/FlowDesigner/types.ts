import { type FlowDesignerUIBlockDescription, type UIElement } from "@kickoffbot.com/types";


export interface CoordinateDescription {
  top: number;
  left: number;
  height: number;
  width: number;
}



export interface FlowDesignerContextDescription {
  selectedBlock: FlowDesignerUIBlockDescription | null;
  setSelectedBlock: (newBlock: FlowDesignerUIBlockDescription | null) => void;

  selectedElement: UIElement | null;
  setSelectedElement: (newBlock: UIElement | null) => void;
}

export interface BlockReactContext {
  blockElement: React.MutableRefObject<HTMLElement | null> | null;
}
