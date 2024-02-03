import type formidable from "formidable";
import { type UploadAttachmentFileDescription } from "./UploadAttachments";

export interface AttachmentUploaderProvider {
  uploadfiles(
    files: formidable.File[],
    prefixPath?: string
  ): Promise<UploadAttachmentFileDescription[]>;
}
