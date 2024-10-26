import { type NextApiRequest, type NextApiResponse } from "next";
import formidable from "formidable";
import { getSession } from "next-auth/react";
import { isNil } from "lodash";
import { ServerErrorCode } from "~/types/ErrorCode";
import { CONFIG } from "~/config";
import { type AttachmentUploaderProvider } from "~/types/AttachmentUploaderProvider";
import { AttachmentUploaderSupaBase } from "~/service/AttachmentUploaderSupaBase";

export const config = {
  api: {
    bodyParser: false,
  },
};

const getFilesFromRequest = async (req: NextApiRequest): Promise<formidable.Files> => {
  const options: formidable.Options = {};
  options.maxFileSize = CONFIG.maxAttachmentFileSize;
  options.filename = (name, ext, path) => {
    return Date.now().toString() + "_" + path.originalFilename;
  };
  const form = formidable(options);

  const [_fields, files] = await form.parse(req);
  return files;
};

export default async function POST(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const botProjectId = request.query.botProjectId as string;
    const session = await getSession({ req: request });

    if (isNil(session) || isNil(session.user.id)) {
      response.status(500).json({ error: ServerErrorCode.USER_SESSION_NULL });
      return;
    }

    const { uploads } = await getFilesFromRequest(request);
    const uploadFiles = uploads!;
    const storeProvider: AttachmentUploaderProvider =
      new AttachmentUploaderSupaBase();

    return response.json(await storeProvider.uploadfiles(uploadFiles, `attachments/user-${session.user.id}/bot-${botProjectId}/`));
  } catch (error) {
    response.status(500).json({ error: ServerErrorCode.API_HANDLER_ERROR });
    console.log(error);
  }
}
