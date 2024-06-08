import { create } from "zustand";
import {
  type FlowDesignerUIBlockDescription,
  type FlowDesignerLink,
  type BotVariable,
  BotProject,
  VariableType,
  BotTemplate,
  ConnectionDescription,
  ConnectionType,
} from "@kickoffbot.com/types";
import { isNil, remove } from "lodash";
import { type PositionDescription } from "@kickoffbot.com/types";
import { canLink, getDefaultBlocks } from "./utils";
import { FlowDesignerState } from "./types";

export const DEFAULT_PROJECT_STATE: BotProject = {
  blocks: [...getDefaultBlocks()],
  links: [],
  variables: [
    {
      id: "user_id",
      type: VariableType.NUMBER,
      name: "user_id",
      value: -1,
      isPlatformVariable: true,
    },
    {
      id: "user_first_name",
      type: VariableType.STRING,
      name: "user_first_name",
      value: "",
      isPlatformVariable: true,
    },
    {
      id: "user_last_name",
      type: VariableType.STRING,
      name: "user_last_name",
      value: "",
      isPlatformVariable: true,
    },
    {
      id: "username",
      type: VariableType.STRING,
      name: "username",
      value: "",
      isPlatformVariable: true,
    },
    {
      id: "user_language_code",
      type: VariableType.STRING,
      name: "user_language_code",
      value: "",
      isPlatformVariable: true,
    },
    {
      id: "is_premium",
      type: VariableType.BOOLEAN,
      name: "is_premium",
      value: false,
      isPlatformVariable: true,
    },
  ],
  transformDescription: { scale: 1, x: 0, y: 0 },
  templates: [],
  connections: [],
};

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
  project: JSON.parse(JSON.stringify(DEFAULT_PROJECT_STATE)),
  initProject: (value: string | null) =>
    set(() => {
      let currentProject = JSON.parse(JSON.stringify(DEFAULT_PROJECT_STATE));
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

  showRuntimeEditor: false,
  toggleRuntimeEditor: () =>
    set((state) => ({ showRuntimeEditor: !state.showRuntimeEditor })),
  destroyProject: () =>
    set(() => ({
      project: JSON.parse(JSON.stringify(DEFAULT_PROJECT_STATE)),
      projectIsInitialized: false,
      showTemporaryLink: false,
      showProjectItemsViewer: false,
      viewPortOffset: { x: 0, y: 0 },
      selectedLink: null,
      showRuntimeEditor: false,
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
        ) ?? []), ...actualGoogleConnections
      ];

      return { project };
    }),
}));
