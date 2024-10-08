import { promises as fs } from "fs";
import type formidable from "formidable";
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env.mjs";
import {
  UploadAttachmentStatus,
  type UploadAttachmentFileDescription,
} from "~/types/UploadAttachments";
import { isNil } from "lodash";
import { type AttachmentUploaderProvider } from "~/types/AttachmentUploaderProvider";

export class AttachmentUploaderSupaBase implements AttachmentUploaderProvider {
  static supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_TOKEN);

  async uploadfiles(
    files: formidable.File[],
    prefixPath?: string
  ): Promise<UploadAttachmentFileDescription[]> {
    const result: UploadAttachmentFileDescription[] = [];
    for (const item of files) {
      const fileBin = await fs.readFile(item.filepath);
      const storeFilePath = prefixPath + item.newFilename;

      const { data: uploadResult, error } =
        await AttachmentUploaderSupaBase.supabase.storage
          .from(env.SUPABASE_BUCKET_ID)
          .upload(storeFilePath, fileBin, {
            cacheControl: "3600",
            upsert: false,
          });

      // if (error) {
      //   console.error(uploadResult, error, fileBin.byteLength);
      // }

      if (!isNil(error) || isNil(uploadResult)) {
        result.push({
          clientFileName: item.originalFilename ?? "",
          uploadStatus: UploadAttachmentStatus.Error,
          size: item.size,
          name: item.originalFilename,
          typeContent: item.mimetype,
        });
        continue;
      }

      const { data: getPublicUrlResult } =
        AttachmentUploaderSupaBase.supabase.storage
          .from(env.SUPABASE_BUCKET_ID)
          .getPublicUrl(uploadResult.path);

      result.push({
        clientFileName: item.originalFilename ?? "",
        uploadStatus: UploadAttachmentStatus.Success,
        storageUrl: getPublicUrlResult.publicUrl,
        size: item.size,
        name: item.originalFilename,
        typeContent: item.mimetype,
      });
    }

    return result;
  }
}
