import type React from "react";

export interface ToolBoxGroup {
  title: string;
  items: ToolBoxItem[];
}

export enum ElementType {
  CONTENT_TEXT = "content-text",
  CONTENT_IMAGE = "content-image",
  CONTENT_AUDIO = "content-audio",
  CONTENT_VIDEO = "content-video",

  INPUT_TEXT = "input-text",
  INPUT_NUMBER = "input-number",
  INPUT_EMAIL = "input-email",
  INPUT_DATE = "input-date",
  INPUT_PHONE = "input-phone",
}

export interface ToolBoxItem {
  title: string;
  icon: React.ReactNode;
  type: ElementType;
}
