import { ElementType } from "@kickoffbot.com/types";
import type React from "react";

export interface ToolBoxGroup {
  title: string;
  items: ToolBoxItem[];
}

export interface ToolBoxItem {
  title: string;
  icon: React.ReactNode;
  type: ElementType;
}

export interface DraggableElementData{
  type: ElementType;
  elementWidth: number;
  isNewElement: boolean;
}