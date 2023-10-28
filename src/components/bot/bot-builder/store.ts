import {
  PositionDescription,
  type FlowDesignerState,
} from "./FlowDesigner/types";
import { create } from "zustand";

export const useFlowDesignerStore = create<FlowDesignerState>()((set) => ({
  scale: 1,
  changeScale: (newValue) => set(() => ({ scale: newValue })),
  showTemporaryLink: false,
  tempLinkPath: null,
  showTempLink: () => set(() => ({ showTemporaryLink: true })),
  hideTempLink: () => set(() => ({ showTemporaryLink: false })),
  setTempLinkPath: (value: string) => set(() => ({ tempLinkPath: value })),
}));
