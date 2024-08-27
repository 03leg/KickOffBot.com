import { BotProject } from "@kickoffbot.com/types";

export function getDbVersionProject(json: string): string {
  const project = JSON.parse(json) as BotProject;
  project.connections = [];

  return JSON.stringify(project);
}
