export enum ContentType {
  Image,
  Other,
}

export interface FileDescription {
  name: string;
  url: string;
  typeContent: ContentType;
  size: string;
}

export interface ClientFileDescription extends FileDescription {
  browserFile: File;
}

export interface PostDescription {
  content: string;
  attachments: FileDescription[];
}
