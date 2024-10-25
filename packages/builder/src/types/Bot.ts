import { BotPlatform } from "@kickoffbot.com/types";
import { JsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";

export interface BotDescription {
  name: string;
  id?: string;
  updatedAt?: Date;
  botType: BotPlatform;
  production?: boolean;
}

export const BotDescriptionScheme = z.object({
  name: z.string(),
  id: z.string().optional(),
  template: z.string().optional(),
  botType: z.number().optional(),
});

export const BotContentScheme = z.object({
  project: z.string(),
  projectId: z.string(),
});

export const IdModelScheme = z.object({
  id: z.string(),
});

export const TelegramTokenScheme = z.object({
  projectId: z.string(),
  token: z.string(),
});

export const ThemeScheme = z.object({

  themeId: z.string().optional(),
  title: z.string(),

  botId: z.string(),

  theme: z.string(),
});

export const GetThemesScheme = z.object({
  botId: z.string(),
});

export const DeleteThemeScheme = z.object({
  id: z.string(),
});

export const ApplyThemeScheme = z.object({
  themeId: z.string(),
  botId: z.string(),
});

export interface ThemeResponse {
  id: string;
  title: string;
  theme: JsonValue;
}

export interface GetAllThemesResponse {
  userThemes: ThemeResponse[];
  publicThemes: ThemeResponse[];
  currentThemeId?: ThemeResponse["id"] | null;
}
