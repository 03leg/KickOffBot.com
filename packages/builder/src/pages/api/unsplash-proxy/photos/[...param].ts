import { isNil } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { createApi } from "unsplash-js";
import { env } from "~/env.mjs";

const serverApi = createApi({
  accessKey: env.UNSPLASH_API_KEY,
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  if (req.method === "GET") {
    const photoUrl = req.headers.photo as string;

    if (isNil(photoUrl)) {
      res.status(500).end();
    }

    void serverApi.photos.trackDownload({
      downloadLocation: photoUrl,
    });

    res.end();
  }
}
