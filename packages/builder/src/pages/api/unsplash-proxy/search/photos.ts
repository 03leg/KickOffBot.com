import type { NextApiRequest, NextApiResponse } from "next";
import { createApi, Orientation } from "unsplash-js";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import { Photos } from "unsplash-js/dist/methods/search/types/response";
import { env } from "~/env.mjs";

const serverApi = createApi({
  accessKey: env.UNSPLASH_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Photos>>
) {
  if (req.method === "GET") {
    const perPage = parseInt(req.query.per_page as string);
    const page = parseInt(req.query.page as string);
    const orientation = req.query.orientation as Orientation;
    const result = await serverApi.search.getPhotos({
      query: req.query.query as string,
      perPage,
      orientation,
      page
    });
    res.send(result);
  }
}
