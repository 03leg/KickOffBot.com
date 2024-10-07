import { WebImageMediaDescription } from "@kickoffbot.com/types";
import { makeStyles } from "tss-react/mui";

export const getCssSize = (size?: string) => {
  if (!size) {
    return undefined;
  }

  if (parseFloat(size).toString() === size) {
    return size + "px";
  }

  return size;
};

export const useImageMediaItemStyles = makeStyles<
  | {
      image: WebImageMediaDescription;
      isLast: boolean;
      direction: "row" | "column";
      wrapped: boolean;
      count: number;
    }
  | undefined
>()(({ spacing, shape }, options) => ({
  imageContainer: {
    position: "relative",
    marginRight:
      options?.direction === "row"
        ? options?.isLast
          ? 0
          : spacing(1)
        : undefined,
    marginBottom:
      options?.direction === "column" || options?.wrapped
        ? options?.isLast
          ? 0
          : spacing(1)
        : undefined,
    display: "flex",
    alignItems: "flex-start",
  },
  img: {
    maxWidth:
      getCssSize(options?.image.maxImageWidth) ??
      (options?.direction === "column" ||
      options?.count === 1 ||
      options?.wrapped
        ? "100%"
        : undefined),
    maxHeight: getCssSize(options?.image.maxImageHeight),
    height: getCssSize(options?.image.imageHeight),
    width: getCssSize(options?.image.imageWidth),
    objectFit: "cover",
    borderRadius: shape.borderRadius,
  },
}));
