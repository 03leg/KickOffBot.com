import type { NextApiRequest, NextApiResponse } from "next";
import { createApi, Orientation } from "unsplash-js";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import { Random } from "unsplash-js/dist/methods/photos/types";
import { env } from "~/env.mjs";

const serverApi = createApi({
  accessKey: env.UNSPLASH_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Random | Random[]>>
) {
  if (req.method === "GET") {
    const count = parseInt(req.query.count as string);
    const orientation = req.query.orientation as Orientation;
    const result = await serverApi.photos.getRandom({
      count,
      orientation,
    });
    res.send(result);
  }
}
