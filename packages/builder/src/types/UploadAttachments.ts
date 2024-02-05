export enum UploadAttachmentStatus {
  Error,
  Success,
}

export interface UploadAttachmentFileDescription {
  clientFileName: string;
  storageUrl?: string;
  uploadStatus: UploadAttachmentStatus;
  size: number;
  name: string | null;
  typeContent: string | null;
}
