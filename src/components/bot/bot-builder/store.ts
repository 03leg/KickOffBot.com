import { create } from "zustand";
import {
  type FlowDesignerUIBlockDescription,
  type FlowDesignerState,
  type FlowDesignerLink,
} from "./types";
import { generateElements } from "./utils";
import { isNil } from "lodash";
import { type PositionDescription } from "./FlowDesigner/types";

export const useFlowDesignerStore = create<FlowDesignerState>()((set, get) => ({
  scale: 1,
  transformDescription: { scale: 1, x: 0, y: 0 },
  changeTransformDescription: (newValue) =>
    set((state) => {
      state.transformDescription = newValue;
      state.scale = newValue.scale;
      return { transformDescription: newValue, scale : newValue.scale};
    }),
  showTemporaryLink: false,
  tempLinkPath: null,
  showTempLink: () => set(() => ({ showTemporaryLink: true })),
  hideTempLink: () => set(() => ({ showTemporaryLink: false })),
  setTempLinkPath: (value: string) => set(() => ({ tempLinkPath: value })),
  project: {
    blocks: [
      {
        id: "0",
        title: "Block #1",
        position: { x: 500, y: 0 },
        elements: generateElements(),
      },
      {
        id: "1",
        title: "Block #2",
        position: { x: 0, y: 500 },
        elements: generateElements(),
      },
    ],
    links: [],
  },
  updateBlocks: (value: FlowDesignerUIBlockDescription[]) =>
    set((state) => {
      let project = state.project;
      if (isNil(project)) {
        project = { blocks: [], links: [] };
      }
      project.blocks = value;
      return { project };
    }),
  viewPortOffset: { x: 0, y: 0 },
  setViewPortOffset: (value: PositionDescription) =>
    set(() => ({ viewPortOffset: value })),
  addLink: (newLink: FlowDesignerLink) =>
    set((state) => {
      let project = state.project;
      if (isNil(project)) {
        project = { blocks: [], links: [] };
      }
      project.links.push(newLink);

      return { project };
    }),
  // viewPortOffset: () => {
  //   const element = document.getElementById("svg-container") as Element;
  //   const rect = element.getBoundingClientRect();

  //   return { x: rect.left, y: rect.top };
  // },
}));
