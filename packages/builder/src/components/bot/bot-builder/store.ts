import { create } from "zustand";
import {
  type FlowDesignerUIBlockDescription,
  type FlowDesignerLink,
  type BotVariable,
  BotProject,
  BotTemplate,
  ConnectionDescription,
  ConnectionType,
  BotPlatform,
} from "@kickoffbot.com/types";
import { isNil, remove } from "lodash";
import { type PositionDescription } from "@kickoffbot.com/types";
import { canLink, getDefaultProjectState } from "./utils";
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
  showProjectItemsViewer: false,
  showTemporaryLink: false,
  tempLinkPath: null,
  showTempLink: () => set(() => ({ showTemporaryLink: true })),
  hideTempLink: () => set(() => ({ showTemporaryLink: false })),
  setTempLinkPath: (value: string) => set(() => ({ tempLinkPath: value })),
  projectIsInitialized: false,
  platform: BotPlatform.WEB,
  project: {} as BotProject,
  initProject: (platform: BotPlatform, value: string | null) =>
    set(() => {
      let currentProject = JSON.parse(
        JSON.stringify(getDefaultProjectState(platform))
      );
      if (value !== null) {
        currentProject = JSON.parse(value);
      }

      return { project: currentProject, projectIsInitialized: true, platform };
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
      project.blocks[indexBlock] = { ...updatedBlock };

      project.blocks = [...project.blocks];

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

  toggleProjectItemsViewer: () =>
    set((state) => {
      return { showProjectItemsViewer: !state.showProjectItemsViewer };
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
  getVariableByName: (name: string) =>
    get().project.variables.find((v) => v.name == name) ?? null,
  getTemplateByName: (name: string) =>
    get().project.templates.find((t) => t.name == name) ?? null,

  showRuntimeEditor: false,
  toggleRuntimeEditor: () =>
    set((state) => ({ showRuntimeEditor: !state.showRuntimeEditor })),
  destroyProject: () =>
    set(() => ({
      project: {} as BotProject,
      projectIsInitialized: false,
      showTemporaryLink: false,
      showProjectItemsViewer: false,
      viewPortOffset: { x: 0, y: 0 },
      selectedLink: null,
      showRuntimeEditor: false,
      showWebBotDemo: false,
    })),
  removeTemplate: (template: BotTemplate) =>
    set((state) => {
      const project = state.project;
      const index = project.templates.findIndex((v) => v.id === template.id);

      project.templates.splice(index, 1);
      project.templates = [...project.templates];

      return { project };
    }),
  addTemplate: (newTemplate: BotTemplate) =>
    set((state) => {
      const project = state.project;

      project.templates = [...(project.templates ?? []), newTemplate];

      return { project };
    }),
  updateTemplate: (template: BotTemplate) =>
    set((state) => {
      const project = state.project;
      const index = project.templates.findIndex((v) => v.id === template.id);

      project.templates.splice(index, 1, template);
      project.templates = [...project.templates];

      return { project };
    }),
  saveConnection: (connection: ConnectionDescription) =>
    set((state) => {
      const project = state.project;
      const index = (project.connections ?? []).findIndex(
        (c) => c.id === connection.id
      );

      if (index !== -1) {
        project.connections.splice(index, 1);
      }

      project.connections = [...(project.connections ?? []), connection];

      return { project };
    }),
  removeConnectionById: (connectionId: ConnectionDescription["id"]) =>
    set((state) => {
      const project = state.project;
      const index = project.connections.findIndex((v) => v.id === connectionId);

      project.connections.splice(index, 1);
      project.connections = [...project.connections];

      return { project };
    }),
  setActualGoogleConnections: (
    actualGoogleConnections: ConnectionDescription[]
  ) =>
    set((state) => {
      const project = state.project;

      project.connections = [
        ...(actualGoogleConnections.filter(
          (c) => c.type !== ConnectionType.Google
        ) ?? []),
        ...actualGoogleConnections,
      ];

      return { project };
    }),
  showWebBotDemo: false,
  toggleShowWebBotDemo: () =>
    set((state) => {
      return { showWebBotDemo: !state.showWebBotDemo };
    }),
  showPublishWebBotDialog: false,
  togglePublishWebBotDialog: () =>
    set((state) => ({
      showPublishWebBotDialog: !state.showPublishWebBotDialog,
    })),
}));
