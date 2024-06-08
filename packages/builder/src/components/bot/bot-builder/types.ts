import {
  BotProject,
  BotTemplate,
  BotVariable,
  ConnectionDescription,
  FlowDesignerLink,
  FlowDesignerUIBlockDescription,
  PositionDescription,
  TransformDescription,
} from "@kickoffbot.com/types";

export interface FlowDesignerState {
  changeTransformDescription: (newValue: TransformDescription) => void;
  showTemporaryLink: boolean;
  tempLinkPath: string | null;
  showTempLink: VoidFunction;
  hideTempLink: VoidFunction;
  setTempLinkPath: (value: string) => void;
  projectIsInitialized: boolean;
  project: BotProject;
  initProject: (value: string | null) => void;

  updateBlock: (updatedBlock: FlowDesignerUIBlockDescription) => void;
  viewPortOffset: PositionDescription;
  setViewPortOffset: (value: PositionDescription) => void;
  addLink: (newLink: FlowDesignerLink) => void;

  addBlock: (newBlock: FlowDesignerUIBlockDescription) => void;
  selectedLink: null | FlowDesignerLink;
  selectLink: (link: null | FlowDesignerLink) => void;
  removeLink: (link: FlowDesignerLink) => void;
  removeLinks: (links: FlowDesignerLink[]) => void;

  removeBlock: (block: FlowDesignerUIBlockDescription) => void;
  updateAllLinks: () => void;

  showProjectItemsViewer: boolean;
  toggleProjectItemsViewer: VoidFunction;

  addVariable: (newVariable: BotVariable) => void;
  updateVariable: (variable: BotVariable) => void;
  removeVariable: (variable: BotVariable) => void;
  getVariableById: (variableId: BotVariable["id"]) => BotVariable | null;

  showRuntimeEditor: boolean;
  toggleRuntimeEditor: VoidFunction;

  destroyProject: VoidFunction;

  removeTemplate: (template: BotTemplate) => void;
  addTemplate: (template: BotTemplate) => void;
  updateTemplate: (template: BotTemplate) => void;

  saveConnection: (connection: ConnectionDescription) => void;
  removeConnectionById: (connectionId: ConnectionDescription["id"]) => void;
  setActualGoogleConnections: (value: ConnectionDescription[]) => void;
}
