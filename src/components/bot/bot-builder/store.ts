import { create } from "zustand";
import {
  type FlowDesignerUIBlockDescription,
  type FlowDesignerState,
  type FlowDesignerLink,
} from "./types";
import { isNil } from "lodash";
import { type PositionDescription } from "./FlowDesigner/types";

export const useFlowDesignerStore = create<FlowDesignerState>()((set, get) => ({
  changeTransformDescription: (newValue) =>
    set((state) => {
      const project = state.project;
      if (isNil(project)) {
        throw new Error("InvalidOperationError");
      }
      project.transformDescription = newValue;
      return { project };
    }),
  showTemporaryLink: false,
  tempLinkPath: null,
  showTempLink: () => set(() => ({ showTemporaryLink: true })),
  hideTempLink: () => set(() => ({ showTemporaryLink: false })),
  setTempLinkPath: (value: string) => set(() => ({ tempLinkPath: value })),
  projectIsInitialized: false,
  project: {
    blocks: [],
    links: [],
    transformDescription: { scale: 1, x: 0, y: 0 },
  },
  initProject: (value: string | null) =>
    set(() => {

      let currentProject = {
        blocks: [],
        links: [],
        transformDescription: { scale: 1, x: 0, y: 0 },
      };
      if (value !== null) {
        currentProject = JSON.parse(value);
      }

      return { project: currentProject, projectIsInitialized: true };
    }),

  // updateBlocks: (value: FlowDesignerUIBlockDescription[]) =>
  //   set((state) => {
  //     let project = state.project;
  //     if (isNil(project)) {
  //       project = { blocks: [], links: [] };
  //     }
  //     project.blocks = value;
  //     console.log("updateBlocks");
  //     return { project };
  //   }),
  addBlock: (newBlock: FlowDesignerUIBlockDescription) =>
    set((state) => {
      const project = state.project;
      if (isNil(project)) {
        throw new Error("InvalidOperationError");
      }

      project.blocks = [...project.blocks, newBlock];

      return { project };
    }),
  updateBlock: (updatedBlock: FlowDesignerUIBlockDescription) =>
    set((state) => {
      const project = state.project;
      if (isNil(project)) {
        throw new Error("InvalidOperationError");
      }

      const indexBlock = project.blocks.findIndex(
        (b) => b.id === updatedBlock.id
      );
      project.blocks[indexBlock] = updatedBlock;

      return { project };
    }),
  viewPortOffset: { x: 0, y: 0 },
  setViewPortOffset: (value: PositionDescription) =>
    set(() => ({ viewPortOffset: value })),
  addLink: (newLink: FlowDesignerLink) =>
    set((state) => {
      let project = state.project;
      if (isNil(project)) {
        project = {
          blocks: [],
          links: [],
          transformDescription: { scale: 1, x: 0, y: 0 },
        };
      }
      project.links = [...project.links, newLink];

      return { project };
    }),
  selectedLink: null,
  selectLink: (link: FlowDesignerLink | null) =>
    set(() => ({ selectedLink: link })),
  // (link: FlowDesignerLink) =>
  //   set(() => (
  //      { selectedLink: link };
  //   )),

  // viewPortOffset: () => {
  //   const element = document.getElementById("svg-container") as Element;
  //   const rect = element.getBoundingClientRect();

  //   return { x: rect.left, y: rect.top };
  // },
}));
