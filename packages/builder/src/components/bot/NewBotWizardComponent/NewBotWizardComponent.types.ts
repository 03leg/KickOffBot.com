import React from "react";

export interface NewBotWizardDescription {
  name: string;
}

export interface TemplateDescription {
  title: string;
  description?: string;
  template?: string;
  icon: React.ReactNode;
}

export interface WebTemplateDescription extends TemplateDescription {
  botId: string;
}

export interface TelegramTemplateDescription extends TemplateDescription {
  telegramLink?: string;
  youtubeLink?: string;
}
