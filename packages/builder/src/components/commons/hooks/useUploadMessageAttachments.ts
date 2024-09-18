import { ContentType, FileDescription } from "@kickoffbot.com/types";
import { useCallback, useState } from "react";
import {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from "~/components/PostCreator/components/AttachEditor/constants";
import { uploadAttachments } from "~/components/PostCreator/utils";
import { ClientFileDescription } from "~/types/ContentEditor";
import { UploadAttachmentFileDescription } from "~/types/UploadAttachments";
import { showError, showSuccessMessage } from "~/utils/ClientStatusMessage";
import { throwIfNil } from "~/utils/guard";

export const useUploadMessageAttachments = (
  attachments: FileDescription[] = [],
  multiply = true
) => {
  const [uploadedFiles, setUploadedFiles] =
    useState<FileDescription[]>(attachments);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleAttachmentsAdd = useCallback(
    async (files: FileDescription[]) => {
      setIsUploading(true);

      let attachments: UploadAttachmentFileDescription[] = [];
      try {
        attachments = await uploadAttachments(
          files.map((f) => (f as ClientFileDescription).browserFile)
        );
      } catch {
        showError("Failed to save your post... Sorry 😔");
        return;
      }

      const newFiles = attachments.map((file) => {
        throwIfNil(file.name);

        const fileExt = file.name
          .slice(file.name.lastIndexOf("."))
          .toLowerCase();
        const result = {
          name: file.name,
          size: file.size,
          typeContent: IMAGE_EXTENSIONS.includes(fileExt)
            ? ContentType.Image
            : VIDEO_EXTENSIONS.includes(fileExt)
            ? ContentType.Video
            : ContentType.Other,
          url: file.storageUrl,
        } as FileDescription;

        return result;
      });

      showSuccessMessage("Your files uploaded!");

      if (multiply) {
        setUploadedFiles([...uploadedFiles, ...newFiles]);
      } else {
        setUploadedFiles([...newFiles]);
      }
      setIsUploading(false);
    },
    [multiply, uploadedFiles]
  );

  const handleAttachmentRemove = useCallback(
    (file: FileDescription) => {
      setUploadedFiles([...uploadedFiles.filter((f) => f.url !== file.url)]);
    },
    [uploadedFiles]
  );

  return {
    uploadedFiles,
    isUploading,
    handleAttachmentsAdd,
    handleAttachmentRemove,
  };
};
