import { FileDescription } from "@kickoffbot.com/types";

export interface ClientFileDescription extends FileDescription {
  browserFile: File;
}

export interface PostDescription {
  content: string;
  attachments: FileDescription[];
}
