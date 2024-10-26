import axios from "axios";
import { isNil } from "lodash";
import {
  UploadAttachmentStatus,
  type UploadAttachmentFileDescription,
} from "~/types/UploadAttachments";
import { showError } from "~/utils/ClientStatusMessage";

export async function uploadAttachments(projectName: string, clientFiles: File[]) {
  try {
    const formData = new FormData();

    for (const uploadFile of clientFiles) {
      formData.append("uploads", uploadFile);
    }

    const { data } = await axios.post<UploadAttachmentFileDescription[]>(
      `/api/upload?botProjectId=${projectName}`,
      formData
    );

    if (
      !isNil(data.find((a) => a.uploadStatus === UploadAttachmentStatus.Error))
    ) {
      throw new Error("Failed to upload all files");
    }

    return data;
  } catch (error) {
    showError("Failed to upload your attachments!");
    throw error;
  }
}
