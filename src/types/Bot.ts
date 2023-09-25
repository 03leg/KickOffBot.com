import { z } from "zod";

export interface BotDescription {
  name: string;
  id?: string;
  updatedAt?: Date;
}

export const BotDescriptionScheme = z.object({
  name: z.string(),
  id: z.string().optional(),
});
