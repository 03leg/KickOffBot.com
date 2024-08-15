import { z } from "zod";

export interface BotDescription {
  name: string;
  id?: string;
  updatedAt?: Date;
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
