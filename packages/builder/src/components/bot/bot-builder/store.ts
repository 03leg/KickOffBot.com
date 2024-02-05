import { create } from "zustand";
import {
  type FlowDesignerUIBlockDescription,
  type FlowDesignerLink,
  type BotVariable,
} from "@kickoffbot.com/types";
import { isNil, remove } from "lodash";
import { type PositionDescription } from "@kickoffbot.com/types";
import { canLink, getDefaultBlocks } from "./utils";
import { FlowDesignerState } from "./types";

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
  showVariablesViewer: false,
  showTemporaryLink: false,
  tempLinkPath: null,
  showTempLink: () => set(() => ({ showTemporaryLink: true })),
  hideTempLink: () => set(() => ({ showTemporaryLink: false })),
  setTempLinkPath: (value: string) => set(() => ({ tempLinkPath: value })),
  projectIsInitialized: false,
  project: {
    blocks: [],
    links: [],
    variables: [],
    transformDescription: { scale: 1, x: 0, y: 0 },
  },
  initProject: (value: string | null) =>
    set(() => {
      let currentProject = {
        blocks: [...getDefaultBlocks()],
        links: [],
        variables: [],
        transformDescription: { scale: 1, x: 0, y: 0 },
      };
      if (value !== null) {
        currentProject = JSON.parse(value);
      }

      return { project: currentProject, projectIsInitialized: true };
    }),
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
      const project = state.project;

      if (!canLink(newLink, project.links)) {
        return { project };
      }

      project.links = [...project.links, newLink];

      return { project };
    }),
  selectedLink: null,
  selectLink: (link: FlowDesignerLink | null) =>
    set(() => ({ selectedLink: link })),
  removeLink: (link: FlowDesignerLink) =>
    set((state) => {
      const project = state.project;

      remove(project.links, (l) => l === link);

      project.links = [...project.links];
      return { project };
    }),
  removeLinks: (links: FlowDesignerLink[]) =>
    set((state) => {
      const project = state.project;
      if (links.length === 0) {
        return { project };
      }
      const ids = links.map((p) => p.id);

      remove(project.links, (l) => ids.includes(l.id));

      project.links = [...project.links];
      return { project };
    }),
  removeBlock: (block: FlowDesignerUIBlockDescription) =>
    set((state) => {
      const project = state.project;

      remove(project.blocks, (b) => b === block);
      const deleteLinks = project.links.filter(
        (l) => l.input.blockId === block.id || l.output.blockId === block.id
      );

      state.removeLinks(deleteLinks);

      return { project };
    }),
  updateAllLinks: () =>
    set((state) => {
      const project = state.project;

      project.links = [...project.links];

      return { project };
    }),

  toggleVariablesViewer: () =>
    set((state) => {
      return { showVariablesViewer: !state.showVariablesViewer };
    }),

  addVariable: (newVariable: BotVariable) =>
    set((state) => {
      const project = state.project;

      project.variables = [...project.variables, newVariable];

      return { project };
    }),
  updateVariable: (variable: BotVariable) =>
    set((state) => {
      const project = state.project;
      const index = project.variables.findIndex((v) => v.id === variable.id);

      project.variables.splice(index, 1, variable);
      project.variables = [...project.variables];

      return { project };
    }),
  removeVariable: (variable: BotVariable) =>
    set((state) => {
      const project = state.project;
      const index = project.variables.findIndex((v) => v.id === variable.id);

      project.variables.splice(index, 1);
      project.variables = [...project.variables];

      return { project };
    }),
  getVariableById: (variableId: string) =>
    get().project.variables.find((v) => v.id == variableId) ?? null,
}));
