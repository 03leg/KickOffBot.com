import {
  getTelegramContentElements,
  getInputElements,
  getIntegrationsElements,
  getLogicElements,
  getWebContentElements,
  getWebInputElements,
} from "../utils";
import { ToolBoxGroup } from "./types";

export const TELEGRAM_TOOLBOX_GROUPS: ToolBoxGroup[] = [
  {
    title: "Content",
    items: getTelegramContentElements(),
  },
  {
    title: "User Input",
    items: getInputElements(),
  },
  {
    title: "Logic",
    items: getLogicElements(),
  },
  {
    title: "Integrations",
    items: getIntegrationsElements(),
  },
];

export const WEB_TOOLBOX_GROUPS: ToolBoxGroup[] = [
  {
    title: "Content",
    items: getWebContentElements(),
  },
  {
    title: "User Input",
    items: getWebInputElements(),
  },
];
