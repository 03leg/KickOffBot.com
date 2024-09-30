import { UnsplashPhoto } from "@kickoffbot.com/types";

export const getImageSrc = (item?: string | UnsplashPhoto) => {
  if (!item) {
    return undefined;
  }
  if (typeof item === "string") {
    return item;
  }
  if (item.source === "unsplash") {
    return item.regularSrc;
  }

  throw new Error("Unsupported image source");
};
